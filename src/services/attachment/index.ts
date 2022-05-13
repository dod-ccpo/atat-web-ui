/* eslint-disable camelcase */
import { TableApiBase } from "@/api/tableApiBase";
import { AttachmentApi } from "@/api/attachments";
import { AttachableDTO, AttachmentDTO, FundingPlanDTO } from "@/api/models";
import api from "@/api";
import {
  FundingPlanApi,
  TABLENAME as FundingPlanTableName,
} from "@/api/fundingPlan";

interface TableAttachment<TModel extends AttachableDTO> {
  data: TModel;
  attachment: AttachmentDTO;
}

//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete
//https://masteringjs.io/tutorials/axios/axios-multi-form-data
//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete

class FileAttachmentServiceBase<
  TTableApi extends TableApiBase<TModel>,
  TModel extends AttachableDTO
> {
  attachmentApi = new AttachmentApi();
  tableName: string;
  tableApi: TTableApi;
  constructor(tableName: string, tableApi: TTableApi) {
    this.tableName = tableName;
    this.tableApi = tableApi;
  }

  private getExtension(filename: string): string {
    return filename.substr(filename.lastIndexOf(".") + 1);
  }

  async upload(
    file: File,
    onProgress?: (total: number, current: number) => void
  ): Promise<TableAttachment<TModel>> {
    try {
      //creates initial record
      const record = await this.tableApi.create();

      if (!record) {
        throw new Error("failed to create record to associate attachment with");
      }

      const fileName = file.name;
      const fileExtension = this.getExtension(fileName);

      //build attachment object
      const attachment: AttachmentDTO = {
        file_name: fileName,
        table_name: this.tableName,
        content_type: "*/*",
        table_sys_id: record.sys_id || "",
      };

      //get the upload the Attachment and get the meta data
      const updatedAttachment = await this.attachmentApi.upload(
        attachment,
        file,
        onProgress
      );

      const attachmentSysId = updatedAttachment?.sys_id || "";

      // update record with attachment sys id, file name, and extension
      // (this will point the attachment column in the record to the attachment)
      record.attachment = attachmentSysId;
      record.file_name = fileName;
      record.extension = fileExtension;
      const updatedRecord = await this.tableApi.update(
        record.sys_id || "",
        record
      );

      //return the attachment and table data
      return {
        data: updatedRecord,
        attachment: updatedAttachment,
      };
    } catch (error) {
      throw new Error(`error occurred uploading file ${error}`);
    }
  }


  async remove(attachment:AttachmentDTO): Promise<void>{

    if(!attachment){

      throw new Error('invalid request, attachment required');
    }
    //first delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");
    //then delete the record
    await this.tableApi.remove(attachment.table_sys_id);
  }
}

export class FileAttachmentService extends FileAttachmentServiceBase<
  TableApiBase<AttachableDTO>,
  AttachableDTO
> {}

export const AttachmentServiceTypes = {
  FundingPlan: "FundingPlan",
};

export const FileAttachmentServiceFactory = (
  attachmentServiceType: string
): FileAttachmentService => {
  switch (attachmentServiceType) {
  case AttachmentServiceTypes.FundingPlan:
    return new FileAttachmentServiceBase<FundingPlanApi, FundingPlanDTO>(
      FundingPlanTableName,
      api.fundingPlanTable
    ) as FileAttachmentService;
  default:
    throw new Error(
      `unable to create service instance for api ${attachmentServiceType}`
    );
  }
};
