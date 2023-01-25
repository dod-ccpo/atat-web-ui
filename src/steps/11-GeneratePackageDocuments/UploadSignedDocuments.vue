<template>
  <div>
    <h1>
      Upload your signed documents
    </h1>
    <div class="copy-max-width">
      <p class="mt-2 mb-4">
        To submit your package to DITCO, all documents that require certification must be signed by
        your approving officials. Upload your individually signed documents below.
      </p>
      <hr class="base-lighter" />
      <div>
        <ATATFileUpload
          :validFileFormats="validFileFormats"
          :attachmentServiceName="attachmentServiceName"
          :maxFileSizeInBytes="maxFileSizeInBytes"
          id="FundingPlan"
          @delete="onRemoveAttachment"
          fileListTitle="Your files"
          :invalidFiles.sync="invalidFiles"
          :maxNumberOfFiles="2"
          :validFiles.sync="uploadedFiles"
          :rules="getRulesArray()"
        />

      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATFileUpload from "@/components/ATATFileUpload.vue";
import { TABLENAME as ACQUISITION_PACKAGE_TABLE } from "@/api/acquisitionPackages";
import { invalidFile, uploadingFile } from "../../../types/Global";
import Attachments from "@/store/attachments";
@Component({
  components:{
    ATATFileUpload
  }
})
export default class UploadSignedDocuments extends Vue {
  private attachmentServiceName = ACQUISITION_PACKAGE_TABLE;
  private maxFileSizeInBytes = 1073741824;
  private validFileFormats = ["pdf","jpg","png","docx"];
  private invalidFiles: invalidFile[] = [];
  private uploadedFiles: uploadingFile[] = [];
  private greaterThanMessage = "Too many files selected. You can upload up to 5 files";
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
      }
    } catch (error) {
      console.error(`error removing attachment with id ${file?.attachmentId}`);
    }
  }
  private getRulesArray(): ((v: string|number) => string | true | undefined)[] {
    let rulesArr: ((v: string|number) => string | true | undefined)[] = [];

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
    rulesArr.push(this.$validators.lessThan(5,this.greaterThanMessage));

    return rulesArr;
  }
  public async loadOnEnter(): Promise<void> {
    console.log(AcquisitionPackage.attachmentNames)
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

