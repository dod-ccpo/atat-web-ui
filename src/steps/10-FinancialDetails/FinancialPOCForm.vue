<template>
  <v-form ref="form" lazy-validation>
  <v-container class="container-max-width" fluid>
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Tell us about your financial POC
        </h1>
        <div class="copy-max-width">
          <p>
            This individual must have authority to allocate funds for your organization. Upon
            submission of this acquisition package, we will send your Incremental Funding Plan to
            this individual for approval and signature.
          </p>
          <ATATContactForm
            ref="ATATContactFormRef"
            role-legend="What role best describes your Financial POC's affiliation?"
            :contactRoles="contactRoles"
            :selectedBranchRanksData="selectedBranchRanksData"
            :branchData="branchData"
            :selectedBranch="selectedBranch"
            @update:selectedBranch="selectedBranch = $event"
            :selectedRank="selectedRank"
            @update:selectedRank="selectedRank = $event"
            :email="email"
            @update:email="email = $event"
            :firstName="firstName"
            @update:firstName="firstName = $event"
            :lastName="lastName"
            @update:lastName="lastName = $event"
            :middleName="middleName"
            @update:middleName="middleName = $event"
            :phone="phone"
            @update:phone="phone = $event"
            :phoneExt="phoneExt"
            @update:phoneExt="phoneExt = $event"
            :selectedPhoneCountry="selectedPhoneCountry"
            @update:selectedPhoneCountry="selectedPhoneCountry = $event"
            :selectedRole="selectedRole"
            @update:selectedRole="selectedRole = $event"
            :selectedSalutation="selectedSalutation"
            @update:selectedSalutation="selectedSalutation = $event"
            :suffix="suffix"
            @update:suffix="suffix = $event"
            :loaded="loaded"
            :validation-msg-custom="'your Financial POC’s'"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
  </v-form>
</template>
<script lang="ts">
/* eslint-disable camelcase */

import { Component, Hook, Vue, Watch, toNative } from "vue-facing-decorator";
import ATATContactForm from "@/components/ATATContactForm.vue";
import { 
  CountryObj, 
  RadioButton, 
  RankData, 
  SaveOnLeaveRefs, 
  SelectData 
} from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import { ContactDTO, ReferenceColumn } from "@/api/models";
import parsePhoneNumber, { AsYouType, CountryCode } from "libphonenumber-js";
import ContactData from "@/store/contactData";
import { Countries } from "@/components/ATATPhoneInput.vue";
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATContactForm
  }
})

class FinancialPOCForm extends Vue {

    
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  private loaded = false;
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

  private emptyBranch: SelectData = {
    text: "",
    value: ""
  };

  private emptyRank: RankData = {
    grade: "",
    name: "",
    sysId: ""
  }

  private selectedPhoneCountry: CountryObj = {
    "name": "United States",
    "countryCode": "+1",
    "abbreviation": "us",
    "active": true,
    "mask": ["999-999-9999"]
  };
  public savedData: ContactDTO = AcquisitionPackage.initContact;
  private branchData: SelectData[] = []
  private selectedBranchRanksData: RankData[] = [];
  private branchRanksData: {[key: string]: RankData[]} = {};
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

  
  // watchers

  @Watch("selectedBranch")
  protected branchChange(): void {
    this.setRankData();
  }

  @Watch("selectedRole")
  protected selectedRoleChange(newRole: string): void {
    this.selectedBranch = newRole === "MILITARY" 
      ? AcquisitionPackage.selectedContactBranch
      : {text: "", value: ""};
  }


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

    return {
      first_name: this.firstName,
      last_name: this.lastName,
      middle_name: this.middleName,
      role: this.selectedRole,
      rank_components: this.selectedRank && this.selectedRank.sysId,
      suffix: this.suffix,
      salutation: this.selectedSalutation,
      phone: phone || "",
      phone_extension: this.phoneExt,
      email: this.email,
      type: "Financial POC",
      dodaac: "",
      can_access_package: "true",
      grade_civ: "",
      title: "",
      manually_entered: "true", 
      acquisition_package: acqPkgId,
    };
  }

  private setRankData(): void {
    if (Object.values(this.selectedBranch).every(v=>v!=="")) {
      this.selectedBranchRanksData =
        this.branchRanksData[this.selectedBranch.value as string];
    }
  }
  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        this.currentData.type = "Financial POC"
        this.currentData.can_access_package = "true"
        await AcquisitionPackage.saveContactInfo({
          data: this.currentData,
          type: "Financial POC",
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }
  
  public async loadOnEnter(): Promise<void> {
    this.savedData.can_access_package = "true";
    const branches = await ContactData.LoadMilitaryBranches();
    this.branchData = branches.map((choice) => {
      const text = `U.S. ${choice.label}`;
      const {value} = choice;
      return {
        text,
        value,
      };
    });
    const storeData = await AcquisitionPackage.loadContactInfo("Financial POC");
    this.branchRanksData = ContactData.militaryAutoCompleteGroups;
    this.savedData = storeData;
    if (storeData) {
      this.selectedRole = storeData.role;
      if ( this.selectedRole === "MILITARY") {
        const rankComp = typeof storeData.rank_components === "object"
          ? (storeData.rank_components as ReferenceColumn).value
          : storeData.rank_components
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
      this.email = storeData.email;
      this.phoneExt = storeData.phone_extension;
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
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}

export default toNative(FinancialPOCForm)
</script>
