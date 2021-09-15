<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="my-9">
      <v-row>
        <v-col cols="12">
          <h2 class="h2">Portfolio Details</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <atat-text-field
            id="portfolio-name"
            label="Portfolio Name"
            :rules="rules.portfolioName"
            :value.sync="portfolio_name"
          />

          <p class="mb-11">
            Naming can be difficult. Choose a name that is descriptive enough
            for users to identify the Portfolio. You may consider naming based
            on your organization. (Must be between 4 - 100 characters)
          </p>
          <atat-text-area
            optional="true"
            id="portfolio-description"
            label="Portfolio Description"
            :value.sync="portfolio_description"
          />
          <p>
            Add a brief one to two sentence description of your Portfolio.
            Consider this your statement of work.
          </p>
          <div>
            <v-row>
              <v-col cols="4">
                <v-divider class="mt-7"></v-divider>
              </v-col>
            </v-row>
          </div>
          <div class="h5 font-weight-bold mt-6">
            Select DoD component(s) funding your Portfolio
          </div>
          <p>
            Select the DoD component(s) that will fund all applications within
            this portfolio. Multiple DoD organizations can fund the same
            Portfolio
          </p>

          <div
            v-if="typeof isDodComponentsValid === 'string'"
            class="mb-2 atat-error-message"
            id="dod-components-errors"
            role="alert"
          >
            {{ isDodComponentsValid }}
          </div>

          <fieldset
            id="dod-component"
            v-for="(dod, index) in dodComponents"
            :key="index"
            :class="[
              typeof isDodComponentsValid === 'string'
                ? 'error-item'
                : 'default',
              ' my-3 atat-checkbox-list',
            ]"
          >
            <input
              :id="'dod-component-' + index"
              type="checkbox"
              v-model="_dod_components"
              :value="dod"
              style="width: 0px; height: 0px; position: absolute"
            />

            <label
              :for="'dod-component-' + index"
              class="d-flex align-center'"
              @keydown.space="check('dod-component-' + index)"
            >
              <v-icon class="checked-icon" v-if="isChecked(dod)"
                >check_box</v-icon
              >
              <v-icon class="checkbox-icon" v-else
                >check_box_outline_blank</v-icon
              >
              <div class="ml-2">
                {{ dod }}
              </div>
            </label>
          </fieldset>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { ValidatableForm } from "types/Wizard";
import Vue from "vue";
import { Component, PropSync, Watch } from "vue-property-decorator";
@Component({})
export default class CreatePortfolioForm
  extends Vue
  implements ValidatableForm
{
  private valid = true;
  private dodComponents = [
    "Air Force",
    "Army",
    "Marine Corps",
    "Navy",
    "Space Force",
    "Combatant Command (CCMD)",
    "Joint Staff (JS)",
    "Defense Agency and Field Activity (DAFA)",
    "Office of the Secretary of Defense (OSD) /Principal Staff Assistants",
    "National Security Agency (NSA)",
    "Other",
  ];
  private isDodComponentsValid: boolean | string | undefined = false;
  private isChecked(dodComp: string) {
    return this._dod_components.some((d) => d === dodComp);
  }
  @PropSync("name", { default: "", required: true }) portfolio_name!: string;
  @PropSync("description", { default: "", required: true })
  portfolio_description!: string;
  @PropSync("dod_components", {
    default: () => new Array<string>(),
    required: true,
  })
  _dod_components!: string[];
  @Watch("_dod_components")
  onDodComponentsChanged(): void {
    if (Object.keys(this.rules).length === 0) return;
    this.validateForm();
  }
  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }
  public mounted(): void {
    this.$http.post("portfolioDrafts?offset=0&limit=20").then((response) => {
      console.log(response);
    });
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
    }
  }

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.isDodComponentsValid =
      this._dod_components.length > 0 ||
      "Please select all of the DoD components that will fund your Portfolio";

    await this.$nextTick(() => {
      validated = this.Form.validate();
    });
    
    return validated && typeof this.isDodComponentsValid === 'boolean';
  }
}
</script>
