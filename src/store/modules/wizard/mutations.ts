import Vue from "vue";
import { MutationTree } from "vuex";
import { getStepModel, stepsModelInitializers } from "./helpers";
import { WizardState } from "./types";

const setStepValidated = (state: WizardState, step: number): void => {
  state.erroredSteps = state.erroredSteps.filter((es) => es !== step);
};

const setCurrentStepNumber = (state: WizardState, step: number): void => {
  const portfolioStep = state.portfolioSteps[step];
  setCurrentStepModel(state, portfolioStep.model);
};

const setCurrentStepModel = (state: WizardState, model: any): void => {
  state.currentStepModel = { ...model };
};

const saveStepModel = (
  state: WizardState,
  {
    model,
    stepNumber,
    valid,
  }: { model: any; stepNumber: number; valid: boolean }
): void => {
  Vue.set(state.portfolioSteps[stepNumber], "model", model);
  Vue.set(state.portfolioSteps[stepNumber], "valid", valid);
  Vue.set(state.portfolioSteps[stepNumber], "touched", true);

  const es: number[] = state.erroredSteps;
  const erroredStepIndex = es.indexOf(stepNumber);
  if (erroredStepIndex > -1 && valid) {
    es.splice(erroredStepIndex, 1);
  } else if (erroredStepIndex === -1 && !valid) {
    es.push(stepNumber);
  }
};

const initializeStepModel = (state: WizardState, stepNumber: number): void => {
  const modelCreator = getStepModel(stepNumber);
  Vue.set(state.portfolioSteps[stepNumber], "model", modelCreator());
  Vue.set(state.portfolioSteps[stepNumber], "valid", true);
  Vue.set(state.portfolioSteps[stepNumber], "touched", false);
};

const updateStepModelValidity = (
  state: WizardState,
  { stepNumber, valid }: { stepNumber: number; valid: boolean }
): void => {
  Vue.set(state.portfolioSteps[stepNumber], "valid", valid);
  Vue.set(state.portfolioSteps[stepNumber], "touched", true);

  const es: number[] = state.erroredSteps;
  const erroredStepIndex = es.indexOf(stepNumber);
  if (erroredStepIndex > -1 && valid) {
    es.splice(erroredStepIndex, 1);
  } else if (erroredStepIndex === -1 && !valid) {
    es.push(stepNumber);
  }
};

const setStepTouched = (
  state: WizardState,
  { stepNumber, isTouched }: { stepNumber: number; isTouched: boolean }
): void => {
  Vue.set(state.portfolioSteps[stepNumber], "touched", isTouched);
};

const initializeSteps = (state: WizardState): void => {
  stepsModelInitializers.forEach((initializer, index) => {
    const stepKey = index + 1;
    Vue.set(state.portfolioSteps[stepKey], "model", initializer());
    Vue.set(state.portfolioSteps[stepKey], "valid", true);
    Vue.set(state.portfolioSteps[stepKey], "touched", false);
  });

  const es: number[] = state.erroredSteps;
  es.splice(0, es.length);
};

const updateMembersModified = (state: WizardState, added: boolean): void => {
  state.membersModified = added;
};

const setCurrentPortfolioId = (state: WizardState, id: string): void => {
  state.currentPortfolioId = id;
};

const setReturnToReview = (state: WizardState, shouldReturn: boolean): void => {
  state.returnToReview = shouldReturn;
};

export const mutations: MutationTree<WizardState> = {
  setStepValidated,
  setCurrentStepNumber,
  saveStepModel,
  initializeStepModel,
  updateStepModelValidity,
  setStepTouched,
  initializeSteps,
  updateMembersModified,
  setCurrentPortfolioId,
  setReturnToReview,
};
