import Vue from "vue";
import Vuetify from "vuetify";
import {config, createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ReplicateAndOptimize
  from "@/steps/05-PerformanceRequirements/CurrentFunctions/ReplicateAndOptimize.vue";
import {routeNames} from "@/router/stepper";
import validators from "@/plugins/validation";
import Vuex from "vuex";
import DescriptionOfWork from "@/store/descriptionOfWork";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import Steps from "@/store/steps";

Vue.use(Vuetify);

describe("Testing ReplicateAndOptimize Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const mockRouter = {
    push: jest.fn()
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReplicateAndOptimize, {
      vuetify,
      localVue,
      mocks: {
        $router: mockRouter
      }
    });
  });

  describe("Initialization....", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Test getters", () => {
    it("hasXaaSNoneApply returns correct value", () => {
      DescriptionOfWork.DOWObject.push({
        serviceOfferingGroupId: "XaaS_NONE",
        sequence: 0,
        serviceOfferings: []
      });
      expect(wrapper.vm.hasXaaSNoneApply).toBe(true);
    });

    it("architecturalDesignIsNo returns correct value", () => {
      DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services = "NO";
      expect(wrapper.vm.architecturalDesignIsNo).toBe(true);
    });

    it("showWarning returns true when expected", () => {
      DescriptionOfWork.DOWObject.push({
        serviceOfferingGroupId: "XaaS_NONE",
        sequence: 0,
        serviceOfferings: []
      });
      DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services = "NO";
      wrapper.vm.savedData.replicatedOrOptimized = "";
      wrapper.vm.$nextTick(() => expect(wrapper.vm.showWarning).toBe(true));
    });

    it("showWarning correctly returns false when hasXaaSNoneApply is falsy", () => {
      DescriptionOfWork.DOWObject.push({
        serviceOfferingGroupId: "",
        sequence: 0,
        serviceOfferings: []
      });
      DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services = "NO";
      wrapper.vm.savedData.replicatedOrOptimized = "";
      wrapper.vm.$nextTick(() => expect(wrapper.vm.showWarning).toBe(false));
    });

    it("showWarning correctly returns false when architecturalDesignIsNo is falsy", () => {
      DescriptionOfWork.DOWObject.push({
        serviceOfferingGroupId: "XaaS_NONE",
        sequence: 0,
        serviceOfferings: []
      });
      DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services = "YES";
      wrapper.vm.savedData.replicatedOrOptimized = "";
      wrapper.vm.$nextTick(() => expect(wrapper.vm.showWarning).toBe(false));
    });

    it("showWarning correctly returns false when replicatedOrOptimized is not empty or NO", () => {
      DescriptionOfWork.DOWObject.push({
        serviceOfferingGroupId: "XaaS_NONE",
        sequence: 0,
        serviceOfferings: []
      });
      DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services = "NO";
      wrapper.vm.savedData.replicatedOrOptimized = "YES";
      wrapper.vm.$nextTick(() => expect(wrapper.vm.showWarning).toBe(false));
    });

    it("currentData returns correct value", () => {
      wrapper.vm.currEnvDTO.current_environment_replicated_optimized = "YES_REPLICATE";
      expect(wrapper.vm.currentData).toEqual({ replicatedOrOptimized: "YES_REPLICATE" });
    });
  });

  describe("Test business functions", () => {
    it("setDOWSection sets correct DOW section", async () => {
      DescriptionOfWork.setCurrentDOWSection = jest.fn();
      wrapper.vm.$router.push = jest.fn();
      await wrapper.vm.setDOWSection();
      expect(DescriptionOfWork.setCurrentDOWSection).toHaveBeenCalledWith("XaaS");
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: routeNames.RequirementCategories,
        params: {
          direction: "next",
          resolver: "RequirementsPathResolver",
        }
      });
    });

    it("mounted lifecycle hook calls router.push", async () => {
      expect(mockRouter.push).toHaveBeenCalled();
    });

    it("loadOnEnter loads data from store", async () => {
      CurrentEnvironment.getCurrentEnvInstance = jest.fn().mockResolvedValue(
        { current_environment_replicated_optimized: "YES_REPLICATE" }
      );
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.currEnvDTO.current_environment_replicated_optimized).toBe("YES_REPLICATE");
      expect(wrapper.vm.savedData.replicatedOrOptimized).toBe("YES_REPLICATE");
    });

    it("hasChanged returns true if data has changed", () => {
      wrapper.vm.currEnvDTO.current_environment_replicated_optimized = "YES_REPLICATE";
      wrapper.vm.savedData.replicatedOrOptimized = "NO";
      expect(wrapper.vm.hasChanged()).toBe(true);
    });

    it("saveOnLeave saves data if it has changed", async () => {
      const setCurrentEnvironmentSpy = jest.spyOn(CurrentEnvironment, "setCurrentEnvironment");
      wrapper.vm.currEnvDTO.current_environment_replicated_optimized = "YES_REPLICATE";
      wrapper.vm.savedData.replicatedOrOptimized = "NO";
      await wrapper.vm.saveOnLeave();
      expect(setCurrentEnvironmentSpy).toHaveBeenCalledWith(wrapper.vm.currEnvDTO);
    });
  });
})
