import { Component } from "vue-property-decorator";
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import { WizardState, PortfolioSteps } from "@/store/modules/wizard/types";
// import {
//   ApplicationModel,
//   EnvironmentModel,
//   OperatorModel,S
// } from "types/Portfolios";

const namespace = "wizard";

/**
 * Mixin to encapsulate application store module data
 */
@Component({})
export default class WizardModuleData extends Vue {
  @State(namespace) wizardState!: WizardState;
  @Action("setReturnToReview", { namespace }) setReturnToReview!: (
    shouldReturn: boolean
  ) => void;
  @Action("setCurrentStepNumber", { namespace }) setCurrentStepNumber!: (
    stepNumber: number
  ) => void;
  @Getter("portfolioSteps", { namespace }) portfolioSteps!: PortfolioSteps;
  @Getter("erroredSteps", { namespace }) erroredSteps!: number[];
}
