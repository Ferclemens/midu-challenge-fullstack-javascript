import { apiUploadResponse, type Data } from "../types";

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("http://localhost:3000/api/files", {
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
