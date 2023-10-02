/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import AcquisitionPackage, { 
  AcquisitionPackageStore, 
  initialEvaluationPlan 
} from "@/store/acquisitionPackage/index";
import { EvaluationPlanDTO } from "@/api/models";
import Vue from "vue";
import { EvalPlanMethod, EvalPlanSourceSelection } from "types/Global";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("AcquisitionPackage Store", () => {
  let acqPackageStore: AcquisitionPackageStore;

  const initialEvalPlan: EvaluationPlanDTO = {
    source_selection: "",
    method: "",
    standard_specifications: "",
    custom_specifications: "",    
  }

  const evalPlanPopulated: EvaluationPlanDTO = {
    source_selection: "TECH_PROPOSAL",
    method: "BVTO",
    standard_specifications: "",
    custom_specifications: "",    
  } 

  beforeEach(() => {
    const createStore = (storeOptions = {}): Store<{ 
      AcquisitionPackageStore: AcquisitionPackageStore 
    }> => 
      new Vuex.Store({ ...storeOptions });
    acqPackageStore = getModule(AcquisitionPackageStore, createStore());
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  // it("initialize() - initializes core data", async () => {
  //   await acqPackageStore.initialize();
  //   expect(acqPackageStore.initialized).toBeTruthy();
  // });

  it("initialEvaluationPlan - returns empty eval plan object", async () => {
    const evalPlan: EvaluationPlanDTO = initialEvaluationPlan();
    expect(evalPlan.source_selection).toBe("");
  });

  it("setEvaluationPlan() initializes eval plan data ", async () => {  
    await acqPackageStore.setEvaluationPlan(initialEvalPlan);
    expect(acqPackageStore.evaluationPlan).not.toBeNull;
  })

  it("setEvaluationPlan() updates eval plan data ", async () => {  
    await acqPackageStore.setEvaluationPlan(initialEvalPlan);
    expect(acqPackageStore.evaluationPlan).not.toBeNull;
    expect(acqPackageStore.evaluationPlan?.source_selection).toBe("");

    await acqPackageStore.setEvaluationPlan(evalPlanPopulated);
    expect(acqPackageStore.evaluationPlan?.source_selection).toBe("TECH_PROPOSAL");
  })

  it("getEvaluationPlan() returns eval plan data ", async () => {  
    await acqPackageStore.setEvaluationPlan(evalPlanPopulated);
    expect(acqPackageStore.evaluationPlan).not.toBeNull;
    const evalPlan = acqPackageStore.getEvaluationPlan;
    expect(evalPlan?.source_selection).toBe("TECH_PROPOSAL");
  });

});
