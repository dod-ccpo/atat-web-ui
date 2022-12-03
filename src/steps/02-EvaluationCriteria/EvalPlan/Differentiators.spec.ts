import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Differentiators from "@/steps/02-EvaluationCriteria/EvalPlan/Differentiators.vue";
import validators from "@/plugins/validation";
import { EvaluationPlanDTO } from "@/api/models";
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

describe("Testing Differentiators Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(async () => {
    await EvaluationPlan.setEvaluationPlan(evalPlanPopulated);
    vuetify = new Vuetify();
    wrapper = mount(Differentiators, {
      vuetify,
      localVue
    });
  });

  describe("testing Differentiators render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("testing methods, getters, methods", () => {
    it("watcher - selectedDifferentiatorsChange() - toggles custom differentiator component", 
      async () => {
        wrapper.vm.$data.selectedDifferentiators = ["CustomDifferentiators"];
        Vue.nextTick(async () => {
          expect(wrapper.vm.$data.showCustomDifferentiators).toBeTruthy();
          wrapper.vm.$data.selectedDifferentiators = ["foo"];
          Vue.nextTick(async () => {
            expect(wrapper.vm.$data.showCustomDifferentiators).toBeFalsy();
          });
        });
      });

    it ("getter - gets currentData", async () => {
      wrapper.vm.$data.evalPlan = "foo";
      const currentData = wrapper.vm.currentData;
      expect(currentData).toBe("foo")
    });
    

    it("saveOnLeave() - saves eval plan data to store", async () => {
      await EvaluationPlan.setEvaluationPlan(initialEvalPlan);
      await wrapper.vm.loadOnEnter();
      await wrapper.setData({
        sourceSelection: "TechProposal",
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
})
