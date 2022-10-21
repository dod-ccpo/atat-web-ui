import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import EvalPlan from "@/steps/02-EvaluationCriteria/EvalPlan/Index.vue";
Vue.use(Vuetify);

describe("Testing Eval Plan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(EvalPlan, {
      vuetify,
      localVue
    });
  });

  describe("testing Eval Plan render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
