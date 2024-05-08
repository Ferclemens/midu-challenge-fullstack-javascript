export type Data = Array<Record<string, string>>;

export type apiUploadResponse = {
  message: string;
  data: Data;
};

export type apiSearchResponse = {
  data: Data;
};
