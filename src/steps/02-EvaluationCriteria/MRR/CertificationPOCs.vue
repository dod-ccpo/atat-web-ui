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
            id="technicalForm"
            POCType="Technical"
            sequence="1"
            :save-form.sync="saveTechForm" />
          <hr>
          <CertificationPOCTypeForm
            id="requirementsForm"
            POCType="Requirements"
            sequence="2"
            :save-form.sync="saveReqForm">
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
import { convertColumnReferencesToValues } from "@/api/helpers";
import _ from "lodash";
import { ContactDTO, FairOpportunityDTO } from "@/api/models";
import ContactData from "@/store/contactData";
import { RadioButton } from "../../../../types/Global";

@Component({
  components: {
    CertificationPOCTypeForm
  }
})

export default class CertificationPOCs extends Mixins(SaveOnLeave) {
  private POCTypePropName: "technical_poc_type" | "requirements_poc_type" = "technical_poc_type";
  private POCPropName: "technical_poc" | "requirements_poc" = "technical_poc";
  private certificationPOCSysId = "";
  private certificationPOCContactDTO: ContactDTO = {} as ContactDTO;
  private certificationPOCTypeOptions: RadioButton[] = [];
  private pocPrimary: ContactDTO = {} as ContactDTO;
  private pocCor: ContactDTO = {} as ContactDTO;
  private pocAcor: ContactDTO | undefined = undefined;


  public initializeCertificationPOCTypeOptions() {
    this.certificationPOCTypeOptions.push(
      {
        id: this.POCType + "PrimaryPOC",
        label: this.pocPrimary.first_name as string + " " + this.pocPrimary.last_name,
        value: this.pocPrimary.sys_id as string,
        optionType: "PRIMARY"
      });
    this.certificationPOCTypeOptions.push(
      {
        id: this.POCType + "CorPOC",
        label: this.pocCor.first_name as string + " " + this.pocCor.last_name,
        value: this.pocCor.sys_id as string,
        optionType: "COR"
      });
    if (this.pocAcor) {
      this.certificationPOCTypeOptions.push({
        id: this.POCType + "AcorPOC",
        label: this.pocAcor.first_name as string + " " + this.pocAcor.last_name,
        value: this.pocAcor.sys_id as string,
        optionType: "ACOR"
      })
    }
    this.certificationPOCTypeOptions.push({
      id: this.POCType + "NewPOC",
      label: "No, I need to enter my " + this.POCType + " POC’s contact information.",
      value: (this.certificationPOCContactDTO.sys_id &&
        this.certificationPOCContactDTO.sys_id.length > 0)
        ? this.certificationPOCContactDTO.sys_id : "NEW",
      optionType: "NEW"
    })
  }

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
    this.setPOCPropertyNames();
    this.pocPrimary = await AcquisitionPackage.getContact("PRIMARY");
    this.pocCor = await AcquisitionPackage.getContact("COR");
    this.pocAcor = AcquisitionPackage.hasAlternativeContactRep ?
      await AcquisitionPackage.getContact("ACOR") : undefined;
    let fairOpportunity = AcquisitionPackage.fairOpportunity;
    if (fairOpportunity) {
      fairOpportunity = convertColumnReferencesToValues(
        _.cloneDeep(AcquisitionPackage.fairOpportunity) as FairOpportunityDTO);
      this.certificationPOCSysId = fairOpportunity[this.POCPropName] as string;
      if (fairOpportunity[this.POCTypePropName] === "NEW" && fairOpportunity[this.POCPropName]) {
        this.certificationPOCContactDTO =
          await ContactData.getContactBySysId(fairOpportunity[this.POCPropName] as string);
      } else {
        this.certificationPOCContactDTO = _.cloneDeep(AcquisitionPackage.initContact);
      }
      this.initializeCertificationPOCTypeOptions();
      await this.setContactFormData(this.certificationPOCContactDTO);
    }
    this.loaded = true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }
}
</script>
