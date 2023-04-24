<template>
  <div class="pt-0">
    <!-- TODO - REINSTATE AFTER AUTOCOMPLETE IS POPULATED WITH ACTUAL DATA FROM SNOW -->
    <!-- <div class="max-width-640" v-if="isWizard">
      <ATATAutoComplete
        id="SearchContact"
        :class="haveSelectedContact ? 'mb-10' : 'mb-8'"
        :label-sr-only="true"
        :label="'Search for your ' + corOrAcor"
        titleKey="fullName"
        subtitleKey="email"
        :items="contactList"
        :searchFields="['fullName', 'email']"
        :selectedItem.sync="selectedContact"
        placeholder="Search by name or email"
        icon="search"
        :noResultsText="'Manually enter my ' + corOrAcor + '’s contact information'"
        :rules="getRules"
        @autocompleteInputUpdate="autocompleteInputUpdate"
      />

      <PersonCard
        v-if="haveSelectedContact"
        :isACOR="isACOR"
        :selectedContact.sync="selectedContact"
        :showContactForm.sync="showContactForm"
        id="SelectedContactCard"
      />
    </div>

    <a
      id="ContactFormToggle"
      v-if="!haveSelectedContact && isWizard"
      role="button"
      class="expandable-content-opener"
      :class="showContactForm ? 'open' : 'closed'"
      tabindex="0"
      @click="toggleContactForm"
      @keypress="toggleContactForm"
    >
      Manually enter your {{ corOrAcor }}’s contact information
    </a> 
    
    -->

    <!--
    ADD THIS PROP BACK TO CorAcorContactInfoForm BELOW AFTER CARD ABOVE IS REINSTATED
      v-if="!isWizard || (showContactForm && !haveSelectedContact)"
    -->
    <CorAcorContactInfoForm
      :isWizard="isWizard"
      :isForm="isForm"
      :corOrAcor="corOrAcor"
      :sectionHeader="sectionHeader"
      
      :selectedRole.sync="selectedRole"
      :selectedBranch.sync="selectedBranch"
      :selectedRank.sync="selectedRank"
      :selectedSalutation.sync="selectedSalutation"
      :firstName.sync="firstName"
      :middleName.sync="middleName"
      :lastName.sync="lastName"
      :suffix.sync="suffix"
      :formalName="formalName"
      :email.sync="email"
      :phone.sync="phone"
      :selectedPhoneCountry.sync="selectedPhoneCountry"
      :phoneExt.sync="phoneExt"
      :dodaac.sync="dodaac"

      :contactRoles="contactRoles"
      :branchData="branchData"
      :selectedBranchRanksData="selectedBranchRanksData"
    />

    <!-- ADD BACK TO <section> TAG AFTER CARD/AUTOCOMPLETE ABOVE IS REINSTATED
      v-if="isWizard && ((showContactForm && showAccessRadioButtons) || haveSelectedContact)"
    -->

    <section
      id="AccessRadioButtons"
      v-if="isWizard && showAccessRadioButtons"
    >
    <!--TODO determine if this section is necessary-->
     <!--  <hr/>
     <ATATRadioGroup
        legend="Does this individual need access to help you create this
          acquisition package in ATAT?"
        id="AccessToEdit"
        :items="accessToEditOptions"
        :value.sync="selectedAccessToEdit"
        :rules="[$validators.required('Please select Yes or No.')]"
      />-->
    </section>
  </div>
</template>
<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
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
  AutoCompleteItem,
  AutoCompleteItemGroups,
  CorAcorSelectData,
  CountryObj,
  RadioButton,
  RankData,
  SelectData,
} from "../../../../types/Global";

@Component({
  components: {
    ATATAutoComplete,
    ATATRadioGroup,
    CorAcorContactInfoForm,
    PersonCard,
  }
})

export default class CommonCorAcor extends Vue {
  // props

  @Prop({default: false}) private isWizard!: boolean;
  @Prop({default: true}) private isForm!: boolean;
  @Prop({default: false}) private isACOR!: boolean;
  @PropSync("currentContactData") private _currentContactData!: ContactDTO;
  @PropSync("savedContactData") private _savedContactData!: ContactDTO;

  // computed

  get sectionHeader(): string {
    return this.isWizard 
      ? "Your "+ this.corOrAcor + "’s Contact Information"
      : this.corOrAcor === "COR"
        ? "Contracting Officer Representative (COR) nominee"
        : "Alternate Contracting Officer Representative (ACOR) nominee"
  }

  get corOrAcor(): string {
    return this.isACOR ? "ACOR" : "COR";
  }

  get haveSelectedContact(): boolean {
    return this.selectedContact
      && Object.prototype.hasOwnProperty.call(this.selectedContact, "firstName")
      && this.selectedContact.firstName !== "";
  }

  // data
  public showAccessRadioButtons = false;
  public showContactForm = false;

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

  public selectedContact: CorAcorSelectData = {
    id: "",
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phone: "",
    orgName: "",
  };

  private contactList: CorAcorSelectData[] = [
    {
      id: "1",
      firstName: "Test0",
      lastName: "Adamson",
      fullName: "Test0 Adamson",
      email: "test.adamson-civ@mail.mil",
      phone: "333-333-3333",
      orgName: "HQ1234 - Corresponding Organization Name"
    },
    {
      id: "2",
      firstName: "Test1",
      lastName: "Contractingofficerep",
      fullName: "Test1 Contractingofficerep",
      email: "test.contractingofficerrep-civ@mail.mil",
      phone: "555-555-5555",
      orgName: "HQ1234 - Corresponding Organization Name"
    },
    {
      id: "3",
      firstName: "Test2",
      lastName: "Wentzel",
      fullName: "Test2 Wentzel",
      email: "test.wentz@acusage.net",
      phone: "444-444-4444",
      orgName: "HQ567 - Other Organization Name"
    },
  ];

  private branchData: SelectData[] = [];
  private selectedBranch: SelectData = {text: "", value: ""};
  private selectedRank: RankData = {
    grade: "",
    name: "",
    sysId: "",
  };
  private selectedBranchRanksData: AutoCompleteItem[] = [];
  private branchRanksData: AutoCompleteItemGroups = {};

  private roleIndices = {
    MILITARY: 0,
    CIVILIAN: 1,
    CONTRACTOR: 3,
  };

  private contactRoles: RadioButton[] = [
    {
      id: "Military",
      label: "Military",
      value: "MILITARY",
    },
    {
      id: "Civilian",
      label: "Civilian",
      value: "CIVILIAN",
    },
  ];

  private selectedRole = "";
  private selectedSalutation = "";
  private firstName = "";
  private middleName = "";
  private lastName = "";
  private suffix = "";
  private formalName = "";
  private email = "";
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

    return {
      type: this.corOrAcor, // COR, ACOR
      role: this.selectedRole, // Military, Civilian
      rank_components: this.selectedRank && this.selectedRank.sysId,
      salutation: this.selectedSalutation,
      first_name: this.firstName,
      middle_name: this.middleName,
      last_name: this.lastName,
      suffix: this.suffix,
      title: "",     // not used on COR/ACOR form
      phone: phone || "",
      phone_extension: this.phoneExt,
      email: this.email,
      grade_civ: "", // not used on COR/ACOR form
      dodaac: this.dodaac,
      can_access_package: this.selectedAccessToEdit,
      manually_entered: this.showContactForm ? "true" : "false",
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

    if (newRole === "MILITARY") {
      this.selectedBranch = AcquisitionPackage.selectedContactBranch;
    } else {
      this.selectedBranch = {text: "", value: ""};
    }
  }

  @Watch("currentData")
  protected currentDataChange(): void {
    this._currentContactData = this.currentData;
  }

  @Watch("savedData")
  protected savedDataChange(): void {
    this._savedContactData = this.savedData;
  }

  @Watch("selectedContact")
  protected selectedContactChange(newSelectedContact: CorAcorSelectData): void {
    this.showContactForm = false;
    if (newSelectedContact) {
      this.firstName = newSelectedContact.firstName;
      this.lastName = newSelectedContact.lastName;
      this.email = newSelectedContact.email;
      this.phone = "+1" + newSelectedContact.phone;
    } else {
      this.selectedRole = "";
      this.selectedSalutation = "";
      this.firstName = "";
      this.middleName = "";
      this.lastName = "";
      this.suffix = "";
      this.email = "";
      this.phone = "";
      this.phoneExt = "";
      this.dodaac = "";
      this.selectedPhoneCountry
        = {name: '', countryCode: '', abbreviation: '', active: false};
      this.selectedBranch = {text: "", value: ""};
      this.selectedRank = {grade: "", name: "", sysId: ""};
      this.selectedAccessToEdit = "";
    }
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
    if (this.selectedBranch !== null) {
      this.selectedBranchRanksData =
        this.branchRanksData[this.selectedBranch.value || ''];
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

    const storeData = await AcquisitionPackage.getContact(this.corOrAcor);
    this.savedData = storeData;

    if (storeData) {
      this.selectedRole = storeData.role;

      if (this.selectedRole === this.contactRoles[this.roleIndices.MILITARY].value) {
        const rankComp = (storeData.rank_components as unknown) as { link: string, value: string };
        if (rankComp) {
          this.savedData.rank_components = rankComp.value;
        }

        const emptyBranch: Record<string, string> = {text: "", value: ""};

        //retrieve selected Military Rank from rank component
        const rank = await ContactData.GetMilitaryRank(rankComp.value || "");

        this.selectedBranch = rank !== undefined
          ? this.branchData.find((branch) => branch.value === rank.branch) || emptyBranch
          : emptyBranch;

        this.selectedRank = rank !== undefined
          ? {name: rank.name || "", grade: rank.grade || "", sysId: rank.sys_id || ""}
          : {grade: "", name: "", sysId: ""};
      }

      this.selectedSalutation = storeData.salutation;

      this.firstName = storeData.first_name;
      this.middleName = storeData.middle_name;
      this.lastName = storeData.last_name;
      this.suffix = storeData.suffix;
      this.formalName = storeData.formal_name || "";

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
      } else {
        const foundContact = this.contactList.find(val =>
          val.email === this.savedData.email
        );
        if (foundContact) {
          this.selectedContact = foundContact;
        }
      }
    } 
  }

}
</script>

