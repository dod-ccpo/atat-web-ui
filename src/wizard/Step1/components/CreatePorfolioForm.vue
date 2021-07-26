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
          <atat-text-field id="Portfolio Name">Portfolio Name</atat-text-field>
        </v-form>
        <p class="mt-0">
          Naming can be difficult. Choose a name that is descriptive enough for
          users to identify the portfolio. you may consider naming based on your
          organization.
        </p>

        <v-checkbox v-for="dod in dodComponents" :key="dod" :label="dod">
        </v-checkbox>
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
