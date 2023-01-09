<template>
  <div>
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

    <ATATAlert 
      v-if="isErrored" 
      id="ErrorAlert" 
      class="my-10"
    >
      <template v-slot:content>
        <p class="mt-1 mb-0">
          An error has occured while generating the documents.  
          Please contact your system administrator
        </p>
      </template>
    </ATATAlert>

    <div class="d-flex">
      <div class="mr-8">
        <div class="package-list pa-6">
          <v-row no-gutters>
            <v-col cols="9">
              <h2>
                Your acquisition package
              </h2>
              <span class="font-weight-500 text-base font-size-14">
                ({{packageCheckList.length}} documents)
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
                v-for="(acPackage, idx) of packageCheckList" :key="idx"
                :itemNumber="String(idx + 1)"
                :itemName="acPackage.itemName"
                :requiresSignature="acPackage.requiresSignature"
                v-show="acPackage.show"
              ></PackageItem>
              <PackageItem
                v-for="(document, idx) of _packageDocuments" :key="idx"
                :itemNumber="(Number(idx) + 6).toString().padStart(2,'0')"
              ></PackageItem>
            </v-col>
          </v-row>        
        </div>
      </div>

      <div style="width: 400px;">
        <div v-if="contractingShop === 'DITCO' "
          id="emailCard"
          class="border1 border-rounded-more border-base-lighter pa-6 mb-7 _shadow"
        >
          <h3 class="mb-2">Email your documents to DITCO</h3>
          <p>
            Send your completed package via email to disa.scott.ditco.mbx.ditco-jwcc@mail.mil
          </p>
            <v-btn
              class="d-flex align-center primary width-100"
              @click="openMail"
              @keydown.enter="openMail"
              @keydown.space="openMail"
            >
              Send Documents
              <ATATSVGIcon class="ml-2" name="sendEmail" color="white" :width="19" :height="14"/>
            </v-btn>
        </div>
        <div 
          id="regenerateCard" 
          class="border1 border-rounded-more border-base-lighter pa-6"
        >
          <h3 class="mb-2">Need to update your documents?</h3>
          <p>
            You can make changes to information within steps 1-8 
            at any time and re-generate new documents, as needed.
          </p> 
          <v-btn
            class="secondary width-100"
            @click="$emit('regenerate')"
          >
            Re-generate my documents&nbsp;
            <v-icon>sync</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PackageItem from "./PackageItem.vue";
import ATATAlert from "@/components/ATATAlert.vue"
import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";

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


  private contractingShop = "";
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded || "";
  }
  private packageCheckList: Record<string,string|boolean>[] = []
  private packages = [
    {
      itemName:"Requirements Checklist",
      requiresSignature:true,
      show:true
    },{
      itemName:"Description of Work",
      requiresSignature:false,
      show:true
    },{
      itemName:"Evaluation Plan",
      requiresSignature:false,
      show:this.fairOpportunity === "NO_NONE"
    },{
      itemName:"Independent Government Cost Estimate (IGCE)",
      requiresSignature:true,
      show:true
    },{
      itemName:"Incremental Funding Plan",
      requiresSignature:false,
      show:this.incrementallyFunded === "NO"
    },
  ]
  private openMail(): void {
    const mailStr = "mailto:disa.scott.ditco.mbx.ditco-jwcc@mail.mil";
    window.open(mailStr, "_blank");
  }
  async mounted(): Promise<void>{
    this.packages.forEach(item => {
      if(item.show){
        this.packageCheckList.push(item)
      }
    })
    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
    this.contractingShop = AcquisitionPackage.contractingShop
  }

}
</script>
