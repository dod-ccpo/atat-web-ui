/* eslint-disable camelcase */
/* eslint-disable max-len */
jest.mock('@/store/acquisitionPackage', () => ({
  fairOpportunity: { exception_to_fair_opportunity: "MOCK_VALUE" }
}));

import { AppropriationOfFundsResolver } from '@/router/resolvers';
import Summary from "@/store/summary";
import { routeNames } from "@/router/stepper"
import AcquisitionPackage from "@/store/acquisitionPackage";

describe('AppropriationOfFundsResolver', () => {
  beforeEach(() => {
    Summary.setHasCurrentStepBeenVisited = jest.fn();
  });

  it('returns routeNames.AppropriationOfFunds when hasExceptionToFairOpp is true', () => {
    AcquisitionPackage.fairOpportunity.exception_to_fair_opportunity = "SOME_EXCEPTION";
    expect(AppropriationOfFundsResolver('someRoute')).toBe(routeNames.AppropriationOfFunds);
    expect(Summary.setHasCurrentStepBeenVisited).toHaveBeenCalled();
  });

  it('returns routeNames.SummaryStepEight when evalPlanRequired is true', () => {
    AcquisitionPackage.fairOpportunity.exception_to_fair_opportunity = "NO_NONE";
    expect(AppropriationOfFundsResolver('someRoute')).toBe(routeNames.SummaryStepEight);
    expect(Summary.setHasCurrentStepBeenVisited).toHaveBeenCalled();
  });

  it('returns routeNames.SeverabilityAndIncrementalFunding based on current value when neither condition is met', () => {
    AcquisitionPackage.fairOpportunity.exception_to_fair_opportunity = "";
    expect(AppropriationOfFundsResolver(routeNames.SeverabilityAndIncrementalFunding)).toBe(routeNames.SeverabilityAndIncrementalFunding);
    expect(Summary.setHasCurrentStepBeenVisited).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Resets the mocked methods
  });
});
