import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/prisma.service";
import { compare, genSalt, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  getAccountByUsername = async (username: string) => {
    const account = await this.prisma.account.findUnique({
      where: {
        username,
      },
    });
    return account;
  };

  hashPassword = async (password: string) => {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
  };

  register = async (username: string, hashedPassword: string) => {
    const account = await this.prisma.account.create({
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
      data: {
        username,
        password: hashedPassword,
      },
    });
    return account;
  };

  getToken = async (userId: string, username: string) => {
    const token = await this.jwtService.signAsync({
      id: userId,
      username,
    });
    return `Bearer ${token}`;
  };

  login = async (username: string, password: string) => {
    const account = await this.prisma.account.findUnique({
      where: {
        username,
      },
    });
    const isMatch = await compare(password, account.password);
    if (isMatch) {
      return account;
    } else {
      return null;
    }
  };

  createProfile = async (accountId: string) => {
    const profile = await this.prisma.profile.create({
      data: {
        accountId,
      },
    });
    return profile;
  };

  getProfile = async (accountId: string) => {
    const profile = await this.prisma.profile.findUnique({
      where: {
        accountId,
      },
    });
    return profile;
  };
}
