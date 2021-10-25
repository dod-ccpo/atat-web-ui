<template>
  <div class="cloud-service-provider pl-3">
    <div class="d-flex flex-column">
      <div>
        <h3 class="h3 mb-2 font-weight-bold text--base-darkest">
          Cloud Service Provider
        </h3>
        <p class="body-lg description">
          Select the Cloud Service Provider where you want to deploy this
          Portfolio. If you have a multi-cloud application with environments
          deployed to different CSPs, you will need to create a Portfolio for
          each CSP.
        </p>
      </div>
      <v-form ref="form" lazy-validation>
        <atat-button-card
          :items="items"
          :rules="[isSelected]"
          :value.sync="_csp"
          :isValidated="isValidated"
          id="csp"
        />
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";
import { ButtonCardItem, ValidatableForm } from "../../../../types/Wizard";

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
