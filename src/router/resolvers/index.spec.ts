/* eslint-disable camelcase */
import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import IGCEStore from "@/store/IGCE";
import Periods from "@/store/periods";
import { 
  AcorsRouteResolver,
  BVTOResolver,
  CreateEvalPlanRouteResolver,
  EvalPlanSummaryRouteResolver,
  IGCECannotProceedResolver, 
  IGCEGatherPriceEstimatesResolver, 
  IGCESupportingDocumentationResolver, 
  IGCESurgeCapabilities,
  NoEvalPlanRouteResolver,

} from "../resolvers/index"
import { routeNames } from "@/router/stepper"
import Vue from "vue";

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
      expect(route).toBe(routeNames.AcqPackageSummary);
    });

    it ("AcorsRouteResolver() - routes to 'has ACOR' question page", async () => {
      await AcquisitionPackage.setHasAlternateCOR(false);
      const route = AcorsRouteResolver(routeNames.AcqPackageSummary);
      expect(route).toBe(routeNames.AlternateCor);
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
    it ("CreateEvalPlanRouteResolver() - routes to Create Eval Plan page", async () => {
      await AcquisitionPackage.setFairOpportunity(
        { exception_to_fair_opportunity: "NO_NONE" }
      );
      const route = CreateEvalPlanRouteResolver(routeNames.Exceptions);
      expect(route).toBe(routeNames.CreateEvalPlan);
    });

    it ("CreateEvalPlanRouteResolver() - routes to No Eval Plan Needed page", async () => {
      await AcquisitionPackage.setFairOpportunity(
        { exception_to_fair_opportunity: "foo" }
      );
      const route = CreateEvalPlanRouteResolver(routeNames.Exceptions);
      expect(route).toBe(routeNames.NoEvalPlan);
    });

    it ("CreateEvalPlanRouteResolver() - routes to Fair Opportunity Exceptions page", async () => {
      await AcquisitionPackage.setFairOpportunity(
        { exception_to_fair_opportunity: "foo" }
      );
      const route = CreateEvalPlanRouteResolver(routeNames.NoEvalPlan);
      expect(route).toBe(routeNames.Exceptions);
    });

    it ("EvalPlanSummaryRouteResolver() - routes to Fair Opportunity Exceptions page", async () => {
      const route = EvalPlanSummaryRouteResolver(routeNames.NoEvalPlan);
      expect(route).toBe(routeNames.Exceptions);
    });

    it ("EvalPlanSummaryRouteResolver() - routes to Eval Plan Summary page", async () => {
      const route = EvalPlanSummaryRouteResolver("foo");
      expect(route).toBe(routeNames.EvalPlanSummary);
    });

    it ("NoEvalPlanRouteResolver() - routes to Current Contract", async () => {
      await AcquisitionPackage.setFairOpportunity(
        { exception_to_fair_opportunity: "NO_NONE" }
      );
      const route = NoEvalPlanRouteResolver(routeNames.EvalPlanSummary);
      expect(route).toBe(routeNames.CurrentContract);
    });

    it ("NoEvalPlanRouteResolver() - routes to Eval Plan Summary page", async () => {
      await AcquisitionPackage.setFairOpportunity(
        { exception_to_fair_opportunity: "NO_NONE" }
      );
      const route = NoEvalPlanRouteResolver(routeNames.CurrentContract);
      expect(route).toBe(routeNames.EvalPlanSummary);
    });

    it ("NoEvalPlanRouteResolver() - routes to No Eval Plan Needed page", async () => {
      await AcquisitionPackage.setFairOpportunity(
        { exception_to_fair_opportunity: "foo" }
      );
      const route = NoEvalPlanRouteResolver(routeNames.CurrentContract);
      expect(route).toBe(routeNames.NoEvalPlan);
    });

    it ("BVTOResolver() - routes to BVTO page", async () => {
      await AcquisitionPackage.setEvaluationPlan(
        { source_selection: "", method: "BVTO" }
      );
      const route = BVTOResolver(routeNames.EvalPlanDetails);
      expect(route).toBe(routeNames.ProposalRequiredBVTO);
    });
    it ("BVTOResolver() - routes to Summary page when not BVTO method", async () => {
      await AcquisitionPackage.setEvaluationPlan(
        { source_selection: "", method: "LPTA" }
      );
      const route = BVTOResolver(routeNames.EvalPlanDetails);
      expect(route).toBe(routeNames.EvalPlanSummary);
    });

    it ("BVTOResolver() - routes to EvalPlanSummary page", async () => {
      await AcquisitionPackage.setEvaluationPlan(
        { source_selection: "", method: "" }
      );
      const route = BVTOResolver(routeNames.EvalPlanDetails);
      expect(route).toBe(routeNames.EvalPlanSummary);
    });

    it ("BVTOResolver() - routes to EvalPlanDetails page", async () => {
      await AcquisitionPackage.setEvaluationPlan(
        { source_selection: "", method: "" }
      );
      const route = BVTOResolver(routeNames.EvalPlanSummary);
      expect(route).toBe(routeNames.EvalPlanDetails);
    });

  });

  describe("IGCE Resolvers", ()=>{
    it("IGCESurgeCapabilities('Create_Price_Estimate') returns routeNames.FeeCharged", 
      async () => {
        IGCEStore.surgeRequirements.capacity = "NO";
        const newRoute = await IGCESurgeCapabilities("Surge_Capacity");
        expect(newRoute).toBe("Fee_Charged");
      });

    it("IGCESurgeCapabilities('Fee_Charged') returns routeNames.SurgeCapacity", 
      async () => {
        IGCEStore.surgeRequirements.capacity = "NO";
        const newRoute = await IGCESurgeCapabilities("Fee_Charged");
        expect(newRoute).toBe("Surge_Capacity");
      });

    it("IGCESurgeCapabilities('Fee_Charged') returns routeNames.SurgeCapabilities", 
      async () => {
        IGCEStore.surgeRequirements.capacity = "YES";
        const newRoute = await IGCESurgeCapabilities("Fee_Charged");
        expect(newRoute).toBe("SurgeCapabilities");
      });


    it("IGCECannotProceedResolver('Create_Price_Estimate') returns routeNames.CannotProceed", 
      async () => {
        const newRoute = await IGCECannotProceedResolver("Create_Price_Estimate");
        expect(newRoute).toBe("Cannot_Proceed");
      });

    it("IGCECannotProceedResolver('Create_Price_Estimate') with expected criteria to return " +
        "routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCECannotProceedResolver("Create_Price_Estimate");
      expect(newRoute).toBe("Gather_Price_Estimates");
    });

    it("IGCECannotProceedResolver('Gather_Price_Estimates') with expected criteria to return " +
        "routeNames.CreatePriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCECannotProceedResolver("Gather_Price_Estimates");
      expect(newRoute).toBe("Create_Price_Estimate");
    });

    it("IGCEGatherPriceEstimatesResolver('Travel_Estimates') returns " +
        "routeNames.CannotProceed", 
    async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCEGatherPriceEstimatesResolver("Travel_Estimates");
      expect(newRoute).toBe("Gather_Price_Estimates");
    });

    it("IGCEGatherPriceEstimatesResolver('Gather_Price_Estimates') with " +
        "expected criteria to return routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCEGatherPriceEstimatesResolver("Gather_Price_Estimates");
      expect(newRoute).toBe("Create_Price_Estimate");
    });

    it("IGCEGatherPriceEstimatesResolver('Gather_Price_Estimates') with  " +
    "expected criteria to return routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(true);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCEGatherPriceEstimatesResolver("Gather_Price_Estimates");
      expect(newRoute).toBe("Funding_Plan_Type");
    });

    it("IGCESupportingDocumentationResolver('Funding_Plan_Type') " +
        "returns routeNames.CannotProceed", 
    async () => {
      const newRoute = await IGCESupportingDocumentationResolver("Funding_Plan_Type");
      expect(newRoute).toBe("Cannot_Proceed");
    });

    it("IGCESupportingDocumentationResolver('Funding_Plan_Type') with expected " +
        "criteria to return routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCESupportingDocumentationResolver("Funding_Plan_Type");
      expect(newRoute).toBe("Estimates_Developed");
    });
    it("IGCESupportingDocumentationResolver('Funding_Plan_Type') with expected " +
    "criteria to return routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      IGCEStore.setHasDOWandPop();
      const newRoute = await IGCESupportingDocumentationResolver("Funding_Plan_Type");
      expect(newRoute).toBe("Estimates_Developed");
    });


  })

})
