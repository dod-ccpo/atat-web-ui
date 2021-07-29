<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-stepper
          :flat="true"
          width="100%"
          alt-labels
          class="wizard-stepper"
          non-linear
          v-model="currentStepNumber"
        >
          <v-stepper-header>
            <template v-for="(step, index) in stepperControl.Steps">
              <v-stepper-step
                editable
                :step="index + 1"
                :key="'stepper_' + index"
                @click="clickedAction(index+1)"
              >
                {{ step.description }}
              </v-stepper-step>
              <v-divider
                :key="'divider_' + index"
                :class="getDividerColor(index)"
              ></v-divider>
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
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";
import { Stepper } from "types/Wizard";

@Component({})
export default class StepperNavigation extends Vue {
  @Prop({ default: 1 }) private stepNumber!: number;
  private currentStepNumber = 1;
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
  public clickedAction(e: MouseEvent, stepSelected: number): number {
    debugger;
    e.preventDefault();
    return stepSelected;
  }

  public getStepDescription(): string {
    return this.stepperControl.Steps[this.stepNumber - 1].description;
  }
  
  get getStepNumber(): number {
    return this.stepNumber;
  }

  set getStepNumber(newValue: number){
    this.currentStepNumber = newValue + 1;
  }

  public getDividerColor(dividerNumber: number): string {
    console.log(dividerNumber);
    return dividerNumber + 1 <= this.stepNumber
      ? "bg-primary"
      : "bg-base-lighter";
  }
}
</script>
