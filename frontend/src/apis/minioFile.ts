import { Res, http } from "./http";

type MinioFile = {
  id: string;
  uploadId?: string;
  sha256: string;
  size: string;
  type: string;
  finished: boolean;
  createdAt: string;
  updatedAt: string;
};

type MinioFilePart = {
  id: string;
  uploadId: string;
  partNumber: number;
  eTag: string;
  createdAt: string;
  updatedAt: string;
};

type UploadSmallFileRes = MinioFile;

type CreateMultipartUploadReq = {
  sha256: string;
  size: string;
  type: string;
};

type CreateMultiPartUploadRes = UploadSmallFileRes & {
  needParts: number[];
};

type UploadFilePartReq = {
  sha256: string;
  partNumber: number;
  uploadId: string;
  bytes: Blob;
};

type UploadFilePartRes = MinioFilePart;

type FinishUploadLargeFileReq = {
  sha256: string;
  uploadId: string;
};

type FinishUploadLargeFileRes = Omit<MinioFile, "uploadId"> & {
  uploadId: string;
};

export const API_MINIO_FILE = {
  UPLOAD_SMALL_FILE: (file: File): Res<UploadSmallFileRes> => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post(`/minio-file/upload-small-file`, formData);
  },
  UPLOAD_LARGE_FILE: (
    payload: CreateMultipartUploadReq
  ): Res<CreateMultiPartUploadRes> =>
    http.post(`/minio-file/upload-large-file`, payload),
  UPLOAD_FILE_PART: (payload: UploadFilePartReq): Res<UploadFilePartRes> => {
    const formData = new FormData();
    formData.append("sha256", payload.sha256);
    formData.append("partNumber", payload.partNumber.toString());
    formData.append("uploadId", payload.uploadId);
    formData.append("bytes", payload.bytes);
    return http.post(`/minio-file/upload-file-part`, formData);
  },
  FINISH_UPLOAD_LARGE_FILE: (
    payload: FinishUploadLargeFileReq
  ): Res<FinishUploadLargeFileRes> =>
    http.patch(`/minio-file/finish-upload`, payload),
};
