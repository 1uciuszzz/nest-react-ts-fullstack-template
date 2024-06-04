import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./auth.decorator";
import { NoFilesInterceptor } from "@nestjs/platform-express";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @UseInterceptors(NoFilesInterceptor())
  async register(@Body() payload: RegisterDto) {
    const exist = await this.authService.getAccountByUsername(payload.username);
    if (exist) {
      throw new ForbiddenException();
    } else {
      const hashedPassword = await this.authService.hashPassword(
        payload.password,
      );
      const account = await this.authService.register(
        payload.username,
        hashedPassword,
      );
      const token = await this.authService.getToken(
        account.id,
        account.username,
      );
      const profile = await this.authService.createProfile(account.id);
      return { account, profile, token };
    }
  }

  @Public()
  @Post("login")
  @UseInterceptors(NoFilesInterceptor())
  async login(@Body() payload: LoginDto) {
    const account = await this.authService.login(
      payload.username,
      payload.password,
    );
    if (account) {
      delete account.password;
      const token = await this.authService.getToken(
        account.id,
        account.username,
      );
      const profile = await this.authService.getProfile(account.id);
      return { account, profile, token };
    } else {
      throw new ForbiddenException();
    }
  }
}
