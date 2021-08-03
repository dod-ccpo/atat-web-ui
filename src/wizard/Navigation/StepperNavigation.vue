<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-stepper
          :flat="true"
          width="100%"
          alt-labels
          class="wizard-stepper"
          v-model="getStepNumber"
          non-linear
        >
          <v-stepper-header class="pb-2">
            <template v-for="(step, index) in stepperControl.Steps">
              <v-stepper-step
                editable
                :id="'step_0' + (index + 1)"
                :step="index + 1"
                :key="'stepper_' + index"
                :complete="isStepComplete(index)"
                :rules="[() => index + 1 !== 4]"
                @click="clickedAction(index + 1, this)"
                :error-icon="'mdi-exclamation-thick '"
                :class="[index + 1 === 2 ? 'visited' : '']"
              >
                <a href="##" class="step-description">
                  {{ step.description }}
                </a>
                <v-divider :key="'divider_' + index"></v-divider>
              </v-stepper-step>
            </template>
          </v-stepper-header>
        </v-stepper>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="step-of-pages-control">
        <span
          class="v-stepper__step__step step bg-primary-darken white--text mx-0"
        >
          {{ this.stepNumber }}
        </span>
        <span class="span-of-pages mx-0">
          of {{ stepperControl.Steps.length }}</span
        >
        <span class="span-of-pages step-description mx-1">
          {{ getStepDescription() }}</span
        >
      </v-col>
    </v-row>
     <v-divider class="mt-7"></v-divider>
  </v-container>
 
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import { Stepper } from "types/Wizard";

@Component({})
export default class StepperNavigation extends Vue {
  @Prop({ default: 1 }) private stepNumber!: number;
  private currentStepNumber = this.stepNumber;
  public stepperControl: Stepper = {
    Steps: [
      {
        step: 1,
        description: "Create Portfolio",
      },
      {
        step: 2,
        description: "Add Funding",
      },
      {
        step: 3,
        description: "Add Application",
      },
      {
        step: 4,
        description: "Add Team Members",
      },
      {
        step: 5,
        description: "Review and Submit",
      },
    ],
  };

  @Emit()
  public clickedAction(stepSelected: number): number {
    return stepSelected;
  }

  public getStepDescription(): string {
    return this.stepperControl.Steps[this.stepNumber - 1].description;
  }

  get getStepNumber(): number {
    return this.stepNumber;
  }

  set getStepNumber(newValue: number) {
    this.currentStepNumber = newValue + 1;
  }

  public isStepComplete(stepNumber: number): boolean {
    return this.getStepNumber > stepNumber + 1;
  }
}
</script>
