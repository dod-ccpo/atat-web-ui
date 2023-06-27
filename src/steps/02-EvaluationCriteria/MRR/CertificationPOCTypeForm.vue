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
        :title.sync="_newContactData.title"
        :show-email="false"
        :firstName.sync="_newContactData.first_name"
        :lastName.sync="_newContactData.last_name"
        :middleName.sync="_newContactData.middle_name"
        :phone.sync="phone"
        :phoneExt.sync="_newContactData.phone_extension"
        :selectedBranch.sync="selectedBranch"
        :selectedPhoneCountry.sync="selectedPhoneCountry"
        :selectedRank.sync="selectedRank"
        :selectedRole.sync="_newContactData.role"
        :selectedSalutation.sync="_newContactData.salutation"
        :suffix.sync="_newContactData.suffix"
        :loaded="loaded"
        :roles.sync="contactRoles"
        :validation-msg-custom="'your ' + POCType + ' POC’s'"
        @resetContactForm="resetContactForm"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import {Component, Prop, PropSync, Watch} from "vue-property-decorator";
import {CountryObj, RadioButton, RankData, SelectData} from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import {ContactDTO, FinancialPOCType} from "@/api/models";
import ContactData from "@/store/contactData";
import parsePhoneNumber, {AsYouType, CountryCode} from "libphonenumber-js";
import {Countries} from "@/components/ATATPhoneInput.vue";
import ATATContactForm from "@/components/ATATContactForm.vue";
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

  private phone = "";
  private selectedBranch: SelectData = {};
  private selectedRank: RankData = {grade: "", name: "", sysId: ""};
  
  public resetContactForm(): void {
    this.phone = "";
    this.selectedBranch = {};
    this.selectedRank = {grade: "", name: "", sysId: ""};
  }

  @Watch("selectedRank")
  public rankChanged(newVal: RankData): void {
    if (newVal && newVal.sysId) {
      this._newContactData.rank_components = newVal.sysId;
    } else {  
      this._newContactData.rank_components = "";
    }
  }

  @Watch("phone")
  public phoneChanged(): void {
    this.formatPhone();
  }
  @Watch("selectedPhoneCountry")
  public phoneCountryChanged(): void {
    this.formatPhone();
  }

  public formatPhone(): void {
    if (this.phone) {
      const countryCode = this.selectedPhoneCountry
        ? (this.selectedPhoneCountry.abbreviation.toUpperCase() as CountryCode)
        : undefined;

      const parsedPhone = parsePhoneNumber(
        this.phone,
        countryCode
      );

      let phone = this.phone
        ? parsePhoneNumber(this.phone, countryCode)?.format("INTERNATIONAL")
        : "";

      if (countryCode) {
        const asyoutype = new AsYouType(countryCode);
        const formatted = asyoutype.input(this.phone);
        phone = `+${parsedPhone?.countryCallingCode} ${formatted}`;
      }
      this._newContactData.phone = phone as string;
    } else {
      this._newContactData.phone = "";
    }
  }

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
  private get selectedOptionType(): FinancialPOCType {
    return this.selectedOption
      ? this.selectedOption.optionType as FinancialPOCType
      : ""
  }

  /**
   * Getter function that checks if the contact form should be displayed or not
   */
  private get showContactForm(): boolean {
    return this.selectedOptionType === "NEW";
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
   * Since default mode is technical, just need to check and set if the form should
   * work in requirements POC contact mode.
   */
  setPOCPropertyNames(): void {
    if(this.POCType === "Requirements") {
      this.POCPropName = "requirements_poc";
      this.POCTypePropName = "requirements_poc_type";
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.setPOCPropertyNames();
    this.initializeCertificationPOCTypeOptions();

    // if contact is MILITARY, load branches, set selectedBranch and selectedRank based on 
    // rank_components which is sys_id of selected rank
    if (this._newContactData.role === this.contactRoles[this.roleIndices.MILITARY].value) {
      const branches = await ContactData.LoadMilitaryBranches();
      this.branchData = branches.map((choice) => {
        const text = `U.S. ${choice.label}`;
        const { value } = choice;
        return {text, value};
      });      
      //retrieve selected Military Rank from rank component
      const rank = await ContactData.GetMilitaryRank(this._newContactData.rank_components);
      if (rank) {
        const branch = this.branchData.find((branch) => branch.value === rank.branch);
        this.selectedBranch = branch ?? { text: "", value: "" };
        this.selectedRank = {
          name: rank.name,
          grade: rank.grade,
          sysId: rank.sys_id as string,
        }        
      }
    }

    // parse phone number to remove country code and formatting for input
    if (this._newContactData.phone.length > 0) {
      const parsedPhone = parsePhoneNumber(this._newContactData.phone);
      const country = Countries.find(
        (country) =>
          country.countryCode === `+${parsedPhone?.countryCallingCode}`
      );
      this.selectedPhoneCountry = country ?? {
        name: "",
        countryCode: "",
        abbreviation: "",
        active: false,
      };
      const phoneNumber = parsedPhone 
        ? parsedPhone?.nationalNumber.toString().replace(/\D/g,'') 
        : "";
      this.phone = phoneNumber;
    }

    this.loaded = true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

