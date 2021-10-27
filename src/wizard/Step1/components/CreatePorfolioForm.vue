<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="body-lg">
      <v-row>
        <v-col cols="12" class="pb-8">
          <h2 class="h2">Let’s start with some details about your portfolio</h2>
          <p class="pt-4 mb-0">
            Your portfolio is a collection of your funding sources and
            applications within a single cloud service provider. If you would
            like to create a multi-cloud application with environments deployed
            to different CSPs, you will need to create a portfolio for each CSP.
            When you are done, click <strong>Next</strong> and we will walk you
            through adding your funding sources.
          </p>
        </v-col>
      </v-row>
      <v-row class="mt-0 pt-0">
        <v-col cols="6" class="py-0">
          <atat-text-field
            id="portfolio-name"
            label="Portfolio Name"
            :helpText="portfolioDetailsDescription"
            :rules="rules.portfolioName"
            :value.sync="portfolio_name"
            :validate-on-load="validateOnLoad"
            class="pb-9"
          />

          <atat-text-area
            optional="true"
            id="portfolio-description"
            label="Portfolio Description"
            :helpText="portfolioDescriptionText"
            :value.sync="portfolio_description"
            class="pt-9 pb-3"
          />
        </v-col>
      </v-row>
      <div class="py-10">
        <v-row>
          <v-col cols="4">
            <v-divider></v-divider>
          </v-col>
        </v-row>
      </div>
      <v-row class="mt-0 pt-0">
        <v-col cols="6" class="py-0">

          <fieldset id="dod-component" class="atat-checkbox-list">
            <legend>
              <h3 class="h3 font-weight-bold pb-2">DoD Component</h3>
            </legend>
            <p>
              Select the DoD component(s) that will fund all applications within
              this portfolio. Multiple DoD organizations can fund the same
              portfolio.
            </p>

            <div
              v-if="typeof isDodComponentsValid === 'string'"
              class="
                mb-2
                atat-error-message
                body
                error--text error--text-darkest error-icon-label-left
              "
              id="dod-components-errors"
              role="alert"
            >
              <div class="v-messages__message">{{ isDodComponentsValid }}</div>
            </div>

            <div
              v-for="(dod, index) in dodComponents"
              :key="index"
              :class="[
                typeof isDodComponentsValid === 'string'
                  ? 'error-item'
                  : 'default',
                ' my-3 atat-checkbox-list',
                'text--base-darkest',
              ]"
            >
              <input
                :id="'dod-component-' + index"
                type="checkbox"
                v-model="_dod_components"
                :value="dod.value"
                style="width: 0px; height: 0px; position: absolute"
              />

              <label
                :for="'dod-component-' + index"
                class="d-flex align-center'"
                @keydown.space="check('dod-component-' + index)"
              >
                <v-icon class="checked-icon" v-if="isChecked(dod.value)"
                  >check_box</v-icon
                >
                <v-icon class="checkbox-icon" v-else
                  >check_box_outline_blank</v-icon
                >
                <div class="ml-2">
                  {{ dod.name }}
                </div>
              </label>
            </div>

          </fieldset>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { ValidatableForm } from "types/Wizard";
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import dodComponents from "../../../data/dodComponents";

@Component({})
export default class CreatePortfolioForm
  extends Vue
  implements ValidatableForm
{
  private valid = true;
  private dodComponents = dodComponents;
  private portfolioDetailsDescription = `Choose a name that is descriptive enough for users to identify the portfolio. Consider naming based on your organization.`;
  private portfolioDescriptionText = `Add a brief one to two sentence description of your Portfolio.
            Consider this your statement of work.`;
  private isDodComponentsValid: boolean | string | undefined = false;
  private isChecked(dodComp: string) {
    return this._dod_components.findIndex((d) => d === dodComp) > -1;
  }
  @PropSync("name", { default: "", required: true }) portfolio_name!: string;
  @PropSync("description", { default: "", required: true })
  portfolio_description!: string;
  @PropSync("dod_components", {
    default: () => new Array<string>(),
    required: true,
  })
  _dod_components!: string[];
  @Prop({ default: false }) private validateOnLoad!: boolean;

  @Watch("_dod_components")
  onDodComponentsChanged(): void {
    if (Object.keys(this.rules).length === 0) return;
    this.validateForm();
  }
  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  get rules(): any {
    return {
      portfolioName: [
        (v: string) => !!v || "Name is required",
        (v: string) =>
          (v.length >= 4 && v.length <= 100) ||
          "Portfolio name must be between 4-100 characters.",
      ],
      dod_components: [
        this._dod_components.length > 0 ||
          "Please select all of the DoD components that will fund your Portfolio",
      ],
    };
  }

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.isDodComponentsValid =
      this._dod_components.length > 0 ||
      "Please select all of the DoD components that will fund your Portfolio";

    await this.$nextTick(() => {
      validated = this.Form.validate();
    });

    return validated && typeof this.isDodComponentsValid === "boolean";
  }
}
</script>
