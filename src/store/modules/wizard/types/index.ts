import { PortfolioStep } from "./PortfolioStepModels";

export default interface WizardState {
  portfolioSteps: Record<string, PortfolioStep>;
  erroredSteps: number[];
  currentStepNumber: number;
  currentStepModel: any;
  currentPortfolioId: string;
  membersModified: boolean;
}
