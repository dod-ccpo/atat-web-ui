import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CardRequirement from "@/steps/10-FinancialDetails/IGCE/components/Card_Requirement.vue";
import validators from "@/plugins/validation";
Vue.use(Vuetify);

describe("Testing Card_Requirement", () => {
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
    it("test setError Message()",async () => {
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
    it("test loadOnEnter() with no card data",async () => {
      await wrapper.setProps({
        cardData: {}
      })
      await wrapper.vm.loadOnEnter()
      const title = wrapper.vm.cardData.title
      expect(title).toBe(undefined);
    })
    it("test loadOnEnter() with data",async () => {
      await wrapper.setProps({
        cardData: {
          title: "test title",
          description: "test description",
          unit: "test unit",
          // eslint-disable-next-line camelcase
          unit_price: 1000
        }
      })
      await wrapper.vm.loadOnEnter()
      const title = wrapper.vm.cardData.title
      expect(title).toBe("test title");
    })

  })
})
