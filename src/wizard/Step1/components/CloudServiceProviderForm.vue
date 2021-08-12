<template>
  <div class="cloud-service-provider">
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
        />
      </v-form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import { ButtonCardItem, ValidatableForm } from "../../../../types/Wizard";

@Component({})
export default class CloudServiceProviderForm
  extends Vue
  implements ValidatableForm
{
  @PropSync("csp", { default: "", required: true })
  _csp!: string;

  public items = new Array<ButtonCardItem>(
    {
      label: "CSP 1",
      value: "CSP logo or optional text  1.",
      content: "CSP logo or optional text  1.",
    },
    {
      label: "CSP 2",
      value: "CSP logo or optional text 2",
      content: "CSP logo or optional text  2.",
    },
    {
      label: "CSP 3",
      value: "CSP logo or optional text 3",
      content: "CSP logo or optional text  3.",
    }
  );

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  private isSelected(value: string): unknown {
    return !!value || "Please selected at least one Cloud Service Provider";
  }

  public async validateForm(): Promise<boolean> {
    let validated = false;
    await this.$nextTick(() => {
      validated = this.Form.validate();
    });

    return validated;
  }
}
</script>

<style lang="scss" scoped>
.description {
  max-width: 632px;
}
</style>
