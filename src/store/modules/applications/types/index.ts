import { ApplicationModel, OperatorModel } from "types/Portfolios";

export default interface ApplicationsState {
  applicationModels: ApplicationModel[];
  portfolioOperators: OperatorModel[];
  currentApplicationId: string;
  portfolioHasHadMembersAdded: boolean;
}
