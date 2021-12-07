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
      <v-stepper-header class="pa-0" role="navigation">
        <template v-for="(step, index) in steps">
          <v-stepper-step
            editable
            :id="'step_0' + (index + 1)"
            :step="index + 1"
            :key="'stepper_' + index"
            :complete="isStepComplete(index + 1)"
            :rules="getValidationRules(index)"
            @click="clickedAction(index + 1, this)"
            @keydown.enter="clickedAction(index + 1, this)"
            :error-icon="'  '"
            :edit-icon="'  '"
            :complete-icon="'  '"
            :class="[isTouched(index + 1) ? 'visited' : '']"
          >
            <a
              tabindex="0"
              @click="clickedAction(index + 1, this)"
              @keydown.enter="clickedAction(index + 1, this)"
              class="step-description px-1"
            >
              {{ step.description }}
            </a>
            <v-divider :key="'divider_' + index"></v-divider>
          </v-stepper-step>
        </template>
      </v-stepper-header>
    </v-stepper>
    <div class="step-of-pages-control py-6 width-100">
      <span
        class="v-stepper__step__step step bg-primary-darken white--text mr-0"
      >
        {{ this.stepNumber }}
      </span>
      <span class="span-of-pages font-size-24"> of {{ steps.length }}</span>
      <span class="span-of-pages step-description ml-2">
        {{ getStepDescription() }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { mixins } from "vue-class-component";
import { Component, Prop, Emit } from "vue-property-decorator";
import { Step } from "types/Wizard";
import WizardModuleData from "@/mixins/WizardModuleData";

@Component({})
export default class StepperNavigation extends mixins(WizardModuleData) {
  @Prop({ default: 1 }) private stepNumber!: number;
  private currentStepNumber = this.stepNumber;

  private getValidationRules(idx: number) {
    const rules: any = [];
    const isStepValid = this.erroredSteps.indexOf(idx + 1) === -1;
    if (!isStepValid) {
      rules.push(() => isStepValid);
    }
    return rules;
  }

  private get steps(): Step[] {
    console.log('in steps');
    const steps = [];
    for (let stepKey in this.portfolioSteps) {
      const step = this.portfolioSteps[stepKey];
      steps.push(step);
    }

    return steps;
  }

  @Emit()
  public clickedAction(stepSelected: number): number {
    this.$store.dispatch("wizard/setReturnToReview", false);
    return stepSelected;
  }

  get step(): Step {
    return this.portfolioSteps[this.stepNumber];
  }

  public getStepDescription(): string {
    return this.step.description;
  }

  get getStepNumber(): number {
    return this.stepNumber;
  }

  set getStepNumber(newValue: number) {
    this.currentStepNumber = newValue + 1;
    this.setCurrentStepNumber(this.currentStepNumber);
  }

  public isStepComplete(stepNumber: number): boolean {
    const isErroredStep = this.erroredSteps.indexOf(stepNumber) != -1;
    const isTouched = this.isTouched(stepNumber);
    return !isErroredStep && isTouched;
  }

  public isTouched(stepNumber: number): boolean {
    return this.portfolioSteps[stepNumber].touched;
  }
}
</script>
