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
import {defaultCurrentEnvironment} from "@/store/acquisitionPackage/currentEnvironment";
import Periods from "@/store/periods";
import ContactData from "@/store/contactData";
import OrganiationData from "@/store/organizationData";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Attachments from "@/store/attachments";
import FinancialDetails from "@/store/financialDetails";

/**
 * Performs any session or state cleanup before routing the user to a new acquisition. This
 * component is expected to be used everywhere there is an option to start a new acquisition.
 */
@Component({})
export default class StartNewAcquisition extends Vue {
  @Prop({ default: "StartNewAcquisitionButton" }) private id!: string;
  @Prop({ default: "Start New Acquisition" }) private label!: string;

  public async startNewAcquisition(): Promise<void> {
    AcquisitionPackage.setInitialized(false);
    Periods.setInitialized(false);
    ContactData.setInitialized(false);
    OrganiationData.setInitialized(false);
    DescriptionOfWork.setInitialized(false);
    Attachments.setInitialized(false);
    FinancialDetails.setInitialized(false);
    // TODO: delete below 2 lines after CurrentEnvironment-initialCurrentEnvironment TODOs are fixed
    delete defaultCurrentEnvironment.sys_id;
    defaultCurrentEnvironment.env_instances = [];
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
