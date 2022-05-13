<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">Upload your MIPR</h1>
        <ATATFileUpload
          :validFileFormats="['xlsx', 'xls', 'pdf']"
          attachmentServiceName="FundingPlans"
          id="FundingPlan"
          @delete="onRemoveAttachment"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import AcquisitionPackage from "@/store/acquisitionPackage";
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATFileUpload from "../../components/ATATFileUpload.vue";
import { AttachmentTables } from "@/api";
import { uploadingFile } from "types/Global";

@Component({
  components: {
    ATATFileUpload,
  },
})
export default class FundingPlan extends Vue {
  private uploadedFiles: uploadingFile[] = [];

  async loadOnEnter(): Promise<void> {
    try {
      const data =
        (await AcquisitionPackage.loadAttachments(
          AttachmentTables.FundingPlans
        )) || [];
      this.uploadedFiles = data.map((attachment) => {
        return {
          file: new File([], attachment.file_name),
          attachmentId: attachment.sys_id,
          recordId: attachment.table_sys_id,
          link: attachment.download_link,
          isUploaded: true,
          isErrored: false,
          progressStatus: 100,
        };
      }) as uploadingFile[];
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
        await AcquisitionPackage.removeAttachment({
          key,
          attachmentId,
          recordId,
        });
      }
    } catch (error) {
      console.error(`error removing attachment with id ${file?.attachmentId}`);
    }
  }
}
</script>
