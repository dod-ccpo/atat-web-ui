import { EnvironmentModel } from "types/Portfolios";

export interface PortfolioStep {
  step: number;
  description: string;
  touched: boolean;
  valid: boolean;
  model: any;
}

export interface StepOneModel {
  name: string;
  description: string;
  dod_components: string[];
  csp: string;
}

export interface StepTwoModel {
  index: number; //local guid
  task_order_number: string;
  task_order_file: {
    description: string;
    id: string;
    created_at: string;
    updated_at: string;
    size: number;
    name: string;
    status: string;
  };
  clins: Array<any>;
}

export interface StepThreeModel {
  id: string;
  name: string;
  description: string;
  operators: Array<any>;
  environments: EnvironmentModel[];
}

export const WizardSteps = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
};
