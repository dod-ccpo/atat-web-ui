<template>
  <v-form ref="form" lazy-validation class="body-lg content-max-width">
    <v-row>
      <v-col v-if="!stepHasBeenTouched" class="mb-4">
        <h1 tabindex="-1">
          Let’s start with some details about your portfolio
        </h1>
        <p>
          Your portfolio is a collection of your funding sources and
          applications within a single Cloud Service Provider (CSP). If you
          would like to create a multi-cloud application with environments
          deployed to different CSPs, you will need to create a portfolio for
          each CSP. When you are done, click <strong>Next</strong> and we will
          walk you through adding your funding sources.
        </p>
      </v-col>
      <v-col v-else class="mb-4">
        <h1 tabindex="-1">Let’s update your portfolio details</h1>
        <p>
          Your portfolio is a collection of your funding sources and
          applications within a single Cloud Service Provider (CSP). If you
          would like to create a multi-cloud application with environments
          deployed to different CSPs, you will need to create a portfolio for
          each CSP. When you are done, click <strong>Next</strong> to continue
          reviewing your portfolio.
        </p>
      </v-col>
    </v-row>
    <ATATAlert
      type="error"
      class="mt-0 mb-8"
      :closeButton="false"
      v-if="_erroredFields.length > 0"
    >
      <template v-slot:content>
        Please review the fields below and take any necessary actions.
        <ul>
          <li v-for="(item, index) in _erroredFields" :key="index">
            {{ item.message }}
          </li>
        </ul>
      </template>
    </ATATAlert>
    <v-row class="mt-0 pt-0">
      <v-col class="py-0 input-max-width">
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

    <atat-divider />

    <v-row class="mt-0 pt-0">
      <v-col class="py-0 input-max-width">
        <fieldset id="dod-component" class="atat-checkbox-list">
          <legend>DoD Component</legend>
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
  </v-form>
</template>

<script lang="ts">
import { ErrorPanelMessages, ValidatableForm } from "types/Wizard";
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import dodComponents from "../../../../data/dodComponents";
import ATATDivider from "@/components/ATATDivider.vue";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    "atat-divider": ATATDivider,
    ATATAlert,
  },
})
export default class CreatePortfolioForm
  extends Vue
  implements ValidatableForm
{
  private dodComponents = dodComponents;
  private portfolioDetailsDescription = `Choose a name that is descriptive enough for users to identify the portfolio. Consider naming based on your organization.`;
  private portfolioDescriptionText = `Add a brief one to two sentence description of your Portfolio.
            Consider this your statement of work.`;
  private isDodComponentsValid: boolean | string | undefined = false;
  private isChecked(dodComp: string) {
    return this._dod_components.findIndex((d) => d === dodComp) > -1;
  }
  private stepHasBeenTouched = false;
  @PropSync("erroredFields") private _erroredFields:
    | ErrorPanelMessages[]
    | undefined;
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
  private mounted(): void {
    this.stepHasBeenTouched = this.$store.getters["wizard/getStepTouched"](1);
  }
}
</script>
