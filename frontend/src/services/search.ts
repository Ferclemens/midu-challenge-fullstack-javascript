import { type apiSearchResponse, type Data } from "../types";
import { API_HOST } from "../config";

export const searchData = async (search: string): Promise<[Error?, Data?]> => {
  try {
    const res = await fetch(`${API_HOST}/api/users?q=${search}`);
    //error handle
    if (!res.ok) {
      return [new Error(`Error searching data: ${res.statusText}`)];
    }
    //upload ok
    const json = (await res.json()) as apiSearchResponse;
    return [undefined, json.data];
  } catch (error) {
    //error handle
    if (error instanceof Error) return [error];
  }
  //error handle
  return [new Error("Unknown error")];
};
