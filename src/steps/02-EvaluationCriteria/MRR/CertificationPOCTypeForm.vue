<template>
  <div>
    <ATATRadioGroup
        v-if="loaded"
        :id="POCType + 'certificationPOCType'"
        :legend="sequence + '. Tell us about your ' + POCType + ' POC'"
        legend-as-subheader="true"
        :helpText="'Will any of these individuals serve as the '
              + POCType + ' Certifier for your J&A?'"
        :value.sync="certificationPOCType"
        :items="certificationPOCTypeOptions"
        :name="'certification-poc-' + POCType + '-radio-group'"
        class="copy-max-width mb-10 mt-3"
        :rules="[$validators.required('Please select an option')]"
    />
    <ATATContactForm
        v-if="showContactForm"
        :email.sync="email"
        :firstName.sync="firstName"
        :lastName.sync="lastName"
        :middleName.sync="middleName"
        :phone.sync="phone"
        :phoneExt.sync="phoneExt"
        :selectedBranch.sync="selectedBranch"
        :selectedPhoneCountry.sync="selectedPhoneCountry"
        :selectedRank.sync="selectedRank"
        :selectedRole.sync="selectedRole"
        :selectedSalutation.sync="selectedSalutation"
        :suffix.sync="suffix"
        :loaded="loaded"
        :roles.sync="contactRoles"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Mixins, Prop, PropSync, Watch} from "vue-property-decorator";
import {CountryObj, RadioButton, RankData, SelectData} from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ContactDTO, FairOpportunityDTO} from "@/api/models";
import ContactData from "@/store/contactData";
import parsePhoneNumber, {AsYouType, CountryCode} from "libphonenumber-js";
import {hasChanges} from "@/helpers";
import _ from "lodash";
import {Countries} from "@/components/ATATPhoneInput.vue";
import ATATContactForm from "@/components/ATATContactForm.vue";
import {convertColumnReferencesToValues} from "@/api/helpers";

@Component({
  components: {
    ATATRadioGroup,
    ATATContactForm
  }
})

export default class CertificationPOCTypeForm extends Mixins(SaveOnLeave) {
  @Prop({default: "Technical"}) private POCType!: "Technical" | "Requirements";
  @Prop({default: "1"}) private sequence!: string;
  @PropSync("saveForm") private _saveForm!: boolean;


  private POCTypePropName: "technical_poc_type" | "requirements_poc_type" = "technical_poc_type";
  private POCPropName: "technical_poc" | "requirements_poc" = "technical_poc";
  private certificationPOCType:
      "" | "PRIMARY" | "COR" | "ACOR" | "NEW" | undefined = "";
  private certificationPOCContactDTO: ContactDTO = {} as ContactDTO;
  private certificationPOCTypeOptions: RadioButton[] = [];
  private pocPrimary: ContactDTO = {} as ContactDTO;
  private pocCor: ContactDTO = {} as ContactDTO;
  private pocAcor: ContactDTO | undefined = undefined;

  private loaded = false;
  private sysId = "";
  private selectedRole = "";
  private selectedSalutation = "";
  private firstName = "";
  private middleName = "";
  private lastName = "";
  private suffix = "";
  private email = "";
  private phone = "";
  private phoneExt = "";
  private selectedBranch: SelectData = {text: "", value: ""};
  private selectedRank: RankData = {
    grade: "",
    name: "",
    sysId: "",
  };
  private roleIndices = {
    CIVILIAN: 0,
    MILITARY: 1,
    CONTRACTOR: 3,
  };
  private selectedPhoneCountry: CountryObj = {
    "name": "United States",
    "countryCode": "+1",
    "abbreviation": "us",
    "active": true,
    "mask": ["999-999-9999"]
  };
  private branchData: SelectData[] = []
  private contactRoles: RadioButton[] = [
    {
      id: this.POCType + "Civilian",
      label: "Civilian",
      value: "CIVILIAN"
    },
    {
      id: this.POCType + "Military",
      label: "Military",
      value: "MILITARY"
    }
  ];

  /**
   * Getter function that checks if the contact form should be displayed or not
   */
  private get showContactForm(): boolean {
    return this.certificationPOCType === "NEW";
  }

  private get currentContactFormData(): ContactDTO {
    const sys_id = this.sysId;
    const first_name = this.firstName;
    const last_name = this.lastName;
    const middle_name = this.middleName;
    const role = this.selectedRole;
    const rank_components = this?.selectedRank ? this.selectedRank?.sysId: "";
    const suffix = this.suffix;
    const salutation = this.selectedSalutation;
    const countryCode = this.selectedPhoneCountry
      ? (this.selectedPhoneCountry.abbreviation.toUpperCase() as CountryCode)
      : undefined;
    const parsedPhone = parsePhoneNumber(
      this.phone,
      countryCode
    );
    let phone = this.phone
      ? parsePhoneNumber(
        this.phone,
        countryCode
      )?.format("INTERNATIONAL")
      : "";
    if(countryCode){
      const asyoutype= new AsYouType(countryCode);
      const formatted = asyoutype.input(this.phone);
      phone = `+${parsedPhone?.countryCallingCode} ${formatted}`;
    }
    const phoneExt = this.phoneExt;
    const email = this.email;
    const grade_civ ="";
    const title = "";
    return {
      sys_id,
      first_name,
      last_name,
      middle_name,
      role,
      rank_components,
      suffix,
      salutation,
      phone: phone || "",
      phone_extension: phoneExt || "", // not used on Mission Owner contact entry form
      email,
      type: this.certificationPOCType as string,
      dodaac: "",
      can_access_package: "true",
      grade_civ,
      title,
      manually_entered: "", // not used on Mission Owner contact entry form
    };
  }

  /**
   * Checks and returns if the fair opportunity data POC type data has changed.
   */
  private hasFairOpportunityDataChanged(): boolean {
    const currentData = {} as FairOpportunityDTO;
    currentData[this.POCTypePropName] = this.certificationPOCType;
    const savedData = {} as FairOpportunityDTO;
    const savedFairOpportunity = AcquisitionPackage.fairOpportunity as FairOpportunityDTO;
    savedData[this.POCTypePropName] = savedFairOpportunity[this.POCTypePropName] || "";
    return hasChanges(currentData, savedData);
  }

  private hasCurrentContactFormChanged(): boolean {
    return hasChanges(this.currentContactFormData, this.certificationPOCContactDTO);
  }

  /**
   * Checks to see if the @certificationPOCType changed and takes one of
   * the actions below.
   * 1. If the user updates the POC type from "NEW" to one of the other 3 types, then
   *      DELETES the contact associated with "NEW" and updates the fair opportunity
   *      properties accordingly
   * 2. If the user changes the POC type from one of the other 3 types to "NEW",
   *      then creates a NEW contact and updates the fair opportunity
   *      properties accordingly
   * 3. If the user changes the POC type among one of the 3 existing contact types,
   *      then just updates the fair opportunity properties.
   * 4. If the POC type has not changed, then checks if any of the form data has changed
   *      and makes a call to save the changed data.
   */
  @Watch('_saveForm')
  protected async saveOnLeave(): Promise<boolean> {
    try {
      const savedPOCType =
          (AcquisitionPackage.fairOpportunity as FairOpportunityDTO)[this.POCTypePropName];
      const fairOpportunity = {} as FairOpportunityDTO;
      if (this.certificationPOCType === "NEW") {
        // user changed from other types to NEW or could be first time filling the form.
        if (this.hasCurrentContactFormChanged()) {
          let savedContact = await ContactData.saveContact(this.currentContactFormData);
          savedContact = convertColumnReferencesToValues(savedContact);
          fairOpportunity[this.POCTypePropName] = this.certificationPOCType;
          fairOpportunity[this.POCPropName] = savedContact.sys_id;
          await AcquisitionPackage.setFairOpportunity(fairOpportunity);
        }
      } else if (savedPOCType === "NEW") {// user has changed from NEW to other type
        await ContactData.deleteContactBySysId(
            this.certificationPOCContactDTO.sys_id as string);
        fairOpportunity[this.POCTypePropName] = this.certificationPOCType;
        fairOpportunity[this.POCPropName] = "";
        await AcquisitionPackage.setFairOpportunity(fairOpportunity);
      } else { // user has changed across one of the 3 existing contact types (NOT NEW)
        if (this.hasFairOpportunityDataChanged()) {
          fairOpportunity[this.POCTypePropName] = this.certificationPOCType;
          await AcquisitionPackage.setFairOpportunity(fairOpportunity)
        }
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

  /**
   * Initializes appropriately based on ACOR information.
   */
  public initializeCertificationPOCTypeOptions() {
    this.certificationPOCTypeOptions.push(
      {
        id: this.POCType + "PrimaryPOC",
        label: this.pocPrimary.first_name as string + " " + this.pocPrimary.last_name,
        value: "PRIMARY"
      });
    this.certificationPOCTypeOptions.push(
      {
        id: this.POCType + "CorPOC",
        label: this.pocCor.first_name as string + " " + this.pocCor.last_name,
        value: "COR"
      });
    if (this.pocAcor) {
      this.certificationPOCTypeOptions.push({
        id: this.POCType + "AcorPOC",
        label: this.pocAcor.first_name as string + " " + this.pocAcor.last_name,
        value: "ACOR"
      })
    }
    this.certificationPOCTypeOptions.push({
      id: this.POCType + "NewPOC",
      label: "No, I need to enter my " + this.POCType + " POC’s contact information.",
      value: "NEW"
    })
  }

  /**
   * Performs several lookups and transformation and sets up the contact form data that
   * is needed to be passed into ATATContactForm component.
   * @see src/components/ATATContactForm
   */
  async setContactFormData(savedContactDTO: ContactDTO) {
    this.sysId = savedContactDTO.sys_id as string;
    this.certificationPOCContactDTO.can_access_package = "true";
    const branches = await ContactData.LoadMilitaryBranches();
    this.branchData = branches.map((choice) => {
      const text = `U.S. ${choice.label}`;
      const {value} = choice;
      return {
        text,
        value,
      };
    });
    this.selectedRole = savedContactDTO.role;
    if (
      this.selectedRole === this.contactRoles[this.roleIndices.MILITARY].value
    ) {
      const rankComp = savedContactDTO.rank_components as unknown as {
        link: string;
        value: string;
      };
      if (rankComp) {
        savedContactDTO.rank_components = rankComp.value;
      }
      const emptyBranch: { text: ""; value: "" } = { text: "", value: "" };
      //retrieve selected Military Rank from rank component
      const rank = await ContactData.GetMilitaryRank(rankComp.value || "");
      this.selectedBranch =
          rank !== undefined
            ? this.branchData.find((branch) => branch.value === rank.branch) ||
              emptyBranch
            : emptyBranch;
      this.selectedRank =
          rank !== undefined
            ? {
              name: rank.name || "",
              grade: rank.grade || "",
              sysId: rank.sys_id || "",
            }
            : { grade: "", name: "", sysId: "" };
    }
    this.selectedSalutation = savedContactDTO.salutation;
    this.firstName = savedContactDTO.first_name;
    this.middleName = savedContactDTO.middle_name;
    this.lastName = savedContactDTO.last_name;
    this.suffix = savedContactDTO.suffix;
    this.email = savedContactDTO.email;
    this.phoneExt = savedContactDTO.phone_extension;
    if (savedContactDTO.phone.length > 0) {
      const parsedPhone = parsePhoneNumber(savedContactDTO.phone);
      const country = Countries.find(
        (country) =>
          country.countryCode === `+${parsedPhone?.countryCallingCode}`
      );
      this.selectedPhoneCountry = country || {
        name: "",
        countryCode: "",
        abbreviation: "",
        active: false,
      };
      const phoneNumber = parsedPhone ? parsedPhone?.
        nationalNumber.toString().replace(/\D/g,'') : "";
      this.phone = phoneNumber;
      savedContactDTO.phone = phoneNumber;
    }
  }

  /**
   * Since default mode is technical, just need to check and set if the form should
   * work in requirements POC contact mode.
   */
  setPOCPropertyNames(): void {
    if(this.POCType === "Requirements") {
      this.POCPropName = "requirements_poc";
      this.POCTypePropName = "requirements_poc_type";
    }
  }

  /**
   * Loads the PRIMARY, COR and ACOR contacts from acquisition package store. If the user
   * has selected NEW and saved it, then loads the contact from ContactsData store.
   */
  public async loadOnEnter(): Promise<void> {
    this.setPOCPropertyNames();
    this.pocPrimary = await AcquisitionPackage.getContact("PRIMARY");
    this.pocCor = await AcquisitionPackage.getContact("COR");
    this.pocAcor = AcquisitionPackage.hasAlternativeContactRep ?
      await AcquisitionPackage.getContact("ACOR") : undefined;
    this.initializeCertificationPOCTypeOptions();
    let fairOpportunity = AcquisitionPackage.fairOpportunity;
    if (fairOpportunity) {
      fairOpportunity = convertColumnReferencesToValues(
          _.cloneDeep(AcquisitionPackage.fairOpportunity) as FairOpportunityDTO)
      this.certificationPOCType = fairOpportunity[this.POCTypePropName];
      if (this.certificationPOCType === "NEW" && fairOpportunity[this.POCPropName]) {
        this.certificationPOCContactDTO =
            await ContactData.getContactBySysId(fairOpportunity[this.POCPropName] as string);
      } else {
        this.certificationPOCContactDTO = _.cloneDeep(AcquisitionPackage.initContact);
      }
      await this.setContactFormData(this.certificationPOCContactDTO);
    }
    this.loaded = true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

