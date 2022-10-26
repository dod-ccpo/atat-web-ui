import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import FairOppExceptions 
  from "@/steps/02-EvaluationCriteria/components/FairOppExceptions.vue";

Vue.use(Vuetify);

describe("Testing CreateEvalPlan Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FairOppExceptions, {
      vuetify,
      localVue
    });
  });

  describe("testing Callout component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("setReadOnly() - not isForm - expect YES for read-only value", async () => {
      await wrapper.setData({
        isForm: false
      });
      await wrapper.vm.setReadOnly();
      Vue.nextTick(async () => {
        expect(wrapper.vm.$data.selectedExceptionReadOnly).toBe("YES");
      });
    });

    it("setReadOnly() - not isForm - expect NO for read-only value", async () => {
      await wrapper.setData({
        isForm: false,
        selectedException: "NO_NONE"
      });
      await wrapper.vm.setReadOnly();
      Vue.nextTick(async () => {
        expect(wrapper.vm.$data.selectedExceptionReadOnly).toBe("NO");
      });
    });


  })
})
