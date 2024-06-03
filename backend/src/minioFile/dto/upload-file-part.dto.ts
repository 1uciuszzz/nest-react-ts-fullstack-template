import { ApiProperty } from "@nestjs/swagger";

export class UploadFilePartDto {
  @ApiProperty()
  sha256: string;

  @ApiProperty()
  partNumber: number;

  @ApiProperty()
  uploadId: string;

  @ApiProperty()
  bytes: Buffer;
}
