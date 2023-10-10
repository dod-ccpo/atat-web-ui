import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CardRequirement from "@/steps/10-FinancialDetails/IGCE/components/Card_Requirement.vue";
import validators from "@/plugins/validation";
Vue.use(Vuetify);

describe("Testing CreatePriceEstimate Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CardRequirement, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("Testing Functions", () => {
    it("test setError Message()", () => {
      wrapper.setData({
        errorMessage: "error 1"
      })
      const errorMessage = wrapper.vm.errorMessage
      expect(errorMessage).toBe("error 1");
      wrapper.vm.setErrorMessage("New Error")
      Vue.nextTick(() => {
        expect(errorMessage).toBe("New Error");
      })
    })

  })
})
