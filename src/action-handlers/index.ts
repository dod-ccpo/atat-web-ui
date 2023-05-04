import AcquisitionPackage from "@/store/acquisitionPackage";
import DescriptionOfWork from "@/store/descriptionOfWork";

import router from "@/router";
import { FairOpportunityDTO } from "@/api/models";
import { routeNames } from "@/router/stepper";
import PortfolioStore from "@/store/portfolio";
import AppSections from "@/store/appSections";
import PortfolioSummary from "@/portfolios/portfolio/components/Index.vue"
import { provWorkflowRouteNames } from "@/router/provisionWorkflow";

const actionHandlerNames = {
  sampleAdditionalButtonAction: "sampleAdditionalButtonAction",
  deleteServiceOfferingGroup: "deleteServiceOfferingGroup",
  confirmOtherOfferingDeletion: "confirmOtherOfferingDeletion",
  confirmServiceDeletion: "confirmServiceDeletion",
  clearCurrentContractInfo: "clearCurrentContractInfo",
  confirmDeleteTravelAll: "confirmDeleteTravelAll",
  writeOwnSoleSourceCause: "writeOwnSoleSourceCause",
  openTOSearchModal: "openTOSearchModal",
  startProvisioning: "startProvisioning",
  didNotUseDapps: "didNotUseDapps"
}

const actions =  {
  [actionHandlerNames.sampleAdditionalButtonAction]: sampleAdditionalButtonAction,
  [actionHandlerNames.deleteServiceOfferingGroup]: deleteServiceOfferingGroup,
  [actionHandlerNames.confirmOtherOfferingDeletion]: confirmOtherOfferingDeletion,
  [actionHandlerNames.confirmServiceDeletion]: confirmServiceDeletion,
  [actionHandlerNames.clearCurrentContractInfo]: clearCurrentContractInfo,
  [actionHandlerNames.confirmDeleteTravelAll]: confirmDeleteTravelAll,
  [actionHandlerNames.writeOwnSoleSourceCause]: writeOwnSoleSourceCause,
  [actionHandlerNames.openTOSearchModal]: openTOSearchModal,
  [actionHandlerNames.startProvisioning]: startProvisioning,
  [actionHandlerNames.didNotUseDapps]: didNotUseDapps,
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
  // eslint-disable-next-line camelcase
  const fairOpp: FairOpportunityDTO = { cause_write_own_explanation: "YES" };
  await AcquisitionPackage.setFairOpportunity(fairOpp);
  router.push({
    name: routeNames.SoleSourceReview,
    params: {
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

  router.push({
    name: "pathResolver",
    params: {
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
  router.push({
    name: provWorkflowRouteNames.PortfolioDetails,
    params: {
      direction: "next"
    }
  });
}

export default actionHandler;
