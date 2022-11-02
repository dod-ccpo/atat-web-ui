import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Differentiators from "@/steps/02-EvaluationCriteria/EvalPlan/Differentiators.vue";
import validators from "@/plugins/validation";

Vue.use(Vuetify);

describe("Testing Differentiators Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
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
  })
})
