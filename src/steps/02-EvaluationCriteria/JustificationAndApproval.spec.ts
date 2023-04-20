import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import JustificationAndApproval from "@/steps/02-EvaluationCriteria/JustificationAndApproval.vue";

Vue.use(Vuetify);

describe("Testing JustificationAndApproval Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(JustificationAndApproval, {
      vuetify,
      localVue
    });
  });

  describe("testing JustificationAndApproval render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })
})
