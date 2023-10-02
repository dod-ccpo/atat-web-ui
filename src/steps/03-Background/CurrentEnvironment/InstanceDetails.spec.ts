/* eslint-disable camelcase */

import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import InstanceDetails from "./InstanceDetails.vue";
import {config, createLocalVue, mount, Wrapper} from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import classificationRequirements from "@/store/classificationRequirements";

Vue.use(Vuetify);

describe("Testing Classification Level Page", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(InstanceDetails, {
      localVue,
      vuetify
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Test getters and setters", () => {
    it("tests currentData getter", () => {
      expect(wrapper.vm.currentData).toEqual(wrapper.vm.instanceData);
    });

    it("tests classificationLegend getter", () => {
      wrapper.vm.instanceData.instance_location = "CLOUD";
      expect(wrapper.vm.classificationLegend)
        .toEqual("What data classification and impact " +
          "level is this instance deployed in?");
    });

    it("tests classificationLegend getter no CLOUD", () => {
      wrapper.vm.instanceData.instance_location = "";
      expect(wrapper.vm.classificationLegend)
        .toEqual("What type of information are you hosting in this instance?");
    });

    it("tests classificationErrorMessage getter", () => {
      wrapper.vm.instanceData.instance_location = "CLOUD";
      expect(wrapper.vm.classificationErrorMessage)
        .toEqual("Select a classification and impact level.");
    });

    it("tests classificationErrorMessage getter no CLOUD", () => {
      wrapper.vm.instanceData.instance_location = "";
      expect(wrapper.vm.classificationErrorMessage)
        .toEqual("Select the type of information that are you hosting.");
    });

    it("tests setClassificationLabels function", () => {
      wrapper.vm.instanceData.instance_location = "CLOUD";
      wrapper.vm.classificationRadioOptions = [{id: "IL2", label: ""}];
      wrapper.vm.setClassificationLabels();
      expect(wrapper.vm.classificationRadioOptions[0].label).toBe("Unclassified / IL2");
    });

    it("tests hasTellUsAboutInstanceHeading getter", () => {
      wrapper.vm.currEnvData.env_location = 'ON_PREM';
      wrapper.vm.currEnvData.env_classifications_onprem.length = 1;
      expect(wrapper.vm.hasTellUsAboutInstanceHeading).toBe(false);
    });

    it("tests showPricingDetails getter", () => {
      wrapper.vm.instanceData.instance_location = "ON_PREM";
      expect(wrapper.vm.showPricingDetails).toBe(false);
    });

    it("tests getCurrentUsageAndUsersSequenceNum getter", () => {
      wrapper.vm.instanceData.instance_location = "ON_PREM";
      expect(wrapper.vm.getCurrentUsageAndUsersSequenceNum).toBe("2.");
    });

    it("tests getInstanceConfigurationsSequenceNum getter", () => {
      wrapper.vm.instanceData.instance_location = "ON_PREM";
      expect(wrapper.vm.getInstanceConfigurationsSequenceNum).toBe("3.");
    });

    it("tests getPricingDetailsSequenceNum getter", () => {
      wrapper.vm.instanceData.instance_location = "ON_PREM";
      expect(wrapper.vm.getPricingDetailsSequenceNum).toBe("4.");
    });

    it("tests getAdditionalInfoSequenceNum getter", () => {
      wrapper.vm.instanceData.instance_location = "ON_PREM";
      expect(wrapper.vm.getAdditionalInfoSequenceNum).toBe("4.");
    });

    it("tests getAdditionalInfoSequenceNum getter no instance heading", () => {
      jest.spyOn(wrapper.vm, "hasTellUsAboutInstanceHeading", "get")
        .mockReturnValue(false);
      wrapper.vm.instanceData.instance_location = "ON_PREM";
      expect(wrapper.vm.getAdditionalInfoSequenceNum).toBe("3.");
    });
  });

  describe("Test watchers", () => {
    it("tests usageTrafficSpikeCausesChange watcher for EVENT", async () => {
      await wrapper.setData({usageTrafficSpikeCauses: ["EVENT"]});
      expect(wrapper.vm.instanceData.is_traffic_spike_event_based).toBe("YES");
    });

    it("tests usageTrafficSpikeCausesChange watcher for PERIOD", async () => {
      await wrapper.setData({usageTrafficSpikeCauses: ["PERIOD"]});
      expect(wrapper.vm.instanceData.is_traffic_spike_period_based).toBe("YES");
    });

    it("tests instanceConfigChange watcher", async () => {
      const instanceConfig = {licensing: "test"};
      await wrapper.setData({instanceConfig});
      expect(wrapper.vm.instanceData.licensing).toBe("test");
    });

    it("tests performanceTierChange watcher", async () => {
      const performanceTier = {performanceTier: "test"};
      await wrapper.setData({performanceTier});
      expect(wrapper.vm.instanceData.performance_tier).toBe("test");
    });

    it("tests pricingDetailsChange watcher", async () => {
      const pricingDetails = {currentPaymentArrangement: "test"};
      await wrapper.setData({pricingDetails});
      expect(wrapper.vm.instanceData.pricing_model).toBe("test");
    });

    it("tests instanceLocationChange watcher", async () => {
      wrapper.vm.allClassificationLevels.filter = jest.fn();
      await wrapper.setData({instanceData: {instance_location: "CLOUD"}});

      expect(wrapper.vm.clearClassificationErrorMessages).toBe(true);
      expect(wrapper.vm.allClassificationLevels.filter).toHaveBeenCalled();

      wrapper.vm.$data.currEnvData.env_classifications_onprem = ["test"];
      await wrapper.setData({instanceData: {instance_location: "ON_PREM"}});

      expect(wrapper.vm.$data.instanceData.classification_level).toBe("test");
    });
  });

  describe("Test business functions", () => {
    it("tests regionsDeployedUpdate function", () => {
      wrapper.vm.regionsDeployedUpdate(["[region1]", "[region2]"]);
      expect(wrapper.vm.instanceData.deployed_regions).toBe("region1,region2");
    });

    it("tests regionUserDataUpdate function", () => {
      wrapper.vm.regionUserDataUpdate("data");
      expect(wrapper.vm.instanceData.users_per_region).toBe("data");
    });

    it("tests validateOnLoad function", async () => {
      CurrentEnvironment.isNewInstance = jest.fn().mockReturnValue(false);
      AcquisitionPackage.setValidateNow = jest.fn();
      await wrapper.vm.validateOnLoad();
      expect(AcquisitionPackage.setValidateNow).toBeCalledWith(true);
    });

    it("tests validate function", async () => {
      wrapper.vm.$nextTick = jest.fn();
      await wrapper.vm.validate();
      expect(wrapper.vm.$nextTick).toHaveBeenCalled();
    });

    it("tests loadOnEnter function", async () => {
      classificationRequirements.getAllClassificationLevels = jest.fn();
      CurrentEnvironment.getCurrentEnvInstance = jest.fn().mockResolvedValue({
          instance_location:"CLOUD",
          sys_id: "1",
          is_traffic_spike_event_based: "YES",
          is_traffic_spike_period_based: "YES"
      });

      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.instanceNumber).toBe(1);
      expect(CurrentEnvironment.getCurrentEnvInstance).toHaveBeenCalled();
      expect(wrapper.vm.$data.usageTrafficSpikeCauses).toContain("EVENT");
      expect(wrapper.vm.$data.usageTrafficSpikeCauses).toContain("PERIOD");
      wrapper.vm.$data.instanceData.instance_location = "";
    });

    it("tests loadOnEnter function when instance location is undefined", async () => {
      classificationRequirements.getAllClassificationLevels = jest.fn();
      CurrentEnvironment.getCurrentEnvInstance = jest.fn().mockResolvedValue({
        sys_id: "1"
      });

      await wrapper.vm.loadOnEnter();
      wrapper.vm.$data.instanceData.instance_location = "";
    });

    it("tests hasChanged function", () => {
      expect(wrapper.vm.hasChanged()).toBe(true);
    });

    it("tests saveOnLeave function", async () => {
      AcquisitionPackage.setValidateNow = jest.fn();
      CurrentEnvironment.saveCurrentEnvironment = jest.fn();
      wrapper.vm.hasChanged = jest.fn().mockReturnValue(true);

      await wrapper.vm.saveOnLeave();
      expect(AcquisitionPackage.setValidateNow).toHaveBeenCalledWith(true);
    });
  });
});
