import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ProposalRequired from "@/steps/02-EvaluationCriteria/EvalPlan/ProposalRequired.vue";
Vue.use(Vuetify);

describe("Testing ProposalRequired Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProposalRequired, {
      vuetify,
      localVue
    });
  });

  describe("testing ProposalRequired render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
