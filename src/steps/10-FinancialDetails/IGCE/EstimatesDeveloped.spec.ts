/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import EstimatesDeveloped from "@/steps/10-FinancialDetails/IGCE/EstimatesDeveloped.vue";
import validators from "@/plugins/validation";
import IGCE from "@/store/IGCE";
import { RequirementsCostEstimateDTO } from "@/api/models";
Vue.use(Vuetify);

describe("Testing EstimatesDeveloped Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const requirementsCostEstimate: RequirementsCostEstimateDTO | null = {
    how_estimates_developed:{
      tools_used:"AWS,GOOGLE_CLOUD,MICROSOFT_AZURE,ORACLE_CLOUD"
    }
  } as RequirementsCostEstimateDTO;


  beforeEach(() => {
    jest.spyOn(IGCE,"getRequirementsCostEstimate").mockImplementation(
      ()=>Promise.resolve(requirementsCostEstimate)
    )
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
      selectedPriceComparison: "MORE_THAN"
    });
    const str = wrapper.vm.overUnderStr;
    expect(str).toBe("overestimated");
  });

  it("checks getter overUnderStr string 'underestimated'", async () => {
    await wrapper.setData({
      selectedPriceComparison: "LESS_THAN"
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
      selectedPriceComparison: "MORE_THAN"
    });
    expect(wrapper.vm.showPercentage).toBeTruthy;

  });


})
