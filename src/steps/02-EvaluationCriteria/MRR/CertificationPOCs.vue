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
            id="technicalForm"
            POCType="Technical"
            sequence="1"
            :pocPrimary="pocPrimary"
            :pocCor="pocCor"
            :pocAcor="pocAcor"
            :newContactData.sync="technicalContactData"
            :selectedSysId.sync="technicalPOCId"
            :selectedPocType.sync="technicalPOCType"
          />
          <hr>
          <CertificationPOCTypeForm
            v-if="showChildren"
            id="requirementsForm"
            POCType="Requirements"
            sequence="2"
            :pocPrimary="pocPrimary"
            :pocCor="pocCor"
            :pocAcor="pocAcor"
            :newContactData.sync="requirementContactData"
            :selectedSysId.sync="requirementsPOCId"
            :seletedPocType.sync="requirementsPOCType"
          >
          </CertificationPOCTypeForm>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import CertificationPOCTypeForm
  from "@/steps/02-EvaluationCriteria/MRR/CertificationPOCTypeForm.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { ContactDTO, FairOpportunityDTO } from "@/api/models";

@Component({
  components: {
    CertificationPOCTypeForm
  }
})

export default class CertificationPOCs extends Mixins(SaveOnLeave) {
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

  // protected async saveOnLeave(): Promise<boolean> {
  //   try {
  //     debugger
  //     const fairOpportunity = {} as FairOpportunityDTO;
  //     let setFairOpportunity = false;
  //     let contactSysId = "";
  //     if (this.selectedOptionType === "NEW") {
  //       // user changed from other types to NEW or could be first time filling the form.
  //       if (this.hasCurrentContactFormChanged()) {
  //         setFairOpportunity = true;
  //         const savedContact = await ContactData.saveContact(this.currentContactFormData);
  //         contactSysId = convertColumnReferencesToValues(savedContact).sys_id as string;
  //       }
  //     } else { // user has changed across one of the 3 existing contact types (NOT NEW)
  //       if (this.hasFairOpportunityDataChanged()) {
  //         setFairOpportunity = true;
  //         contactSysId = this.selectedOption?.value;
  //       }
  //     }
  //     if (setFairOpportunity) {
  //       fairOpportunity[this.POCTypePropName] = this.selectedOptionType;
  //       fairOpportunity[this.POCPropName] = contactSysId;
  //       await AcquisitionPackage.setFairOpportunity(fairOpportunity);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   return true;
  // }
  public async loadOnEnter(): Promise<void> {
    debugger
    this.pocPrimary = await AcquisitionPackage.getContact("PRIMARY");
    this.pocCor = await AcquisitionPackage.getContact("COR");
    this.pocAcor = AcquisitionPackage.hasAlternativeContactRep ?
      await AcquisitionPackage.getContact("ACOR") : undefined;
    this.showChildren = true
    const fairOpportunity = AcquisitionPackage.fairOpportunity;
    // if (fairOpportunity) {
    //   fairOpportunity = convertColumnReferencesToValues(
    //     _.cloneDeep(AcquisitionPackage.fairOpportunity) as FairOpportunityDTO);
    //   this.certificationPOCSysId = fairOpportunity[this.POCPropName] as string;
    //   if (fairOpportunity[this.POCTypePropName] === "NEW" && fairOpportunity[this.POCPropName]) {
    //     this.certificationPOCContactDTO =
    //       await ContactData.getContactBySysId(fairOpportunity[this.POCPropName] as string);
    //   } else {
    //     this.certificationPOCContactDTO = _.cloneDeep(AcquisitionPackage.initContact);
    //   }
    //   this.initializeCertificationPOCTypeOptions();
    //   await this.setContactFormData(this.certificationPOCContactDTO);
    // }
  }

  public async mounted(): Promise<void> {
    debugger
    await this.loadOnEnter()
  }
}
</script>
