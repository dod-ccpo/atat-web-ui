import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import DOWLandingPage from "@/steps/05-PerformanceRequirements/DOW/DOWLandingPage.vue";
import CurrentEnvironment, {
  defaultCurrentEnvironment
} from "@/store/acquisitionPackage/currentEnvironment";
import currentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import DescriptionOfWork from "@/store/descriptionOfWork";

Vue.use(Vuetify);

describe("Testing DOW Landing Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(DOWLandingPage, {
      vuetify,
      localVue
    });
  });

  describe("testing DOW Landing Page", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("detects changes to isOpen for the DOWSummaryAlert", async () => {
      DescriptionOfWork.setIsDOWSummaryAlertOpen = jest.fn();
      wrapper.setData({ "isOpen": false });
      await wrapper.vm.$nextTick();
      expect(DescriptionOfWork.setIsDOWSummaryAlertOpen).toHaveBeenCalledWith(false);
    });

    it("detects currentEnvironment accurately", () => {
      expect(wrapper.vm.doesCurrentEnvironmentExist()).toBe(false);
    });
  })
})
