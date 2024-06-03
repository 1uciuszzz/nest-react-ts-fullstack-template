export class UploadFilePartDto {
  sha256: string;
  partNumber: number;
  uploadId: string;
  bytes: Buffer;
}
