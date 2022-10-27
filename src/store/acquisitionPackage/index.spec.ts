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

  const mockPackage = {
    "fair_opportunity": "",
    "sensitive_information": "",
    "classification_level": "",
    "docusign_envelope_id": "",
    "sys_updated_on": "2022-10-27 14:25:52",
    "contract_award": "",
    "number": "ACQ0027452",
    "period_of_performance": "",
    "sys_id": "1234567890",
    "edms_folder_created": "false",
    "sys_updated_by": "eric.youngquist-ctr@ccpo.mil",
    "ditco_ko": "",
    "current_contract_and_recurring_information": "",
    "sys_created_on": "2022-10-27 14:25:52",
    "primary_reviewer": "",
    "pending_operators": "",
    "selected_service_offerings": "",
    "sys_created_by": "eric.youngquist-ctr@ccpo.mil",
    "funding_plans": "",
    "project_overview": "",
    "gfe_overview": "",
    "package_status": "DRAFT",
    "contract_considerations": "",
    "sys_mod_count": "0",
    "css_pre_award_id": "",
    "contract_modifications": "",
    "sys_tags": "",
    "mission_owners": "",
    "contract_type": "",
    "css_tracking_number": "",
    "idiq_clins": "",
    "requirements_cost_estimate": "",
    "funding_request": "",
    "secondary_reviewers": "",
    "organization": "",
    "contributors": "",
    "current_environment": ""
  }

  const initialEvalPlan: EvaluationPlanDTO = {
    source_selection: "",
    method: "",
    standard_specifications: [],
    custom_specifications: [],    
  }

  const evalPlanPopulated: EvaluationPlanDTO = {
    source_selection: "TechProposal",
    method: "BVTO",
    standard_specifications: [],
    custom_specifications: [],    
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
    expect(acqPackageStore.evaluationPlan?.source_selection).toBe("TechProposal");
  })

  it("getEvaluationPlan() returns eval plan data ", async () => {  
    await acqPackageStore.setEvaluationPlan(evalPlanPopulated);
    expect(acqPackageStore.evaluationPlan).not.toBeNull;
    const evalPlan = acqPackageStore.getEvaluationPlan;
    expect(evalPlan?.source_selection).toBe("TechProposal");
  });

});
