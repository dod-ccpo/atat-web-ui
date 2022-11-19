<template>
  <div>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <div v-if="hasTopSecret">
            <ATATRadioGroup
              class="copy-max-width mb-10"
              id="ClearanceLevelRadio"
              legend="What clearance level is required for contractor employees to provide your
               training?"
              :items="clearanceLevels"
              :value.sync="_selectedClearanceLevels"
            />
            <hr />
          </div>
          <SecurityRequirementsCheckboxes
            v-if="hasSecret"
            :hasSecret="hasSecret"
            :securityRequirementsCheckboxes="securityRequirementsCheckboxes"
            :selectedSecurityRequirements.sync="_selectedSecretSecurityRequirements"
          />
          <hr v-if="hasTopSecret && hasSecret" />
          <SecurityRequirementsCheckboxes
            v-if="hasTopSecret"
            :hasTopSecret="hasTopSecret"
            :securityRequirementsCheckboxes="securityRequirementsCheckboxes"
            :selectedSecurityRequirements.sync="_selectedTopSecretSecurityRequirements"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">

import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import vue from "vue";
import { Checkbox, RadioButton } from "../../../types/Global";
import SecurityRequirementsCheckboxes from "@/components/DOW/SecurityRequirementsCheckboxes.vue";
@Component({
  components: {
    SecurityRequirementsCheckboxes,
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert
  }
})
export default class SecurityRequirementsForm extends vue {
  // eslint-disable-next-line max-len
  @PropSync("selectedSecretSecurityRequirements") private _selectedSecretSecurityRequirements!: string[];
  // eslint-disable-next-line max-len
  @PropSync("selectedTopSecretSecurityRequirements") private _selectedTopSecretSecurityRequirements!: string[];
  @PropSync("selectedClearanceLevels") private _selectedClearanceLevels!: string[];
  @Prop() private hasSecret!: boolean;
  @Prop() private hasTopSecret!: boolean;
  @Prop() private isDOW!: boolean;

  private securityRequirementsCheckboxes: Checkbox[] = [
    {
      id: "COMSEC",
      label: "Communication Security (COMSEC) Information",
      value: "COMSEC",
      description: "Includes accountable or non-accountable COMSEC information and controlled" +
        " crytographic items (CCI)",
    },
    {
      id: "RestrictedData",
      label: "Restricted Data",
      value: "restrictedData",
    },
    {
      id: "CNWDI",
      label: "Critical Nuclear Weapon Design Information (CNWDI)",
      value: "CNWDI",
      description:"If CNWDI access is required, then Restricted Data must also be selected."
    },
    {
      id: "FormerlyRestrictedData",
      label: "Formerly Restricted Data",
      value: "formerlyRestrictedData",
    },
    {
      id: "SCI",
      label: "National Intelligence Information: Sensitive Compartmented Information (SCI)",
      value: "SCI",
    },
    {
      id: "NOSCI",
      label: "National Intelligence Information: Non-SCI",
      value: "NONSCI",
    },
    {
      id: "SAP",
      label: "Special Access Program (SAP) Information",
      value: "SAP",
    },
    {
      id: "NATO",
      label: "North Atlantic Treaty Organization (NATO) Information",
      value: "NATO",
    },
    {
      id: "FGI",
      label: "Foreign Government Information (FGI)",
      value: "FGI",
    },
    {
      id: "ACCM",
      label: "Alternative Compensatory Control Measures (ACCM) Information",
      value: "ACCM",
    },
    {
      id: "CUI",
      label: "Controlled Unclassified Information (CUI)",
      value: "CUI",
    },
    {
      id: "Other",
      label: "Other - Secure Internet Protocol Router Network (SIPRNET) / Joint" +
        " Worldwide Intelligence Communciations System (JWICS)",
      value: "Other",
    },
  ]
  private clearanceLevels: RadioButton[] = [
    {
      id: "TopSecret",
      label: "TopSecret",
      value: "TS",
    },
    {
      id: "TS/SCI",
      label: "Top Secret/Sensitive Compartmented Information (TS/SCI)",
      value: "TS/SCI",
    },
  ];
}
</script>

