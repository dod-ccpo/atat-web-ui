<template>
  <div>hi there</div>
 
</template>

<script lang="ts">
import { Component, Vue, toNative, Watch } from "vue-facing-decorator";
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
import acquisitionPackage from "@/store/acquisitionPackage";
import Toast from "@/store/toast";
import { ToastObj } from "types/Global";

// @Component({
//   components: {
//     ATATFooter,
//     ATATLoader,
//     ATATLoadingPackageModal,
//     ATATToast,
//     ExistingUser,
//     HelpfulResourcesCards,
//     NewUser,
//     TaskOrderSearchModal,
//   }
// })

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
    await acquisitionPackage.setIsNewPackage(true)
    await AcquisitionPackage.reset();
    await PortfolioStore.setSelectedAcquisitionPackageSysId("");
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
export default toNative(Home);
</script>
