import { generateUid } from "@/helpers";

export const getStepIndex = (step: number): number => {
  return step - 1;
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

export const stepModelHasData = (
  stepModel: any,
  initialModel: any
): unknown => {
  return JSON.stringify(stepModel) !== JSON.stringify(initialModel);
};

export const stepsModelInitializers: Array<any> = [
  createStepOneModel,
  createStepTwoModel,
  createStepThreeModel,
  createStepFourModel,
  createStepFiveModel,
];

export const getStepModel = (stepNumber: number): any => {
  const modelCreator = stepsModelInitializers[stepNumber - 1];

  return modelCreator();
};


