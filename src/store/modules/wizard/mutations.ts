import Vue from "vue";
import { MutationTree } from "vuex";
import { getStepIndex, stepsModelInitializers } from "./helpers";
import WizardState from "./types";

const setStepValidated = (state: WizardState, step: number): void => {
  state.erroredSteps = state.erroredSteps.filter((es) => es !== step);
};

const setCurrentStepNumber = (state: WizardState, step: number): void => {
  state.currentStepNumber = step;
  const portfolioStep = state.portfolioSteps[getStepIndex(step)];
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
  const stepKey = getStepIndex(stepNumber);
  Vue.set(state.portfolioSteps[stepKey], "model", model);
  Vue.set(state.portfolioSteps[stepKey], "valid", valid);
  Vue.set(state.portfolioSteps[stepKey], "touched", true);

  const es: number[] = state.erroredSteps;
  const erroredStepIndex = es.indexOf(stepNumber);
  if (erroredStepIndex > -1 && valid) {
    es.splice(erroredStepIndex, 1);
  } else if (erroredStepIndex === -1 && !valid) {
    es.push(stepNumber);
  }
};

const initializeStepModel = (state: WizardState, stepNumber: number): void => {
  const stepModelIndex = stepNumber - 1;
  const modelCreator = stepsModelInitializers[stepModelIndex];
  Vue.set(state.portfolioSteps[stepModelIndex], "model", modelCreator());
  Vue.set(state.portfolioSteps[stepModelIndex], "valid", true);
  Vue.set(state.portfolioSteps[stepModelIndex], "touched", false);
};

const updateStepModelValidity = (
  state: WizardState,
  {
    stepNumber,
    stepIndex,
    valid,
  }: { stepNumber: number; stepIndex: number; valid: boolean }
): void => {
  Vue.set(state.portfolioSteps[stepIndex], "valid", valid);
  Vue.set(state.portfolioSteps[stepIndex], "touched", true);

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
  { stepIndex, isTouched }: { stepIndex: number; isTouched: boolean }
): void => {
  const stepKey = getStepIndex(stepIndex);
  Vue.set(state.portfolioSteps[stepKey], "touched", isTouched);
};

const initializeSteps = (state: WizardState): void => {
  stepsModelInitializers.forEach((initializer, index) => {
    Vue.set(state.portfolioSteps[index], "model", initializer());
    Vue.set(state.portfolioSteps[index], "valid", true);
    Vue.set(state.portfolioSteps[index], "touched", false);
  });

  //todo: make sure this is right
  //   //clear out task order models
  //   Vue.set(state, "taskOrderModels", []);

  const es: number[] = state.erroredSteps;
  es.splice(0, es.length);
};

const updateMembersModified = (state: WizardState, added: boolean): void => {
  state.membersModified = added;
};

const setCurrentPortfolioId = (state: WizardState, id: string): void => {
  state.currentPortfolioId = id;
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
};
