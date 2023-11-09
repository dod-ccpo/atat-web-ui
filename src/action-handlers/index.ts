import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";

import router from "@/router";
import PortfolioStore from "@/store/portfolio";
import AppSections from "@/store/appSections";
import PortfolioSummary from "@/portfolios/portfolio/components/Index.vue"
import { provWorkflowRouteNames } from "@/router/provisionWorkflow";
import { FairOpportunityDTO } from "@/api/models";
import { routeNames } from "@/router/stepper";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

const actionHandlerNames = {
  sampleAdditionalButtonAction: "sampleAdditionalButtonAction",
  deleteServiceOfferingGroup: "deleteServiceOfferingGroup",
  confirmOtherOfferingDeletion: "confirmOtherOfferingDeletion",
  confirmServiceDeletion: "confirmServiceDeletion",
  clearCurrentContractInfo: "clearCurrentContractInfo",
  confirmDeleteTravelAll: "confirmDeleteTravelAll",
  openTOSearchModal: "openTOSearchModal",
  startProvisioning: "startProvisioning",
  didNotUseDapps: "didNotUseDapps",
  writeOwnSoleSourceCause: "writeOwnSoleSourceCause",
  writeOwnMarketResearchDetails: "writeOwnMarketResearchDetails",
  WriteOwnBarriers: "WriteOwnBarriers",
  startNewPortfolio: "startNewPortfolio",
  submitPackage: "submitPackage"
}

const actions =  {
  [actionHandlerNames.sampleAdditionalButtonAction]: sampleAdditionalButtonAction,
  [actionHandlerNames.deleteServiceOfferingGroup]: deleteServiceOfferingGroup,
  [actionHandlerNames.confirmOtherOfferingDeletion]: confirmOtherOfferingDeletion,
  [actionHandlerNames.confirmServiceDeletion]: confirmServiceDeletion,
  [actionHandlerNames.clearCurrentContractInfo]: clearCurrentContractInfo,
  [actionHandlerNames.confirmDeleteTravelAll]: confirmDeleteTravelAll,
  [actionHandlerNames.openTOSearchModal]: openTOSearchModal,
  [actionHandlerNames.startProvisioning]: startProvisioning,
  [actionHandlerNames.didNotUseDapps]: didNotUseDapps,
  [actionHandlerNames.writeOwnSoleSourceCause]: writeOwnSoleSourceCause,
  [actionHandlerNames.writeOwnMarketResearchDetails]: writeOwnMarketResearchDetails,
  [actionHandlerNames.WriteOwnBarriers]: WriteOwnBarriers,
  [actionHandlerNames.didNotUseDapps]: didNotUseDapps,
  [actionHandlerNames.startNewPortfolio]: startNewPortfolio,
  [actionHandlerNames.submitPackage]: submitPackage,
};

async function actionHandler(actionName: string, actionArgs: string[]): Promise<void> {
  await actions[actionName](actionArgs);
} 

function sampleAdditionalButtonAction(actionArgs: string[]) {
  // commented code for demonstration purposes only
  // console.log('args in actionHandler:', actionArgs);
  // const [foo, bar] = actionArgs;
  // console.log("in action-handler: foo: " + foo + "bar: " + bar);
  AcquisitionPackage.sampleAdditionalButtonActionInStore(actionArgs);
  alert("\"Cancel\" will navigate to JWCC intro when completed.");
}

async function writeOwnSoleSourceCause() {
  /* eslint-disable camelcase */
  const fairOpp: FairOpportunityDTO = { 
    cause_write_own_explanation: "YES",
    cause_of_sole_source_for_docgen: "CUSTOM" 
  };
  /* eslint-enable camelcase */
  await AcquisitionPackage.setFairOpportunity(fairOpp);
  await AcquisitionPackage.setSkipValidation(true);
  
  AcquisitionPackage.fairOppExplanations.soleSource.useCustomText = true;
  
  await router.push({
    name: routeNames.SoleSourceReview,
    query: {
      direction: "next"
    },
    replace: true
  }).catch(() => console.log("avoiding redundant navigation"));
}
async function WriteOwnBarriers() {
  // eslint-disable-next-line camelcase
  const fairOpp: FairOpportunityDTO = { barriers_write_own_explanation: "YES" };
  await AcquisitionPackage.setFairOpportunity(fairOpp);
  await AcquisitionPackage.setSkipValidation(true);
  await router.push({
    name: routeNames.ReviewBarriers,
    query: {
      direction: "next"
    },
    replace: true
  }).catch(() => console.log("avoiding redundant navigation"));
}

async function writeOwnMarketResearchDetails() {
  // eslint-disable-next-line camelcase
  const fairOpp: FairOpportunityDTO = { research_write_own_explanation: "YES" };
  await AcquisitionPackage.setFairOpportunity(fairOpp);
  await AcquisitionPackage.setSkipValidation(true);
  await router.push({
    name: routeNames.MarketResearchReview,
    query: {
      direction: "next"
    },
    replace: true
  }).catch(() => console.log("avoiding redundant navigation"));
}


function clearCurrentContractInfo() {
  AcquisitionPackage.clearCurrentContractInfo();
}

// used in Performance Requirements when user clicks "I don't need these cloud resources" button
async function deleteServiceOfferingGroup() {
  await DescriptionOfWork.removeCurrentOfferingGroup();

  await router.push({
    name: "pathResolver",
    query: {
      resolver: "ServiceOfferingsPathResolver",
      direction: "next"
    },
  }).catch(() => console.log("avoiding redundant navigation"));
}

// used in Other Offerings when user clicks "I don't need ____ resources" button
async function confirmOtherOfferingDeletion() {
  DescriptionOfWork.setConfirmOtherOfferingDelete(true);
}

async function confirmServiceDeletion() {
  await DescriptionOfWork.setConfirmServiceOfferingDelete(true);
}

async function confirmDeleteTravelAll() {
  AcquisitionPackage.setIsTravelNeeded("NO")
  await DescriptionOfWork.setConfirmTravelDeleteAll(true);
}

async function openTOSearchModal() {
  await PortfolioStore.setOpenTOSearchModal(true);
}

async function startProvisioning() {
  await PortfolioStore.startProvisioning();
  await AppSections.setAppContentComponent(PortfolioSummary);
}

async function didNotUseDapps() {
  await PortfolioStore.setDidNotUseDAPPS(true);
  await router.push({
    name: provWorkflowRouteNames.PortfolioDetails,
    query: {
      direction: "next"
    }
  });
}

async function startNewPortfolio(): Promise<void> {
  // used when clicking secondary "I need to create a new portfolio" button 
  // on "Add to existing portfolio" page (AddToExistingPortfolio.vue)
  await PortfolioStore.resetCurrentPortfolio();
  const packageCount = AcquisitionPackageSummary.packagesWaitingForTaskOrderCount;
  const acqPkgSysId = PortfolioStore.getSelectedAcquisitionPackageSysId;
  const showPackageSelection = PortfolioStore.showTOPackageSelection;
  let routeName = provWorkflowRouteNames.PortfolioDetails
  if (packageCount && (!acqPkgSysId || showPackageSelection)) {
    routeName = provWorkflowRouteNames.GeneratedFromPackage;
  }

  await router.push({
    name: routeName,
    query: {
      direction: "next"
    },
    replace: true
  }).catch(() => console.log("avoiding redundant navigation"));
}

async function submitPackage(): Promise<void> {
  await AcquisitionPackage.setValidateNow(true);
  await AcquisitionPackageSummary.updateAcquisitionPackageStatus({
    acquisitionPackageSysId: AcquisitionPackage.acquisitionPackage?.sys_id||"",
    newStatus: "WAITING_FOR_TASK_ORDER"
  });

  await router.push({
    name: routeNames.UnderReview,
    query: {
      direction: "next"
    },
    replace: true
  }).catch(() => console.log("avoiding redundant navigation"));  
}

export default actionHandler;
