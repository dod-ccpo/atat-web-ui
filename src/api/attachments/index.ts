import { AxiosRequestConfig, AxiosResponse } from "axios";
import { AttachmentDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "attachment";
export class AttachmentApi extends TableApiBase<AttachmentDTO> {
  constructor() {
    super(TABLENAME);
  }

  protected get endPoint(): string {
    return `/now/${this.tableName}`;
  }

  private async upload<AttachmentDTO>(
    data: AttachmentDTO,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.post(`${this.endPoint}/file`, data, config);
  }

}
