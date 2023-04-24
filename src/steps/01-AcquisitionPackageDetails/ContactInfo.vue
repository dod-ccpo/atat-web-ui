<template>
  <v-container fluid class="container-max-width">
    
    <h1 class="page-header">Let’s find out about the primary point of contact for this 
      requirement</h1>
    <ATATRadioGroup
      legend="What role best describes your affiliation with the DoD?"
      id="ContactRole"
      :items="contactRoles"
      :value.sync="selectedRole"
      class="mb-6"
      @radioButtonSelected="contactTypeChange"
      :rules="[$validators.required('Please select your role.')]"
    />

    <v-form ref="form">
      <v-row class="form-section">
      <v-col>
        <ATATSelect
          id="Branch"
          v-model="selectedBranch"
          v-if="selectedRole === 'MILITARY'"
          class="_input-max-width mb-10"
          label="Service branch"
          placeholder=""
          :items="branchData"
          :selectedValue.sync="selectedBranch"
          :return-object="true"
          :rules="[
            $validators.required('Please enter your Service Branch.')
          ]"
        />

        <ATATSelect
          v-if="selectedRole !== 'MILITARY'"
          id="Salutation"
          class="_input-max-width"
          label="Salutation"
          :optional="true"
          placeholder=""
          :items="salutationData"
          :selectedValue.sync="selectedSalutation"
        />

        <ATATAutoComplete
          id="Rank"
          v-if="selectedRole === 'MILITARY' && showContactInfoFields"
          label="Rank"
          titleKey="name"
          :items="selectedBranchRanksData"
          :searchFields="['name', 'grade']"
          :selectedItem.sync="selectedRank"
          class="_input-max-width mb-7"
          icon="arrow_drop_down"
          :rules="[
            $validators.required('Please select your military rank.')
          ]"
        />
      </v-col>
      </v-row>
      <v-row class="form-section" v-show="showContactInfoFields">
        <v-col class="col-12 col-lg-3">
          <ATATTextField
            label="First name"
            id="FirstName"
          :value.sync="firstName"
          class="_input-max-width"
          :rules="[
            $validators.required('Please enter your first name.')
          ]"
          />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField
            label="Middle name"
            id="MiddleName"
            :value.sync="middleName"
            :optional="true"
            class="_input-max-width"
          />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField
            label="Last name"
            id="LastName"
            :value.sync="lastName"
            class="_input-max-width"
            :rules="[
              $validators.required('Please enter your last name.')
            ]"
          />
        </v-col>
        <v-col class="col-12 col-lg-3">
          <ATATTextField
            label="Suffix"
            id="Suffix"
            :optional="true"
            width="80"
            :value.sync="suffix"
          />
        </v-col>
      </v-row>
      <v-row class="form-section mb-0" v-if="showContactInfoFields">
        <v-col>
          <ATATTextField
            label="Your title"
            id="ContactTitle"
            class="_input-max-width mb-10"
            :value.sync="title"
            :rules="[
              $validators.required('Please enter your title.')
            ]"
          />
          <ATATPhoneInput
            label="Your phone number"
            id="ContactPhone"
            class="mb-10"
            :value.sync="selectedPhoneNumber"
            :country.sync="selectedPhoneCountry"
            :extensionValue.sync="phoneExtension"
            :rules="[
              $validators.isPhoneNumberValid(
                this.selectedPhoneCountry
              ),
            ]"
          />
          <ATATTextField
            label="Your email"
            id="ContactEmail"
            class="_input-max-width mb-10"
            helpText="Enter a .mil or .gov email address."
            :value.sync="email"
            :validateOnBlur="true"
            :rules="[
                $validators.required('Please enter your email address.'),
                $validators.isEmail(),
            ]"
          />
          <ATATAutoComplete
            v-if="selectedRole === 'CIVILIAN'"
            id="ContactGrade"
            :optional="true"
            class="_input-max-width mb-10"
            label="Grade"
            :label-sr-only="false"
            titleKey="label"
            :searchFields="['label']"
            :items="gradeData"
            :selectedItem.sync="selectedGrade"
            placeholder=""
            icon="arrow_drop_down"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Watch, Mixins } from "vue-property-decorator";
import {convertSystemChoiceToSelect} from "@/helpers";
import parsePhoneNumber,{ AsYouType, CountryCode} from "libphonenumber-js";

import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATPhoneInput, {Countries} from "@/components/ATATPhoneInput.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import ContactData from "@/store/contactData";

import {
  AutoCompleteItem,
  AutoCompleteItemGroups,
  CountryObj,
  RadioButton,
  SelectData,
} from "../../../types/Global";
import { ContactDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import Vue from "vue";

@Component({
  components: {
    ATATAutoComplete,
    ATATPhoneInput,
    ATATRadioGroup,
    ATATSelect,
    ATATTextField,
  },
})
export default class ContactInfo extends Mixins(SaveOnLeave) {
  $refs!: {
    form: Vue & {
      resetValidation: () => void;
      reset: () => void;
      validate: () => boolean;
    };
  };
  
  
  // computed

  get showContactInfoFields(): boolean {
    return (
      this.selectedRole !== "MILITARY" ||
      (this.selectedRole === "MILITARY" && 
        (this.selectedBranch && this.selectedBranch.value !== ""))
    );
  }

  // watchers

  @Watch("selectedBranch")
  protected branchChange(newVal: string): void {
    if (newVal !== null){
      this.setRankData();
      AcquisitionPackage.setSelectedContactBranch(this.selectedBranch);
    }
  }

  @Watch("selectedRole")
  protected roleChange(newRole: string): void {
    if (newRole === "MILITARY") {
      const branch = this.branchData.filter((branchObj) => {
        return branchObj.value === this.selectedAgency.value;
      });
      if (branch.length) {
        this.selectedBranch = branch[0];
      }
    }
  }

  // data
  private loaded = false;
  private firstName = "";
  private middleName = "";
  private lastName = "";
  private suffix = "";
  private title = "";
  private email = "";
  private selectedPhoneNumber = "";
  private phoneExtension = "";

  //todo replace this from the store after `countries` is stored there
  private selectedPhoneCountry: CountryObj = {
    name: "United States",
    countryCode: "+1",
    abbreviation: "us",
    active: true,
    mask: ["999-999-9999"],
  };

  public selectedAgency: SelectData =
    AcquisitionPackage.selectedAgency;

  private selectedBranch: SelectData = { text: "", value: "" };
  private branchData: SelectData[] = [];

  private selectedRank: { grade: string; name: string; sysId: string } = {
    grade: "",
    name: "",
    sysId: "",
  };

  private selectedBranchRanksData: AutoCompleteItem[] = [];
  private branchRanksData: AutoCompleteItemGroups = {};

  private selectedRole = "";

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

  private selectedGrade: {grade: string, label: string} = {grade: "", label: ""};
  private gradeData: {grade: string, label: string}[] = [];

  private selectedSalutation = "";
  private salutationData: SelectData[] = [];

  public get currentData(): ContactDTO {
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
      this.selectedPhoneNumber,
      countryCode
    );

    let phone = this.selectedPhoneNumber
      ? parsePhoneNumber(
        this.selectedPhoneNumber,
        countryCode
      )?.format("INTERNATIONAL")
      : "";

    if(countryCode){
      
      const asyoutype= new AsYouType(countryCode);
      const formatted = asyoutype.input(this.selectedPhoneNumber);
      phone = `+${parsedPhone?.countryCallingCode} ${formatted}`;
    }

  
    const phoneExt = this.phoneExtension;
    const email = this.email;
    const grade_civ = this.selectedGrade ?  this.selectedGrade.grade : "";
    const title = this.title;
    return {
      first_name,
      last_name,
      middle_name,
      role,
      rank_components,
      suffix,
      salutation,
      phone: phone || "",
      phone_extension: phoneExt || "", // not used on Primary Contact contact entry form
      email,
      type: "Primary Contact",
      dodaac: "",
      can_access_package: "true",
      grade_civ,
      title,
      manually_entered: "", // not used on Primary Contact contact entry form
    };
  }

  public savedData: ContactDTO = AcquisitionPackage.initContact;

  // methods

  private setRankData(): void {
    if (this.selectedBranch.value) {
      this.selectedBranchRanksData =
        this.branchRanksData[this.selectedBranch.value];
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.savedData.can_access_package = "true";
    const branches = await ContactData.LoadMilitaryBranches();
    this.branchData = branches.map((choice) => {
      const text = `U.S. ${choice.label}`;
      const { value } = choice;
      return {
        text,
        value,
      };
    });

    this.branchRanksData = ContactData.militaryAutoCompleteGroups;

    this.gradeData = ContactData.civilianGradeChoices.map(choice=> {
      return {
        label: choice.label,
        grade: choice.value
      }
    });

    this.salutationData = convertSystemChoiceToSelect(ContactData.salutationChoices);

    const storeData = await AcquisitionPackage.getContact("Primary Contact");
    this.savedData = storeData;

    if (storeData) {
      this.selectedRole = storeData.role;

      if (
        this.selectedRole === this.contactRoles[this.roleIndices.MILITARY].value
      ) {
        const rankComp = storeData.rank_components as unknown as {
          link: string;
          value: string;
        };
        if (rankComp) {
          this.savedData.rank_components = rankComp.value;
        }

        const emptyBranch: { text: ""; value: "" } = { text: "", value: "" };

        //retrieve selected Military Rank from rank component
        const rank = await ContactData.GetMilitaryRank(rankComp && rankComp.value || "");

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

      if (
        this.selectedRole === this.contactRoles[this.roleIndices.CIVILIAN].value
      ) {
        const gradeValue = this.gradeData.find(
          (value) => value.grade === storeData.grade_civ
        );
        this.selectedGrade = {
          grade: gradeValue?.grade || "",
          label: gradeValue?.label || "",
        };
      }

      this.selectedSalutation = storeData.salutation;
      this.firstName = storeData.first_name;
      this.middleName = storeData.middle_name;
      this.lastName = storeData.last_name;
      this.suffix = storeData.suffix;

      this.title = storeData.title;
      this.email = storeData.email;
      this.phoneExtension = storeData.phone_extension;
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
        // if(phoneNumber.length > 0 && country){
        //   phoneNumber = Inputmask({
        //     mask: country?.mask || [],
        //     placeholder: "",
        //     jitMasking: true
        //   }).mask(phoneTextField);
        // }
        this.selectedPhoneNumber = phoneNumber;
        this.savedData.phone = phoneNumber;
      }
    }

    this.$nextTick(()=> this.loaded = true);
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
  
  private contactTypeChange(): void {
    if(this.loaded){
      this.resetData();
    }
  }

  public resetData(): void {
    Vue.nextTick(() => {
      //iterate over the forms children ref manually set their 'errorMessages' array to empty
      const formChildren = this.$refs.form.$children;
     
      formChildren.forEach((ref)=> {
        ((ref as unknown) as {errorMessages:[], _value: string}).errorMessages = [];
      });
      Vue.nextTick(() => {
        this.$refs.form.reset();
        this.$refs.form.resetValidation();
      });
    });
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveContactInfo({
          data: this.currentData,
          type: "Primary Contact",
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
