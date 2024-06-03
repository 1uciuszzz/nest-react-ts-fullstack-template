import { ApiProperty } from "@nestjs/swagger";

export class UploadLargeFileDto {
  @ApiProperty()
  sha256: string;

  @ApiProperty()
  size: string;

  @ApiProperty()
  type: string;
}
