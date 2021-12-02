import { Module } from "vuex";
import { RootState } from "@/store/types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";
import WizardState from "./types";
import { PortfolioStep } from "./types/PortfolioStepModels";

const step1: PortfolioStep = {
  step: 1,
  description: "Create Portfolio",
  touched: false,
  valid: false,
  model: {
    name: "",
    description: "",
    dod_components: [],
    csp: "",
  },
};

const step2: PortfolioStep = {
  step: 2,
  description: "Add Funding",
  touched: false,
  valid: false,
  model: {
    index: 0, //local guid
    task_order_number: "",
    task_order_file: {
      description: "",
      id: "",
      created_at: "",
      updated_at: "",
      size: 0,
      name: "",
      status: "",
    },
    clins: [],
  },
};

const step3: PortfolioStep = {
  step: 3,
  description: "Add Application",
  touched: false,
  valid: false,
  model: {},
};

const step4: PortfolioStep = {
  step: 4,
  description: "Add Team Members",
  touched: false,
  valid: false,
  model: {},
};

const step5: PortfolioStep = {
  step: 5,
  description: "Review and Submit",
  touched: false,
  valid: false,
  model: {},
};

const portfolioSteps: Record<string, PortfolioStep> = {
  "1": step1,
  "2": step2,
  "3": step3,
  "4": step4,
  "5": step5,
};

const state: WizardState = {
  portfolioSteps: portfolioSteps,
  erroredSteps: [],
  currentStepNumber: 0,
  currentStepModel: undefined,
  currentPortfolioId: "",
  membersModified: false,
  currentApplicationId: "",
};

const wizard: Module<WizardState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default wizard;
