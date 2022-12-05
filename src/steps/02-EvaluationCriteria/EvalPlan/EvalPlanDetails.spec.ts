import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import EvalPlanDetails from "@/steps/02-EvaluationCriteria/EvalPlan/EvalPlanDetails.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";
import { Checkbox } from "types/Global";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";

Vue.use(Vuetify);

/* eslint-disable camelcase */
const initialEvalPlan: EvaluationPlanDTO = {
  source_selection: "",
  method: "",
  standard_specifications: "",
  custom_specifications: "",  
  standard_differentiators: "",
  custom_differentiators: "",  
};

const evalPlanPopulated: EvaluationPlanDTO = {
  source_selection: "TECH_PROPOSAL",
  method: "BVTO",
  standard_specifications: "",
  custom_specifications: "",    
  standard_differentiators: "",
  custom_differentiators: "",  
};
/* eslint-enable camelcase */


describe("Testing NoEvalPlan Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(async () => {
    await EvaluationPlan.setEvaluationPlan(evalPlanPopulated);
    vuetify = new Vuetify();
    wrapper = mount(EvalPlanDetails, {
      vuetify,
      localVue
    });
  });

  describe("testing EvalPlanDetails render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("testing methods", () => {
    it("loadOnEnter() - gets eval plan data from store", async () => {
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.evalPlan.source_selection).toBe("TECH_PROPOSAL")
    });

    it("initCustomSpecs", async () => {
      // eslint-disable-next-line camelcase
      wrapper.vm.$data.evalPlan.custom_specifications = null;
      wrapper.vm.initCustomSpecs();
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.evalPlan.custom_specifications).toBe([]);
      });
    });

    it("saveOnLeave() - saves eval plan data to store", async () => {
      await EvaluationPlan.setEvaluationPlan(initialEvalPlan);
      await wrapper.vm.loadOnEnter();
      await wrapper.setData({
        sourceSelection: "TECH_PROPOSAL",
        method: "BVTO",
        savedData: {
          // eslint-disable-next-line camelcase
          source_selection: "foo",
          method: "LPTA",
        }
      });
      Vue.nextTick(async () => {
        await wrapper.vm.saveOnLeave();
        const hasChanged = wrapper.vm.hasChanged;
        expect(hasChanged).toBeTruthy();
      })
    });

  });

  describe("testing getters", () => {
    it ("gets header for tech proposal required", async () => {
      // eslint-disable-next-line camelcase
      wrapper.vm.$data.evalPlan.source_selection = "TECH_PROPOSAL";
      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.header).toContain("proposals are required")  
    });
    it ("gets header for no proposal required", async () => {
      await wrapper.setData({
        // eslint-disable-next-line camelcase
        evalPlan: { source_selection: "NO_TECH_PROPOSAL" }
      })

      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.header).toContain("no technical proposal is required")    
    });

    it ("gets header for lump sum one CSP", async () => {
      await wrapper.setData({
        // eslint-disable-next-line camelcase
        evalPlan: { source_selection: "SET_LUMP_SUM" }
      })

      expect(wrapper.vm.isStandards).toBeFalsy();
      expect(wrapper.vm.header).toContain("assessment criteria")    
    });

    it ("gets header for lump sum multiple CSPs", async () => {
      await wrapper.setData({
        // eslint-disable-next-line camelcase
        evalPlan: { source_selection: "EQUAL_SET_LUMP_SUM" }
      });

      expect(wrapper.vm.isStandards).toBeFalsy();
      expect(wrapper.vm.header).toContain("there are no required compliance")    
    });

    it ("gets currentData", async () => {
      wrapper.vm.$data.evalPlan = "foo";
      const currentData = wrapper.vm.currentData;
      expect(currentData).toBe("foo")
    });

  });

  describe("testing watchers", () => {

    it("testing watchers - click `Yes` radio option", async () => {
      await wrapper.setData({
        selectedStandardsRadioItem: "YES"
      });
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.evalPlan.custom_specifications.length).toBe(1);
        expect(wrapper.vm.scrollToId).toBeCalled();
      });
    });

    it("testing watchers - click `NO` radio option", async () => {
      await wrapper.setData({
        selectedStandardsRadioItem: "NO"
      });
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.evalPlan.custom_specifications.length).toBe(0);
      })
    });

    it("watch selectedSetLumpSumOptions - initializes custom specs", async () => {
      wrapper.vm.$data.isLoading = false;
      wrapper.vm.$data.selectedSetLumpSumOptions.push("foo");
      Vue.nextTick(() => {
        let specs = wrapper.vm.$data.evalPlan.standard_specifications;
        const hasFoo = specs.includes("foo");
        expect(hasFoo).toBeTruthy();
        wrapper.vm.$data.selectedSetLumpSumOptions.push("CustomAssessment");
        Vue.nextTick(() => {
          specs = wrapper.vm.$data.evalPlan.standard_specifications;
          const hasCustomAssessment = specs.includes("CustomAssessment");
          expect(hasCustomAssessment).toBeTruthy();
        });
      })

    });

    it("watch setLumpSumCheckboxOptions - includes risk to govt option", async () => {
      wrapper.vm.$data.evalPlan.method = "BestUse";
      const options = wrapper.vm.setLumpSumCheckboxOptions;
      const riskToGovtIndex = options.findIndex((obj: Checkbox) => obj.id === "RiskToGovt");
      expect(riskToGovtIndex).not.toBe(-1);
    })
  });

});
