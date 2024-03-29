<template>
  <div :id="`Section${idSuffix}`">
    <p :id="`Message${idSuffix}`" class="mb-5 font-weight-500">
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
    
    <p v-if="!isDOW" :id="`MessageNote${idSuffix}`" class="mb-5 ">
      Select all that apply to your
      <span v-if="hasSecret">SECRET</span>
      <span v-if="hasTopSecret">TOP SECRET</span>
      classification level.
    </p>
    <p v-if="isDOW" :id="`DOWMessageNote${idSuffix}`" class="mb-5">
      Select all that apply to this support service.
    </p>
    <v-form ref="SecurityRequirementsCheckboxes" class="copy-max-width" lazy-validation>
      <ATATCheckboxGroup
        :ref="'SecurityRequirements' + idSuffix + 'Ref'"
        :id="'SecurityRequirements' + idSuffix"
        :labelSuffix="idSuffix"
        :value="_selectedSecurityRequirements"
        @update:value="_selectedSecurityRequirements = $event"
        :items="securityRequirementsCheckboxes"
        name="checkboxes"
        :card="false"
        class="copy-max-width"
        :rules="[
          $validators.required('Please select at least one type of classified information.')
      ]"
      />
    </v-form>
  </div>
</template>
<script lang="ts">

import { Component, Prop, Vue, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { Checkbox } from "../../../types/Global";
@Component({
  components: {
    ATATRadioGroup,
    ATATCheckboxGroup,
    ATATAlert
  }
})
class SecurityRequirementsCheckboxes extends Vue {
  @PropSync("selectedSecurityRequirements") private _selectedSecurityRequirements!: string[];
  @Prop() private securityRequirementsCheckboxes!: Checkbox[];
  @Prop() private hasSecret!: boolean;
  @Prop() private hasTopSecret!: boolean;
  @Prop() private isDOW!: boolean;

  private get idSuffix(): string {
    return this.hasSecret ? "Secret" : "TopSecret";
  }

  private selectedItem: string[] = []
  @Watch("selectedItem")
  public selectedChange(newVal: string[]): void {
    this._selectedSecurityRequirements = newVal
  }
}
export default toNative(SecurityRequirementsCheckboxes)
</script>

