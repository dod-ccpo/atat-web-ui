import Vue from "vue";
import { createVuetify } from "vuetify";
import { mount, VueWrapper} from "@vue/test-utils";
import DOWLandingPage from "@/steps/05-PerformanceRequirements/DOW/DOWLandingPage.vue";


import DescriptionOfWork from "@/store/descriptionOfWork";
const Vuetify = createVuetify()
Vue.use(Vuetify);

describe("Testing DOW Landing Page", () => {

  let vuetify;
  let wrapper: VueWrapper;

  beforeEach(() => {
    vuetify = createVuetify();
    wrapper = mount(DOWLandingPage, {
      vuetify,
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
