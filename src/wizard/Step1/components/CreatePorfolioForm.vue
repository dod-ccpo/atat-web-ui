<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="h2">Portfolio Details</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-form ref="form" lazy-validation>
          <atat-text-field
            id="Portfolio Name"
            label="Portfolio Name"
            :rules="rules.portfolioName"
            :value.sync="model.name"
          />

          <p class="mb-11">
            Naming can be difficult. Choose a name that is descriptive enough
            for users to identify the portfolio. you may consider naming based
            on your organization.
          </p>
          <atat-text-area
            optional="true"
            id="Portfolio Description"
            label="Portfolio Description"
            @blur-action="getPortfolioDescription"
            :value.sync="model.description"
          />
          <p>
            Add a brief one to two sentence description of your Portfolio.
            Consider this your statement of work.
          </p>
          <div>
            <v-row>
              <v-col cols="6">
                <hr class="hr my-5" />
              </v-col>
            </v-row>
          </div>
          <div class="h5 font-weight-bold mt-6">
            Select DoD component(s) funding your Portfolio
          </div>
          <p>
            Select the Dod component(s) that will fund all applications within
            this portfolio. Multiple DoD organizations can fund the same
            Portfolio
          </p>
          <v-checkbox
            :rules="rules.dod_components"
            class="ma-2 pa-0 validation-above"
            :id="'checkbox_' + dod.replace(/ /gi, '_')"
            v-for="(dod, index) in dodComponents"
            v-model="model.dod_components"
            :key="dod"
            :value="dod"
            :hide-details="index !== 0"
            :ripple="false"
            :input-value="model.dod_components"
            @click="validateForm"
          >
            <template v-slot:label>
              {{ dod }}
            </template>
          </v-checkbox>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
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
  public validateForm(): void {
    this.rules = {
      portfolioName: [(v: string) => !!v || "Name is required"],
      dod_components: [
        this.model.dod_components.length > 0 ||
         "Please select all of the DoD components that will fund your Portfolio",
      ],
    };
    this.$nextTick(() => {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        alert("data saved");
      }
    });
  }
}
</script>
