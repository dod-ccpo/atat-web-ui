
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

    <RegionsDeployedAndUserCount 
      :hasTextFields="false"
      id="RegionsDeployed"
      groupLabelId="RegionsDeployedLabel"
      groupLabel="In which region(s) is this instance deployed?"
      @selectedRegionsUpdate="regionsDeployedUpdate"
      :tooltipText="regionsDeployedTooltipText"
      :optional="true"
    />
    
    <hr />

    <h2 class="mb-4">2. Current usage and users</h2>

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

    <h2 class="mb-4">3. Instance configurations</h2>

    <InstanceConfig
      :instanceConfig.sync="instanceConfig"
      :storageUnits="storageUnits"
    />

    <PerformanceTier 
      :performanceTier.sync="performanceTier"
      :storageUnits="storageUnits"
    />

    <hr />

    <h2 class="mb-4">4. Pricing details</h2>

    <PricingDetails :pricingDetails.sync="pricingDetails" />

    <hr />

    <h2 class="mb-4">
      5. Additional information 
      <span class="text-base font-weight-400">(Optional)</span>
    </h2>

    <AdditionalInfo :additionalInfo.sync="additionalInfo" />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

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
} from "types/Global";

import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { CurrentEnvironmentDTO } from "@/api/models";

@Component({
  components: {
    AdditionalInfo,
    CurrentUsage,
    InstanceConfig, 
    PerformanceTier,
    PricingDetails,
    RegionsDeployedAndUserCount,
  }
})

export default class EnvironmentDetails extends Vue {

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
    numberOfSimilarInstances: null,
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
    const storeData = await AcquisitionPackage
      .loadData<CurrentEnvironmentDTO>(
        {storeProperty: StoreProperties.CurrentEnvironment}
      );
    if (storeData) {
      debugger;
      // this.savedData = {
      //   additional_information: storeData.additional_information,
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
    env_location: "", // CLOUD | ONPREM | HYBRID
    env_classifications: [], // array of classification level sys_ids
    // IL2_cloud_deployments: [], // CAN BE POST-MVP -- Commercial Cloud | Federal community cloud (govt cloud)

    env_instances: [
      {
        instance_location: "", // CLOUD | ONPREM - auto-set if env_loc is CLOUD or ONPREM - radio if HYBRID
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
        memory: null, // number | null - one decimal place
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
