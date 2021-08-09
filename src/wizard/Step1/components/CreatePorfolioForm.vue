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
            :value.sync="model.name"
          />

          <p class="mb-11">
            Naming can be difficult. Choose a name that is descriptive enough
            for users to identify the Portfolio. You may consider naming based
            on your organization.
          </p>
          <atat-text-area
            optional="true"
            id="portfolio-description"
            label="Portfolio Description"
            :value.sync="model.description"
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
            v-for="(dod, index) in dodComponents"
            v-model="model.dod_components"
            :key="dod"
            :value="dod"
            :hide-details="index !== 0"
            :input-value="model.dod_components"
            color="primary"
            @click="validateForm"
          >
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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { CreatePortfolioFormModel } from "../../../../types/Wizard";
@Component({})
export default class CreatePortfolioForm extends Vue {
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

  private rules = {};
  private model: CreatePortfolioFormModel = {
    name: "",
    description: "",
    dod_components: [],
  };

  get Form(): Vue & { validate: () => boolean } {
    return this.$refs.form as Vue & { validate: () => boolean };
  }

  public async validateForm(): Promise<boolean> {
    let validated = false;
    this.rules = {
      portfolioName: [(v: string) => !!v || "Name is required"],
      dod_components: [
        this.model.dod_components.length > 0 ||
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
