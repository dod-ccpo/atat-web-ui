import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import NoEvalPlan from "@/steps/02-EvaluationCriteria/EvalPlan/NoEvalPlan.vue";

Vue.use(Vuetify);

describe("Testing NoEvalPlan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(NoEvalPlan, {
      vuetify,
      localVue
    });
  });

  describe("testing NoEvalPlan render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
