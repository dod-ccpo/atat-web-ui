import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import EstimatesDeveloped from "@/steps/10-FinancialDetails/IGCE/EstimatesDeveloped.vue";
import validators from "@/plugins/validation";
Vue.use(Vuetify);

describe("Testing EstimatesDeveloped Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(EstimatesDeveloped, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("checks getter overUnderStr string 'overestimated'", async () => {
    await wrapper.setData({
      selectedPriceComparison: "More"
    });
    const str = wrapper.vm.overUnderStr;
    expect(str).toBe("overestimated");
  });

  it("checks getter overUnderStr string 'underestimated'", async () => {
    await wrapper.setData({
      selectedPriceComparison: "Less"
    });
    const str = wrapper.vm.overUnderStr;
    expect(str).toBe("underestimated");
  });

  it("toggles percentage input", async () => {
    await wrapper.setData({
      selectedPriceComparison: "Same"
    });
    expect(wrapper.vm.showPercentage).toBeFalsy;

    await wrapper.setData({
      selectedPriceComparison: "More"
    });
    expect(wrapper.vm.showPercentage).toBeTruthy;

  });


})
