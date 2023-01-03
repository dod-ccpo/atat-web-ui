<template>
  <div>
    <p id="Message" class="mb-5 font-weight-500">
      For your
      <span v-if="hasSecret">SECRET</span>
      <span v-if="hasTopSecret">TOP SECRET</span>
      <span v-if="!isDOW">
        cloud services and support, what type of classified information will be accessed?
      </span>
      <span v-if="isDOW">
        advisory services, what type of classified information will contractor employees 
        be required to access?
      </span>
    </p>
    
    <p v-if="!isDOW" id="MessageNote" class="mb-5 ">
      Select all that apply to your
      <span v-if="hasSecret">SECRET</span>
      <span v-if="hasTopSecret">TOP SECRET</span>
      classification level.
    </p>
    <p v-if="isDOW" id="DOWMessageNote" class="mb-5">
      Select all that apply to this support service.
    </p>

    <ATATCheckboxGroup
      id="SecurityRequirements"
      :value.sync="_selectedSecurityRequirements"
      :items="securityRequirementsCheckboxes"
      name="checkboxes"
      :card="false"
      class="copy-max-width"
      :rules="[
      $validators.required('Please select at least one type of classified information.')
    ]"
    />
  </div>
</template>
<script lang="ts">

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import vue from "vue";
import { Checkbox } from "../../../types/Global";
@Component({
  components: {
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert
  }
})
export default class SecurityRequirementsCheckboxes extends vue {
  @PropSync("selectedSecurityRequirements") private _selectedSecurityRequirements!: string[];
  @Prop() private securityRequirementsCheckboxes!: Checkbox[];
  @Prop() private hasSecret!: boolean;
  @Prop() private hasTopSecret!: boolean;
  @Prop() private isDOW!: boolean;

  private selectedItem: string[] = []
  @Watch("selectedItem")
  public selectedChange(newVal: string[]): void {
    this._selectedSecurityRequirements = newVal
  }

}
</script>

