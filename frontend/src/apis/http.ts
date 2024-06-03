import axios, { AxiosResponse } from "axios";

export type Res<T> = Promise<AxiosResponse<T>>;

export const http = axios.create({
  baseURL: `/api`,
});

http.interceptors.request.use(
  (v) => {
    return v;
  },
  (e) => {
    return e;
  }
);

http.interceptors.response.use(
  (v) => {
    return v;
  },
  (e) => {
    return e;
  }
);
