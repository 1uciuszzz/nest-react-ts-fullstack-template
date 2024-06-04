import { atom } from "jotai";
import { Account } from "../apis/auth";

const initialData: Account = {
  id: "",
  username: "",
  createdAt: "",
  updatedAt: "",
};

export const accountAtom = atom(initialData);
