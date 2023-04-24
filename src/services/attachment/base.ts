/* eslint-disable camelcase */
import { AttachmentApi } from "@/api/attachments";
import { BaseTableDTO, AttachmentDTO } from "@/api/models";
import { TableApiBase } from "@/api/tableApiBase";
import { RecordManager, AttachmentServiceCallbacks } from ".";
import { convertColumnReferencesToValues } from "@/api/helpers";

const getExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf(".") + 1);
};

interface SnowTableAttachment<TModel extends BaseTableDTO> {
  data: TModel;
  attachment: AttachmentDTO;
}

export class AttachmentServiceBase<
  TTableApi extends TableApiBase<TModel>,
  TModel extends BaseTableDTO
> {
  attachmentApi = new AttachmentApi();
  serviceKey: string;
  tableName: string;
  tableApi: TTableApi;
  constructor(serviceKey: string, tableName: string, tableApi: TTableApi) {
    this.serviceKey = serviceKey;
    this.tableName = tableName;
    this.tableApi = tableApi;
  }

  protected recordManager: RecordManager<TModel> | null = null;

  async upload(
    file: File,
    onProgress?: (total: number, current: number) => void
  ): Promise<SnowTableAttachment<TModel>> {

    //creates initial record
    //if record manager exist outsource record creation/retrieval to it
    let record =
      this.recordManager != null
        ? await this.recordManager.retrieveOrCreate()
        : await this.tableApi.create();

    if (!record) {
      throw new Error("failed to create record to associate attachment with");
    }

    const fileName = file.name;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fileExtension = getExtension(fileName);

    //build attachment object
    const attachment: AttachmentDTO = {
      file_name: fileName,
      table_name: this.tableName,
      content_type: "*/*",
      table_sys_id: record.sys_id || "",
    };

    //upload the Attachment and get the meta data
    const updatedAttachment = await this.attachmentApi.upload(
      attachment,
      file,
      onProgress
    );

    const attachmentSysId = updatedAttachment?.sys_id || "";

    //if record manager exists process any record updates becore saving
    if (this.recordManager) {
      record = this.recordManager.updateRecord(
        JSON.stringify(record),
        attachmentSysId,
        fileName
      );
    }

    let updatedRecord = await this.tableApi.update(
      record.sys_id || "",
      record
    );
    updatedRecord = convertColumnReferencesToValues(updatedRecord)

    // if record manager exists call it's save method
    // so that the updated record can be processed.
    if (this.recordManager) {
      this.recordManager.save(JSON.stringify(updatedRecord));
    }

    //notify listeners that the attachment has been uploaded
    AttachmentServiceCallbacks.invokeUploadCallbacks(this.serviceKey, {
      ...attachment,
      ...updatedAttachment,
    });

    //return the attachment and table data
    return {
      data: updatedRecord,
      attachment: updatedAttachment,
    };
  }

  // the base removal functionality is just to delete both the
  // attachment and the record. Sub classes that need to do more
  // can override this method
  async remove(attachment: AttachmentDTO): Promise<void> {
    if (!attachment) {
      throw new Error("invalid request, attachment required");
    }
    //first delete the attachment
    await this.attachmentApi.remove(attachment.sys_id || "");
    //then delete the record
    await this.tableApi.remove(attachment.table_sys_id);

    AttachmentServiceCallbacks.invokeRemoveCallbacks(
      this.serviceKey,
      attachment
    );
  }
}

export class AttachmentService extends AttachmentServiceBase<
  TableApiBase<BaseTableDTO>,
  BaseTableDTO
> {}
