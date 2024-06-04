import axios, { AxiosResponse, isAxiosError } from "axios";
import { router } from "../router";

export type Res<T> = Promise<AxiosResponse<T>>;

export const http = axios.create({
  baseURL: `/api`,
});

http.interceptors.request.use(
  (v) => {
    const token = localStorage.getItem("token");
    if (token) v.headers.Authorization = token;
    return v;
  },
  () => {
    throw new Error("Request Error");
  }
);

http.interceptors.response.use(
  (v) => {
    return v;
  },
  (e) => {
    if (isAxiosError(e)) {
      if (e?.response?.data?.statusCode == 401) {
        router.navigate("/auth");
        localStorage.clear();
        throw new Error("Unauthorized");
      } else {
        throw new Error(e?.response?.data?.message || "Server Error");
      }
    } else {
      throw new Error("Response Error");
    }
  }
);
