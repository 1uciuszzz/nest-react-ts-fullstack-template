import { atom } from "jotai";
import { Profile } from "../../apis/auth";

const initialData: Profile = {
  id: "",
  accountId: "",
  avatarId: "",
  firstName: "",
  lastName: "",
  bio: "",
  email: "",
  phone: "",
  birthday: "",
  gender: null,
  createdAt: "",
  updatedAt: "",
};

export const profileAtom = atom(initialData);
