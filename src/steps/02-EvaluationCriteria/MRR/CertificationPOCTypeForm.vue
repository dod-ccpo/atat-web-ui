<template>
  <div>
    <h2>{{ sequence }}. Tell us about your {{ POCType }} POC</h2>
    <ATATRadioGroup
        v-if="loaded"
        :id="POCType + 'certificationPOCType'"
        :legend="'Will any of these individuals serve as the '
              + POCType + ' Certifier for your J&A?'"
        :legend-font-normal-weight="true"
        :value.sync="_selectedSysId"
        :items="certificationPOCTypeOptions"
        :name="'certification-poc-' + POCType + '-radio-group'"
        class="copy-max-width mb-10 mt-3"
        :rules="[$validators.required('Please select an option')]"
    />
    <ATATContactForm
        v-if="showContactForm"
        :id-prefix="POCType"
        role-legend="What role best describes this individual’s affiliation with the DoD?"
        :role-legend-font-normal-weight="true"
        :show-job-title="true"
        :title.sync="title"
        :show-email="false"
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
        :validation-msg-custom="'your ' + POCType + ' POC’s'"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Prop, PropSync, Watch} from "vue-property-decorator";
import {CountryObj, RadioButton, RankData, SelectData} from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ContactDTO, FairOpportunityDTO} from "@/api/models";
import ContactData from "@/store/contactData";
import parsePhoneNumber, {AsYouType, CountryCode} from "libphonenumber-js";
import {hasChanges} from "@/helpers";
import _ from "lodash";
import {Countries} from "@/components/ATATPhoneInput.vue";
import ATATContactForm from "@/components/ATATContactForm.vue";
import {convertColumnReferencesToValues} from "@/api/helpers";
import Vue from "vue";

@Component({
  components: {
    ATATRadioGroup,
    ATATContactForm
  }
})

export default class CertificationPOCTypeForm extends Vue {
  @Prop({default: "Technical"}) private POCType!: "Technical" | "Requirements";
  @Prop({default: "1"}) private sequence!: string;
  @Prop() private pocPrimary!: ContactDTO;
  @Prop() private pocCor!: ContactDTO;
  @Prop() private pocAcor!: ContactDTO;
  @PropSync("newContactData") private _newContactData!: ContactDTO;
  @PropSync("selectedSysId") private _selectedSysId?: string;
  @PropSync("selectedPocType") private _selectedPocType?: string;


  private POCTypePropName: "technical_poc_type" | "requirements_poc_type" = "technical_poc_type";
  private POCPropName: "technical_poc" | "requirements_poc" = "technical_poc";
  private certificationPOCTypeOptions: RadioButton[] = [];


  private loaded = false;
  private sysId = "";
  private selectedRole = "";
  private selectedSalutation = "";
  private firstName = "";
  private middleName = "";
  private lastName = "";
  private suffix = "";
  private title = "";
  private phone = "";
  private phoneExt = "";
  private acquisition_package = "";
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
   * Returns the selected option based on value that is synchronized with the
   * ATATRadioGroup
   */
  private get selectedOption(): RadioButton {
    debugger
    const selectedOption = this.certificationPOCTypeOptions.find(certOption =>
      certOption.value === this._selectedSysId) as RadioButton
    if(selectedOption){
      this._selectedSysId = selectedOption.value
      this._selectedPocType = selectedOption.optionType
    }
    return selectedOption
  }

  /**
   * Returns the selected option type based on value that is synchronized with the
   * ATATRadioGroup
   */
  private get selectedOptionType():  "" | "PRIMARY" | "COR" | "ACOR" | "NEW" | undefined {
    return this.selectedOption
      ? this.selectedOption.optionType as unknown as
            "" | "PRIMARY" | "COR" | "ACOR" | "NEW" | undefined
      : ""
  }

  /**
   * Getter function that checks if the contact form should be displayed or not
   */
  private get showContactForm(): boolean {
    return this.selectedOptionType === "NEW";
  }

  private get currentContactFormData(): ContactDTO {
    debugger
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
    if(countryCode && phone){
      const asyoutype= new AsYouType(countryCode);
      const formatted = asyoutype.input(this.phone);
      phone = `+${parsedPhone?.countryCallingCode} ${formatted}`;
    }
    this.acquisition_package = (AcquisitionPackage.acquisitionPackage) ?
      (AcquisitionPackage.acquisitionPackage.sys_id) ?
        AcquisitionPackage.acquisitionPackage.sys_id : "" : ""
    const phoneExt = this.phoneExt;
    const formData = {
      sys_id: this.sysId,
      first_name: this.firstName,
      last_name: this.lastName,
      middle_name: this.middleName,
      role: this.selectedRole,
      rank_components: this?.selectedRank ? this.selectedRank?.sysId: "",
      suffix: this.suffix,
      salutation: this.selectedSalutation,
      phone: phone || "",
      phone_extension: phoneExt || "",
      email: "",
      type: this.selectedOptionType as string,
      dodaac: "",
      can_access_package: "true",
      grade_civ: "",
      title: this.title,
      manually_entered: "",
      acquisition_package: this.acquisition_package
    };
    this._newContactData = formData
    return formData
  }

  /**
   * Checks and returns if the fair opportunity data POC type data has changed.
   */
  private hasFairOpportunityDataChanged(): boolean {
    const currentData = {} as FairOpportunityDTO;
    currentData[this.POCTypePropName] = this.selectedOptionType;
    const savedData = {} as FairOpportunityDTO;
    const savedFairOpportunity = AcquisitionPackage.fairOpportunity as FairOpportunityDTO;
    savedData[this.POCTypePropName] = savedFairOpportunity[this.POCTypePropName] || "";
    return hasChanges(currentData, savedData);
  }

  /**
   * Initializes appropriately based on ACOR information.
   */
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
      value: (this._newContactData.sys_id)
        ? this._newContactData.sys_id : "NEW",
      optionType: "NEW"
    })
  }

  /**
   * Performs several lookups and transformation and sets up the contact form data that
   * is needed to be passed into ATATContactForm component.
   * @see src/components/ATATContactForm
   */
  async setContactFormData(savedContactDTO: ContactDTO) {
    this.sysId = savedContactDTO.sys_id as string;
    this._newContactData.can_access_package = "true";
    const branches = await ContactData.LoadMilitaryBranches();
    this.selectedSalutation = savedContactDTO.salutation;
    this.firstName = savedContactDTO.first_name;
    this.middleName = savedContactDTO.middle_name;
    this.lastName = savedContactDTO.last_name;
    this.suffix = savedContactDTO.suffix;
    this.title = savedContactDTO.title;
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
    this.phoneExt = savedContactDTO.phone_extension;
    if (savedContactDTO.phone) {
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
    this.initializeCertificationPOCTypeOptions();
    await this.setContactFormData(this._newContactData);
    this.loaded = true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

