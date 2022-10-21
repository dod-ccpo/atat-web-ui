import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ProposalRequiredBVTODifferentiators
  from "@/steps/02-EvaluationCriteria/EvalPlan/ProposalRequiredBVTODifferentiators.vue";
Vue.use(Vuetify);

describe("Testing ProposalRequiredBVTODifferentiators Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProposalRequiredBVTODifferentiators, {
      vuetify,
      localVue
    });
  });

  describe("testing ProposalRequiredBVTODifferentiators render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
