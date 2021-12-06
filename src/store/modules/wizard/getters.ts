import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import { WizardState } from "./types";
import { WizardSteps } from "./types/PortfolioStepModels";

export const getters: GetterTree<WizardState, RootState> = {
  getInvalidSteps(state) {
    const invalidSteps: number[] = [];
    for (const key in state.portfolioSteps) {
      const step = state.portfolioSteps[key];
      if (step.step < 5 && (step.touched === false || step.valid === false)) {
        invalidSteps.push(step.step);
      }
    }
    return invalidSteps;
  },
  getStepModel: (state) => (stepNumber: number) => {
    return state.portfolioSteps[stepNumber].model;
  },
  getStepTouched: (state) => (stepNumber: number) => {
    return state.portfolioSteps[stepNumber].touched;
  },
  getPortfolio: (state) => state.portfolioSteps[WizardSteps.One].model,
  isStepErrored:
    (state) =>
    (stepNumber: number): boolean => {
      const es: number[] = state.erroredSteps;
      const i = es.indexOf(stepNumber);
      return i > -1;
    },
  membersModified: (state) => {
    return state.membersModified;
  },
  isStepTouched:
    (state) =>
    (stepNumber: number): boolean => {
      return state.portfolioSteps[stepNumber].touched;
    },
  getPortfolioName: (state, getters) => (defaultResponse: string) => {
    defaultResponse = defaultResponse || "this portfolio";
    let pName = defaultResponse;
    const portfolio = getters.getPortfolio;
    if (portfolio) {
      if (Object.prototype.hasOwnProperty.call(portfolio, "name")) {
        pName = portfolio.name || pName;
      }
      if (
        pName === defaultResponse &&
        Object.prototype.hasOwnProperty.call(portfolio, "model")
      ) {
        if (Object.prototype.hasOwnProperty.call(portfolio, "name")) {
          pName = portfolio.model.name || pName;
        }
      }
    }
    return pName;
  },
  isReturnToReview: (state) => {
    return state.returnToReview;
  },
  portfolioSteps: (state) => {
    return state.portfolioSteps;
  },
  erroredSteps: (state) => {
    return state.erroredSteps;
  },
};
