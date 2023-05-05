<template>
  <div>
    <div v-if="hasTopSecret && isDOW">
      <ATATRadioGroup
        class="copy-max-width mb-10"
        id="ClearanceLevelRadio"
        legend="What clearance level is required for contractor employees to provide your
         training?"
        :items="clearanceLevels"
        :value.sync="_selectedClearanceLevel"
      />
      <hr />
    </div>
    <SecurityRequirementsCheckboxes
      v-if="hasSecret"
      :hasSecret="hasSecret"
      :isDOW="isDOW"
      :securityRequirementsCheckboxes="securityRequirementsCheckboxes"
      :selectedSecurityRequirements.sync="_selectedSecretSecurityRequirements"
    />
    <hr v-if="hasTopSecret && hasSecret" />
    <SecurityRequirementsCheckboxes
      v-if="hasTopSecret"
      :hasTopSecret="hasTopSecret"
      :isDOW="isDOW"
      :securityRequirementsCheckboxes="securityRequirementsCheckboxes"
      :selectedSecurityRequirements.sync="_selectedTopSecretSecurityRequirements"
    />
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
import classificationRequirements from "@/store/classificationRequirements";
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
  @PropSync("selectedClearanceLevel", { default: "" }) 
  private _selectedClearanceLevel!: string | null;
  // pragma: allowlist secret
  @Prop() private hasSecret!: boolean;
  // pragma: allowlist secret
  @Prop() private hasTopSecret!: boolean;
  @Prop() private isDOW!: boolean;

  private securityRequirementsCheckboxes: Checkbox[] = [];
  
  private clearanceLevels: RadioButton[] = [
    {
      id: "TopSecret",
      label: "Top Secret",
      value: "TS",
    },
    {
      id: "TS_SCI",
      label: "Top Secret/Sensitive Compartmented Information (TS/SCI)",
      value: "TS_SCI",
    },
  ];

  private async loadOnEnter(): Promise<void> {
    let classifiedInformationTypes = 
      await classificationRequirements.getAllClassifiedInformationTypes();

    classifiedInformationTypes = classifiedInformationTypes.sort((a,b) => {
      return Number(a.sequence) - Number(b.sequence);
    });

    this.securityRequirementsCheckboxes = [];

    classifiedInformationTypes.forEach(item => {
      this.securityRequirementsCheckboxes.push({
        id: item.sequence,
        label: item.name,
        description: item.description,
        value: item.sys_id as string
      })
    })

  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>

