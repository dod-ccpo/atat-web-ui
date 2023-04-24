/* eslint-disable camelcase */
import { AxiosRequestConfig } from "axios";
import { AttachmentDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
import FormData from "form-data";

const TABLENAME = "attachment";
export class AttachmentApi extends TableApiBase<AttachmentDTO> {
  constructor() {
    super(TABLENAME);
  }


  protected get endPoint(): string {
    return `/now/${this.tableName}`;
  }
  

  public async upload(data: AttachmentDTO, file:File,
    onProgress?:(total:number, current: number)=>void): Promise<AttachmentDTO> {
    
          
    const formData = new FormData();
    formData.append('file', file);
    
    const {table_name, table_sys_id, file_name} = data;

    const config:AxiosRequestConfig ={
      headers:{
        'Content-Type': '*/*',
      },
      params:{
        file_name,
        table_name,
        table_sys_id
      },
      onUploadProgress:(progressEvent: ProgressEvent)=> {

        const { loaded, total } = progressEvent;
        if(onProgress){
          onProgress(total, loaded);
        }
      }
    }
    const response =  await this.instance.post(`${this.endPoint}/file`, formData, config);

    if(response.status !== 201){
      throw new Error(response.statusText);
    }
    return response.data.result as AttachmentDTO;
          
    
  }

  public async getAttachments(table_sys_id: string): Promise<AttachmentDTO[]>{

    // we will get the attachment based on the
    // table sys id (the id of the record the file is attached to)
    const config: AxiosRequestConfig = {
      params: {
        table_sys_id
      }
    }
    const attachments = this.getQuery(config);
    
    return attachments;
  }

}
