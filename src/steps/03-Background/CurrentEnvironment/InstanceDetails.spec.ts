/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import InstanceDetails from "./InstanceDetails.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import classificationRequirements from "@/store/classificationRequirements";
vi.mock('@/store/acquisitionPackage')
vi.mock('@/store/classificationRequirements')

describe("Testing Classification Level Page", () => {
  
  const wrapper: VueWrapper = shallowMount(InstanceDetails, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  beforeEach(() => {
    wrapper.setData({
      allClassificationLevels: [{
        impact_level: 'IL2',
        classification: 'UNCLASSIFIED'
      }]
    })
  })
  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Test getters and setters", () => {
    it("tests currentData getter", () => {
      expect(vm.currentData).toEqual(vm.instanceData);
    });

    it("tests classificationLegend getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'CLOUD'
        }
      })
      expect(vm.classificationLegend)
        .toEqual("What data classification and impact " +
          "level is this instance deployed in?");
    });

    it("tests classificationLegend getter no CLOUD", () => {
      wrapper.setData({
        instanceData: {
          instance_location: ''
        }
      })
      expect(vm.classificationLegend)
        .toEqual("What type of information are you hosting in this instance?");
    });

    it("tests classificationErrorMessage getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'CLOUD'
        }
      })
      expect(vm.classificationErrorMessage)
        .toEqual("Select a classification and impact level.");
    });

    it("tests classificationErrorMessage getter no CLOUD", () => {
      wrapper.setData({
        instanceData: {
          instance_location: ''
        }
      })
      expect(vm.classificationErrorMessage)
        .toEqual("Select the type of information that are you hosting.");
    });

    it("tests setClassificationLabels function", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'CLOUD'
        },
        classificationRadioOptions: [{id: "IL2", label: ""}]
      })
      vm.setClassificationLabels();
      expect(vm.classificationRadioOptions[0].label).toBe("Unclassified / IL2");

      
    });

    it("tests hasTellUsAboutInstanceHeading getter", () => {
      wrapper.setData({
        currEnvData: {
          env_location: 'ON_PREM',
          env_classifications_onprem: {
            length: 1
          }
        }
      })
      expect(vm.hasTellUsAboutInstanceHeading).toBe(false);
    });

    it("tests showPricingDetails getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'ON_PREM'
        }
      })
      expect(vm.showPricingDetails).toBe(false);
    });

    it("tests getCurrentUsageAndUsersSequenceNum getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'ON_PREM'
        }
      })
      expect(vm.getCurrentUsageAndUsersSequenceNum).toBe("1.");
    });

    it("tests getInstanceConfigurationsSequenceNum getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'ON_PREM'
        }
      })
      //vm.$nextTick(() => {
      expect(vm.getInstanceConfigurationsSequenceNum).toBe("2.");
      //})
    });

    it("tests getPricingDetailsSequenceNum getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'ON_PREM'
        }
      })
      //vm.$nextTick(()=> {
      expect(vm.getPricingDetailsSequenceNum).toBe("3.");
      //})
    });

    it("tests getAdditionalInfoSequenceNum getter", () => {
      wrapper.setData({
        instanceData: {
          instance_location: 'ON_PREM'
        }
      })
      //vm.$nextTick(() => {
      expect(vm.getAdditionalInfoSequenceNum).toBe("3.");
      //})
      
    });

    it("tests getAdditionalInfoSequenceNum getter no instance heading", () => {
      vi.spyOn(vm, "hasTellUsAboutInstanceHeading", "get")
        .mockReturnValue(false);
      vm.instanceData.instance_location = "ON_PREM";
      expect(vm.getAdditionalInfoSequenceNum).toBe("3.");
    });
  });

  describe("Test watchers", () => {
    it("tests usageTrafficSpikeCausesChange watcher for EVENT", async () => {
      await wrapper.setData({usageTrafficSpikeCauses: ["EVENT"]});
      expect(vm.instanceData.is_traffic_spike_event_based).toBe("YES");
    });

    it("tests usageTrafficSpikeCausesChange watcher for PERIOD", async () => {
      await wrapper.setData({usageTrafficSpikeCauses: ["PERIOD"]});
      expect(vm.instanceData.is_traffic_spike_period_based).toBe("YES");
    });

    it("tests instanceConfigChange watcher", async () => {
      const instanceConfig = {licensing: "test"};
      await wrapper.setData({instanceConfig});
      expect(vm.instanceData.licensing).toBe("test");
    });

    it("tests performanceTierChange watcher", async () => {
      const performanceTier = {performanceTier: "test"};
      await wrapper.setData({performanceTier});
      expect(vm.instanceData.performance_tier).toBe("test");
    });

    it("tests pricingDetailsChange watcher", async () => {
      const pricingDetails = {currentPaymentArrangement: "test"};
      await wrapper.setData({pricingDetails});
      expect(vm.instanceData.pricing_model).toBe("test");
    });

    it.skip("tests instanceLocationChange watcher", async () => {
      vm.allClassificationLevels.filter = vi.fn();
      await wrapper.setData({instanceData: {instance_location: "CLOUD"}});
      expect(vm.clearClassificationErrorMessages).toBe(true);
      expect(vm.allClassificationLevels.filter).toHaveBeenCalled();

      vm.$data.currEnvData.env_classifications_onprem = ["test"];
      await wrapper.setData({instanceData: {instance_location: "ON_PREM"}});

      expect(vm.$data.instanceData.classification_level).toBe("test");
    });
  });

  describe("Test business functions", () => {
    it("tests regionsDeployedUpdate function", () => {
      vm.regionsDeployedUpdate(["[region1]", "[region2]"]);
      expect(vm.instanceData.deployed_regions).toBe("region1,region2");
    });

    it("tests regionUserDataUpdate function", () => {
      vm.regionUserDataUpdate("data");
      expect(vm.instanceData.users_per_region).toBe("data");
    });
    //this.$refs.form.validate() is not a function
    it.skip("tests validateOnLoad function", async () => {
      CurrentEnvironment.isNewInstance = vi.fn().mockReturnValue(false);
      AcquisitionPackage.setValidateNow = vi.fn().mockReturnValue(true);
      await vm.validateOnLoad();
      vm.$nextTick(() => {
        expect(AcquisitionPackage.setValidateNow).toBeCalledWith(true);
      })
      
    });

    it.skip("tests validate function", async () => {
      vm.$nextTick = vi.fn();
      await vm.validate();
      expect(vm.$nextTick).toHaveBeenCalled();
    });
    //LoC: 404 this.allClassificationLevels.filter --> cannot read properties undefined of filter
    it("tests loadOnEnter function", async () => {
      classificationRequirements.getAllClassificationLevels = vi.fn()
        .mockResolvedValue([{
          impact_level: 'IL2',
          classification: 'UNCLASS',
          classification_level: ''
        }]);
      CurrentEnvironment.getCurrentEnvInstance = vi.fn().mockResolvedValue({
        instance_location:"CLOUD",
        sys_id: "1",
        is_traffic_spike_event_based: "YES",
        is_traffic_spike_period_based: "YES"
      });

      await vm.loadOnEnter();
      expect(vm.instanceNumber).toBe(1);
      expect(CurrentEnvironment.getCurrentEnvInstance).toHaveBeenCalled();
      expect(vm.$data.usageTrafficSpikeCauses).toContain("EVENT");
      expect(vm.$data.usageTrafficSpikeCauses).toContain("PERIOD");
      vm.$data.instanceData.instance_location = "";
    });

    it("tests loadOnEnter function when instance location is undefined", async () => {
      classificationRequirements.getAllClassificationLevels = vi.fn().mockResolvedValue([{
        impact_level: 'IL2',
        classification: 'UNCLASS',
        classification_level: ''
      }]);
      CurrentEnvironment.getCurrentEnvInstance = vi.fn().mockResolvedValue({
        sys_id: "1"
      });

      await vm.loadOnEnter();
      vm.$data.instanceData.instance_location = "";
    });

    it("tests hasChanged function", () => {
      expect(vm.hasChanged()).toBe(true);
    });
    //this.$refs.form.validate is not a function
    it.skip("tests saveOnLeave function", async () => {
      AcquisitionPackage.setValidateNow = vi.fn();
      CurrentEnvironment.saveCurrentEnvironment = vi.fn();
      vm.hasChanged = vi.fn().mockReturnValue(true);

      await vm.saveOnLeave();
      expect(AcquisitionPackage.setValidateNow).toHaveBeenCalledWith(true);
    });
  });
});
