/* eslint-disable camelcase */
import AcquisitionPackage, { AcquisitionPackageStore } from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { config } from '@vue/test-utils';
import IGCEStore from "@/store/IGCE";
import Vuex from "vuex";
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

let apMutations = {
  contracting_shop_require_funding_documents_for_submission_of_package: jest.fn()
}
let apStore = new Vuex.Store({
  mutations: apMutations
})

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
      
    it ("CurrentlyHasFundingResolver() - routes to SummaryStepEight", async () => {
      jest.spyOn(AcquisitionPackage,'loadData').mockImplementation(
        ()=>Promise.resolve({
          "contracting_shop_require_funding_documents_for_submission_of_package":"NO"
        })
      )
      Vue.nextTick(()=>{
        expect(CurrentlyHasFundingResolver(routeNames.RFD))
            .toBe(routeNames.CurrentlyHasFunding);
      })
    });
  });
})
