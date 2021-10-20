<template>
  <div>
    <v-stepper
      :flat="true"
      width="100%"
      alt-labels
      class="wizard-stepper"
      v-model="getStepNumber"
      non-linear
    >
      <v-stepper-header class="pa-0">
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
            :class="[
              isTouched(index) ? 'visited' : '',
              index === 0 ? 'ml-n1' : '',
            ]"
          >
            <a
              @click="clickedAction(index + 1, this)"
              class="step-description px-1"
            >
              {{ step.description }}
            </a>
            <v-divider :key="'divider_' + index"></v-divider>
          </v-stepper-step>
        </template>
      </v-stepper-header>
    </v-stepper>
  </div>
  <div class="step-of-pages-control py-6 width-100">
    <span
      class="
        v-stepper__step__step
        step
        bg-primary-darken
        white--text
        ml-n1
        mr-0
      "
    >
      {{ this.stepNumber }}
    </span>
    <span class="span-of-pages font-size-24">
      of {{ stepperControl.Steps.length }}</span
    >
    <span class="span-of-pages step-description ml-2">
      {{ getStepDescription() }}</span
    >
  </div>
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
