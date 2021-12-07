import { PortfolioStep } from "./PortfolioStepModels";

export type PortfolioSteps = { [key: number]: PortfolioStep };

export interface WizardState {
  portfolioSteps: PortfolioSteps;
  erroredSteps: number[];
  currentStepNumber: number;
  currentStepModel: any;
  currentPortfolioId: string;
  membersModified: boolean;
  currentApplicationId: string;
  returnToReview: boolean;
  arrivedFromStep5: boolean;
}
