<template>
  <v-container fluid class="px-0 mb-10 ms-0 pt-0">
    <v-row>
      <v-col cols="12" class="py-0">
        <v-stepper
          :flat="true"
          width="100%"
          alt-labels
          class="wizard-stepper"
          v-model="getStepNumber"
          non-linear
        >
          <v-stepper-header class="pb-2 px-2">
            <template v-for="(step, index) in stepperControl.Steps">
              <v-stepper-step
                editable
                :id="'step_0' + (index + 1)"
                :step="index + 1"
                :key="'stepper_' + index"
                :complete="isStepComplete(index)"
                :rules="getValidationRules(index)"
                @click="clickedAction(index + 1, this)"
                :error-icon="'  '"
                :edit-icon="'  '"
                :complete-icon="'  '"
                :class="[isTouched(index) ? 'visited' : '']"
              >
                <a
                  @click="clickedAction(index + 1, this)"
                  class="step-description"
                >
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
        <span class="span-of-pages body-xl mx-0">
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
    Steps: this.$store.state.portfolioSteps,
  };

  private getValidationRules(idx: number) {
    const rules: any = [];
    const isStepValid = this.$store.state.erroredSteps.indexOf(idx + 1) === -1;
    if (!isStepValid) {
      rules.push(() => isStepValid);
    }
    return rules;
  }

  @Emit()
  public clickedAction(stepSelected: number): number {
    return stepSelected;
  }

  public getStepDescription(): string {
    return this.stepperControl.Steps[this.stepNumber - 1].description;
  }

  get getStepNumber(): number {
    this.$store.dispatch("setCurrentStepNumber", this.stepNumber);
    return this.stepNumber;
  }

  set getStepNumber(newValue: number) {
    this.currentStepNumber = newValue + 1;
    this.$store.dispatch("setCurrentStepNumber", this.currentStepNumber);
  }

  public isStepComplete(stepNumber: number): boolean {
    const isErroredStep =
      this.$store.state.erroredSteps.indexOf(stepNumber + 1) != -1;
    const isTouched = this.isTouched(stepNumber);
    return !isErroredStep && isTouched;
  }

  public isTouched(stepNumber: number): boolean {
    const stepIndex = this.$store.state.portfolioSteps.findIndex(
      (x: any) => x.step === stepNumber + 1
    );
    return this.$store.state.portfolioSteps[stepIndex].touched;
  }
}
</script>
