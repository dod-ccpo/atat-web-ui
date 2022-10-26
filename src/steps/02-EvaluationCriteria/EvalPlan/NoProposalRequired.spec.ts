import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import NoProposalRequired from "@/steps/02-EvaluationCriteria/EvalPlan/NoProposalRequired.vue";
Vue.use(Vuetify);

describe("Testing NoProposalRequired Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(NoProposalRequired, {
      vuetify,
      localVue
    });
  });

  describe("testing NoProposalRequired render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
