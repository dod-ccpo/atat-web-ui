<template>
  <v-main>
    <div class="container-max-width-wide" style="margin: 0 auto;">
    <h1 class="page-header">Ready to create your first ATAT portfolio?</h1>
    <v-row>
      <v-col col="8" class="mr-15" style="max-width: 560px">
        <div class="copy-max-width">
          <p class="mb-3">
            We’ll guide you through steps to start provisioning cloud resources 
            and building an ATAT portfolio. Once set up, you’ll be provided a 
            dashboard for viewing funding reports and managing access to your cloud console.
          </p>
          <p class="font-weight-500 mb-3">You can expect to:</p>
          <v-list class="_atat-stepper mb-10">
              <v-list-item
                v-for="(stepText, index) in provisionStepsText"
                :key="index"
              >
                <span class="_step-circle">{{ index + 1 }}</span>
                <div class="mb-2">
                  {{ stepText }}
                </div>
              </v-list-item>
          </v-list>
          <div class="mb-6 pa-6 rounded-lg _card-soft-shadow">
            <TaskOrderSearch
              label="Get started by adding your task order number"
              labelClass="h3"
              :TONumber="TONumber"
              @update:TONumber="TONumber = $event"
              @startProvisionWorkflow="startProvisionWorkflow"
              :wrapperWidth="searchWidth"
              :width="searchWidth"
            />
          </div>
          <ATATExpandableLink aria-id="DataRetrievedFrom">
            <template v-slot:header>
              What if I don’t have a task order?
            </template>
            <template v-slot:content>
              <p class="mb-4">
                First, you will need to
                <a
                  id="createAPackageLink"
                  role="button"
                  @click="startNewAcquisition"
                  @keydown.enter="startNewAcquisition"
                  @keydown.space="startNewAcquisition"
                  >create a package</a
                >
                using the DISA Acquisition Package Preparation System (DAPPS).
                Upon submission of your requirements package, your Contracting
                Office will review the completed documents and begin the
                procurement process.
              </p>
              <p>
                Your Contracting Office will notify you when a task order has
                been awarded for your requirement.
              </p>
            </template>
          </ATATExpandableLink>
        </div>
      </v-col>
      <v-col cols="4" > 
        <ATATSVGIcon
          width="545"
          height="481"
          name="startProvisioning"
          color="primary"
        />
      </v-col>
    </v-row>
      <ATATFooter/>
  </div>
  </v-main>
</template>

<script lang="ts">
/*eslint prefer-const: 1 */
import AcquisitionPackage from "@/store/acquisitionPackage";
import AppSections from "@/store/appSections";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import ATATFooter from "../../components/ATATFooter.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { Component,  Vue, toNative } from "vue-facing-decorator";
import PortfolioStore from "@/store/portfolio";
import { provWorkflowRouteNames } from "@/router/provisionWorkflow";
import { routeNames } from "@/router/stepper";
import Steps from "@/store/steps";
import TaskOrderSearch from "../components/TaskOrderSearch.vue";

@Component({
  components: {
    ATATExpandableLink,
    ATATFooter,
    ATATSVGIcon,
    TaskOrderSearch,
  },
})
class CreateFirstPortfolio extends Vue {
  public provisionStepsText = [
    `Provide details about your awarded task order and the individuals who will 
      administer your cloud resources.`,
    `Initiate provisioning and ATAT will automate the creation of your account 
      and environment with your Cloud Service Provider (CSP).`,
    `Track your cloud usage and manage spending throughout the duration of 
      the task order.`,
  ];

  public searchWidth = "100%";

  public TONumber = "";

  public async startProvisionWorkflow(): Promise<void> {
    await Steps.setAltBackDestination(
      AppSections.sectionTitles.CreateFirstPortfolio
    );
    await AcquisitionPackage.reset();

    this.$router.push({
      name: provWorkflowRouteNames.AwardedTaskOrder,
      query: {
        direction: "next",
      },
      replace: true,
    });
    AppSections.changeActiveSection(
      AppSections.sectionTitles.ProvisionWorkflow
    );
  }

  public async startNewAcquisition(): Promise<void> {
    await Steps.setAltBackDestination(
      AppSections.sectionTitles.CreateFirstPortfolio
    );
    await AcquisitionPackage.setIsNewPackage(true);
    await AcquisitionPackage.reset();
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
    this.$router.push({
      name: routeNames.DAPPSChecklist,
      query: {
        direction: "next",
      },
      replace: true,
    });
    AppSections.changeActiveSection(
      AppSections.sectionTitles.AcquisitionPackage
    );
  }
}
export default toNative(CreateFirstPortfolio)
</script>
