<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2 class="h2">Portfolio Details</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-form ref="form" lazy-validation v-model="valid">
          <atat-text-field
            v-model="portfolioName"
            id="Portfolio Name"
            label="Portfolio Name"
            :rules="rules.portfolioNameRules"
          />
          <p class="mb-11">
            Naming can be difficult. Choose a name that is descriptive enough
            for users to identify the portfolio. you may consider naming based
            on your organization.
          </p>
          <atat-text-area
            v-model="portfolioDescription"
            optional="true"
            id="Portfolio Description"
            label="Portfolio Description"
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
            :rules="rules.fundingRules"
            class="ma-2 pa-0"
            v-for="dod in dodComponents"
            v-model="funding"
            :key="dod"
            :label="dod"
            :value="dod"
            hide-details="auto"
          />
          <v-row>
            <v-col cols="6">
              <hr class="hr my-5" />
            </v-col>
          </v-row>
          <v-btn :disabled="!valid" @click="onSubmit"> temporary submit </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

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
    "Office of the Secretary of Defense (OSD) /Principal Staff Assitants",
    "National Security Agency (NSA)",
  ];
  private portfolioName = "";
  private portfolioDescription = "";
  private funding = [];
  private rules = {};

  public onSubmit() {
    //replace empty rules with real rules
    this.rules = {
      portfolioNameRules: [(v: string) => !!v || "Name is required"],
      fundingRules: [
        this.funding.length > 0 || "At least one item should be selected",
      ],
    };
    //let the DOM update
    this.$nextTick(() => {
      //manually trigger Vuetify validation
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        //it’s valid, do work
      }
      //if not valid, errors will be automatically displayed
    });
  }
}
</script>
