<template>
  <div class="container-max-width">
    <h1>
      Ready to submit your acquisition package?
    </h1>
    <div class="d-flex mt-10">
      <div class="copy-max-width">
        <p class="font-size-20 font-weight-500 mb-3" style="line-height: 1.6;">
          Great news! We have everything ready to send your package to DITCO for processing.
        </p>
        <p class="mt-2 mb-10">
          Upon submission, a Contracting Specialist will review your documents and
          contact you if any changes are required. You’ll continue to have access
          to your completed documents within DAPPS.
        </p>
        <div  class="border1 border-rounded-more border-base-lighter pa-6 bg-primary-lighter">
          <ATATCheckboxGroup
            id="CertifiedCheckbox"
            aria-describedby="CertifiedCheckbox"
            :value.sync="certified"
            :items="checkboxItem"
            :boldText="true"
            :card="false"
          />
          <ol class="ml-6">
            <li class="pb-3">
              All information in my package is accurate and complete to the best of my knowledge.
            </li>
            <li>
              All documents requiring certification have been signed and uploaded.
            </li>
          </ol>
        </div>
      </div>
      <div class="ml-10">
        <v-card class="border1 border-base-lighter pa-6 _shadow border-rounded-more">
          <h3 class="mb-3 nowrap">Your completed package includes:</h3>
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
            class="secondary _text-decoration-none px-6 mt-6"
            large
            role="button"
            :href="$sanitize(downloadPackageLink)"
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
</template>
<script lang="ts">

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
  private certified = [];
  private downloadPackageLink = "";
  private checkboxItem = [
    {
      id: "Programming",
      label: "By submitting this acquisition, I certify that:",
      value: "true",
    },
  ]

  @Watch('certified')
  public async certifiedChecked(): Promise<void>{
    if(this.certified.length > 0){
      await acquisitionPackage.setDisableContinue(false)
    }
    else{
      await acquisitionPackage.setDisableContinue(true)
    }
  }
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
    await acquisitionPackage.setDisableContinue(true)
    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
    this.downloadPackageLink = await AcquisitionPackage.setDownloadPackageLink();
    
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

