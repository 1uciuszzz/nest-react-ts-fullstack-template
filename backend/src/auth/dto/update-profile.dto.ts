import { Gender } from "@prisma/client";

export class UpdateProfileDto {
  avatarId: string;
  bio: string;
  email: string;
  birthday: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender;
}
