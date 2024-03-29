<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Lastly, let’s gather details about your certification POCs
          </h1>
          <p class="copy-max-width mb-8">
            Prior to submitting your completed package to a Contracting Office, your J&A
            will need to be signed by your technical POC and your requirements POC. These
            individuals must have authority to certify that the supporting data, respective
            to their area of expertise, is accurate and complete.
          </p>
          <CertificationPOCTypeForm
            v-if="showChildren"
            key="technicalForm"
            id="technicalForm"
            ref="technicalFormRef"
            POCType="Technical"
            sequence="1"
            :pocPrimary="pocPrimary"
            :pocCor="pocCor"
            :pocAcor="pocAcor"
            :newContactData="technicalContactData"
            @update:newContactData="technicalContactData = $event"
            :selectedSysId="technicalPOCId"
            @update:selectedSysId="technicalPOCId = $event"
            :selectedPocType="technicalPOCType"
            @update:selectedPocType="technicalPOCType = $event"
          />
          <hr>
          <CertificationPOCTypeForm
            v-if="showChildren"
            key="requirementsForm"
            id="requirementsForm"
            ref="requirementsFormRef"
            POCType="Requirements"
            sequence="2"
            :pocPrimary="pocPrimary"
            :pocCor="pocCor"
            :pocAcor="pocAcor"
            :newContactData="requirementContactData"
            @update:newContactData="requirementContactData = $event"
            :selectedSysId="requirementsPOCId"
            @update:selectedSysId="requirementsPOCId = $event"
            :selectedPocType="requirementsPOCType"
            @update:selectedPocType="requirementsPOCType = $event"
          >
          </CertificationPOCTypeForm>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import CertificationPOCTypeForm
  from "@/steps/02-EvaluationCriteria/MRR/CertificationPOCTypeForm.vue";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { SaveOnLeaveRefs } from 'types/Global'
import AcquisitionPackage from "@/store/acquisitionPackage";
import { ContactDTO, FairOpportunityDTO, FinancialPOCType } from "@/api/models";
import { convertColumnReferencesToValues } from "@/api/helpers";
import _ from "lodash";
import ContactData from "@/store/contactData";
import { getStringFromReferenceColumn, hasChanges } from "@/helpers";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";
import { ComponentPublicInstance } from "vue";

@Component({
  components: {
    CertificationPOCTypeForm
  }
})

class CertificationPOCs extends Vue {
  $refs!: {
    [key: string]: ComponentPublicInstance & {
      validateForm: ()=> Promise<void>,
      validate: ()=> Promise<SubmitEventPromise>,
    };
  };  

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as unknown as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  /* eslint-disable camelcase */
  private pocPrimary: ContactDTO = {} as ContactDTO;
  private pocCor: ContactDTO = {} as ContactDTO;
  private technicalContactData: ContactDTO = {} as ContactDTO;
  private requirementContactData: ContactDTO = {} as ContactDTO;
  private pocAcor: ContactDTO | undefined = {} as ContactDTO;
  private technicalPOCId = ""
  private technicalPOCType = ""
  private requirementsPOCId = ""
  private requirementsPOCType = ""
  private showChildren = false


  private get currentData(): FairOpportunityDTO {
    const fairOppSaved: FairOpportunityDTO = _.cloneDeep(AcquisitionPackage.fairOpportunity)
      || _.cloneDeep(AcquisitionPackage.getInitialFairOpportunity());
    const formData: FairOpportunityDTO = {
      technical_poc: this.technicalPOCId,
      technical_poc_type: this.technicalPOCType as FinancialPOCType,
      requirements_poc: this.requirementsPOCId,
      requirements_poc_type: this.requirementsPOCType as FinancialPOCType,
    };
    return Object.assign(fairOppSaved,formData)
  }
  private savedData: FairOpportunityDTO = {}

  public hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  public async isFormsValid(): Promise<boolean>{
    return [
      await this.$refs.requirementsFormRef.validateForm(),
      await this.$refs.technicalFormRef.validateForm()
    ].every(v=>v)
  }

  protected async saveOnLeave(): Promise<boolean> {
    if (await this.isFormsValid()){
      if(this.requirementsPOCType === "NEW"){
        const savedContact = await ContactData.saveContact(this.requirementContactData)
        const newContactSysId = convertColumnReferencesToValues(savedContact).sys_id as string;
        this.requirementsPOCId = newContactSysId
      }
      if(this.technicalPOCType === "NEW"){
        const savedContact = await ContactData.saveContact(this.technicalContactData)
        const newContactSysId = convertColumnReferencesToValues(savedContact).sys_id as string;
        this.technicalPOCId = newContactSysId
      }

      try {
        if(this.hasChanged()){
          await AcquisitionPackage.setFairOpportunity(this.currentData)
        }
      } catch (error) {
        console.log(error);
      }

    }
    return true;
  }


  public async loadOnEnter(): Promise<void> {
    this.pocPrimary = await AcquisitionPackage.getContact("PRIMARY");
    this.pocCor = await AcquisitionPackage.getContact("COR");
    this.pocAcor = AcquisitionPackage.hasAlternativeContactRep ?
      await AcquisitionPackage.getContact("ACOR") : undefined;
    let fairOpportunity = AcquisitionPackage.fairOpportunity;
    if (fairOpportunity) {
      fairOpportunity = convertColumnReferencesToValues(
        _.cloneDeep(AcquisitionPackage.fairOpportunity) as FairOpportunityDTO);
      this.requirementsPOCId = getStringFromReferenceColumn(fairOpportunity.requirements_poc);
      if (fairOpportunity.requirements_poc_type === "NEW" && fairOpportunity.requirements_poc) {
        this.requirementContactData =
          convertColumnReferencesToValues(
            await ContactData.getContactBySysId(fairOpportunity.requirements_poc as string)
          );
      } else {
        this.requirementContactData = _.cloneDeep(AcquisitionPackage.initContact);
      }
      this.technicalPOCId = getStringFromReferenceColumn(fairOpportunity.technical_poc);
      if (fairOpportunity.technical_poc_type === "NEW" && fairOpportunity.technical_poc) {
        this.technicalContactData =
          convertColumnReferencesToValues(
            await ContactData.getContactBySysId(fairOpportunity.technical_poc as string)
          );
      } else {
        this.technicalContactData = _.cloneDeep(AcquisitionPackage.initContact);
      }
      this.savedData = fairOpportunity
      this.showChildren = true
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }
}
export default toNative(CertificationPOCs)
</script>
