import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CreatePriceEstimate from "@/steps/10-FinancialDetails/IGCE/CreatePriceEstimate.vue";
import SlideoutPanel from "@/store/slideoutPanel";
Vue.use(Vuetify);

describe("Testing CreatePriceEstimate Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreatePriceEstimate, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

 
  it("should mock window alert function", async() => {
    //temporary unit test until showAlert() is removed
    jest.spyOn(window, 'alert').mockReturnValue();
    const link = await wrapper.find("#AZURECalculatorLink");
    link.trigger("click");
    expect(wrapper.vm.$data.selectedCSP).toBe('Microsoft Azure');
  });

  it("openSlideoutPanel() - ensure slideoutpanel opens when `LearnMoreIGCE` link is clicked",
    async()=>{
      await wrapper.find("#LearnMoreIGCE").trigger("click");
      expect(SlideoutPanel.slideoutPanelComponent.name).toBe('ICGELearnMore');
    }
  )
  

})
