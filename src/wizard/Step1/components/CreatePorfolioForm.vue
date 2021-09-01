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
          <v-checkbox
            :rules="rules.dod_components"
            class="ma-2 pa-0 validation-above text--black"
            :id="'checkbox_' + dod.replace(/ /gi, '_')"
            :ref="'checkbox_' + dod.replace(/ /gi, '_')"
            v-for="(dod, index) in dodComponents"
            v-model="_dod_components"
            :key="dod"
            :value="dod"
            :hide-details="index !== 0"
            color="primary"
            name="dod_components"
            :aria-checked="_dod_components.findIndex((c) => c === dod) > -1"
            @change="checkComponent('checkbox_' + dod.replace(/ /gi, '_'), dod)"
          >
            <!-- @keyup.enter="checkComponent"   -->
            <!-- @click="dod.checked = !dod.checked"
          @keyup.space="dod.checked = !dod.checked" -->
            <template v-slot:label>
              <span class="">{{ dod }}</span>
            </template>
          </v-checkbox>
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

  private checkboxClicked() {
    //this.$refs(cbRef)
    // console.log(this.$refs[cbRef]);
    // // alert("hi there");
    // debugger;
    // console.log("hi threre");
    return true;
  }

  private checkComponent(cbRef: string, dod: string) {
    // debugger;
    // console.log(this.$refs[cbRef]);
    this.$nextTick(function () {
      let cb: any = this.$refs[cbRef];
      let isItemChecked = this._dod_components.findIndex((c) => c === dod) > -1;
      if (cb && cb.length > 0) {
        cb[0].$attrs["aria-checked"] = isItemChecked;
      }
    });
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

  public rules = {};

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.rules = {
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

    await this.$nextTick(() => {
      validated = this.Form.validate();
    });

    return validated;
  }
}
</script>
