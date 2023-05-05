<template>
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
            type="financialPOCForm"
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
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable camelcase */

import { Component, Mixins } from "vue-property-decorator";
import ATATContactForm from "@/components/ATATContactForm.vue";
import { CountryObj, RadioButton, RankData, SelectData } from "../../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { convertSystemChoiceToSelect, hasChanges } from "@/helpers";
import { ContactDTO } from "@/api/models";
import parsePhoneNumber, { AsYouType, CountryCode } from "libphonenumber-js";
import ContactData from "@/store/contactData";
import { Countries } from "@/components/ATATPhoneInput.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATContactForm
  }
})

export default class FinancialPOCForm extends Mixins(SaveOnLeave) {
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
    MILITARY: 0,
    CIVILIAN: 1,
    CONTRACTOR: 3,
  };

  private selectedPhoneCountry: CountryObj = {
    "name": "United States",
    "countryCode": "+1",
    "abbreviation": "us",
    "active": true,
    "mask": ["999-999-9999"]
  };
  public savedData: ContactDTO = AcquisitionPackage.initContact;
  private branchData: SelectData[] = []
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
      type: "Financial POC",
      dodaac: "",
      can_access_package: "true",
      grade_civ,
      title,
      manually_entered: "", // not used on Mission Owner contact entry form
    };
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
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
      this.selectedSalutation = storeData.salutation;
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
    this.$nextTick(()=> this.loaded = true);
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
