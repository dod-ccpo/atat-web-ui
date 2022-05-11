/* eslint-disable camelcase */
import { TableApiBase } from "@/api/tableApiBase";
import { AttachmentApi } from "@/api/attachments";
import { Attachable, AttachmentDTO } from "@/api/models";


interface TableAttachment<TModel extends Attachable>{
    data: TModel,
    attachment: AttachmentDTO
}

//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete
//https://masteringjs.io/tutorials/axios/axios-multi-form-data
//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete

export class attachmentService<TTableApi extends TableApiBase<TModel>, TModel extends Attachable> {
    attachmentApi = new AttachmentApi();
    tableName: string;
    tableApi:  TTableApi;
    constructor(tableName: string, tableApi: TTableApi){
      this.tableName = tableName;
      this.tableApi = tableApi;
    }

    async upload(fileName:string, fileExtension: string, file:File, 
      onProgress?:(total:number, current: number)=> void):Promise<TableAttachment<TModel>>{
           
      try {
        //creates initial record
        const record = await this.tableApi.create();
        
        if(!record){
          throw new Error('failed to create record to associate attachment with');
        }

        const attachment:AttachmentDTO = {
          file_name: fileName,
          table_name: this.tableName,
          content_type: "*/*",
          table_sys_id: record.sys_id || ''
        };
          
        //get the uploaded Attachment meta data
        const updatedAttachment  = await this.attachmentApi.upload(attachment,file, onProgress);

        const attachmentSysId = updatedAttachment?.sys_id || "";
        // update record with attachment sys id  
        //(this will point the attachment column to the attachment)
        record.attachment = attachmentSysId;
        const updatedRecord = await this.tableApi.update(record.sys_id || "", record);

        //return the attachment and table data
        return {
          data: updatedRecord,
          attachment: updatedAttachment
        }

      } catch (error) {
        throw new Error(`error occurred uploading file ${error}`)
            
      }
         
    }
}