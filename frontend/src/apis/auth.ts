import { Res, http } from "./http";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

type Account = {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

type Profile = {
  id: string;
  accountId: string;
  avatarId: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  birthday: string | null;
  gender: Gender | null;
  createdAt: string;
  updatedAt: string;
};

type Token = string;

type RegisterReq = {
  username: string;
  password: string;
};

type RegisterRes = Account & Profile & { token: Token };

type LoginReq = RegisterReq;

type LoginRes = RegisterRes;

export const API_AUTH = {
  REGISTER: (payload: RegisterReq): Res<RegisterRes> => {
    const formData = new FormData();
    formData.append("username", payload.username);
    formData.append("password", payload.password);
    return http.post(`/auth/register`, formData);
  },
  LOGIN: (payload: LoginReq): Res<LoginRes> => {
    const formData = new FormData();
    formData.append("username", payload.username);
    formData.append("password", payload.password);
    return http.post(`/auth/login`, formData);
  },
};
