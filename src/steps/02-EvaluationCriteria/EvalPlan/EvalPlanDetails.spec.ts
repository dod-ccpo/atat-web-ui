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

  beforeEach(() => {
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
      await AcquisitionPackage.setEvaluationPlan(evalPlanPopulated);
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.evalPlan.source_selection).toBe("TechProposal")
    });
  })

})
