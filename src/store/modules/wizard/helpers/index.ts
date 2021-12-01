import { generateUid } from "@/helpers";
import { WizardSteps } from "../types/PortfolioStepModels";

export const getStepIndex = (step: number): string => {
  const steps: Record<string, string> = {};
  steps["1"] = "stepOne";
  steps["2"] = "stepTwo";
  steps["3"] = "stepThree";
  steps["4"] = "stepFour";
  steps["5"] = "stepFive";

  return steps[`${step}`];
};

export const createStepOneModel = () => {
  return {
    model: {
      name: "",
      description: "",
      dod_components: [],
      csp: "",
    },
  };
};
export const createStepTwoModel = () => {
  return {
    id: "",
    task_order_number: "",
    task_order_file: {
      description: "",
      id: "",
      crated_at: "",
      updated_at: "",
      size: 0,
      name: "",
      status: "",
    },
    clins: [
      {
        clin_number: "",
        idiq_clin: "",
        total_clin_value: 0,
        obligated_funds: 0,
        pop_start_date: "",
        pop_end_date: "",
      },
    ],
  };
};

export const createStepThreeModel = () => {
  return {
    id: "",
    name: "",
    description: "",
    operators: [],
    environments: [
      {
        name: "Development",
        id: generateUid(),
        operators: [],
      },
      {
        name: "Testing",
        id: generateUid(),
        operators: [],
      },
      {
        name: "Staging",
        id: generateUid(),
        operators: [],
      },
      {
        name: "Production",
        id: generateUid(),
        operators: [],
      },
    ],
  };
};

export const createStepFourModel = () => {
  return {};
};

export const createStepFiveModel = () => {
  return {};
};

export const stepsModelInitializers = [
  createStepOneModel,
  createStepTwoModel,
  createStepThreeModel,
  createStepFourModel,
  createStepFiveModel,
];
