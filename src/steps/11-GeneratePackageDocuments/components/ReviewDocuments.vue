<template>
  <div
    :class="{'copy-max-width':ditcoUser}">
    <h1>
      Your documents are ready to download and review
    </h1>
    <div >
      <p class="mt-2 mb-4 copy-max-width">
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
        <div
          class="package-list pa-6"
          :class="{'width-100':ditcoUser}"
        >
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
import Attachments from "@/store/attachments";
import {TABLENAME as CURRENT_ENVIRONMENT_TABLE} from "@/api/currentEnvironment";
import { TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE } from "@/api/fundingRequestMIPRForm";
import Vue from "vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { TABLENAME as FUNDING_REQUEST_FSFORM_TABLE } from "@/api/fundingRequestFSForm";


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
  private lastUpdatedString = ""
  private ditcoUser = AcquisitionPackage.isDitcoUser
  private currentEnvServiceName = CURRENT_ENVIRONMENT_TABLE;
  private needsSignatureLength = 0
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded || "";
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
      requiresSignature:true,
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
  ];

  private createAttachmentObject(attachment:any, step:string):void{
    const obj = {
      itemName:attachment.file_name,
      requiresSignature:false,
      show:true,
      description: `Uploaded in step ${step}`
    }
    this.packageCheckList.push(obj)
  }

  public async loadOnEnter(): Promise<void> {
    if(AcquisitionPackage.acquisitionPackage
      && AcquisitionPackage.acquisitionPackage.sys_updated_on){
      this.lastUpdatedString =
        `Last updated ${createDateStr(AcquisitionPackage.acquisitionPackage.sys_updated_on, true)}`
    }
    this.packages.forEach(item => {
      if(item.show){
        this.packageCheckList.push(item)
      }
    })
    this.packageCheckList.forEach(item =>{
      if(item.requiresSignature){
        this.needsSignatureLength++
      }
    })
    const currentEnv = await CurrentEnvironment.getCurrentEnvironment()
    const MIPR = await FinancialDetails.loadFundingRequestMIPRForm()
    const fundingRequest = await FinancialDetails.loadFundingRequestFSForm()
    const fundingRequestIds = []

    const migrationAttachments = await Attachments.getAttachmentsBySysIds({
      serviceKey: this.currentEnvServiceName,
      sysIds: currentEnv?.migration_documentation||[]
    });
    migrationAttachments.forEach(attachment => {
      this.createAttachmentObject(attachment,'4 (Current Environment)')
    })

    const sysDocAttachments = await Attachments.getAttachmentsBySysIds({
      serviceKey: this.currentEnvServiceName,
      sysIds: currentEnv?.system_documentation||[]
    });
    sysDocAttachments.forEach(attachment => {
      this.createAttachmentObject(attachment,'4 (Current Environment)')
    })

    if(MIPR.mipr_attachment){
      const MIPRAttachment = await Attachments.getAttachmentById({
        serviceKey: FUNDING_REQUEST_MIPRFORM_TABLE, sysID: MIPR.mipr_attachment});
      this.createAttachmentObject(MIPRAttachment,'8 (Funding)')
    }

    if (fundingRequest?.fs_form_7600a_attachment.length > 0) {
      fundingRequestIds.push(fundingRequest?.fs_form_7600a_attachment)
    }
    if (fundingRequest?.fs_form_7600b_attachment.length > 0) {
      fundingRequestIds.push(fundingRequest?.fs_form_7600b_attachment)
    }
    const fundingRequestAttachments = await Attachments.getAttachmentsBySysIds({
      serviceKey: FUNDING_REQUEST_FSFORM_TABLE,
      sysIds: fundingRequestIds
    });
    fundingRequestAttachments.forEach(attachment => {
      this.createAttachmentObject(attachment,'8 (Funding)')
    })

    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
  }

  async mounted(): Promise<void>{
    await this.loadOnEnter()
  }

}
</script>
