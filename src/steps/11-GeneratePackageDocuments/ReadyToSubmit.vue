<template>
  <div class="container-max-width">
    <h1>
      Ready to submit your acquisition package?
    </h1>
    <div class="d-flex mt-10">
      <div class="copy-max-width">
        <p class="font-size-20 font-weight-500 mb-3">
          Great news! We have everything ready to send your package to DITCO for processing.
        </p>
        <p class="mt-2 mb-4">
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
            labelFontWeight="500"
            labelFontSize="14"
            :card="false"
          />
          <ol class="ml-6">
            <li>
              All information in my package is accurate and complete to the best of my knowledge.
            </li>
            <li>
              All documents requiring certification have been signed and uploaded.
            </li>
          </ol>
        </div>
      </div>
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
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import acquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
@Component({
  components: {
    ATATSVGIcon,
    ATATCheckboxGroup
  }
})
export default class ReadyToSubmit extends Vue {
  public packageId = "";
  private documentList:string[]=[];
  private certified = []
  private checkboxItem = [
    {
      id: "Programming",
      label: "By submitting this acquisition, I certify that:",
      value: "true",
    },
  ]

  public async loadOnEnter(): Promise<void> {
    if(acquisitionPackage.attachmentNames){
      this.documentList = acquisitionPackage.attachmentNames
    }
    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
  }
  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }
}
</script>

