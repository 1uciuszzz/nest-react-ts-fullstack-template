import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "./auth.decorator";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { User } from "./user.decorator";
import { TokenPayload } from "./dto/user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

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
      await this.authService.createProfile(account.id);
      const token = await this.authService.getToken(
        account.id,
        account.username,
      );
      return { token };
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
      const token = await this.authService.getToken(
        account.id,
        account.username,
      );
      return { token };
    } else {
      throw new ForbiddenException();
    }
  }

  @Get()
  async me(@User() user: TokenPayload) {
    const account = await this.authService.getAccountByUsername(user.username);
    const profile = await this.authService.getProfile(user.id);
    return { account, profile };
  }

  @Put("profile")
  async updateProfile(
    @User() user: TokenPayload,
    @Body() payload: UpdateProfileDto,
  ) {
    const profile = await this.authService.updateProfile(
      user.id,
      payload.avatarId,
      payload.bio,
      payload.email,
      payload.birthday,
      payload.firstName,
      payload.lastName,
      payload.phone,
      payload.gender,
    );
    return profile;
  }
}
