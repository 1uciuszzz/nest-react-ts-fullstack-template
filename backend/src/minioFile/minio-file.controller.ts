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
import { MinioService } from "./minio.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { createHmac } from "crypto";
import { Response } from "express";
import { Readable } from "stream";
import { UploadLargeFileDto } from "./dto/upload-large-file.dto";
import { UploadFilePartDto } from "./dto/upload-file-part.dto";

@Controller("minio-file")
export class MinioFileController {
  constructor(
    private readonly minioFileService: MinioFileService,
    private readonly minioService: MinioService,
  ) {}

  @Post("upload-small-file")
  @UseInterceptors(FileInterceptor("file"))
  async uploadSmallFile(@UploadedFile() file: Express.Multer.File) {
    const sha256 = createHmac("sha256", file.buffer).digest("hex");
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
    const minioFile = await this.minioFileService.getFileBySha256(
      payload.sha256,
    );
    if (minioFile) {
      if (minioFile.finished) {
        return minioFile;
      } else {
        const partItems = await this.minioFileService.getPartsByUploadId(
          minioFile.uploadId,
        );
        if (partItems.length > 0) {
          /**  */
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
      return minioFile;
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Post("upload-file-part")
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
  async finishUpload() {}

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
