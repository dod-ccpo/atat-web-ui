<template>
  <div class="body-lg content-max-width">
    <fieldset id="cloud-service-provider" class="atat-radio-button-cards">
      <legend>Cloud Service Provider</legend>
      <p class="mb-1">
        Select the CSP where you want to deploy this portfolio.<strong
          >Your selection must match the CSP listed in your awarded task
          order(s).</strong
        >
      </p>
      <v-form ref="form" lazy-validation>
        <atat-button-card
          :items="items"
          :rules="[isSelected]"
          :value.sync="_csp"
          :isValidated="isValidated"
          id="csp"
        />
      </v-form>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";
import { ButtonCardItem, ValidatableForm } from "../../../../../types/Wizard";

@Component({})
export default class CloudServiceProviderForm
  extends Vue
  implements ValidatableForm
{
  @PropSync("csp", { default: "", required: true })
  _csp!: string[];
  private isValidated = true;
  public items = new Array<ButtonCardItem>(
    {
      label: "CSP A",
      value: "CSP A",
      content: "CSP A",
    },
    {
      label: "CSP B",
      value: "CSP B",
      content: "CSP B",
    }
  );

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  private isSelected(value: string): unknown {
    return !!value || "Please select at least one cloud service provider";
  }

  public async validateForm(): Promise<boolean> {
    this.isValidated = false;
    await this.$nextTick(() => {
      this.isValidated = this.Form.validate();
    });
    return this.isValidated;
  }
}
</script>

<style lang="scss" scoped>
.description {
  max-width: 632px;
}
</style>
