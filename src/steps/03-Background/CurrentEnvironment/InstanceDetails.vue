
<template>
  <v-form ref="form" lazy-validation>
    <div class="container-max-width">
      <h1 class="mb-3">
        Let’s start gathering details about each instance in your environment
      </h1>
      <p class="mb-10">
        An instance may be an isolated environment, an enclave, or a collection of 
        components. Aggregate all virtual machines (VMs) with similar specifications 
        into a single instance below. If you have multiple instances, we will walk 
        through them one at a time.
      </p>

      <v-expand-transition>
        <ATATAlert
          id="ErrorsOnLoadAlert"
          v-show="!isValid && !isNewInstance"
          type="error"
          class="mb-10"
        >
          <template v-slot:content>
            <p class="mb-0" id="ErrorsOnLoadAlertText">
              Some of your info is missing. You can add it now or come back at any 
              time before finalizing your acquisition package.
            </p>
          </template>
        </ATATAlert>
      </v-expand-transition>

      <h2 class="mb-4" v-if="hasTellUsAboutInstanceHeading">
        1. Tell us about Instance #{{ instanceNumber }}
      </h2>

      <ATATRadioGroup 
        v-if="envLocation === 'HYBRID' || !envLocation"
        id="EnvironmentLocation"
        class="mb-8"
        :items="envLocationOptions"
        tooltipText="<strong>On-premise environments</strong> are deployed in-house 
          and within an enterprise IT infrastructure. <strong>Cloud environments</strong> 
          are hosted by a third-party provider in an off-site, cloud-based server."
        :value.sync="instanceData.instance_location"
        legend="Where is this instance located?"
      />

      <div v-show="instanceData.instance_location">

        <RegionsDeployedAndUserCount 
          v-if="instanceData.instance_location === 'CLOUD'"
          id="RegionsDeployed"
          class="mb-8"
          :hasTextFields="false"
          groupLabelId="RegionsDeployedLabel"
          groupLabel="In which region(s) is this instance deployed?"
          :tooltipText="regionsDeployedTooltipText"
          :optional="true"
          @selectedRegionsUpdate="regionsDeployedUpdate"
          :selectedDeployedRegionsOnLoad="selectedDeployedRegionsOnLoad"
        />

        <ATATRadioGroup 
          id="ClassificationLevelOptions"
          v-if="classificationRadioOptions.length > 1"
          class="mb-8"
          :items="classificationRadioOptions"
          :value.sync="instanceData.classification_level"
          :legend="classificationLegend"
          :rules="[$validators.required(classificationErrorMessage)]"
          :clearErrorMessages.sync="clearClassificationErrorMessages"
        />

        <hr v-if="hasTellUsAboutInstanceHeading" />

        <h2 class="mb-4">
          {{getCurrentUsageAndUsersSequenceNum}}
          Current usage and users
        </h2>

        <CurrentUsage 
          class="mb-10"
          :usageTrafficSpikeCauses.sync="usageTrafficSpikeCauses"
          :currentUsageDescription.sync="instanceData.current_usage_description"
          :eventSpikeDescription.sync="instanceData.traffic_spike_event_description"
          :periodSpikeDescription.sync="instanceData.traffic_spike_period_description"
        />

        <RegionsDeployedAndUserCount 
          :hasTextFields="true"
          id="RegionsUsers"
          :optional="false"
          groupLabelId="RegionUsersLabel"
          groupLabel="Where are your users located?"
          groupLabelHelpText="Enter the approximate number of users for each selected region."
          @regionUserDataUpdate="regionUserDataUpdate"
          :rules="[$validators.required('Select at least one region.'),]"
          :textfieldRules="[$validators.required('Enter the number of users in this region.'),]"
          :regionUsersOnLoad="regionUsersOnLoad"
        />

        <hr />

        <h2 class="mb-4">
          {{getInstanceConfigurationsSequenceNum}}
          Instance configurations
        </h2>

        <InstanceConfig
          :data.sync="instanceConfig"
          :storageUnits="storageUnits"
        />

        <PerformanceTier 
          :data.sync="performanceTier"
          :storageUnits="storageUnits"
        />

        <hr />

        <span v-if="showPricingDetails">
          <h2 class="mb-4">
            {{getPricingDetailsSequenceNum}}
            Pricing details
          </h2>

          <PricingDetails :pricingDetails.sync="pricingDetails" />

          <hr />
        </span>

        <h2 class="mb-4">
          {{getAdditionalInfoSequenceNum}}
          Additional information 
          <span class="text-base font-weight-400">(Optional)</span>
        </h2>

        <AdditionalInfo :additionalInfo.sync="instanceData.additional_information" />

      </div>
    </div>
  </v-form>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import { Component, Mixins, Watch } from "vue-property-decorator";

import ATATAlert from "@/components/ATATAlert.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";

import AdditionalInfo from "@/components/DOW/AdditionalInfo.vue";
import CurrentUsage from "@/components/DOW/CurrentUsage.vue";
import InstanceConfig from "@/components/DOW/InstanceConfig.vue";
import PerformanceTier from "@/components/DOW/PerformanceTier.vue";
import PricingDetails from "@/components/DOW/PricingDetails.vue";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";

import { 
  CurrEnvInstanceConfig, 
  CurrEnvInstancePerformance,
  SelectData,
  CurrEnvInstancePricingDetails,
  RadioButton,
} from "types/Global";

import AcquisitionPackage from "@/store/acquisitionPackage";
import { 
  ClassificationLevelDTO, 
  CurrentEnvironmentInstanceDTO 
} from "@/api/models";


import CurrentEnvironment, 
{ 
  defaultCurrentEnvironment, 
  defaultCurrentEnvironmentInstance 
} from "@/store/acquisitionPackage/currentEnvironment";
import classificationRequirements from "@/store/classificationRequirements";
import { buildClassificationCheckboxList, hasChanges } from "@/helpers";

import SaveOnLeave from "@/mixins/saveOnLeave";
import _ from "lodash";


@Component({
  components: {
    ATATAlert,
    ATATRadioGroup,
    AdditionalInfo,
    CurrentUsage,
    InstanceConfig, 
    PerformanceTier,
    PricingDetails,
    RegionsDeployedAndUserCount,
  }
})

export default class InstanceDetails extends Mixins(SaveOnLeave) {
  /* eslint-disable camelcase */
  public currEnvData = _.cloneDeep(defaultCurrentEnvironment);
  public envLocation = "";
  public instanceData = _.cloneDeep(defaultCurrentEnvironmentInstance);
  public instanceNumber = 0;
  public isNewInstance = true;
  public isValid = true;

  public get currentData(): CurrentEnvironmentInstanceDTO {

    return this.instanceData;
  }
  public savedData: CurrentEnvironmentInstanceDTO = _.cloneDeep(defaultCurrentEnvironmentInstance);

  public envLocationOptions: RadioButton[] = [
    {
      id: "Cloud",
      label: "Cloud",
      value: "CLOUD",
    },
    {
      id: "OnPremises",
      label: "On-premise",
      value: "ON_PREM",
    },
  ];

  public allClassificationLevels: ClassificationLevelDTO[] = [];
  public classificationRadioOptions: RadioButton[] = [];
  public get classificationLegend(): string {
    return this.instanceData.instance_location === "CLOUD"
      ? "What data classification and impact level is this instance deployed in?"
      : "What type of information are you hosting in this instance?";
  }

  public get classificationErrorMessage(): string {
    return this.instanceData.instance_location === "CLOUD"
      ? "Select a classification and impact level."
      : "Select the type of information that are you hosting.";
  }

  public clearClassificationErrorMessages = false;

  public classificationLabels: Record<string, Record<string, string>> = {
    CLOUD: { 
      IL2: "Unclassified / IL2",
      IL4: "Unclassified / IL4",
      IL5: "Unclassified / IL5",
      IL6: "Secret / IL6",
      TS: "Top Secret",
    },
    ON_PREM: { 
      IL2: "Unclassified (DoD information approved for public release)",
      IL4: "Unclassified (DoD CUI)",
      IL5: "Unclassified (DoD CUI & National Security Systems)",
      IL6: "Secret",
      TS: "Top Secret",
    },
  }

  public setClassificationLabels(): void {
    const locType = this.instanceData.instance_location;
    if (locType) {
      this.classificationRadioOptions.forEach((obj) => {
        const IL = obj.id;
        const labels = this.classificationLabels[locType];
        obj.label = labels[IL];
      });
    }
  }

  public get hasTellUsAboutInstanceHeading(): boolean {
    // only one case where there won't be a "Tell us about instance #x" header -
    // if instance location is on-premise AND only one classification was selected.
    // classification radio options will show if either NO (ZERO) classification
    // levels were selected, or more than one was selected.
    return !(this.currEnvData.env_location === 'ON_PREM'
      && this.currEnvData.env_classifications_onprem.length === 1);
  }

  public selectedDeployedRegionsOnLoad: string[] = [];
  public regionsDeployedUpdate(selected: string[]): void {
    const santized = selected.map(
      element => element.replaceAll("[", "").replaceAll("]","")
    )
    this.instanceData.deployed_regions = santized.length>0 
      ? santized.join(",")
      : ""
  }

  public regionUsersOnLoad = "";
  public regionUserDataUpdate(data: string): void {
    this.instanceData.users_per_region = data;
  }

  public usageTrafficSpikeCauses: string[] = [];
  @Watch("usageTrafficSpikeCauses")
  public usageTrafficSpikeCausesChange(newVal: string[]): void {
    const spikeEventBased = newVal?.includes("EVENT") ? "YES" : "NO";
    const spikePeriodBased = newVal?.includes("PERIOD") ? "YES" : "NO";
    const spikeSelection = {
      is_traffic_spike_event_based: spikeEventBased,
      is_traffic_spike_period_based: spikePeriodBased,
    }
    this.instanceData = Object.assign(this.instanceData, spikeSelection);    
    if (spikeEventBased === "NO") {
      this.instanceData.traffic_spike_event_description = "";
    }
    if (spikePeriodBased === "NO") {
      this.instanceData.traffic_spike_period_description = "";
    }    
  }

  public instanceConfig: CurrEnvInstanceConfig = {
    licensing: "",
    operatingSystem: "",
    numberOfVCPUs: null,
    processorSpeed: null,
    memoryAmount: null,
    storageType: "",
    storageAmount: null,
    storageUnit: "GB",
  }
  @Watch("instanceConfig", {deep: true})
  public instanceConfigChange(newVal: CurrEnvInstanceConfig): void {
    const instanceConfig = {
      licensing: newVal.licensing,
      operating_system: newVal.operatingSystem,
      number_of_vcpus: newVal.numberOfVCPUs,
      processor_speed: newVal.processorSpeed,
      memory_amount: newVal.memoryAmount,
      memory_unit: "GB",
      storage_type: newVal.storageType,
      storage_amount: newVal.storageAmount,
      storage_unit: newVal.storageUnit,
    }
    this.instanceData = Object.assign(this.instanceData, instanceConfig);    
  }

  public performanceTier: CurrEnvInstancePerformance = {
    performanceTier: "",
    numberOfInstances: 1,
    dataEgressMonthlyAmount: null,
    dataEgressMonthlyUnit: "GB",
  }
  @Watch("performanceTier", {deep: true})
  public performanceTierChange(newVal: CurrEnvInstancePerformance): void {
    const performanceTier = {
      performance_tier: newVal.performanceTier,
      number_of_instances: newVal.numberOfInstances,
      data_egress_monthly_amount: newVal.dataEgressMonthlyAmount,
      data_egress_monthly_unit: newVal.dataEgressMonthlyUnit,
    }
    this.instanceData = Object.assign(this.instanceData, performanceTier);    
  }

  public pricingDetails: CurrEnvInstancePricingDetails = {
    currentPaymentArrangement: "",
    pricingPeriodExpirationDate: "",
  }
  @Watch("pricingDetails", {deep: true})
  public pricingDetailsChange(newVal: CurrEnvInstancePricingDetails): void {
    const pricingDetails = {
      pricing_model: newVal.currentPaymentArrangement,
      pricing_model_expiration: newVal.pricingPeriodExpirationDate,
    }
    this.instanceData = Object.assign(this.instanceData, pricingDetails);    
  }

  public regionsDeployedTooltipText = `This is the geographic location where your 
    public cloud resources are located, e.g., within the continental U.S. (CONUS) 
    or outside of the continental U.S. (OCONUS).`;

  public storageUnits: SelectData[] = [
    { text: "Gigabyte (GB)", value: "GB" },
    { text: "Terabyte (TB)", value: "TB" },
    { text: "Petabyte (PB)", value: "PB" },
  ];

  @Watch("instanceData.instance_location")
  public instanceLocationChange(newVal: string, oldVal: string): void {
    // eslint-disable-next-line camelcase
    this.setClassificationLabels();
    this.clearClassificationErrorMessages = true;
    if (oldVal !== "") {
      this.instanceData.classification_level = "";
    }
    const envClassificationLevelSysIds = newVal === "CLOUD"
      ? this.currEnvData.env_classifications_cloud
      : this.currEnvData.env_classifications_onprem;

    if (envClassificationLevelSysIds.length === 1) {
      // eslint-disable-next-line camelcase
      this.instanceData.classification_level = envClassificationLevelSysIds[0];
    } else {
      const filteredClassificationObjects = this.allClassificationLevels.filter((obj) => {
        if (obj.sys_id) {
          return envClassificationLevelSysIds.includes(obj.sys_id)
        }
      });
      
      this.classificationRadioOptions = buildClassificationCheckboxList(
        filteredClassificationObjects, "", false, true, "short"
      );

      this.setClassificationLabels();
    }   
  }
  public async validateOnLoad(): Promise<void> {
    this.isNewInstance = await CurrentEnvironment.isNewInstance();
    if (!this.isNewInstance) {
      // user is editing an existing instance, validate on load
      await this.validate();
      AcquisitionPackage.setValidateNow(true);
      this.$nextTick(async () => {
        AcquisitionPackage.setValidateNow(true);
      });
    }
  }

  public async validate(): Promise<void> {
    this.$nextTick(() => {
      this.isValid = this.$refs.form.validate();
    });
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
    await this.validateOnLoad();
  }

  // EJY NEED ROUTE RESOLVER AFTER on classifications page if no location selected
  // send directly to instance form with region and classification radio groups on every instance


  public async loadOnEnter(): Promise<void> {
    this.allClassificationLevels = await classificationRequirements.getAllClassificationLevels();
    this.instanceNumber = CurrentEnvironment.currentEnvInstanceNumber + 1;
    const envStoreData = await CurrentEnvironment.getCurrentEnvironment();
    if (envStoreData) {
      this.selectedDeployedRegionsOnLoad = [];
      this.currEnvData = envStoreData;
      this.envLocation = envStoreData.env_location;
      const instanceStoreData = await CurrentEnvironment.getCurrentEnvInstance();
      if (instanceStoreData) {
        this.instanceData = _.cloneDeep(instanceStoreData);
        this.savedData = _.cloneDeep(instanceStoreData);
        if (typeof this.instanceData.deployed_regions === "string") {
          //eslint-disable-next-line prefer-const
          let deployedRegionIds = this.instanceData.deployed_regions?.split(',')
          if(deployedRegionIds.length != this.instanceData.deployed_regions?.length){
            deployedRegionIds.forEach((instanceId) => {
              this.selectedDeployedRegionsOnLoad.push(instanceId)
            })
          }
          
        } else {
          console.log("error")
        }
        
        this.regionUsersOnLoad = this.instanceData.users_per_region;

        if (this.instanceData.is_traffic_spike_event_based === "YES") {
          this.usageTrafficSpikeCauses.push("EVENT");
        }
        if (this.instanceData.is_traffic_spike_period_based === "YES") {
          this.usageTrafficSpikeCauses.push("PERIOD");
        }

        this.instanceConfig = {
          licensing: this.instanceData.licensing,
          operatingSystem: this.instanceData.operating_system,
          numberOfVCPUs: this.instanceData.number_of_vcpus,
          processorSpeed: this.instanceData.processor_speed,
          memoryAmount: this.instanceData.memory_amount,
          storageType: this.instanceData.storage_type,
          storageAmount: this.instanceData.storage_amount,
          storageUnit: this.instanceData.storage_unit,
        }
        
        this.performanceTier = {
          performanceTier: this.instanceData.performance_tier,
          numberOfInstances: this.instanceData.number_of_instances,
          dataEgressMonthlyAmount: this.instanceData.data_egress_monthly_amount,
          dataEgressMonthlyUnit: this.instanceData.data_egress_monthly_unit,
        }

        this.pricingDetails = {
          currentPaymentArrangement: this.instanceData.pricing_model,
          pricingPeriodExpirationDate: this.instanceData.pricing_model_expiration,
        }
      }

      if (!instanceStoreData?.instance_location) {
        this.instanceData.instance_location = envStoreData.env_location !== "HYBRID"
          ? envStoreData.env_location : "";
      }
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    // need to flip `setValidateNow` to true in page component's `saveOnLeave` method
    // for pages with checkbox groups that have validation rules
    await AcquisitionPackage.setValidateNow(true);
    const isValid = this.$refs.form.validate();

    try {
      this.instanceData.instance_number = this.instanceNumber;
      this.instanceData.instance_name = "Instance #" + this.instanceNumber;
      this.instanceData.acquisition_package = AcquisitionPackage.packageId;

      if (this.hasChanged() && isValid) {
        await CurrentEnvironment.saveCurrentEnvironmentInstance(this.instanceData);
      } else if (!isValid) {
        // scroll to first errored input/issue
        const el = document.getElementsByClassName("error--text")[0];
        el.scrollIntoView({
          behavior: "smooth"
        });
      }
    } catch (error) {
      console.log(error);
    }

    return isValid;
  }
  /**
   * Processes the instance location 
   * returns false if the instance location is on_prem
   * returns true otherwise
   */
  public get showPricingDetails(): boolean {
    return this.instanceData.instance_location === "ON_PREM" ? false:true 
  }

  /**
   * Compiles and returns the sequence number for current usage & user section
   */
  public get getCurrentUsageAndUsersSequenceNum(): string {
    return this.hasTellUsAboutInstanceHeading ? "2." : "1.";
  }

  /**
   * Compiles and returns the sequence number for instance configurations section
   */
  public get getInstanceConfigurationsSequenceNum(): string {
    return this.hasTellUsAboutInstanceHeading ? "3." : "2.";
  }

  /**
   * Compiles and returns the sequence number for pricing details section
   */
  public get getPricingDetailsSequenceNum(): string {
    return this.hasTellUsAboutInstanceHeading ? "4." : "3.";
  }

  /**
   * Compiles and returns the sequence number for additional information section
   */
  public get getAdditionalInfoSequenceNum(): string {
    if (this.hasTellUsAboutInstanceHeading) {
      return this.instanceData.instance_location === "ON_PREM" ? "4." : "5.";
    } else {
      return this.instanceData.instance_location === "ON_PREM" ? "3." : "4.";
    }
  }

}

</script>
