<template>
  <div
    class="copy-max-width">
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
      id="Callout"
      class="my-10"
      type="warning"
    >
      <template v-slot:content>
        <p class="mt-1 mb-0">
          During your review process, be sure to obtain signatures from certifying officials on
          the <strong>{{needsSignatureLength}} documents </strong> indicated below.
          We’ll help you upload these signed documents next.
        </p>
      </template>
    </ATATAlert>

    <ATATAlert
    v-if="!ditcoUser"
    id="DITCOWhatsNextInfo"
    class="my-10"
    type="info"
  >
    <template v-slot:content>
      <h3 class="mb-1">What’s next?</h3>
      <ol type="1">
        <li class="mb-2">
          Obtain signatures from certifying officials on the <strong>{{needsSignatureLength}}
          documents</strong> indicated below.
        </li>
        <li class="mb-2">Send your downloaded package and signed documents
          to your Contracting Office for processing.
        </li>
        <li class="mb-2">
          Once a task order is awarded, you can return to ATAT and we’ll help you provision
          your accounts and environments with your Cloud Service Provider.
        </li>
      </ol>
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
                v-if="isErrored === false"
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
                v-if="isErrored === false"
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
import {TABLENAME as FUNDING_REQUEST_MIPRFORM_TABLE} from "@/api/fundingRequestMIPRForm";
import {TABLENAME as REQUIREMENTS_COST_ESTIMATE_TABLE} from "@/api/requirementsCostEstimate";
import Vue from "vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {TABLENAME as FUNDING_REQUEST_FSFORM_TABLE } from "@/api/fundingRequestFSForm";
import IGCE from "@/store/IGCE";
import SaveOnLeave from "@/mixins/saveOnLeave";
import acquisitionPackage from "@/store/acquisitionPackage";
import { signedDocument } from "types/Global";


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
  @PropSync(
    "isGenerating",{default: false}
  ) private _isGenerating!: boolean;


  public packageId = "";
  private lastUpdatedString = ""
  private currentEnvServiceName = CURRENT_ENVIRONMENT_TABLE;
  private reqCostEstimateServiceName = REQUIREMENTS_COST_ESTIMATE_TABLE;
  private needsSignatureLength = 0
  private downloadPackageLink = "";
  private domain="";
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
    this._isGenerating = true;
  }
  private packageCheckList: signedDocument[] = [];
  
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

    this.packageCheckList = (await AcquisitionPackage.getSignedDocumentsList()).filter(
      signedDoc => signedDoc.show === true
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
    const docNames:string[] = []
    this.packageCheckList.forEach(listItem => {
      if(typeof listItem.itemName === "string")
        docNames.push(listItem.itemName)
    })
    await AcquisitionPackage.setAttachmentNames(docNames)

    this.packageId = AcquisitionPackage.acquisitionPackage?.sys_id?.toUpperCase() || "";
    this.downloadPackageLink = await acquisitionPackage.setDownloadPackageLink(false);
  }

  async mounted(): Promise<void>{
    await AcquisitionPackage.setDisableContinue(false)
    await this.loadOnEnter();
  }

}
</script>
