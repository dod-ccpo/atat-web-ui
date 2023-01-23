<template>
  <div>
    <h1>
      Your documents are ready to download and review.
    </h1>
    <div class="copy-max-width">
      <p class="mt-2 mb-4">
        We’ve generated your required documents based on the information that you have provided in
        steps 1-8. Download your entire package below and review each document. If needed, you can
        revisit the previous steps to make changes and click the “Update” button to re-generate your
        documents.
      </p>
    </div>

    <ATATAlert
      v-if="needsSignatureLength && ditcoUser"
      id="warning"
      class="my-10"
      type="warning"
    >
      <template v-slot:content>
        <p class="mt-1 mb-0">
          Your package has
          <strong>{{needsSignatureLength}} documents requiring certification.</strong>
          During your review process, be sure to obtain signatures from your approving officials,
          and we’ll upload them on the following page.
        </p>
      </template>
    </ATATAlert>
    <ATATAlert 
      v-if="isErrored" 
      id="ErrorAlert" 
      class="my-10"
    >
      <template v-slot:content>
        <p class="mt-1 mb-0">
          An error has occurred while generating the documents.
          Please contact your system administrator
        </p>
      </template>
    </ATATAlert>

    <div class="d-flex">
        <div class="package-list pa-6">
          <v-row class="d-flex justify-space-between">
            <v-col>
              <h2>
                Your acquisition package
              </h2>
              <span v-if="!ditcoUser" class="font-weight-500 text-base font-size-14">
                ({{packageCheckList.length}} documents)
              </span>
              <span v-else class="font-weight-500 text-base font-size-14">
                {{packageCheckList.length}} documents • {{lastUpdatedString}}
              </span>
            </v-col>
            <v-col class="d-flex justify-end" align-self="end">
              <v-btn
                v-if="ditcoUser && isErrored === false"
                class="secondary _text-decoration-none px-6 mr-5"
                large
                target="_blank"
                @click="update()"
                @keydown.enter="update()"
                @keydown.space="update()"
              >
                Update
                <ATATSVGIcon class="pl-2" width="14" height="19" name="update" color="primary"/>
              </v-btn>
              <v-btn
                class="primary _text-decoration-none px-6"
                large
                v-if="isErrored === false"
                target="_blank"
                width="137"
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
                :additionalInfo="acPackage.description"
                :alertText="acPackage.alertText"
                :ditcoUser="ditcoUser"
                v-show="acPackage.show"
              ></PackageItem>
              <PackageItem
                v-for="(document, idx) of _packageDocuments" :key="idx"
                :itemNumber="(Number(idx) + 6).toString().padStart(2,'0')"
              ></PackageItem>
            </v-col>
          </v-row>
      </div>

      <div
        style="width: 400px;"
        v-if="!ditcoUser"
        class="pl-5">
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
import { Component, Mixins, Prop, PropSync } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PackageItem from "./PackageItem.vue";
import ATATAlert from "@/components/ATATAlert.vue"
import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import { createDateStr } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";
import Attachments from "@/store/attachments";

@Component({
  components: {
    ATATSVGIcon,
    PackageItem,
    ATATAlert
  }
})

export default class ReviewDocuments extends Mixins(SaveOnLeave) {
  @PropSync(
    "packageDocuments",{default: () => []}
  ) private _packageDocuments!: [];
  @Prop({default: false }) private isErrored!: boolean;

  public packageId = "";
  private lastUpdatedString = ""

  private needsSignatureLength = 0
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded || "";
  }
  get ditcoUser():boolean {
    return AcquisitionPackage.acquisitionPackage?.contracting_shop === "DITCO"
  }
  private async update(): Promise<void> {
    await this.$router.push(
      {
        path:"ready-to-generate-package"
      }
    );
  }
  private packageCheckList: Record<string,string|boolean|undefined>[] = []
  private packages = [
    {
      itemName:"Requirements Checklist",
      requiresSignature:true,
      alertText:"Requires signatures",
      show:true
    },
    {
      itemName:"Independent Government Cost Estimate",
      requiresSignature:true,
      alertText:"Requires signatures",
      show:true
    },
    {
      itemName:"Incremental Funding Plan",
      requiresSignature:false,
      alertText:"Requires signatures",
      show:this.incrementallyFunded === "YES"
    },
    {
      itemName:"Justification and Approval (Template)",
      requiresSignature:true,
      alertText:"Complete and sign",
      show:this.fairOpportunity !== "NO_NONE"
    },
    {
      itemName:"Sole Source Market Research Report (Template)",
      requiresSignature:true,
      alertText:"Complete and sign",
      show:this.fairOpportunity !== "NO_NONE"
    },
    {
      itemName:"Description of Work",
      requiresSignature:false,
      show:true
    },
    {
      itemName:"Evaluation Plan",
      requiresSignature:false,
      show:this.fairOpportunity !== "NO_NONE"
    },
    {
      itemName:"system diagram of current environment.pdf",
      requiresSignature:false,
      show:true,
      description: "Uploaded in Step 4 (Current Environment)"
    },
    {
      itemName:"file-name-for-7600B-order-document.pdf",
      requiresSignature:false,
      show:true,
      description: "Uploaded in Step 8 (Funding)"
    },
    {
      itemName:"long_file_name_fo...documentation.pdf",
      requiresSignature:false,
      show:true,
      description: "Uploaded in Step 8 (Requirements Cost Estimate)"
    },
  ];

  public async saveOnLeave(): Promise<boolean> {
    console.log('hello')
    await AcquisitionPackageSummary.updateAcquisitionPackageStatus({
      acquisitionPackageSysId: AcquisitionPackage.acquisitionPackage?.sys_id||"",
      newStatus: "WAITING_FOR_SIGNATURES"
    })
    return true;
  }

  async mounted(): Promise<void>{
    this.packages.forEach(item => {
      if(item.show){
        this.packageCheckList.push(item)
      }
    })
    if(AcquisitionPackage.acquisitionPackage){
      console.log(await Attachments
        .getAttachments(AcquisitionPackage.acquisitionPackage?.sys_id||""))
    }
    this.packageCheckList.forEach(item =>{
      if(item.requiresSignature){
        this.needsSignatureLength++
      }
    })
    if(AcquisitionPackage.acquisitionPackage
      && AcquisitionPackage.acquisitionPackage.sys_updated_on){
      this.lastUpdatedString =
        `Last updated ${createDateStr(AcquisitionPackage.acquisitionPackage.sys_updated_on, true)}`
    }
    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
  }

}
</script>
