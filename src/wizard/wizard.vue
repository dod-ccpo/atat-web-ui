<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <Stepper />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <Step1 />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <ButtonNavigation />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import Stepper from "./Navigation/Stepper.vue";
import ButtonNavigation from "./Navigation/ButtonNavigation.vue";
import Step1 from "./Step1/views/Step1.vue";
import Step2 from "./Step2/views/Step2.vue";

@Component({
  components: {
    Stepper,
    Step1,
    Step2,
    ButtonNavigation,
  },
})
export default class Wizard extends Vue {}
</script>
