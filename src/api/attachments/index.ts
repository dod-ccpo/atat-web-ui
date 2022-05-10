import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiBase } from "../apiBase";
import { AttachmentDTO } from "../models";
const ENDPOINTNAME = "attachment/file";
export class AttachmentApi extends ApiBase<AttachmentDTO> {
  constructor() {
    super(ENDPOINTNAME);
  }

  private async upload<AttachmentDTO>(
    data: AttachmentDTO,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.post(`${this.endPoint}/file`, data, config);
  }

}
