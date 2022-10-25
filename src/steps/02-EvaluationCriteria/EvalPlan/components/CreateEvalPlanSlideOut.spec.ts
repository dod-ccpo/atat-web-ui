import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import CreateEvalPlanSlideOut 
  from "@/steps/02-EvaluationCriteria/EvalPlan/components/CreateEvalPlanSlideOut.vue";

Vue.use(Vuetify);

describe("Testing CreateEvalPlan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreateEvalPlanSlideOut, {
      vuetify,
      localVue
    });
  });

  describe("testing Callout component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  })
})
