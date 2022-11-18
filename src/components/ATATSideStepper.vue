<template>
  <v-navigation-drawer 
    id="GlobalSideNavBar" 
    app 
    permanent 
    class="global-side-nav-bar d-flex flex-column align-start " 
    width="320"
  >
    <div class="_stepper-progress-bar">
      <strong class="text-primary pl-1">{{ percentComplete }}%</strong>&nbsp;
      <span class="text-base">COMPLETE</span>
      <v-progress-linear
        :value="percentComplete"
        height="12"
        rounded
        color="#544496"
      ></v-progress-linear>
    </div>

    <v-list>
      <v-list-item
        v-for="(step, stepIndex) in stepperData"
        :key="stepIndex"
        :class="{ 'active-step': step.stepNumber === activeStep }"
      >
        <router-link
          :id="'Step_' + getIdText(step.menuText)"
          :to="{ name: getRouteName(step) }"
          :class="{ 
            'step-complete': isStepComplete(step.stepNumber),
            'disabled': !isStepComplete(step.stepNumber) && !canNavigate() 
          }"
          class="step"
          @click.native="setCurrentStep(step.stepNumber)"
        >
          <span class="step-circle">
            {{ step.stepNumber }}
            <span v-if="isStepComplete(step.stepNumber)" class="completed-check">
              <span class="d-sr-only">Completed</span>
              <v-icon>check_circle</v-icon>
            </span>
          </span>
          <span class="step-text">
            {{ step.menuText }}
          </span>
        </router-link>

        <v-expand-transition v-if="hasSubSteps(step)">
          <span v-show="activeStep === step.stepNumber">
            <span 
              v-for="(subStep, subStepIndex) in step.subSteps"
              :key="'step' + step.stepNumber + '_substep' + subStepIndex"
            >
              <router-link
                v-show="!subStep.excludeFromMenu"
                :id="'SubStep_' + getIdText(subStep.menuText)"
                :to="subStep.route"
                :class="{ 
                  'step-complete': isSubstepComplete(subStep.name),
                  'disabled': !isSubstepComplete(subStep.name) && !canNavigate() 
                }"
                class="substep"
              >
                <span class="substep-circle">
                  <span
                    v-if="isSubstepComplete(subStep.name)"
                    class="completed-check"
                    :data-substep-complete-percentage="
                      subStep.completePercentageWeight
                    "
                  >
                    <span class="d-sr-only">Completed</span>
                    <v-icon>check_circle</v-icon>
                  </span>
                </span>
                <span class="step-text">
                  {{ subStep.menuText }}
                </span>
              </router-link>
            </span>
          </span>
        </v-expand-transition>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { StepperStep } from "../../types/Global";
import { getIdText } from "@/helpers";
import { StepInfo } from "@/store/steps/types";
import Steps from "@/store/steps";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({})
export default class ATATSideStepper extends Vue {
  @Prop({ default: ()=>[] })  private stepperData!: StepperStep[]

  public setCurrentStep(stepNumber: string): void {
    this.activeStep = stepNumber;
    this.calculatePercentComplete();
  }

  private getCurrentStepperStep(): StepInfo {
    return Steps.currentStep as StepInfo;
  }

  private canNavigate(): boolean {
    return AcquisitionPackage.getAllowDeveloperNavigation;
  }

  @Watch('getCurrentStepperStep')
  private isStepComplete(stepNumber: string): boolean {
    return stepNumber < (Steps.currentStep?.stepNumber as string);
  }

  @Watch('getCurrentStepperStep')
  private isSubstepComplete(stepName: string): boolean {
    return Steps.stepMap.get(stepName)?.completed as boolean;
  }

  private hasSubSteps(step: StepperStep) {
    return (
      Object.prototype.hasOwnProperty.call(step, "subSteps") &&
      step.subSteps?.length
    );
  }

  private getIdText(string: string) {
    return getIdText(string);
  }

  private getRouteName(step: StepperStep) {
    if (step.name !== "") return step.name;

    if (!this.hasSubSteps(step)) {
      throw new Error(
        `step: ${JSON.stringify(step)} doesn't have a name defined`
      );
    }

    //a stepper route with children should not have a named defined 
    // so we will use the child step name for routing
    return step.subSteps ? step.subSteps.length > 0 && step.subSteps[0].name : "";
  }
  
  private calculatePercentComplete() {
    this.percentComplete = 0;

    for(let [key, value] of Steps.stepMap){
      if(value.completed)
        this.percentComplete += value.completePercentageWeight as number;
    }
    this.percentComplete = Math.round(this.percentComplete);
  }

  public mounted(): void {
    this.calculatePercentComplete();
    this.activeStep = this.stepperData && this.stepperData.length > 0 ? 
      (this.stepperData[0].stepNumber || '') : '';
  }

  // data
  private activeStep = "";
  private percentComplete = 0;
}
</script>