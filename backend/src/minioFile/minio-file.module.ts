import { Module } from "@nestjs/common";
import { MinioFileController } from "./minio-file.controller";
import { PrismaService } from "src/shared/prisma.service";
import { MinioFileService } from "./minio-file.service";
import { MinioService } from "./minio.service";

@Module({
  controllers: [MinioFileController],
  providers: [PrismaService, MinioService, MinioFileService],
})
export class MinioFileModule {}
