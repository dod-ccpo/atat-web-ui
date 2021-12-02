import { TaskOrderFile } from "types/Wizard";
import ApiClient from "../apiClient";

const client = new ApiClient("");

export const uploadTaskOrderFile = async (
  file: FormData
): Promise<TaskOrderFile> => {
  const response = await client.post("taskOrderFiles", file, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.status !== 201) {
    throw Error(" error uploading file");
  }
  return response.data as TaskOrderFile;
};
