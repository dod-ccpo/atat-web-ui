import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SlideOutGatherPricesEstimates
  from "@/steps/10-FinancialDetails/IGCE/components/SlideOut_GatherPricesEstimates.vue";
Vue.use(Vuetify);

describe("Testing SlideOutGatherPricesEstimates Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SlideOutGatherPricesEstimates, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

})
