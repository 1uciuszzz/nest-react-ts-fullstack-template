import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  private readonly version: `0.0.1`;

  getVersion = () => {
    return this.version;
  };
}
