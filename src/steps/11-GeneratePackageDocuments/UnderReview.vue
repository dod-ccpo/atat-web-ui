<template>
  <div class="container-max-width ml-10">
    <h1>
      Your package is currently under review
    </h1>
    <div class="d-flex mt-10">
      <div class="copy-max-width">
        <p>
          Your acquisition was submitted to DITCO for processing. A Contracting Specialist is
          reviewing your documents and will contact you if any changes are required. Nothing
          further is needed from you at this time.
        </p>
        <div class="d-flex">
          <ATATSVGIcon
            width="680" height="466" name="underReview" color="primary"
          />
          <div class="ml-10">
            <v-card
              class="
            border1
            border-base-lighter
            pa-4"
              :elevation="2"
            >
              <h3 class="mb-2">Your completed package includes:</h3>
              <ul>
                <li
                  v-for="(item,idx) in uploadedFiles"
                  :key="idx"
                  class="text-base py-1"
                >
                  {{item.fileName}}
                </li>
              </ul>
              <v-btn
                class="secondary _text-decoration-none px-6 mt-3"
                large
                target="_blank"
                :href="downloadPackageLink"
              >
                <ATATSVGIcon
                  class="mr-2" width="14" height="19" name="download" color="primary"
                />
                Download your completed package
              </v-btn>
            </v-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { TABLENAME as PACKAGE_DOCUMENTS_SIGNED } from "@/api/packageDocumentsSigned";
import { AxiosRequestConfig } from "axios";
import api from "@/api";
import Attachments from "@/store/attachments";
import { AttachmentDTO } from "@/api/models";
import { uploadingFile } from "types/Global";
@Component({
  components: {
    ATATSVGIcon,
    ATATCheckboxGroup
  }
})
export default class ReadyToSubmit extends Vue {
  public packageId = "";
  private attachmentServiceName = PACKAGE_DOCUMENTS_SIGNED;
  private downloadPackageLink = "";
  private uploadedFiles: uploadingFile[] = [];

  public async loadOnEnter(): Promise<void> {
    const query: AxiosRequestConfig = {
      params: {
        // eslint-disable-next-line camelcase
        sysparm_query: "acquisition_package.sys_id=" + AcquisitionPackage.packageId
      }
    };
    const signedDocumentSysId = await api.packageDocumentsSignedTable.getQuery(query);
    if(signedDocumentSysId.length > 0){
      try {
        const attachment = await Attachments.getAttachmentsByTableSysIds({
          serviceKey: PACKAGE_DOCUMENTS_SIGNED, tableSysId: signedDocumentSysId[0].sys_id||""});
        const uploadedFiles = attachment.map((attachment: AttachmentDTO) => {
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
        throw new Error("an error occurred loading Package Signed Documents data");
      }
    }


    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
  }

  async mounted(): Promise<void>{
    await this.loadOnEnter()
    await acquisitionPackage.setHideNavigation(true);
    this.downloadPackageLink = await acquisitionPackage.setDownloadPackageLink();
  }
} 
</script>

