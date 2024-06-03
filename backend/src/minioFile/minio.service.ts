import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { Readable } from "stream";

export interface PartItem {
  ETag: string;
  PartNumber: number;
}

@Injectable()
export class MinioService {
  private readonly client: S3Client;
  private readonly bucket = process.env.MINIO_BUCKET;

  constructor() {
    this.client = new S3Client({
      endpoint: process.env.MINIO_ENDPOINT,
      region: "ap-east-1",
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY,
        secretAccessKey: process.env.MINIO_SECRET_KEY,
      },
    });
  }

  uploadFile = async (sha256: string, bytes: Buffer) => {
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: sha256,
      Body: bytes,
    });
    try {
      await this.client.send(cmd);
      return true;
    } catch {
      return false;
    }
  };

  createMultipartUpload = async (sha256: string): Promise<string | null> => {
    const cmd = new CreateMultipartUploadCommand({
      Bucket: this.bucket,
      Key: sha256,
    });
    try {
      const res = await this.client.send(cmd);
      return res.UploadId;
    } catch {
      return null;
    }
  };

  uploadFilePart = async (
    sha256: string,
    partNumber: number,
    uploadId: string,
    bytes: Buffer,
  ): Promise<string | null> => {
    const command = new UploadPartCommand({
      Bucket: this.bucket,
      Key: sha256,
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: bytes,
    });
    try {
      const res = await this.client.send(command);
      return res.ETag;
    } catch {
      return null;
    }
  };

  mergeFileParts = async (
    sha256: string,
    uploadId: string,
    parts: PartItem[],
  ): Promise<string | null> => {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucket,
      Key: sha256,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    });
    try {
      const res = await this.client.send(command);
      return res.Key;
    } catch {
      return null;
    }
  };

  getFileBySha256 = async (sha256: string): Promise<Readable | null> => {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: sha256,
    });
    try {
      const res = await this.client.send(command);
      return res.Body as Readable;
    } catch {
      return null;
    }
  };
}
