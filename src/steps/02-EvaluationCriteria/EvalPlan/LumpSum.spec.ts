import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import LumpSum from "@/steps/02-EvaluationCriteria/EvalPlan/LumpSum.vue";
Vue.use(Vuetify);

describe("Testing LumpSum Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(LumpSum, {
      vuetify,
      localVue
    });
  });

  describe("testing LumpSum render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
