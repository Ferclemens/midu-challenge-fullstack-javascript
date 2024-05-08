import { apiUploadResponse, type Data } from "../types";
import { API_HOST } from "../config";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${API_HOST}/api/files`, {
      method: "POST",
      body: formData,
    });
    //error handle
    if (!res.ok) {
      return [new Error(`Error uploading file: ${res.statusText}`)];
    }
    //upload ok
    const json = (await res.json()) as apiUploadResponse;
    return [undefined, json.data];
  } catch (error) {
    //error handle
    if (error instanceof Error) return [error];
  }
  //error handle
  return [new Error("Unknown error")];
};
