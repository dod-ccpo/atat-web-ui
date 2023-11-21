<template>
  <v-form ref="contactForm" lazy-validation="true">
  <div>
    <h2>{{ sequence }}. Tell us about your {{ POCType }} POC</h2>
    <ATATRadioGroup
        :id="POCType + 'certificationPOCType'"
        ref="certificationPOCTypeRef"
        :legend="'Will any of these individuals serve as the '
              + POCType + ' Certifier for your J&A?'"
        :legend-font-normal-weight="true"
        :value="_selectedSysId"
        @update:value="_selectedSysId = $event"
        :items="certificationPOCTypeOptions"
        :name="'certification-poc-' + POCType + '-radio-group'"
        class="copy-max-width mb-10 mt-3"
        :rules="[$validators.required('Please select an option')]"
    />
    <ATATContactForm
        v-if="showContactForm"
        :id-prefix="POCType"
        :ref="POCType + 'ContactFormRef'"
        role-legend="What role best describes this individual’s affiliation with the DoD?"
        :role-legend-font-normal-weight="true"
        :roles="contactRoles"
        :selectedRole="_newContactData.role"
        @update:selectedRole="_newContactData.role = $event"
        @update:roles="contactRoles = $event"
        :show-job-title="true"
        :title="_newContactData.title"
        @update:title="_newContactData.title = $event"
        :show-email="false"
        :firstName="_newContactData.first_name"
        @update:firstName="_newContactData.first_name = $event"
        :lastName="_newContactData.last_name"
        @update:lastName="_newContactData.last_name = $event"
        :middleName="_newContactData.middle_name"
        @update:middleName="_newContactData.middle_name = $event"
        :phone="phone"
        @update:phone="phone = $event"
        :phoneExt="_newContactData.phone_extension"
        @update:phoneExt="_newContactData.phone_extension = $event"
        :selectedBranch="selectedBranch"
        @update:selectedBranch="selectedBranch = $event"
        :selectedPhoneCountry="selectedPhoneCountry"
        @update:selectedPhoneCountry="selectedPhoneCountry = $event"
        :selectedRank="selectedRank"
        @update:selectedRank="selectedRank = $event"
        :selectedSalutation="_newContactData.salutation"
        @update:selectedSalutation="_newContactData.salutation = $event"
        :suffix="_newContactData.suffix"
        @update:suffix="_newContactData.suffix = $event"
        :loaded="loaded"
        :validation-msg-custom="'your ' + POCType + ' POC’s'"
        @resetContactForm="resetContactForm"
        @rankComponent = "setRankComponent"
        :contactRoles="contactRoles"
        :branchData="branchData"
        :selectedBranchRanksData="selectedBranchRanksData"
    />
  </div>
</v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop,  Watch, Vue, toNative } from "vue-facing-decorator";
import { CountryObj, RadioButton, RankData, SelectData } from "../../../../types/Global";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { ContactDTO, FinancialPOCType, ReferenceColumn } from "@/api/models";
import ContactData from "@/store/contactData";
import parsePhoneNumber, { AsYouType, CountryCode } from "libphonenumber-js";
import { Countries } from "@/components/ATATPhoneInput.vue";
import ATATContactForm from "@/components/ATATContactForm.vue";
import { PropSync } from "@/decorators/custom"
import { ComponentPublicInstance } from "vue";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";


@Component({
  components: {
    ATATRadioGroup,
    ATATContactForm
  }
})

class CertificationPOCTypeForm extends Vue {
  $refs!: {
    [key: string]: ComponentPublicInstance & {
      validate: ()=> Promise<SubmitEventPromise>,
        $refs: {
        [key: string]: ComponentPublicInstance & {
          validate: ()=> Promise<SubmitEventPromise>,
        };
      }
    };
  }; 

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
  private selectedBranch: SelectData = { text: "", value: "" };
  private selectedRank: RankData = {
    grade: "",
    name: "",
    sysId: ""
  };
  private selectedBranchRanksData: RankData[] = [];
  private branchRanksData!: { [key: string]: RankData[]; };
  
  public resetContactForm(): void {
    this.phone = "";
    this.selectedBranch = {};
    this.selectedRank = {grade: "", name: "", sysId: ""};
  }

  @Watch("selectedBranch")
  protected branchChange(): void {
    this.setRankData();
  }

  private setRankData(): void {
    if (Object.values(this.selectedBranch).every(v=>v!=="")) {
      this.selectedBranchRanksData =
        this.branchRanksData[this.selectedBranch.value as string];
    }
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

  public setRankComponent(rc: string): void{
    this._newContactData.rank_components = rc;
  }

  public async validateForm(): Promise<boolean> {
    return (await this.$refs.certificationPOCTypeRef.$refs.atatRadioButtonGroup.validate()).valid;
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
      certOption.value === this._selectedSysId)
    if(selectedOption){
      this._selectedSysId = selectedOption.value
      this._selectedPocType = selectedOption.optionType
    }
    return selectedOption as RadioButton;
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
    if (this._newContactData.role === "MILITARY") {
      
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
    await this.getBranchData();
    await this.getRanksData();
    await this.loadOnEnter();
  }

  public async getBranchData(): Promise<void> {
    this.branchData = (await ContactData.LoadMilitaryBranches()).map((choice) => {
      const text = `U.S. ${choice.label}`;
      const { value } = choice;
      return {text, value};
    }); 
  }

  public async getRanksData(): Promise<void>{
    this.branchRanksData = ContactData.militaryAutoCompleteGroups;
  }

}

export default toNative(CertificationPOCTypeForm )
</script>

