/* eslint-disable camelcase */
/* eslint-disable max-len */
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import {
  AcorsRouteResolver,
  CurrentlyHasFundingResolver, GeneratingPackageDocumentsFundingResolver,
  GTCInformationResolver,
  Upload7600Resolver
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

const fundingReq = {
  acquisition_package: "",
  funding_plan: "",
  funding_request: "",
  funds_obligated: "",
  funds_total: "",
  has_funding: "HAS_FUNDING",
  incrementally_funded: "",
  pop_start_date: "",
  pop_end_date: "",
  task_order_number: "",
  financial_poc: "",
}

jest.mock('@/store/summary', () => ({
  Summary: {
    hasCurrentStepBeenVisited: false,
  },
}));

describe("testing route resolvers", () => {
  afterEach(()=>{
    //reset periodOfPerformance and DOW back to incomplete
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

  describe("FundingStep Resolvers", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      acquisitionPackage.contracting_shop_require_funding_documents_for_submission_of_package = '';
      acquisitionPackage.contracting_shop = '';
      Summary.hasCurrentStepBeenVisited = false;
    });

    describe("CurrentlyHasFundingResolver", ()=> {
      it('returns SummaryStepEight when current is RFD and doesNotNeedFundingDoc is true',
        async () => {
          acquisitionPackage.contracting_shop_require_funding_documents_for_submission_of_package = "NO";
          await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
          const result = CurrentlyHasFundingResolver(routeNames.RFD);
          expect(result).toBe(routeNames.SummaryStepEight);
        });

      it('returns SummaryStepEight when hasCurrentStepBeenVisited is true', () => {
        Summary.hasCurrentStepBeenVisited = true;
        const result = CurrentlyHasFundingResolver('any-other-route');
        expect(result).toBe(routeNames.CurrentlyHasFunding);
      });

      it('returns CurrentlyHasFunding when user is not a DITCO user', async () => {
        await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
        const result = CurrentlyHasFundingResolver('any-other-route');
        expect(result).toBe(routeNames.CurrentlyHasFunding);
      });

      it('returns RFD when user is a DITCO user', async () => {
        acquisitionPackage.contracting_shop = "DITCO";
        await AcquisitionPackage.setAcquisitionPackage(acquisitionPackage);
        const result = CurrentlyHasFundingResolver('any-other-route');
        expect(result).toBe(routeNames.CurrentlyHasFunding);
      });
    })

    describe("GTCInformationResolver", () => {
      it('returns GTC when doesNotNeedFundingDoc is true', async () => {
        FinancialDetails.setFundingRequirement(fundingReq);
        expect(GTCInformationResolver(routeNames.CurrentlyHasFunding))
          .toBe(routeNames.GTC)
      });
    })

    describe('Upload7600Resolver', () => {
      beforeEach(() => {
        FinancialDetails.setHasFunding('');
      });
      
      it('returns MIPR route if current is FundingPlanType and fundingRequestType returns "MIPR"', async () => {
        const fundingRequest = {
          funding_request_type: 'MIPR'
        };
        await FinancialDetails.setFundingRequest(fundingRequest)
        expect(Upload7600Resolver(routeNames.FundingPlanType)).toBe(routeNames.MIPR);
      });
  
      it('returns Upload7600 route if current is FundingPlanType and fundingRequestType does not return "MIPR"', async () => {
        const fundingRequest = {
          funding_request_type: 'NOT_MIPR'
        };
        await FinancialDetails.setFundingRequest(fundingRequest);
        expect(Upload7600Resolver(routeNames.FundingPlanType)).toBe(routeNames.Upload7600);
      });

      it('returns FundingPlanType when current is MIPR', () => {
        const result = Upload7600Resolver(routeNames.MIPR);
        expect(result).toBe(routeNames.FundingPlanType);
      });

      it('returns Upload7600 for any other value of current', () => {
        const result = Upload7600Resolver('SomeRandomValue');
        expect(result).toBe(routeNames.Upload7600);
      });
    });

    describe('GeneratingPackageDocumentsFundingResolver', () => {
      it('returns SummaryStepEight when current is MIPR', () => {
        const result = GeneratingPackageDocumentsFundingResolver(routeNames.MIPR);
        expect(result).toBe(routeNames.SummaryStepEight);
      });

      it('returns GeneratingPackageDocumentsFunding for any other value of current', () => {
        const result = GeneratingPackageDocumentsFundingResolver('SomeRandomValue');
        expect(result).toBe(routeNames.GeneratingPackageDocumentsFunding);
      });
    });
  })
});