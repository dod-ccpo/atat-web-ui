import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import EvalPlanDetails from "@/steps/02-EvaluationCriteria/EvalPlan/EvalPlanDetails.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { EvaluationPlanDTO } from "@/api/models";

Vue.use(Vuetify);

/* eslint-disable camelcase */
const evalPlanPopulated: EvaluationPlanDTO = {
  source_selection: "TechProposal",
  method: "BVTO",
  standard_specifications: [],
  custom_specifications: [],    
};
/* eslint-enable camelcase */


describe("Testing NoEvalPlan Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(async () => {
    await AcquisitionPackage.setEvaluationPlan(evalPlanPopulated);
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
      expect(wrapper.vm.$data.evalPlan.source_selection).toBe("TechProposal")
    });

    it("initCustomSpecs", async () => {
      // eslint-disable-next-line camelcase
      wrapper.vm.$data.evalPlan.custom_specifications = null;
      wrapper.vm.initCustomSpecs();
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.evalPlan.custom_specifications).toBe([]);
      });

    });

  });

  describe("testing getters", () => {
    it ("gets header for tech proposal required", async () => {
      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.header).toContain("proposals are required")  
    });
    it ("gets header for no proposal required", async () => {
      await wrapper.setData({
        // eslint-disable-next-line camelcase
        evalPlan: { source_selection: "NoTechProposal" }
      })

      expect(wrapper.vm.isStandards).toBeTruthy();
      expect(wrapper.vm.header).toContain("no technical proposal is required")    
    });

    it ("gets header for lump sum one CSP", async () => {
      await wrapper.setData({
        // eslint-disable-next-line camelcase
        evalPlan: { source_selection: "SetLumpSum" }
      })

      expect(wrapper.vm.isStandards).toBeFalsy();
      expect(wrapper.vm.header).toContain("assessment criteria")    
    });

    it ("gets header for lump sum multiple CSPs", async () => {
      await wrapper.setData({
        // eslint-disable-next-line camelcase
        evalPlan: { source_selection: "EqualSetLumpSum" }
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
  });

});
