import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { MinioFileService } from "./minio-file.service";
import { MinioService, PartItem } from "./minio.service";
import { FileInterceptor, NoFilesInterceptor } from "@nestjs/platform-express";
import { createHmac } from "crypto";
import { Response } from "express";
import { Readable } from "stream";
import { UploadLargeFileDto } from "./dto/upload-large-file.dto";
import { UploadFilePartDto } from "./dto/upload-file-part.dto";
import { MergePartsDto } from "./dto/merge-parts.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Minio File")
@Controller("minio-file")
export class MinioFileController {
  private readonly CHUNK_SIZE = 16 * 1024 * 1024;

  constructor(
    private readonly minioFileService: MinioFileService,
    private readonly minioService: MinioService,
  ) {}

  @Post("upload-small-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadSmallFile(@UploadedFile() file: Express.Multer.File) {
    const sha256 = createHmac("sha256", file.buffer).digest("hex");
    const minioFile = await this.minioFileService.getFileBySha256(sha256);
    if (minioFile) {
      return minioFile;
    }
    const uploaded = await this.minioService.uploadFile(sha256, file.buffer);
    if (uploaded) {
      const minioFile = this.minioFileService.uploadSmallFile(
        sha256,
        file.size.toString(),
        file.mimetype,
      );
      return minioFile;
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Post("upload-large-file")
  async uploadLargeFile(@Body() payload: UploadLargeFileDto) {
    const totalPartsNumber = Math.ceil(
      parseInt(payload.size) / this.CHUNK_SIZE,
    );
    const needParts = [];
    const minioFile = await this.minioFileService.getFileBySha256(
      payload.sha256,
    );
    if (minioFile) {
      if (minioFile.finished) {
        return { ...minioFile, needParts };
      } else {
        const partItems = await this.minioFileService.getPartsByUploadId(
          minioFile.uploadId,
        );
        if (partItems.length > 0) {
          const partMap = new Set(partItems.map((part) => part.partNumber));
          for (let i = 0; i < totalPartsNumber; i++) {
            const partNumber = i + 1;
            if (!partMap.has(partNumber)) {
              needParts.push(partNumber);
            }
          }
          return { ...minioFile, needParts };
        } else {
          return {
            ...minioFile,
            needParts: Array.from(
              { length: totalPartsNumber },
              (_, i) => i + 1,
            ),
          };
        }
      }
    }
    const uploadId = await this.minioService.createMultipartUpload(
      payload.sha256,
    );
    if (uploadId) {
      const minioFile = await this.minioFileService.uploadLargeFile(
        payload.sha256,
        payload.size,
        payload.type,
        uploadId,
      );
      return {
        ...minioFile,
        needParts: Array.from({ length: totalPartsNumber }, (_, i) => i + 1),
      };
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Post("upload-file-part")
  @UseInterceptors(NoFilesInterceptor())
  async uploadFilePart(@Body() payload: UploadFilePartDto) {
    const eTag = await this.minioService.uploadFilePart(
      payload.sha256,
      payload.partNumber,
      payload.uploadId,
      payload.bytes,
    );
    if (eTag) {
      const minioFilePart = await this.minioFileService.uploadFilePart(
        payload.uploadId,
        payload.partNumber,
        eTag,
      );
      return minioFilePart;
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Patch("finish-upload")
  async finishUpload(@Body() payload: MergePartsDto) {
    const partItems = await this.minioFileService.getPartsByUploadId(
      payload.uploadId,
    );
    const parts: PartItem[] = partItems.map((partItem) => {
      return {
        ETag: partItem.eTag,
        PartNumber: partItem.partNumber,
      };
    });
    const sha256 = await this.minioService.mergeFileParts(
      payload.sha256,
      payload.uploadId,
      parts,
    );
    if (sha256) {
      const minioFile = await this.minioFileService.mergeFileParts(sha256);
      return minioFile;
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Get(":id")
  async getMinioFile(
    @Param("id") id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const minioFile = await this.minioFileService.getFileById(id);
    if (minioFile) {
      if (minioFile.finished) {
        try {
          const file = await this.minioService.getFileBySha256(
            minioFile.sha256,
          );
          const stream = Readable.from(file);
          response.set({
            "Content-Disposition": `inline; filename="${minioFile.sha256}"`,
            "Content-Type": minioFile.type,
          });
          return new StreamableFile(stream);
        } catch {
          throw new InternalServerErrorException();
        }
      } else {
        throw new ForbiddenException();
      }
    } else {
      throw new NotFoundException();
    }
  }
}
