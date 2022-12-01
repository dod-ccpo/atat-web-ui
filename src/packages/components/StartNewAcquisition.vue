<template>
  <v-btn
      :id="id"
      class="primary width-100"
      :ripple="false"
      @click="startNewAcquisition"
      @keydown.enter="startNewAcquisition"
      @keydown.space="startNewAcquisition"
  > 
    <!-- TODO: do we need the above 2 keydown events? Defined here because they are defined
          in NewUser, ExistingUser and NewAcquisitionCard components. But not defined in Home and
          Packages components -->
    {{label}}
  </v-btn>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import {routeNames} from "@/router/stepper";
import AcquisitionPackage from "@/store/acquisitionPackage";
import CurrentEnvironment,
{defaultCurrentEnvironment} from "@/store/acquisitionPackage/currentEnvironment";
import Periods from "@/store/periods";
import ContactData from "@/store/contactData";
import OrganiationData from "@/store/organizationData";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Attachments from "@/store/attachments";
import FinancialDetails from "@/store/financialDetails";
import ClassificationRequirements from "@/store/classificationRequirements";
import TaskOrder from "@/store/taskOrder";

/**
 * Performs any session or state cleanup before routing the user to a new acquisition. This
 * component is expected to be used everywhere there is an option to start a new acquisition.
 */
@Component({})
export default class StartNewAcquisition extends Vue {
  @Prop({ default: "StartNewAcquisitionButton" }) private id!: string;
  @Prop({ default: "Start New Acquisition" }) private label!: string;

  /**
   * TODO: temp function until current env is hooked up to snow
   */
  private cleanAllCurrentEnvironmentStore() {
    delete defaultCurrentEnvironment.sys_id;
    defaultCurrentEnvironment.env_instances = [];
    defaultCurrentEnvironment.additional_growth= "" as const;
    defaultCurrentEnvironment.anticipated_yearly_additional_capacity = null;
    defaultCurrentEnvironment.applications_need_architectural_design = "";
    defaultCurrentEnvironment.current_environment_replicated_optimized = "";
    defaultCurrentEnvironment.data_classifications_impact_levels = [];
    defaultCurrentEnvironment.env_classifications_cloud = [];
    defaultCurrentEnvironment.env_classifications_on_prem = [];
    defaultCurrentEnvironment.env_instances = [];
    defaultCurrentEnvironment.env_location = "";
    defaultCurrentEnvironment.external_factors_architectural_design = "";
    defaultCurrentEnvironment.has_phased_approach = "";
    defaultCurrentEnvironment.needs_architectural_design_services = "";
    defaultCurrentEnvironment.phased_approach_schedule = "";
    defaultCurrentEnvironment.statement_architectural_design = "";
    defaultCurrentEnvironment.statement_replicated_optimized = "";
    defaultCurrentEnvironment.current_environment_exists = "";
    defaultCurrentEnvironment.has_system_documentation = "";
    defaultCurrentEnvironment.has_migration_documentation = "";
  }

  public async startNewAcquisition(): Promise<void> {
    AcquisitionPackage.setInitialized(false);
    Periods.setInitialized(false);
    ContactData.setInitialized(false);
    OrganiationData.setInitialized(false);
    DescriptionOfWork.setInitialized(false);
    Attachments.setInitialized(false);
    FinancialDetails.setInitialized(false);
    ClassificationRequirements.setInitialized(false);
    CurrentEnvironment.setInitialized(false);
    TaskOrder.setInitialized(false);

    // TODO: delete below call and the called function after CurrentEnvironment-
    //  initialCurrentEnvironment is tied to SNOW
    this.cleanAllCurrentEnvironmentStore();

    // perform any other cleanup operations/ calls here.
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    this.$router.push({
      name: routeNames.ProjectOverview,
      params: {
        direction: "next"
      }
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }
}
</script>

<style scoped>

</style>
