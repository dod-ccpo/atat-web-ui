<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <template>
          <div>
            <v-stepper :flat="true" alt-labels class="wizard-stepper">
              <v-stepper-header>
                <template v-for="(step, index) in stepperControl.Steps">
                  <v-stepper-step :step="index + 1" :key="'stepper_' + index" >
                    {{ step.text }}
                    <!-- <template v-slot="{ step }">
                      {{ step }}
                    </template> -->
                  </v-stepper-step>
                  <v-divider
                    :key="'divider_' + index"
                    class="primary"
                  ></v-divider>
                </template>
              </v-stepper-header>
            </v-stepper>
          </div>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Stepper } from "types/Wizard";

@Component({})
export default class StepperNavigation extends Vue {
  public stepperControl: Stepper = {
    Steps: [
      {
        step: 1,
        text: "Create Portfolio",
      },
      {
        step: 2,
        text: "Add Funding",
      },
      {
        step: 3,
        text: "Add Application",
      },
      {
        step: 4,
        text: "Add Team Members",
      },
      {
        step: 5,
        text: "Review and Submit",
      },
    ],
  };
}
</script>
