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
    
    const {table_name, table_sys_id, file_name} = data;
    // SNOW offers two file upload APIs:
    //    /file, which uses query parameters and whose POST body is the raw bytes of the file and
    //    /upload, which consumes a multipart/form-data POST body
    // We are using the latter here. See the following link for API documentation:
    // eslint-disable-next-line max-len
    // https://docs.servicenow.com/en-US/bundle/rome-application-development/page/integrate/inbound-rest/concept/c_AttachmentAPI.html#title_attachment-POST-upload

    formData.append('table_name',table_name)
    formData.append('table_sys_id',table_sys_id)
    formData.append('uploadFile',file_name)
    formData.append('file', file);
    const config:AxiosRequestConfig ={
      headers:{
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress:(progressEvent: ProgressEvent)=> {

        const { loaded, total } = progressEvent;
        if(onProgress){
          onProgress(total, loaded);
        }
      }
    }
    const response =  await this.instance.post(`${this.endPoint}/upload`, formData, config);

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
