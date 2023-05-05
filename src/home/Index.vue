<template>
  <div 
    class="_home-wrapper"
    :class="[
      {'_is-new-user' : isNewUser },
      {'_is-existing-user' : !isNewUser }
    ]"  
  >
    <ATATToast />

    <div class="_hero-banner"></div>
    <v-main class="_home">
      <div class="_home-content">
        <div class="container-max-width">
          <div class="_welcome-bar">
            <div class="d-flex justify-start">
              <h1 class="text-primary">
                Hi {{currentUser.first_name}}! How can we help you?
              </h1>
            </div>
            <div class="d-flex justify-end">
              <v-btn 
                v-if="!isNewUser"
                class="v-btn primary"
                @click="startNewAcquisition"
              >
                Start a new acquisition
              </v-btn>
              <v-btn
                v-else
                href="https://community.hacc.mil/s/jwcc"
                target="_blank"
                id="HelpfulResourcesButton"
                class="secondary no-text-decoration"
              >
                Learn more about JWCC&nbsp;<v-icon>launch</v-icon>
              </v-btn>
            </div>
          </div>
        </div>

        <NewUser 
          v-if="isNewUser" 
          class="mt-15" 
          @startNewAcquisition="startNewAcquisition" 
          @startProvisionWorkflow="startProvisionWorkflow"
          @openTOSearchModal="openSearchTOModal"
        />

        <ExistingUser 
          v-else 
          class="mt-8" 
          @startNewAcquisition="startNewAcquisition" 
          @allPackagesCleared="allPackagesCleared"
          @openTOSearchModal="openSearchTOModal"
          @startProvisionWorkflow="startProvisionWorkflow"
          @portfolioCountUpdated="portfolioCountUpdated"
        />      

        <div class="bg-white">
          <ATATFooter class="mx-auto pt-10" />
        </div>

      </div>

    </v-main>

    <TaskOrderSearchModal
      :showTOSearchModal.sync="showTOSearchModal"
      :TONumber.sync="TONumber"
      :resetValidationNow.sync="resetValidationNow"
      @TOSearchCancelled="TOSearchCancelled"
      @startProvisionWorkflow="startProvisionWorkflow"
    />    

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATFooter from "@/components/ATATFooter.vue";
import ExistingUser from "./ExistingUser.vue";
import NewUser from "./NewUser.vue";
import ATATToast from "@/components/ATATToast.vue";
import ATATLoadingPackageModal from "@/components/ATATLoadingPackageModal.vue";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";

import HelpfulResourcesCards from "./components/HelpfulResourcesCards.vue";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";
import { provWorkflowRouteNames } from "@/router/provisionWorkflow";

import { scrollToId } from "@/helpers";

import UserStore from "@/store/user";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";
import PortfolioStore from "@/store/portfolio";
import acquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATFooter,
    ATATLoadingPackageModal,
    ATATToast,
    ExistingUser,
    HelpfulResourcesCards,
    NewUser,
    TaskOrderSearchModal,
  }
})

export default class Home extends Vue {

  public showTOSearchModal = false;
  public TONumber = "";
  public resetValidationNow = false;
  public selectedAcquisitionPackageSysId = "";
  
  public openSearchTOModal(acqPackageSysId: string): void {
    this.selectedAcquisitionPackageSysId = acqPackageSysId;
    this.showTOSearchModal = true;
  }

  public async TOSearchCancelled(): Promise<void> {
    this.TONumber = "";
    this.resetValidationNow = true;
    this.showTOSearchModal = false;
    this.selectedAcquisitionPackageSysId = "";
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
    await PortfolioStore.setShowTOPackageSelection(true);
  }

  public get isNewUser(): boolean {
    return !this.userHasPackages && !this.userHasPortfolios;
  } 

  public userHasPackages = false;
  public userHasPortfolios = false;

  public allPackagesCleared(): void {
    this.userHasPackages = false;
  }

  private currentUser: UserDTO = {};

  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public async currentUserChange(newVal: UserDTO): Promise<void> {
    this.currentUser = newVal;
    await this.checkIfIsNewUser();
  }  

  public async startNewAcquisition(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    await acquisitionPackage.setFirstTimeVisit(true)
    this.$router.push({
      name: routeNames.DAPPSChecklist,
      params: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }

  public async startProvisionWorkflow(): Promise<void>{
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    await AcquisitionPackage.reset();
    if (this.selectedAcquisitionPackageSysId) {
      await PortfolioStore.setShowTOPackageSelection(false);
    }
    await PortfolioStore.setSelectedAcquisitionPackageSysId(this.selectedAcquisitionPackageSysId);


    this.$router.push({
      name: provWorkflowRouteNames.AwardedTaskOrder,
      params: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.ProvisionWorkflow);
    
  }

  public portfolioCountUpdated(portfolioCount: string): void {
    this.userHasPortfolios = parseInt(portfolioCount) > 0;
  }

  public async checkIfIsNewUser(): Promise<void> {
    this.userHasPackages = await UserStore.hasPackages();
    await UserStore.hasPortfolios();
    this.userHasPortfolios = UserStore.getUserHasPortfolios;
  }

  public async mounted(): Promise<void> {
    await AcquisitionPackage.reset();
    await AcquisitionPackage.setHideNavigation(false);
    this.currentUser = await UserStore.getCurrentUser();
    // await this.checkIfIsNewUser();
    const sectionData = await AppSections.getSectionData();
    AcquisitionPackage.doSetCancelLoadDest(sectionData.sectionTitles.Home);
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
    await PortfolioStore.setShowTOPackageSelection(true);
    await this.checkIfIsNewUser();
  }


}

</script>
