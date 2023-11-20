<template>
  <div class="pt-0">
    <CorAcorContactInfoForm
      ref="CorAcorContactInfoFormRef"
      :isWizard="isWizard"
      :isForm="isForm"
      :corOrAcor="corOrAcor"
      :isPrimaryContact="isPrimaryContact"
      :sectionHeader="sectionHeader"
      
      :selectedRole="selectedRole"
      @update:selectedRole="selectedRole = $event"
      :selectedBranch="selectedBranch"
      @update:selectedBranch="selectedBranch = $event"
      :selectedRank="selectedRank"
      @update:selectedRank="selectedRank = $event"
      :selectedSalutation="selectedSalutation"
      @update:selectedSalutation="selectedSalutation = $event"
      :firstName="firstName"
      @update:firstName="firstName = $event"
      :middleName="middleName"
      @update:middleName="middleName = $event"
      :lastName="lastName"
      @update:lastName="lastName = $event"
      :suffix="suffix"
      @update:suffix="suffix = $event"
      :formalName="formalName"
      @update:formalName="formalName = $event"
      :email="email"
      @update:email="email = $event" 
      :showTitle = "showTitle"
      :title="title"
      @update:title="title = $event"
      :phone="phone"
      @update:phone="phone = $event"
      :selectedPhoneCountry="selectedPhoneCountry"
      @update:selectedPhoneCountry="selectedPhoneCountry = $event"
      :phoneExt="phoneExt"
      @update:phoneExt="phoneExt = $event"
      :dodaac="dodaac"
      @update:dodaac="dodaac = $event"

      :contactRoles="contactRoles"
      :branchData="branchData"
      :selectedBranchRanksData="selectedBranchRanksData"
    />
    <section
      id="AccessRadioButtons"
      v-if="isWizard && showAccessRadioButtons"
    >
    </section>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
 

import { Component, Prop, Watch , Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import parsePhoneNumber,{ AsYouType, CountryCode} from "libphonenumber-js";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import CorAcorContactInfoForm from "./ContactInfoForm.vue";
import PersonCard from "./PersonCard.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import ContactData from "@/store/contactData";
import { ContactDTO } from "@/api/models";
import { Countries } from "@/components/ATATPhoneInput.vue";

import {
  CountryObj,
  RadioButton,
  RankData,
  SelectData,
} from "../../../../types/Global";
import {convertColumnReferencesToValues} from "@/api/helpers";

@Component({
  components: {
    ATATAutoComplete,
    ATATRadioGroup,
    CorAcorContactInfoForm,
    PersonCard,
  }
})

class CommonCorAcor extends Vue {
  // props

  @Prop({default: false}) private isWizard!: boolean;
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: false}) private isACOR!: boolean;
  @PropSync("currentContactData") private _currentContactData!: ContactDTO;
  @PropSync("savedContactData") private _savedContactData!: ContactDTO;
  @Prop({default: false}) private showTitle!: boolean;
  @Prop({default: false}) private isPrimaryContact!: boolean;

  // computed

  get sectionHeader(): string {
    if (this.isPrimaryContact){
      return "";
    }
    return this.isWizard 
      ? "Your "+ this.corOrAcor + "’s Contact Information"
      : this.corOrAcor === "COR"
        ? "Contracting Officer Representative (COR) nominee"
        : "Alternate Contracting Officer Representative (ACOR) nominee"
  }

  get corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }


  // data
  public showAccessRadioButtons = false;
  public showContactForm = false;
  private emptyBranch: SelectData = {
    text: "",
    value: ""
  };

  private emptyRank: RankData = {
    grade: "",
    name: "",
    sysId: ""
  }

  private selectedAccessToEdit = "";
  private accessToEditOptions: RadioButton[] = [
    {
      id: "AccessToEdit_Yes",
      label: "Yes. I would like to invite this individual to edit my acquisition.",
      value: "YES",
    },
    {
      id: "AccessToEdit_No",
      label: "No.",
      value: "NO",
    },
  ];

  private branchData: SelectData[] = [];
  private selectedBranch: SelectData = {text: "", value: ""};
  private selectedRank: RankData = {
    grade: "",
    name: "",
    sysId: "",
  };
  private selectedBranchRanksData: RankData[] = [];
  private branchRanksData: {[key: string]: RankData[]} = {};

  private roleIndices = {
    CIVILIAN: 0,
    MILITARY: 1,
    CONTRACTOR: 3,
  };

  private contactRoles: RadioButton[] = [
    {
      id: "Civilian",
      label: "Civilian",
      value: "CIVILIAN",
    },
    {
      id: "Military",
      label: "Military",
      value: "MILITARY",
    }
  ];

  private selectedRole = "";
  private selectedSalutation = "";
  private firstName = "";
  private middleName = "";
  private lastName = "";
  private suffix = "";
  private formalName = "";
  private email = "";
  private title = "";
  private phone = "";
  private phoneExt = "";
  private dodaac = "";
  private selectedPhoneCountry: CountryObj = {
    "name": "United States",
    "countryCode": "+1",
    "abbreviation": "us",
    "active": true,
    "mask": ["999-999-9999"]
  };

  public get currentData(): ContactDTO {
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

    if (countryCode) {
      const asyoutype= new AsYouType(countryCode);
      const formatted = asyoutype.input(this.phone);
      phone = `+${parsedPhone?.countryCallingCode} ${formatted}`;
    }

    const acqPkgId = AcquisitionPackage.acquisitionPackage
      ? AcquisitionPackage.acquisitionPackage.sys_id as string
      : "";
    debugger;
    return {
      type: this.corOrAcor, // COR, ACOR
      role: this.selectedRole, // Military, Civilian
      rank_components:  this.selectedRank && this.selectedRank.sysId,
      salutation: this.selectedSalutation,
      first_name: this.firstName,
      middle_name: this.middleName,
      last_name: this.lastName,
      suffix: this.suffix,
      title: this.title,     // not used on COR/ACOR form
      phone: phone || "",
      phone_extension: this.phoneExt,
      email: this.email,
      grade_civ: "", // not used on COR/ACOR form
      dodaac: this.dodaac,
      can_access_package: this.selectedAccessToEdit,
      manually_entered: this.showContactForm ? "true" : "false",
      acquisition_package: acqPkgId
    };
  }

  public savedData: ContactDTO = AcquisitionPackage.initContact;

  // watchers

  @Watch("selectedBranch")
  protected branchChange(): void {
    this.setShowAccessRadioButtons();
    this.setRankData();
  }

  @Watch("selectedRole")
  protected selectedRoleChange(newRole: string): void {
    this.setShowAccessRadioButtons();

    this.selectedBranch = newRole === "MILITARY" 
      ? AcquisitionPackage.selectedContactBranch
      : {text: "", value: ""};
  }

  @Watch("currentData")
  protected currentDataChange(): void {
    this._currentContactData = this.currentData;
  }

  @Watch("savedData")
  protected savedDataChange(): void {
    this._savedContactData = this.savedData;
  }


  // methods

  private get getRules(){
    return this.showContactForm ? [] : [
      this.$validators
        .required('Please search for or manually enter' +
        ' your ' + this.corOrAcor + ' contact information.')
    ]
  }

  private setShowAccessRadioButtons(): void {
    this.showAccessRadioButtons = this.selectedRole === "CIVILIAN"
      || (this.selectedBranch && this.selectedBranch.value !== "");
  }

  private setRankData(): void {
    if (Object.values(this.selectedBranch).every(v=>v!=="")) {
      this.selectedBranchRanksData =
        this.branchRanksData[this.selectedBranch.value as string];
    }
  }

  private toggleContactForm(): void {
    this.showContactForm = !this.showContactForm;
  }

  private autocompleteInputUpdate(isReset: boolean): void {
    this.showContactForm = isReset;
  }

  public async loadOnEnter(): Promise<void> {

    const branches = await ContactData.LoadMilitaryBranches();
    this.branchData = branches.map((choice) => {
      const text = `U.S. ${choice.label}`;
      const {value} = choice;
      return {
        text,
        value,
      };
    });

    this.branchRanksData = ContactData.militaryAutoCompleteGroups;

    let storeData = await AcquisitionPackage.getContact(this.corOrAcor);
    storeData = convertColumnReferencesToValues(storeData);
    this.savedData = storeData;
    debugger;
    if (storeData) {
      this.selectedRole = storeData.role;
      debugger;
      if (this.selectedRole === "MILITARY") {
        const rankComp = storeData.rank_components;
        if (rankComp) {
          this.savedData.rank_components = rankComp;
        }

        //retrieve selected Military Rank from rank component
        const rank = await ContactData.GetMilitaryRank(rankComp || "");

        this.selectedBranch = rank !== undefined
          ? this.branchData.find((branch) => branch.value === rank.branch) || this.emptyBranch
          : this.emptyBranch;

        this.selectedRank = rank !== undefined
          ? {name: rank.name, grade: rank.grade, sysId: rank.sys_id as string}
          : this.emptyRank

      } else if (this.selectedRole === "CIVILIAN"){
        this.selectedSalutation = storeData.salutation;
      }


      this.firstName = storeData.first_name;
      this.middleName = storeData.middle_name;
      this.lastName = storeData.last_name;
      this.suffix = storeData.suffix;
      this.formalName = storeData.formal_name || "";
      this.title = storeData.title;

      this.email = storeData.email;

      if (storeData.phone.length > 0) {
        const parsedPhone = parsePhoneNumber(storeData.phone);
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
        this.savedData.phone = phoneNumber;
      }

      this.phoneExt = storeData.phone_extension;
      this.dodaac = storeData.dodaac;
      this.selectedAccessToEdit = storeData.can_access_package;
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    this.setShowAccessRadioButtons();
    if(this.savedData){
      if (this.savedData.manually_entered === "true") {
        this.showContactForm = true;
      }
    } 
  }

}
export default toNative(CommonCorAcor)
</script>

