<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1>
          Your documents are ready to download and review.
        </h1>
        <div class="copy-max-width">
          <p class="mt-2 mb-0">
            We’ve generated your required documents based on the information that you have 
            provided in steps 1-8. Download your entire package below and review each 
            document. Be sure to sign all necessary documents prior to submitting them 
            to your Contracting Office to begin the procurement process.
          </p>
        </div>
      </v-col>
    </v-row>
     <v-row v-if="isErrored">
      <v-col>
        <ATATAlert>
          <template v-slot:content>
              <p class="mt-1 mb-0">
                An error has occured while generating the documents.  
                Please contact your system administrator
              </p>
          </template>
        </ATATAlert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <div class="package-list pa-6">
          <v-row no-gutters>
            <v-col cols="9">
              <h2>
                Your acquisition package
              </h2>
              <span class="font-weight-500 text-base font-size-14">
                ({{_packageDocuments.length + 5}} documents)
              </span>
            </v-col>
            <v-col cols="3" align-self="end">
              <v-btn
                class="primary _text-decoration-none px-6"
                large
                v-if="isErrored === false"
                target="_blank"
                :href="'/download_all_attachments.do?sysparm_sys_id=' + packageId" 
              >
                Download 
                <v-icon class="ml-2">download</v-icon>
              </v-btn>
            </v-col>
          </v-row> 
          <v-row>
            <v-col>
              <PackageItem
                itemNumber="01"
                itemName="Requirements Checklist"
                requiresSignature=true
              ></PackageItem>
              <PackageItem
                itemNumber="02"
                itemName="Description of Work"
              ></PackageItem>
              <PackageItem
                itemNumber="03"
                itemName="Evaluation Plan"
              ></PackageItem>
              <PackageItem
                itemNumber="04"
                itemName="Independent Government Cost Estimate (IGCE)"
                requiresSignature=true
              ></PackageItem>
              <PackageItem
                itemNumber="05"
                itemName="Incremental Funding Plan"
                requiresSignature=true
              ></PackageItem>
              <PackageItem
                v-for="(document, idx) of _packageDocuments" :key="idx"
                :itemNumber="(Number(idx) + 6).toString().padStart(2,'0')"
              ></PackageItem>
            </v-col>
          </v-row>        
        </div>
      </v-col>
      <v-col cols="4">
        <div 
          id="regenerateCard" 
          class="border1 border-rounded border-base-lighter pa-6"
        >
          <h3 class="mb-2">Need to update your documents?</h3>
          <p>
            You can make changes to information within steps 1-8 
            at any time and re-generate new documents, as needed.
          </p> 
          <v-btn
            class="secondary"
            @click="$emit('regenerate')"
          >
            Re-generate my documents&nbsp;
            <v-icon>sync</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PackageItem from "./PackageItem.vue";
import ATATAlert from "@/components/ATATAlert.vue"
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATSVGIcon,
    PackageItem,
    ATATAlert
  }
})
export default class ReviewDocuments extends Vue {

  @PropSync(
    "packageDocuments",{default: () => []}
  ) private _packageDocuments!: [];

  @Prop({default: false }) private isErrored!: boolean;
  public packageId = "";

  async mounted(): Promise<void>{
    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
  }

}
</script>