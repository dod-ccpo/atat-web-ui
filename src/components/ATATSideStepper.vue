<template>
  <!-- TODO: app props have been removed from v-navigation-drawer, v-app-bar and v-system-bar.   -->
  <v-navigation-drawer
    id="GlobalSideNavBar"
    :permanent="true"
    class="global-side-nav-bar d-flex flex-column align-start "
    width="320"
  >
    <!-- TODO: remove class .d-none on progress bar when progress bar logic complete -->
    <div class="_stepper-progress-bar d-none">
      <strong class="text-primary pl-1">{{ percentComplete }}%</strong>&nbsp;
      <span class="text-base">COMPLETE</span>
      <v-progress-linear
        :model-value="percentComplete"
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
          :id="'Step_' + getIdText(step.menuText ?? '')"
          :to="{ name: getRouteName(step) }"
          :class="{
            'step-complete': isStepComplete(step.stepNumber ?? ''),
            'disabled': !isStepComplete(step.stepNumber ?? '') && !canNavigate()
          }"
          class="step"
          @click.native ="setCurrentStep(
            step.stepNumber ?? '',
            step,
            false)"
        >
          <span class="step-circle">
            {{ step.stepNumber }}
            <span v-if="isStepComplete(step.stepNumber ?? '')" class="completed-check">
              <span class="d-sr-only">Completed</span>
              <v-icon>mdi-check-circle</v-icon>
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
                :id="'SubStep_' + getIdText(subStep.menuText ?? '')"
                :to="subStep.route"
                :class="{
                  'step-complete': isSubstepComplete(subStep.name),
                  'disabled': !isSubstepComplete(subStep.name) && !canNavigate()
                }"
                class="substep"
                @click="setCurrentStep(
                  subStep.stepNumber ?? '',
                  subStep,
                  false
                )"
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
                    <v-icon>mdi-check-circle</v-icon>
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
    <div class="_stepper-footer mt-15">
      <span class="_footer-title text-base">
        JWCC RESOURCES
      </span>
      <div class="_footer-content">
        <div class="d-flex align-center mb-2">
          <ATATSVGIcon class="mr-2" width="18" height="18" name="Article" color="base-light"/>
          <a
            href="https://community.hacc.mil/s/jwcc/ordering-guide"
            target="_blank"
            class="_text-link"
            id="OrderingGuide"
            rel="noopener"
          >
            <span class="_external-link">Ordering Guide</span>
          </a>
        </div>
        <div class="d-flex align-center">
          <ATATSVGIcon class="mr-2" width="18" height="18" name="Article" color="base-light"/>
          <a
            href="https://community.hacc.mil/s/jwcc/base-contract"
            target="_blank"
            class="_text-link"
            id="BaseContract"
            rel="noopener"
          > 
            <span class="_external-link">Base Contract</span>
          </a>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Prop, Watch, Vue, toNative } from "vue-facing-decorator";
import { StepperStep } from "../../types/Global";
import { getIdText } from "@/helpers";
import { StepInfo } from "@/store/steps/types";
import Steps from "@/store/steps";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Summary, { isStepValidatedAndTouched} from "@/store/summary";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  }
})
class ATATSideStepper extends Vue {
  @Prop({ default: ()=>[] })  private stepperData!: StepperStep[]

  public async setCurrentStep(
    stepNumber: string, 
    step: StepperStep, 
    isSubStep: boolean
  ): Promise<void> {
    this.activeStep = stepNumber;
    this.calculatePercentComplete();
    if (step){
      Summary.setHasCurrentStepBeenVisited(
        await isStepValidatedAndTouched(parseInt(stepNumber))
      )
    }
    if (stepNumber && !isSubStep && step && Summary.hasCurrentStepBeenVisited){
      this.navigateToSummary(step, isSubStep);
    }
  }

  public navigateToSummary(step: StepperStep, isSubStep: boolean): void {
    const lastSubStep = step.subSteps?.slice(-1)[0];
    if(lastSubStep?.menuText==="SummaryStepOne"){
      this.$router.push({
        path: step?.route + lastSubStep?.route,
        query: {
          direction: "next"
        },
      })
    }else{
      this.$router.push({
        path: lastSubStep?.route,
        query: {
          direction: "next"
        },
      })
    }
  }
  
  private get getCurrentStepperStep(): StepInfo {
    this.activeStep = Steps.currentStep?.stepNumber||"";
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

  private getRouteName(step: StepperStep): string | undefined {
    if (step.name !== "") return step.name;

    if (!this.hasSubSteps(step)) {
      throw new Error(
        `step: ${JSON.stringify(step)} doesn't have a name defined`
      );
    }

    //a stepper route with children should not have a named defined 
    // so we will use the child step name for routing
    return (step.subSteps && step.subSteps.length > 0) ? step.subSteps[0].name : undefined;
  }
  
  private calculatePercentComplete() {
    this.percentComplete = 0;
    for(const [key, value] of Steps.stepMap){
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
export default toNative(ATATSideStepper)
</script>
