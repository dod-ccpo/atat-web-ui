import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import CreatePriceEstimate from "@/steps/10-FinancialDetails/IGCE/CreatePriceEstimate.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import sanitize from "@/plugins/sanitize";
Vue.use(Vuetify);

describe("Testing CreatePriceEstimate renders ", () => {
  const localVue = createLocalVue();
  localVue.use(sanitize);
  const vuetify = new Vuetify();
  const wrapper = mount(CreatePriceEstimate, {
    localVue,
    vuetify,
  });

  it("successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});

describe("Testing CreatePriceEstimate Component", () => {
  const localVue = createLocalVue();
  const vuetify = new Vuetify();
  const wrapper = mount(CreatePriceEstimate, {
    localVue,
    vuetify,
  });

  it.skip("should mock window alert function", async() => {
    //temporary unit test until showAlert() is removed
    jest.spyOn(window, 'alert').mockReturnValue();
    const link = wrapper.find("#AZURECalculatorLink");
    link.trigger("click");
    expect(wrapper.vm.$data.selectedCSP).toBe('Microsoft Azure');
  });

  it("openSlideoutPanel() - ensure slideoutpanel opens when `LearnMoreIGCE` link is clicked",
    async()=>{
      await wrapper.find("#LearnMoreIGCE").trigger("click");
      expect(SlideoutPanel.slideoutPanelComponent.name).toBe('ICGELearnMore');
    }
  )
  
  it("renders calculator link correctly", async() => {
    const link = wrapper.find("#AWSCalculatorLink");
    expect(link.attributes('href'))
      // eslint-disable-next-line max-len
      .toBe("https://calculator.aws/#/?token=4ec5ddaefb8454253ef740c67969aae0&amp;volume_discount=0");
  });
})
