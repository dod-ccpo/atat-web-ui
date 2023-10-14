/* eslint-disable camelcase */
/* eslint-disable max-len */
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import {
  AcorsRouteResolver,
  BVTOResolver,
  EvalPlanDetailsRouteResolver,
  CurrentlyHasFundingResolver, GTCInformationResolver, Upload7600Resolver
} from "./index"
import { routeNames } from "@/router/stepper"
import Vue from "vue";
import Summary from "@/store/summary";
import FinancialDetails from "@/store/financialDetails";

const acquisitionPackage = {
  acor: "",
  classification_level: "",
  contract_award: "",
  contract_considerations: "",
  contract_type: "",
  contracting_shop: "",
  cor: "",
  current_contract_and_recurring_information: "",
  current_environment: "",
  customer_feedback: "",
  docgen_job_status: "",
  docusign_envelope_id: "",
  environment_instance: "",
  fair_opportunity: {},
  funding_plans: "",
  funding_requirement: "",
  gfe_overview: "",
  is_travel_needed: "",
  number: "",
  organization: "",
  owner_needs_email_package_ready_to_submit: false,
  period_of_performance: "",
  periods: "",
  primary_contact: "",
  project_overview: "",
  required_services: "",
  sensitive_information: "",
  status: "",
  contracting_shop_require_funding_documents_for_submission_of_package: ''
};
jest.mock('@/store/summary', () => ({
  Summary: {
    hasCurrentStepBeenVisited: false,
  },
}));

describe("testing route resolvers", () => {
  afterEach(()=>{
    // reset periodOfPerformance and DOW back to incomplete
    Periods.setPeriods([]);
    DescriptionOfWork.setIsIncomplete(true);
  })
  
  describe("ACORs Resolvers", () => {
    it ("AcorsRouteResolver() - routes to acquisition package summary", async () => {
      await AcquisitionPackage.setHasAlternateCOR(false);
      const route = AcorsRouteResolver(routeNames.AlternateCor);
      expect(route).toBe(routeNames.SummaryStepOne);
    });

    it ("AcorsRouteResolver() - routes to 'has ACOR' question page", async () => {
      await AcquisitionPackage.setHasAlternateCOR(false);
      const route = AcorsRouteResolver(routeNames.AcqPackageSummary);
      expect(route).toBe(routeNames.AcorInformation);
    });

    it ("AcorsRouteResolver() - routes to ACOR info form", async () => {
      await AcquisitionPackage.setHasAlternateCOR(true);
      const route = AcorsRouteResolver(routeNames.AcqPackageSummary);
      Vue.nextTick(() => {
        expect(route).toBe(routeNames.AcorInformation);
      })
    });
  });

  describe("Evaluation Plan Resolvers", () => {
    it ("EvalPlanDetailsRouteResolver() - routes to EvalPlan page", async () => {
      expect(EvalPlanDetailsRouteResolver(routeNames.CreateEvalPlan))
        .toBe(routeNames.SummaryStepTwo);
    });
  });

  describe("FundingStep Resolvers", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      acquisitionPackage.contracting_shop_require_funding_documents_for_submission_of_package = '';
      acquisitionPackage.contracting_shop = '';
      Summary.hasCurrentStepBeenVisited = false;
    });

    it('should return SummaryStepEight when current is RFD and doesNotNeedFundingDoc is true', async () => {
      acquisitionPackage.contracting_shop_require_funding_documents_for_submission_of_package = "NO";
      await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
      const result = CurrentlyHasFundingResolver(routeNames.RFD);
      expect(result).toBe(routeNames.SummaryStepEight);
    });

    it('should return SummaryStepEight when hasCurrentStepBeenVisited is true', () => {
      Summary.hasCurrentStepBeenVisited = true;
      const result = CurrentlyHasFundingResolver('any-other-route');
      expect(result).toBe(routeNames.SummaryStepEight);
    });

    it('should return CurrentlyHasFunding when user is not a DITCO user', async () => {
      await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
      const result = CurrentlyHasFundingResolver('any-other-route');
      expect(result).toBe(routeNames.CurrentlyHasFunding);
    });

    it('should return RFD when user is a DITCO user', async () => {
      acquisitionPackage.contracting_shop = "DITCO";
      await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
      const result = CurrentlyHasFundingResolver('any-other-route');
      expect(result).toBe(routeNames.RFD);
    });
  });

  describe('GTCInformationResolver', () => {
    beforeEach(() => {
      FinancialDetails.setHasFunding('');
    });

    it('should return GTC route if FinancialDetails has funding', async () => {
      await FinancialDetails.setHasFunding("HAS_FUNDING");
      const result = GTCInformationResolver('anyRoute');
      expect(result).toBe(routeNames.GTC);
    });

    it('should return GeneratingPackageDocumentsFunding if current route is not GeneratingPackageDocumentsFunding and no funding', async () => {
      await FinancialDetails.setHasFunding("HAS_FUNDING");
      const result = GTCInformationResolver(routeNames.CurrentlyHasFunding);
      expect(result).toBe(routeNames.GTC);
    });

    it('should return CurrentlyHasFunding if current route is GeneratingPackageDocumentsFunding and no funding', () => {
      const result = GTCInformationResolver(routeNames.CurrentlyHasFunding);
      expect(result).toBe(routeNames.GeneratingPackageDocumentsFunding);
    });
  });

  describe('Upload7600Resolver', () => {
    beforeEach(() => {
      FinancialDetails.setHasFunding('');
    });

    it('should return MIPR route if current is FundingPlanType and fundingRequestType returns "MIPR"', async () => {
      const fundingRequest = {
        funding_request_type: 'MIPR'
      };
      await FinancialDetails.setFundingRequest(fundingRequest)
      expect(Upload7600Resolver(routeNames.FundingPlanType)).toBe(routeNames.MIPR);
    });

    it('should return Upload7600 route if current is FundingPlanType and fundingRequestType does not return "MIPR"', async () => {
      const fundingRequest = {
        funding_request_type: 'NOT_MIPR'
      };
      await FinancialDetails.setFundingRequest(fundingRequest)
      expect(Upload7600Resolver(routeNames.FundingPlanType)).toBe(routeNames.Upload7600);
    });

    it('returns GTC when current is SeverabilityAndIncrementalFunding', () => {
      const result = Upload7600Resolver(routeNames.SeverabilityAndIncrementalFunding);
      expect(result).toBe(routeNames.GTC);
    });

    it('returns GTC when current is AppropriationOfFunds', () => {
      const result = Upload7600Resolver(routeNames.AppropriationOfFunds);
      expect(result).toBe(routeNames.GTC);
    });

    it('returns AppropriationOfFunds when there is an exception to fair opp', async () => {
      acquisitionPackage.fair_opportunity = {exception_to_fair_opportunity: "NO_NONE"};
      await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
      const result = Upload7600Resolver('someOtherRoute'); // this can be any route that's not in the ones explicitly mentioned
      expect(result).toBe(routeNames.AppropriationOfFunds);
    });
  });
});
