/* eslint-disable camelcase */
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import {
  AcorsRouteResolver,
  BVTOResolver,
  EvalPlanRouteResolver,
  EvalPlanDetailsRouteResolver,
  CurrentlyHasFundingResolver
} from "./index"
import * as exportedSummaryStoreFunctions from "@/store/summary"
import { routeNames } from "@/router/stepper"
import Vue from "vue";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import Summary from "@/store/summary";

const aq = {
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
  fair_opportunity: "",
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
  const legitPeriod = [
    {
      "period_unit": "YEAR",
      "period_unit_count": "1",
      "period_type": "BASE",
      "option_order": "1"
    }
  ]
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

  describe("Evaluation Plan Resolvers", () => {
    it ("EvalPlanRouteResolver() - routes to SummaryStepTwo", async () => {
      jest.spyOn(exportedSummaryStoreFunctions, "isStepTouched").mockReturnValue(true)
      expect(EvalPlanRouteResolver(routeNames.CertificationPOCs)).toBe(routeNames.SummaryStepTwo)
    });

    it ("EvalPlanRouteResolver() - routes to CreateEvalPlan page", async () => {
      jest.spyOn(exportedSummaryStoreFunctions, "isStepTouched").mockReturnValue(false)
      expect(EvalPlanRouteResolver(routeNames.SummaryStepTwo)).toBe(routeNames.CreateEvalPlan)
    });

    it ("BVTOResolver() - routes to BVTO page", async () => {
      await EvaluationPlan.setEvaluationPlan(
        { source_selection: "", method: "BVTO" }
      );
      const route = BVTOResolver(routeNames.EvalPlanDetails);
      expect(route).toBe(routeNames.Differentiators);
    });
    it ("BVTOResolver() - routes to Summary page when not BVTO method", async () => {
      await EvaluationPlan.setEvaluationPlan(
        { source_selection: "", method: "LPTA" }
      );
      const route = BVTOResolver(routeNames.EvalPlanDetails);
      expect(route).toBe(routeNames.SummaryStepTwo);
    });

    it ("BVTOResolver() - routes to EvalPlanSummary page", async () => {
      await EvaluationPlan.setEvaluationPlan(
        { source_selection: "", method: "" }
      );
      const route = BVTOResolver(routeNames.EvalPlanDetails);
      expect(route).toBe(routeNames.SummaryStepTwo);
    });

    
    it ("EvalPlanDetailsRouteResolver() - routes to EvalPlan page", async () => {
      expect(EvalPlanDetailsRouteResolver(routeNames.CreateEvalPlan))
        .toBe(routeNames.SummaryStepTwo);
    });

  });

  describe("FundingStep Resolvers", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      aq.contracting_shop_require_funding_documents_for_submission_of_package = '';
      aq.contracting_shop = '';
      Summary.hasCurrentStepBeenVisited = false;
    });

    // eslint-disable-next-line max-len
    it('should return SummaryStepEight when current is RFD and doesNotNeedFundingDoc is true', async () => {
      aq.contracting_shop_require_funding_documents_for_submission_of_package = "NO";
      await AcquisitionPackage.setAcquisitionPackage(aq);
      const result = CurrentlyHasFundingResolver(routeNames.RFD);
      expect(result).toBe(routeNames.SummaryStepEight);

    });

    it('should return SummaryStepEight when hasCurrentStepBeenVisited is true', () => {
      Summary.hasCurrentStepBeenVisited = true;
      const result = CurrentlyHasFundingResolver('any-other-route');
      expect(result).toBe(routeNames.SummaryStepEight);
    });

    it('should return CurrentlyHasFunding when user is not a DITCO user', async () => {
      await AcquisitionPackage.setAcquisitionPackage(aq);
      const result = CurrentlyHasFundingResolver('any-other-route');
      expect(result).toBe(routeNames.CurrentlyHasFunding);
    });

    it('should return RFD when user is a DITCO user', async () => {
      aq.contracting_shop = "DITCO";
      await AcquisitionPackage.setAcquisitionPackage(aq);
      const result = CurrentlyHasFundingResolver('any-other-route');
      expect(result).toBe(routeNames.RFD);
    });
  })
});
