<template>
  <div 
    class="_home-wrapper"
    :class="[
      {'_is-new-user' : isNewUser && !isLoading },
      {'_is-existing-user' : !isNewUser || isLoading },
      {'_is-loading' : isLoading },
    ]"  
  >
    <ATATToast />

    <div class="_hero-banner"></div>
    <v-main class="_home">
      <div class="_home-content">
        <div class="container-max-width mx-auto">
          <div v-if="isLoading" style="height: 1000px;">
            <div class="_welcome-bar" style="height: 92px">
              <div class="d-flex align-center" style="margin: 0 auto">
                <v-progress-circular 
                  indeterminate color="#544496" size="24" width="3" class="mr-2" />
                <span class="h3">Loading...</span>
              </div>
            </div>
          </div>

          <div v-if="!isLoading" class="_welcome-bar">
            <div class="d-flex justify-start">
              <h1 class="text-primary">
                Hi {{currentUser.first_name}}! How can we help you?
              </h1>
            </div>
            <div class="d-flex justify-end">
              <v-btn 
                v-if="!isNewUser"
                class="v-btn _primary"
                @click="startNewAcquisition"
              >
                Start a new acquisition
              </v-btn>
              <v-btn
                v-else
                href="https://community.hacc.mil/s/jwcc"
                target="_blank"
                id="HelpfulResourcesButton"
                class="_secondary no-text-decoration"
              >
                Learn more about JWCC&nbsp;<v-icon>mdi-launch</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div v-if="!isLoading">
          <NewUser 
            v-if="isNewUser" 
            class="mt-15" 
            @startNewAcquisition="startNewAcquisition" 
            @startProvisionWorkflow="startProvisionWorkflow"
            @openTOSearchModal="openSearchTOModal"
          />

          <ExistingUser 
            v-else 
            class="mt-5" 
            @startNewAcquisition="startNewAcquisition" 
            @openTOSearchModal="openSearchTOModal"
            @startProvisionWorkflow="startProvisionWorkflow"

          />      
        </div>

        <div class="bg-white _is-home">
          <ATATFooter class="mx-auto pt-10" />
        </div>

      </div>

    </v-main>

    <TaskOrderSearchModal
      :showTOSearchModal="showTOSearchModal"
      @update:showTOSearchModal="showTOSearchModal = $event"
      :TONumber="TONumber"
      @update:TONumber="TONumber = $event"
      :resetValidationNow="resetValidationNow"
      @update:resetValidationNow="resetValidationNow = $event"
      @TOSearchCancelled="TOSearchCancelled"
      @startProvisionWorkflow="startProvisionWorkflow"
    />    

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, toNative } from "vue-facing-decorator";
import ATATFooter from "@/components/ATATFooter.vue";
import ExistingUser from "./ExistingUser.vue";
import NewUser from "./NewUser.vue";
import ATATToast from "@/components/ATATToast.vue";
import ATATLoader from "@/components/ATATLoader.vue";
import ATATLoadingPackageModal from "@/components/ATATLoadingPackageModal.vue";
import TaskOrderSearchModal from "@/portfolios/components/TaskOrderSearchModal.vue";

import HelpfulResourcesCards from "./components/HelpfulResourcesCards.vue";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";
import { provWorkflowRouteNames } from "@/router/provisionWorkflow";

import AcquisitionPackage from "@/store/acquisitionPackage";

import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";
import PortfolioStore from "@/store/portfolio";
import Toast from "@/store/toast";
import { ToastObj } from "types/Global";

@Component({
  components: {
    ATATFooter,
    ATATLoader,
    ATATLoadingPackageModal,
    ATATToast,
    ExistingUser,
    HelpfulResourcesCards,
    //TODO Validate with new sys_id
    NewUser,
    TaskOrderSearchModal,
  }
})

class Home extends Vue {

  public showTOSearchModal = false;
  public TONumber = "";
  public resetValidationNow = false;
  public selectedAcquisitionPackageSysId = "";
  public isLoading = true;

  public get userIsInitialized(): boolean {
    return CurrentUserStore.isInitialized;
  }  
  @Watch("userIsInitialized")
  public async userIsInitializedChanged(newVal: boolean): Promise<void> {
    this.isLoading = !newVal;
    if (newVal === true) {
      await this.loadDashboard();  
    }
  }

  public openSearchTOModal(acqPackageSysId: string): void {
    if(acqPackageSysId){
      this.selectedAcquisitionPackageSysId = acqPackageSysId;
    }
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
  public get userHasPackages(): boolean {
    return CurrentUserStore.getUserHasPackages;
  }
  public get userHasPortfolios(): boolean {
    return CurrentUserStore.getUserHasPortfolios;
  }

  public get currentUser(): UserDTO {
    return CurrentUserStore.getCurrentUserData;
  }

  public async startNewAcquisition(): Promise<void> {
    await AcquisitionPackage.setIsNewPackage(true)
    await AcquisitionPackage.reset();
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
    this.$router.push({
      name: routeNames.DAPPSChecklist,
      query: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }

  public async startProvisionWorkflow(): Promise<void>{
    await AcquisitionPackage.reset();
    if (this.selectedAcquisitionPackageSysId) {
      await PortfolioStore.setShowTOPackageSelection(false);
    }
    await PortfolioStore.setSelectedAcquisitionPackageSysId(this.selectedAcquisitionPackageSysId);

    this.$router.push({
      name: provWorkflowRouteNames.AwardedTaskOrder,
      query: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.ProvisionWorkflow);
  }

  public async loadDashboard(): Promise<void> {
    await AcquisitionPackage.reset();
    await AcquisitionPackage.setHideNavigation(false);
    const sectionData = await AppSections.getSectionData();
    AcquisitionPackage.doSetCancelLoadDest(sectionData.sectionTitles.Home);
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
    await PortfolioStore.setShowTOPackageSelection(true);
  }

  public async mounted(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    await PortfolioStore.setProvisioningTOFollowOn(false)
    await PortfolioStore.setProvisioningFromMeatballMenu(false);
    await AcquisitionPackage.loadFeedbackOptions()
    
    this.isLoading = true;
    await CurrentUserStore.initialize();
    if (PortfolioStore.userLeftPortfolio) {
      Toast.setToast(this.accessRemovedToast);
      await PortfolioStore.setUserLeftPortfolio(false);
    }
  }

  public accessRemovedToast: ToastObj = {
    type: "success",
    message: "Portfolio access removed",
    isOpen: true,
    hasUndo: false,
    hasIcon: true,
  };

}
export default toNative(Home)
</script>
