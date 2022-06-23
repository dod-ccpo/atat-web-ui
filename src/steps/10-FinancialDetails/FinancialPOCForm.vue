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
            :selectedRole.sync="selectedRole"
            :selectedBranch.sync="selectedBranch"
            :selectedRank.sync="selectedRank"
            :selectedSalutation.sync="selectedSalutation"
            :firstName.sync="firstName"
            :middleName.sync="middleName"
            :lastName.sync="lastName"
            :suffix.sync="suffix"
            :email.sync="email"
            :phone.sync="phone"
            :selectedPhoneCountry.sync="selectedPhoneCountry"
            :phoneExt.sync="phoneExt"
          />


        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
import ATATContactForm from "@/components/ATATContactForm.vue";
import { CountryObj, RankData, SelectData } from "../../../types/Global";

@Component({
  components: {
    ATATContactForm
  }
})

export default class FinancialPOCForm extends Vue {
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
  private selectedPhoneCountry: CountryObj = {
    "name": "United States",
    "countryCode": "+1",
    "abbreviation": "us",
    "active": true,
    "mask": ["999-999-9999"]
  };
}
</script>
