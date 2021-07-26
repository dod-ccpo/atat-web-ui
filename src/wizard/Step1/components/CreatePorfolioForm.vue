<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="h2">Portfolio Details</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-form ref="form">
          <atat-text-field id="Portfolio Name" name="Portfolio Name" />
        </v-form>
        <p class="mt-0">
          Naming can be difficult. Choose a name that is descriptive enough for
          users to identify the portfolio. you may consider naming based on your
          organization.
        </p>
        <atat-text-area id="Portfolio Description" />
        <p class="mt-0">
          Add a brief one to two sentence description of your Portfolio.
          Consider this your statement of work.
        </p>
        <div>
          <v-row>
            <v-col cols="8">
              <hr class="hr" />
            </v-col>
          </v-row>
        </div>
        <div class="h5 font-weight-bold mt-4">
          Select DoD component(s) funding your Portfolio
        </div>
        <p>
          Select the Dod component(s) that will fund all applications within
          this portfolio. Multiple DoD organizations can fund the same Portfolio
        </p>
        <v-checkbox v-for="dod in dodComponents" :key="dod" :label="dod" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class CreatePorfolioForm extends Vue {
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
}
</script>
