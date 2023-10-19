/* eslint-disable camelcase */
import {createLocalVue} from "@vue/test-utils";
import Vuex, {Store} from "vuex";
import {getModule} from "vuex-module-decorators";
import AcquisitionPackage, { 
  AcquisitionPackageStore, 
  initialEvaluationPlan 
} from "@/store/acquisitionPackage/index";
import { ContactDTO, EvaluationPlanDTO, FundingRequirementDTO } from "@/api/models";
import FinancialDetails from "../financialDetails";
import api from "@/api";
import Vue from "vue";

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

  const emptyContact: ContactDTO = {
    type:  "", 
    role:  "", 
    rank_components:  "",
    salutation:  "",
    first_name:  "John",
    last_name:  "Doe",
    middle_name:  "",
    formal_name:  "",
    suffix:  "",
    title:  "",
    phone:  "",
    phone_extension:  "",
    email:  "",
    grade_civ:  "",
    dodaac:  "",
    can_access_package:  "",
    manually_entered:  "",
    acquisition_package:  "",
  };

  const emptyFundingRequirementDTO: FundingRequirementDTO = {
    acquisition_package:  "",
    funding_plan:  "",
    funding_request:  "",
    funds_obligated:  "",
    funds_total:  "",
    has_funding:  "",
    incrementally_funded:  "",
    pop_start_date:  "",
    pop_end_date:  "",
    task_order_number:  "",
    financial_poc:  "",
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

  it ("saveContactInfo()", async () => {
    const testData = {
      data: emptyContact,
      type: "Financial POC"
    }
    AcquisitionPackage.setContact(testData);
    await Vue.nextTick();
    const mockSetFinancialPOC = jest.spyOn(FinancialDetails, "setFinancialPOC")
      .mockImplementation();
    jest.spyOn(api.contactsTable, "create").mockImplementation(
      () => Promise.resolve(emptyContact));
    jest.spyOn(AcquisitionPackage, "updateAcquisitionPackage").mockImplementation();
    jest.spyOn(api.fundingRequirementTable, "update").mockImplementation();
    jest.spyOn(FinancialDetails, "getFundingRequirement").mockImplementation(
      () => Promise.resolve(emptyFundingRequirementDTO)
    )
    await AcquisitionPackage.saveContactInfo(testData);
    expect(mockSetFinancialPOC).toBeCalled();
  })

});
