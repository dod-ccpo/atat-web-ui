 <template>
  <v-container class="container-max-width mb-7" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">Let’s gather info about your MIPR</h1>
        <div class="mt-10">
          <ATATTextField
            id="MIPRNumber"
            :rules="[
                $validators.required('Please enter the MIPR Number located' +
                 ' on your authorized DD Form 448.')
              ]"
            :tooltipText="toolTip"
            :value.sync="MIPRNumber"
            class="_input-max-width"
            label="MIPR Number"
          />
        </div>
        <hr/>
        <h3 class="mb-5">Upload your MIPR (DD Form 448)</h3>
        <ATATFileUpload
          id="FundingPlan"
          tabindex="-1"
          :invalidFiles.sync="invalidFiles"
          :maxFileSizeInBytes="maxFileSizeInBytes"
          :maxNumberOfFiles="1"
          :rules="getRulesArray()"
          :validFileFormats="validFileFormats"
          :validFiles.sync="uploadedFiles"
          :helpText="fileUploadHelpText"
          :attachmentServiceName="attachmentServiceName"
          @delete="onRemoveAttachment"
          :multiplesAllowed="false"
          :requiredMessage="requiredMessage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";

import { Component, Mixins } from "vue-property-decorator";
import ATATFileUpload from "../../components/ATATFileUpload.vue";
import { AttachmentTables } from "@/api";
import { AttachmentDTO, FundingRequestMIPRFormDTO } from "@/api/models";
import { TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE } from "@/api/fundingRequestMIPRForm";
import { invalidFile, uploadingFile } from "types/Global";
import Attachments from "@/store/attachments";
import ATATTextField from "@/components/ATATTextField.vue";
import FinancialDetails, { initialFundingRequestMIPRForm } from "@/store/financialDetails";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { AttachmentServiceCallbacks } from "@/services/attachment";

@Component({
  components: {
    ATATTextField,
    ATATFileUpload,
  },
})
export default class MIPR extends Mixins(SaveOnLeave)  {
  private attachmentServiceName = FUNDING_REQUEST_MIPRFORM_TABLE;
  private uploadedFiles: uploadingFile[] = [];
  private invalidFiles: invalidFile[] = [];
  private validFileFormats = ["xlsx", "xls", "pdf"];
  private maxFileSizeInBytes = 1073741824;
  private saved: FundingRequestMIPRFormDTO = {
    /* eslint-disable camelcase */
    mipr_number:"",
    mipr_attachment: "",
    mipr_filename: ""
  };
  private MIPRNumber = ""
  private toolTip = `This number is assigned by your agency’s accounting and finance office.
   It is located in Box 5 on the MIPR form (DD Form 448).`
  private fileUploadHelpText = "Supported file types: PDF&nbsp;&nbsp;•" +
                                  "&nbsp;&nbsp;Max file size: 1GB&nbsp;&nbsp;•" +
                                  "&nbsp;&nbsp;Maximum 1 file";
  private requiredMessage = "You must include an authorized MIPR for this acquisition. " +
        "Please upload your missing document, or select Back to choose another method for " +
        "transferring funds.";

  // rules array dynamically created based on the invalid
  // files returned from the child component

  async loadOnEnter(): Promise<void> {
    try {
      this.saved = await FinancialDetails.loadFundingRequestMIPRForm();
      this.MIPRNumber = this.saved.mipr_number;
      if(this.saved.mipr_attachment){
        const attachment = await Attachments.getAttachmentById({
          serviceKey: FUNDING_REQUEST_MIPRFORM_TABLE, sysID: this.saved.mipr_attachment});
        if (attachment) {
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
          this.uploadedFiles = [upload];
        }
      }
    } catch (error) {
      throw new Error("an error occurred loading MIPR data");
    }
  }

  get current(): FundingRequestMIPRFormDTO {
    return {
      /* eslint-disable camelcase */
      mipr_number:this.MIPRNumber,
      mipr_attachment: this.uploadedFiles[0].attachmentId,
      mipr_filename: this.uploadedFiles[0].fileName || ""
    }
  }
  private hasChanged(): boolean {
    return hasChanges(this.current, this.saved);
  }
  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        const updated: FundingRequestMIPRFormDTO = {
          ...this.saved || initialFundingRequestMIPRForm,
          ...this.current
        };
        await FinancialDetails.saveFundingRequestMIPRForm(updated);
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  async onRemoveAttachment(file: uploadingFile): Promise<void> {
    try {
      if (file) {
        const key = this.attachmentServiceName;
        const attachmentId = file.attachmentId;
        const recordId = file.recordId;
        await Attachments.removeAttachment({
          key,
          attachmentId,
          recordId,
        });
      }
    } catch (error) {
      console.error(`error removing attachment with id ${file?.attachmentId}`);
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();

    //listen for attachment service upload callbacks
    //and update attachments
    AttachmentServiceCallbacks.registerUploadCallBack(
      FUNDING_REQUEST_MIPRFORM_TABLE,
      async () => {
        //reload data when files are uploaded
        this.saved = await FinancialDetails.loadFundingRequestMIPRForm();
      }
    );
  }

  // `ATATFileUpload.vue`
  private getRulesArray(): ((v: string) => string|true|undefined)[] {
    //eslint-disable-next-line prefer-const
    let rulesArr: ((v: string) => string | true | undefined)[] = [];
  
    rulesArr.push(this.$validators.required(this.requiredMessage));
    this.invalidFiles.forEach((iFile) => {
      rulesArr.push(
        this.$validators.isFileValid(
          iFile.file,
          this.validFileFormats,
          this.maxFileSizeInBytes,
          iFile.doesFileExist,
          iFile.SNOWError,
          iFile.statusCode
        )
      );
    });
    return rulesArr;
  }

}
</script>
