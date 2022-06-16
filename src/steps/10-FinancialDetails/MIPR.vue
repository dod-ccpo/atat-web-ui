<template>
  <v-container class="container-max-width mb-7" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">Let’s gather info about your MIPR</h1>
        <div class="mt-10">
          <ATATTextField
            id="ProjectTitle"
            :rules="[
                $validators.required('Please enter the MIPR number located' +
                 ' on your authorized DD Form 448.')
              ]"
            :tooltipText="toolTip"
            :value.sync="MIPRNumber"
            class="_input-max-width"
            label="MIPR number"
          />
        </div>
        <hr/>
        <h3 class="mb-5">Upload your MIPR (DD Fom 448)</h3>
        <ATATFileUpload
          id="FundingPlan"
          :invalidFiles.sync="invalidFiles"
          :maxFileSizeInBytes="maxFileSizeInBytes"
          :rules="getRulesArray()"
          :validFileFormats="validFileFormats"
          :validFiles.sync="uploadedFiles"
          :helpText="fileUploadHelpText"
          attachmentServiceName="FundingPlans"
          @delete="onRemoveAttachment"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATFileUpload from "../../components/ATATFileUpload.vue";
import { AttachmentTables } from "@/api";
import { AttachmentDTO } from "@/api/models";
import { invalidFile, uploadingFile } from "types/Global";
import Attachments from "@/store/attachments";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField,
    ATATFileUpload,
  },
})
export default class MIPR extends Vue {
  private uploadedFiles: uploadingFile[] = [];
  private invalidFiles: invalidFile[] = [];
  private validFileFormats = ["xlsx", "xls", "pdf"];
  private maxFileSizeInBytes = 1073741824;
  private MIPRNumber = ""
  private toolTip = `This number is assigned by your agency’s accounting and finance office.
   It is located in Box 5 on the MIPR form (DD Form 448).`
  private fileUploadHelpText = "Supported file types: PDF • Max file size: 1GB"

  // rules array dynamically created based on the invalid
  // files returned from the child component

  async loadOnEnter(): Promise<void> {
    try {

      const attachments = await Attachments.getAttachments(AttachmentTables.FundingPlans);
      const uploadedFiles = attachments.map((attachment: AttachmentDTO) => {
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

    } catch (error) {
      throw new Error("an error occurred loading funding plans data");
    }
  }

  async onRemoveAttachment(file: uploadingFile): Promise<void> {
    try {
      if (file) {
        const key = AttachmentTables.FundingPlans;
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
  }

  // `ATATFileUpload.vue`
  private getRulesArray(): ((v: string) => string | true | undefined)[] {
    let rulesArr: ((v: string) => string | true | undefined)[] = [];

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
    console.log(rulesArr)
    return rulesArr;
  }

}
</script>
