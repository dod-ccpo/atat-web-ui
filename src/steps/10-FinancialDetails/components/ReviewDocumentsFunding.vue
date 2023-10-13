<template>
  <div
    class="copy-max-width">
    <h1>
      Your draft documents are ready for download
    </h1>

    <ATATAlert
      v-if="needsSignatureLength && isDitcoUser"
      id="Callout"
      class="my-10"
      type="info"
    >
      <template v-slot:content>
        <p class="mt-1 pb-1">
          You may need to submit select documents from your package to your financial office in
          order to obtain funding documents for this acquisition package.
        </p>
        <p class="mt-1 mb-1">
          <strong>NOTE</strong>: Upon acquiring funding documents, you will need to return to DAPPS
            and provide your funding information.
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
          class="package-list pa-6 width-100"
        >
          <v-row class="d-flex justify-space-between">
            <v-col>
              <h2>
                Your acquisition package
              </h2>
              <span class="font-weight-500 text-base font-size-14">
                {{packageCheckList.length}} documents • {{lastUpdatedString}}
              </span>
            </v-col>
            <v-col class="d-flex justify-end" align-self="end">
              <v-btn
                v-if="!isErrored"
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
                v-if="!isErrored"
                large
                width="137"
                role="button"
                :href="downloadPackageLink" >
                Download 
                <v-icon class="ml-2">download</v-icon>
            </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <PackageItem
                v-for="(acPackage, idx) of packageCheckList" :key="idx"
                :itemNumber="String(idx<9 ? '0' + (idx + 1) : idx + 1)"
                :itemName="acPackage.itemName"
                :alertText="acPackage.alertText"
                :ditcoUser="isDitcoUser"
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
  </div>
</template>
<script lang="ts">
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import PackageItem from "@/steps/11-GeneratePackageDocuments/components/PackageItem.vue";
import ATATAlert from "@/components/ATATAlert.vue"
import AcquisitionPackage, { isDitcoUser } from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import { createDateStr } from "@/helpers";
import Attachments from "@/store/attachments";
import {TABLENAME as CURRENT_ENVIRONMENT_TABLE} from "@/api/currentEnvironment";
import {TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE} from "@/api/fundingRequestMIPRForm";
import {TABLENAME as REQUIREMENTS_COST_ESTIMATE_TABLE} from "@/api/requirementsCostEstimate";
import Vue from "vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {TABLENAME as FUNDING_REQUEST_FSFORM_TABLE } from "@/api/fundingRequestFSForm";
import IGCE from "@/store/IGCE";
import { signedDocument } from "types/Global";
import ATATFeedbackForm from "@/components/ATATFeedbackForm.vue";


@Component({
  components: {
    ATATFeedbackForm,
    ATATSVGIcon,
    PackageItem,
    ATATAlert
  }
})

export default class ReviewDocumentsFunding extends Vue {
  @PropSync(
    "packageDocuments",{default: () => []}
  ) private _packageDocuments!: [];
  @Prop({default: false }) private isErrored!: boolean;
  @PropSync(
    "isGenerating",{default: false}
  ) private _isGenerating!: boolean;


  public packageId = "";
  private lastUpdatedString = ""
  private currentEnvServiceName = CURRENT_ENVIRONMENT_TABLE;
  private reqCostEstimateServiceName = REQUIREMENTS_COST_ESTIMATE_TABLE;
  private needsSignatureLength = 0
  private downloadPackageLink = "";
  get fairOpportunity():string {
    return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity || "";
  }
  get incrementallyFunded():string {
    return FinancialDetails.fundingRequirement?.incrementally_funded ?? "";
  }
  get isDitcoUser(): boolean {
    return isDitcoUser();
  } 

  private async update(): Promise<void> {
    this._isGenerating = true;
  }
  private packageCheckList: signedDocument[] = [];
  
  private createAttachmentObject(attachment: any, step: string):void{
    const obj = {
      itemName:attachment.file_name,
      requiresSignature:false,
      show:true,
      description: `Uploaded in step ${step}`
    }
    this.packageCheckList.push(obj)
  }

  public async loadOnEnter(): Promise<void> {
    if(AcquisitionPackage.acquisitionPackage?.sys_updated_on) {
      this.lastUpdatedString =
        `Last updated ${createDateStr(AcquisitionPackage.acquisitionPackage.sys_updated_on, true)}`
    }
    
    this.packageCheckList = (await AcquisitionPackage.getSignedDocumentsList()).filter(
      signedDoc => signedDoc.show
    )

    this.needsSignatureLength = 
      this.packageCheckList.filter(signedDoc => signedDoc.requiresSignature).length;

    const currentEnv = await CurrentEnvironment.getCurrentEnvironment()
    const MIPR = await FinancialDetails.loadFundingRequestMIPRForm()
    const fundingRequest = await FinancialDetails.loadFundingRequestFSForm()
    const reqCostEstimate = await IGCE.getRequirementsCostEstimate();
    const fundingRequestIds = [];

    const supportingDocumentsAttachments = await Attachments.getAttachmentsByTableSysIds({
      serviceKey: this.reqCostEstimateServiceName,
      tableSysId: reqCostEstimate?.sys_id as string
    });
    supportingDocumentsAttachments.forEach(attachment => {
      this.createAttachmentObject(attachment,'8 (Requirements Cost Estimate)')
    })


    const migrationAttachments = await Attachments.getAttachmentsBySysIds({
      serviceKey: this.currentEnvServiceName,
      sysIds: currentEnv?.migration_documentation||[]
    });
    migrationAttachments.forEach(attachment => {
      this.createAttachmentObject(attachment,'4 (Current Environment)')
    })

    const sysDocAttachments = await Attachments.getAttachmentsBySysIds({
      serviceKey: this.currentEnvServiceName,
      sysIds: currentEnv?.system_documentation ?? []
    });
    sysDocAttachments.forEach(attachment => {
      this.createAttachmentObject(attachment,'4 (Current Environment)')
    })
    if(MIPR.mipr_attachment){
      const MIPRAttachment = await Attachments.getAttachmentById({
        serviceKey: FUNDING_REQUEST_MIPRFORM_TABLE, sysID: MIPR.mipr_attachment});
      this.createAttachmentObject(MIPRAttachment,'8 (Funding)')
    }
    if(fundingRequest){
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
    }
    const docNames: string[] = []
    this.packageCheckList.forEach(listItem => {
      if(typeof listItem.itemName === "string")
        docNames.push(listItem.itemName)
    })
    await AcquisitionPackage.setAttachmentNames(docNames)

    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() ?? "";
    this.downloadPackageLink = await AcquisitionPackage.setDownloadPackageLink(false);
  }

  async mounted(): Promise<void>{
    await AcquisitionPackage.setDisableContinue(false)
    await this.loadOnEnter();
  }

}
</script>
