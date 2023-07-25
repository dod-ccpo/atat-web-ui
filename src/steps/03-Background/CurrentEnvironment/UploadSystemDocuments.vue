<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Do you have system diagrams, data architecture diagrams, charts, or other relevant
            information for your current environment?
          </h1>
          <div class="copy-max-width">
            <p class="mb-8">
              If available, you can upload this supporting documentation, and we will attach it to
              your Description of Work to be shared with the CSPs for proposal purposes. 
              <strong>Please do not upload any classified documents.</strong>
            </p>
            <ATATRadioGroup
              id="ExistingEnvOptions"
              :card="true"
              :items="uploadOptions"
              :rules="[$validators.required('Please select an option')]"
              :value.sync="hasSystemDocumentation"
              class="copy-max-width mb-10 max-width-740"
              width="180"
            />
            <div v-if="hasSystemDocumentation === 'YES'">
              <hr />
              <ATATFileUpload
                  id="FundingPlan"
                  tabindex="-1"
                  :maxNumberOfFiles="100"
                  :maxFileSizeInBytes="maxFileSizeInBytes"
                  :validFileFormats="validFileFormats"
                  :multiplesAllowed="true"
                  :attachmentServiceName="attachmentServiceName"
                  :invalidFiles.sync="invalidFiles"
                  :validFiles.sync="uploadedFiles"
                  :removeAll.sync="removeAll"
                  @delete="onRemoveAttachment"
                  @uploaded="onUpload"
                  :rules="[$validators.required('Please upload a file')]"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins, Watch } from "vue-property-decorator";
import { invalidFile, RadioButton, uploadingFile, YesNo } from "../../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {AttachmentDTO} from "@/api/models";
import { hasChanges } from "@/helpers";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import { TABLENAME as CURRENT_ENVIRONMENT_TABLE } from "@/api/currentEnvironment";
import CurrentEnvironment,
{defaultCurrentEnvironment} from "@/store/acquisitionPackage/currentEnvironment";
import Attachments from "@/store/attachments";
import {AttachmentServiceCallbacks} from "@/services/attachment";
import SaveOnLeave from "@/mixins/saveOnLeave";


@Component({
  components: {
    ATATFileUpload,
    ATATRadioGroup,
  },
})
export default class UploadSystemDocuments extends Mixins(SaveOnLeave) {
  public currEnvDTO = defaultCurrentEnvironment;
  
  private attachmentServiceName = CURRENT_ENVIRONMENT_TABLE;
  private uploadOptions: RadioButton[] = [
    {
      id: "Yes_SystemDocs",
      label: "Yes.",
      value: "YES",
    },
    {
      id: "No_SystemDocs",
      label: "No.",
      value: "NO",
    },
  ];
  private invalidFiles: invalidFile[] = [];
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["csv","xlsx","pdf","jpg","png","docx"];
  private uploadedFiles: uploadingFile[] = [];

  public hasSystemDocumentation: YesNo = "";
  private get currentData(): Record<string, string> {
    return {
      // eslint-disable-next-line camelcase
      has_system_documentation: this.hasSystemDocumentation  || "",
    };
  }

  private savedData: Record<string, string> = {
    // eslint-disable-next-line camelcase
    has_system_documentation: "",
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {

    AcquisitionPackage.setValidateNow(true);

    try {
      if (this.hasChanged()) {
        Object.assign(this.currEnvDTO, this.currentData);
        await CurrentEnvironment.saveCurrentEnvironment();
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  public removeAll = false

  @Watch('selectedUpload')
  private selectedUploadChange(): void{
    if(this.hasSystemDocumentation === "NO"){
      this.uploadedFiles = []
      this.removeAll = true
    }
  }

  /**
   * On file upload, once the file attachment gets uploaded to the proper place,
   * the current environment's system_documentation array needs to be
   * updated with the sys_id of the newly added attachment. This function
   * takes of this and follows up with a call-out to save the current environment.
   */
  public async onUpload(file: uploadingFile): Promise<void> {
    try {
      if (file) {
        const attachmentSysId = file.attachmentId;
        if(!this.currEnvDTO.system_documentation) {
          this.currEnvDTO.system_documentation = [];
        }
        if (this.currEnvDTO.system_documentation.indexOf(attachmentSysId) === -1) {
          this.currEnvDTO.system_documentation.push(attachmentSysId);
        }
        // console.log(this.currEnvDTO);
        // the updated system_documentation will need to be saved
        await CurrentEnvironment.setCurrentEnvironment(this.currEnvDTO);
      }
    } catch (error) {
      console.error(`error completing file upload with id ${file?.attachmentId}`);
    }
  }

  /**
   * Deletes the attachment from the attachment table by making a callout.
   *
   * And the current environment's system_documentation array needs to be
   * updated by removing the sys_id of the deleted attachment.
   */
  public async onRemoveAttachment(file: uploadingFile): Promise<void> {
    try {
      if (file) {
        const key = this.attachmentServiceName;
        const attachmentId = file.attachmentId;
        const recordId = file.recordId;
        await Attachments.removeAttachment({
          key,
          attachmentId,
          recordId, // recordId is the "table_sys_id" in the context of ATTACHMENT API
        });
        //
        this.currEnvDTO.system_documentation?.splice(
          this.currEnvDTO.system_documentation?.indexOf(attachmentId), 1);
        // console.log(this.currEnvDTO);
        // the updated system_documentation will need to be saved
        await CurrentEnvironment.saveCurrentEnvironment();
      }
    } catch (error) {
      console.error(`error removing attachment with id ${file?.attachmentId}`);
    }
  }

  /**
   * Loads the attachments across all the records of current
   * environment table. It then filters the attachments specific to systems
   * documents of the acquisition.
   */
  async loadAttachments(): Promise<void>{
    if(!this.currEnvDTO.system_documentation) {
      this.currEnvDTO.system_documentation = [];
    }
    const attachments = await Attachments.getAttachmentsBySysIds({
      serviceKey: this.attachmentServiceName,
      sysIds: this.currEnvDTO.system_documentation
    });
    const uploadedFiles = attachments
      .map((attachment: AttachmentDTO) => {
        const file = new File([], attachment.file_name, {
          lastModified: Date.parse(attachment.sys_created_on || "")
        });
        const upload: uploadingFile = {
          attachmentId: attachment.sys_id || "",
          fileName: attachment.file_name,
          file: file,
          created: file.lastModified,
          progressStatus: 100,
          link: attachment.download_link || "",
          recordId: attachment.table_sys_id,
          isErrored: false,
          isUploaded: true
        }
        return upload;
      });
    this.uploadedFiles = [...uploadedFiles];
  }

  public async loadOnEnter(): Promise<void> {
    // TODO - get from ACQPKG store or CURRENV store??
    const storeData = await CurrentEnvironment.getCurrentEnvironment();
    if (storeData) {
      this.currEnvDTO = storeData;
      this.hasSystemDocumentation = storeData.has_system_documentation;
      this.savedData = {
        // eslint-disable-next-line camelcase
        has_system_documentation: storeData.has_system_documentation,
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await this.loadAttachments()
    //listen for attachment service upload callbacks
    //and update attachments
    // TODO: check if this call back registration is required & remove it if not needed
    AttachmentServiceCallbacks.registerUploadCallBack(
      CURRENT_ENVIRONMENT_TABLE,
      async () => {
        await CurrentEnvironment.loadCurrentEnvironment();
      }
    );
  }
}
</script>

