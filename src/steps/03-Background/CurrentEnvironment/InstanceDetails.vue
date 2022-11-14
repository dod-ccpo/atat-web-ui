
<template>
  <div class="container-max-width">
    <h1 class="mb-10">
      Let’s start gathering details about each instance in your environment
    </h1>
    <p>
      An instance may be an isolated environment, an enclave, or a collection of 
      components. Aggregate all virtual machines (VMs) with similar specifications 
      into a single instance below. If you have multiple instances, we will walk 
      through them one at a time.
    </p>

    <h2 class="mb-4" v-if="hasTellUsAboutInstanceHeading">1. Tell us about Instance #1</h2>

    <ATATRadioGroup 
      v-if="envLocation === 'HYBRID' || !envLocation"
      id="EnvironmentLocation"
      class="mb-8"
      :items="envLocationOptions"
      tooltipText="<strong>On-premises environments</strong> are deployed in-house 
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
        @selectedRegionsUpdate="regionsDeployedUpdate"
        :tooltipText="regionsDeployedTooltipText"
        :optional="true"
      />

      <!-- v-if="showClassificationOptions" -- TODO after curr env classifications page wired -->
      <ATATRadioGroup 
        id="ClassificationLevelOptions"
        class="mb-8"
        :items="classificationRadioOptions"
        :value.sync="instanceData.classification"
        :legend="classificationLegend"
        :rules="[$validators.required(classificationErrorMessage)]"
        :clearErrorMessages.sync="clearClassificationErrorMessages"
      />

      <hr v-if="hasTellUsAboutInstanceHeading" />

      <h2 class="mb-4">
        {{ hasTellUsAboutInstanceHeading ? "2." : "1." }}
        Current usage and users
      </h2>

      <CurrentUsage 
        class="mb-10"
        :currentUsage.sync="currentUsage"   
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
      />

      <hr />

      <h2 class="mb-4">
        {{ hasTellUsAboutInstanceHeading ? "3." : "2." }}
        Instance configurations
      </h2>

      <InstanceConfig
        :instanceConfig.sync="instanceConfig"
        :storageUnits="storageUnits"
      />

      <PerformanceTier 
        :performanceTier.sync="performanceTier"
        :storageUnits="storageUnits"
      />

      <hr />

      <h2 class="mb-4">
        {{ hasTellUsAboutInstanceHeading ? "4." : "3." }}
        Pricing details
      </h2>

      <PricingDetails :pricingDetails.sync="pricingDetails" />

      <hr />

      <h2 class="mb-4">
        {{ hasTellUsAboutInstanceHeading ? "5." : "4." }}
        Additional information 
        <span class="text-base font-weight-400">(Optional)</span>
      </h2>

      <AdditionalInfo :additionalInfo.sync="additionalInfo" />

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATRadioGroup from "@/components/ATATRadioGroup.vue";

import AdditionalInfo from "@/components/DOW/AdditionalInfo.vue";
import CurrentUsage from "@/components/DOW/CurrentUsage.vue";
import InstanceConfig from "@/components/DOW/InstanceConfig.vue";
import PerformanceTier from "@/components/DOW/PerformanceTier.vue";
import PricingDetails from "@/components/DOW/PricingDetails.vue";
import RegionsDeployedAndUserCount from "@/components/DOW/RegionsDeployedAndUserCount.vue";

import { 
  Checkbox, 
  CurrentEnvInstanceConfig, 
  CurrentEnvUsageData, 
  CurrentEnvPerformanceTier,
  SelectData,
  CurrentEnvPricingDetails,
  RadioButton,
} from "types/Global";

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { ClassificationLevelDTO, CurrentEnvironmentDTO } from "@/api/models";

import CurrentEnvironment, 
{ 
  defaultCurrentEnvironment, 
  defaultCurrentEnvironmentInstance 
} from "@/store/acquisitionPackage/currentEnvironment";
import classificationRequirements from "@/store/classificationRequirements";
import { buildClassificationCheckboxList } from "@/helpers";


@Component({
  components: {
    ATATRadioGroup,
    AdditionalInfo,
    CurrentUsage,
    InstanceConfig, 
    PerformanceTier,
    PricingDetails,
    RegionsDeployedAndUserCount,
  }
})

export default class InstanceDetails extends Vue {
  public currEnvData = defaultCurrentEnvironment;
  public envLocation = "";
  public instanceData = defaultCurrentEnvironmentInstance;

  public envLocationOptions: RadioButton[] = [
    {
      id: "Cloud",
      label: "Cloud",
      value: "CLOUD",
    },
    {
      id: "OnPremises",
      label: "On-premises",
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

  @Watch("instanceData.instance_location")
  public instanceLocChanged(): void {
    this.setClassificationLabels();
    this.clearClassificationErrorMessages = true;
  }

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
    // if instance location is on-premises AND only one classification was selected.
    // classification radio options will show if either NO (ZERO) classification
    // levels were selected, or more than one was selected.
    return !(this.instanceData.instance_location === 'ON_PREM' 
      && this.currEnvData.env_classifications_on_prem.length === 1);
  }

  // public sectionNumber(section: string): string {
  //   switch (section) {
  //   case "currentUsage": 
  //     return this.instanceData.instance_location === 'ON_PREM' 
  //     && this.currEnvData.env_classifications_cloud.length === 1
  //       ? "1." : "2."
  //   }
  //   return "";
  // }

  public regionsDeployed: string [] = [];
  public regionsDeployedUpdate(selected: string[]): void {
    this.regionsDeployed = selected;
  }

  public regionUserData: Checkbox[] = [];
  public regionUserDataUpdate(data: Checkbox[]): void {
    this.regionUserData = data;
  }

  public currentUsage: CurrentEnvUsageData = {
    currentUsageDescription: "",
    trafficSpikeCauses: [],
    isTrafficSpikeEventBased: "",
    isTrafficSpikePeriodBased: "",
    trafficSpikeEventDescription: "",
    trafficSpikePeriodDescription: "",
  }

  public instanceConfig: CurrentEnvInstanceConfig = {
    licensing: "",
    operatingSystem: "",
    numberOfVCPUs: null,
    processorSpeed: null,
    memoryAmount: null,
    storageType: "",
    storageAmount: null,
    storageUnit: "GB",
  }

  public performanceTier: CurrentEnvPerformanceTier = {
    performanceTier: "",
    numberOfSimilarInstances: 1,
    dataEgressMonthlyAmount: null,
    dataEgressMonthlyUnit: "GB",
  }

  public pricingDetails: CurrentEnvPricingDetails = {
    currentPaymentArrangement: "",
    pricingPeriodExpirationDate: "",
  }

  public additionalInfo = "";

  public regionsDeployedTooltipText = `This is the geographic location where your 
    public cloud resources are located, e.g., within the continental U.S. (CONUS) 
    or outside of the continental U.S. (OCONUS).`;

  public storageUnits: SelectData[] = [
    { text: "Gigabyte (GB)", value: "GB" },
    { text: "Terabyte (TB)", value: "TB" },
    { text: "Petabyte (PB)", value: "PB" },
  ];

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    // const storeData = await AcquisitionPackage
    //   .loadData<CurrentEnvironmentDTO>(
    //     {storeProperty: StoreProperties.CurrentEnvironment}
    //   );

    this.allClassificationLevels = await classificationRequirements.getAllClassificationLevels();
    this.classificationRadioOptions = buildClassificationCheckboxList(
      this.allClassificationLevels, "", false, true, "short"
    );

    const envStoreData = await AcquisitionPackage.getCurrentEnvironment();

    if (envStoreData) {
      this.currEnvData = envStoreData;
      this.envLocation = envStoreData.env_location;
      // eslint-disable-next-line camelcase
      this.instanceData.instance_location = envStoreData.env_location !== "HYBRID"
        ? envStoreData.env_location : "";
      this.setClassificationLabels();

      // this.savedData = {
      // }
    }

  }

  /* eslint-disable camelcase */
  /* eslint-disable max-len */
  public currentEnvironment = {
    current_environment_exists: "", // radio - YES | NO 
    has_system_documentation: "", // radio - YES | NO
    system_documentation: [], // array of attachments
    has_migration_documentation: "", // radio - YES | NO
    migration_documentation: [], // array of attachments
    env_location: "", // CLOUD | ON_PREM | HYBRID
    env_classifications_cloud: [], // array of classification level sys_ids
    env_classifications_onprem: [], // array of classification level sys_ids
    // IL2_cloud_deployments: [], // CAN BE POST-MVP -- Commercial Cloud | Federal community cloud (govt cloud)

    env_instances: [
      {
        instance_location: "", // CLOUD | ON_PREM - auto-set if env_loc is CLOUD or ON_PREM - radio if HYBRID
        deployed_regions: [], // checkboxes - CONUS East, CONUS Central, etc.
        instance_classification: "", // classification level sys_id
        // IL2_cloud_types: [], // CAN BE POST-MVP
        current_usage_description: "", // radio - even usage or spikes in traffic
        traffic_spike: [], // checkboxes - event-based or period-based
        surge_usage_event: "", // textfield
        surge_usage_periods: "", // textfield 
        users_regions: [ // checkboxes with textfields
          {
            region: "", // checkbox
            count: null, // null | number - textfield
          },
        ], 
        operating_system: "",
        licensing: "",
        number_Of_VCPUs: null, // number | null - no decimals
        processor_speed: null, // number | null - no decimals 
        memory_amount: null, // number | null - one decimal place
        memory_unit: "GB", // only used in text field as append text
        storage_type: "", // dropdown - 
        storage_amount: null, // number | null - no decimals
        storage_unit: "GB", // dropdown -- GB | TB | PB - default GB
        performance_tier: "", // radio - GENERAL_PURPOSE | COMPUTE_OPTIMIZED | MEMORY_OPTIMIZED | STORAGE_OPTIMIZED
        number_of_similar_instances: null, // number | null - no decimals 
        data_egress_monthly_storage: null, // number | null - no decimals    
        data_egress_monthly_storage_unit: "GB", // dropdown -- GB | TB | PB - default GB   
        current_payment_arrangement: "", // radio - PREPAID | PAYASYOUGO
        pricing_period_expiration_date: "", // datepicker - ISO string
        additional_information: "", // textarea
      }
    ],
    current_environment_replicated_optimized: "", // radio - REPLICATE | OPTIMIZE | NO
    statement_replicated_optimized: "", // textarea
    additional_growth: "", // "YES" | "NO"
    anticipated_yearly_additional_capacity: null, // number | null - textfield
    has_phased_approach: "", // "YES" | "NO"
    phased_approach_schedule: "", // textarea 
    needs_architectural_design_services: "", // "YES" | "NO"
    statement_architectural_design: "", // textarea 
    applications_need_architectural_design: "", // textfield
    data_classifications_impact_levels: [], // checkboxes - array of sys_ids for U/IL2, U/IL3, U/IL4, Secret/IL6 - Top Secret hidden per Melissa
    external_factors_architectural_design: "", // textfield
  }

}

</script>
