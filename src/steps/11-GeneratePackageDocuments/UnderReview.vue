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
              <h2>Your completed package includes:</h2>
              <ul>
                <li
                  v-for="(item,idx) in documentList"
                  :key="idx"
                  class="text-base py-1"
                >
                  {{item}}
                </li>
              </ul>
              <v-btn
                class="secondary _text-decoration-none px-6 mt-3"
                large
                target="_blank"
                :href="'/download_all_attachments.do?sysparm_sys_id=' + packageId"
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

import { Component, Mixins, Watch } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import SaveOnLeave from "@/mixins/saveOnLeave";
@Component({
  components: {
    ATATSVGIcon,
    ATATCheckboxGroup
  }
})
export default class ReadyToSubmit extends Mixins(SaveOnLeave) {
  public packageId = "";
  private documentList:string[]=[];

  public async saveOnLeave(): Promise<boolean> {
    await AcquisitionPackage.setValidateNow(true);
    await AcquisitionPackageSummary.updateAcquisitionPackageStatus({
      acquisitionPackageSysId: AcquisitionPackage.acquisitionPackage?.sys_id||"",
      newStatus: "WAITING_FOR_TASK_ORDER"
    })
    return true;
  }

  public async loadOnEnter(): Promise<void> {
    if(acquisitionPackage.attachmentNames){
      this.documentList = acquisitionPackage.attachmentNames
    }
    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
    await acquisitionPackage.setHideNavigation(true)
  }
}
</script>

