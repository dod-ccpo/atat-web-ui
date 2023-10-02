import { randomNumber, cleanText } from "../helpers";

//step1
const acor = ["Yes", "No"];
//step2
const fairOpp = "none";
const exceptionToFairOpp = [
  "YES_FAR_16_505_B_2_I_A",
  "YES_FAR_16_505_B_2_I_B",
  "YES_FAR_16_505_B_2_I_C",
];
const estDelayVal = ["1", "52", "12", "365"];
const dropDownOption = ["year", "weeks", "months", "days"];
const addTimeCost = ["Yes", "No"];
const govEngineer = ["Yes", "No"];
const specificFeaProduct = ["Yes", "No"];
const isProductOrFeature = ["product", "feature"];
const contractAction = ["optionToExtend", "none", "bridge", "undefinitized"];
const techniques = [
  "perKnowledge",
  "reviewDB",
  "contactKnowledge",
  "disaMRR",
  "reviewDB",
  "reviewSorceList",
  "reviewProdLit",
  "reviewOtherContracts",
  "reviewJWCCCatlog",
  "other",
];

const capablesourceOption = ["Yes", "No"];
const reviewCatalogSectionOption = ["Yes", "No"];
const researchSameDate = ["Yes", "No"];
const followOn = ["Yes", "No"];
const logicalException = ["Yes", "No"];
const purgeTraining = ["Yes", "No"];
const priorProcurement = ["Yes", "No"];
const reqIaaS = ["Yes", "No"];

//Eval plan
const evalPlanOption = [
  "techProposal",
  "noTechProposal",
  "equalLumpSum",
  "setLumpSum",
];
const setTechProposalSelectionMethod = ["LPTA", "BVTO"];
const setLumpSumSelectionMethod = ["LowestRisk", "BestUse"];
const customCompliance = ["Yes", "No"];
//step3
const rowCount = 1;
const contractNo = randomNumber(13);
const competitiveStatusOptions = ["otherThanFull", "fullOpen", "sbSetAside"];
const businessSizeOption = [
  "large",
  "small",
  "smallBA",
  "hubZone",
  "sdvosb",
  "wosb",
];
const descriptionDetails = [`${rowCount} previous contract: ${contractNo}`];
const previousContract = ["Yes", "No"];
const currentContract = "Yes";
const instanceCount = 1;
const impactLevelCheckboxes = [
  "SecretIL6",
  "UnclassifiedIL2",
  "UnclassifiedIL5",
  "UnclassifiedIL4",
];
const currentUsage = ["evenlyDistributed", "irregularUsage"];
const spikesUsage = ["periodBased", "eventBased"];
const storageOptions = ["Block", "Object", "File", "Archive"];
const storageOptionsList = storageOptions.join(" ,").toUpperCase();
const storageSize = randomNumber(3);
const expctedStorage = storageOptionsList + ":" + storageSize + "GB";
const performanceTierOptions = [
  "computeOptimized",
  "generalPurpose",
  "memoryOptimized",
  "storageOptimized",
];

const performanceTierOptionsList = performanceTierOptions
  .join(" ,")
  .toUpperCase();

const currentPayment = ["reserved", "payAsyouGo"];

export {
  acor,
  fairOpp,
  exceptionToFairOpp,
  addTimeCost,
  dropDownOption,
  govEngineer,
  specificFeaProduct,
  isProductOrFeature,
  contractAction,
  techniques,
  contractNo,
  capablesourceOption,
  reviewCatalogSectionOption,
  researchSameDate,
  followOn,
  logicalException,
  purgeTraining,
  priorProcurement,
  reqIaaS,
  evalPlanOption,
  setTechProposalSelectionMethod,
  customCompliance,
  previousContract,
  setLumpSumSelectionMethod,
  currentContract,
  descriptionDetails,
  impactLevelCheckboxes,
  estDelayVal,
  competitiveStatusOptions,
  businessSizeOption,
  currentUsage,
  spikesUsage,
  storageOptions,
  performanceTierOptions,
  performanceTierOptionsList,
  currentPayment,
  storageOptionsList,
  expctedStorage,storageSize
};

function generateCurrentEnvironmentDescDetails(
  instanceCount,
  currentEnvironment,
  hybridRadioboxes,
  impactLevelCheckboxes
) {
  const classificationType = impactLevelCheckboxes
    .map((checkbox) => checkbox.charAt(0).toUpperCase() + checkbox.slice(1))
    .join(", ");

  let environmentText;

  if (currentEnvironment === "Onpremise") {
    environmentText = "On-premise";
  } else if (currentEnvironment === "Hybrid") {
    environmentText = "Hybrid";
  } else {
    environmentText = currentEnvironment;
  }

  const instanceText = instanceCount > 1 ? "instances" : "instance";

  let hybridRadioboxesText =
    currentEnvironment === "Hybrid" ? hybridRadioboxes : "";
  if (hybridRadioboxesText) {
    if (hybridRadioboxesText.toLowerCase() === "onpremise") {
      hybridRadioboxesText = "on-premise";
    } else {
      hybridRadioboxesText =
        hybridRadioboxesText.charAt(0).toLowerCase() +
        hybridRadioboxesText.slice(1);
    }
  }

  // eslint-disable-next-line max-len
  const formattedItem = `${environmentText} environment:${instanceCount} ${hybridRadioboxesText} ${instanceText} (${classificationType})`;
  const currentEnvironmentDescDetails = cleanText(formattedItem);
  return [currentEnvironmentDescDetails];
}
export const jaSet1 = {
  acor: "Yes",
  exceptionToFairOpp: "YES_FAR_16_505_B_2_I_C",
  contractAction: "none",
  techniques: ["perKnowledge", "reviewDB"],
  addTimeCost: "Yes",
  estDelayVal: "1",
  dropDownOption: "year",
  govEngineer: "Yes",
  specificFeaProduct: "Yes",
  isProductOrFeature: "product",
  capablesourceOption: "Yes",
  reviewCatalogSectionOption: "Yes",
  researchSameDate: "No",
  logicalException: "Yes",
  followOn: "Yes",
  purgeTraining: "Yes",
  priorProcurement: "Yes",
  reqIaaS: "Yes",
  previousContract: "",
  competitiveStatusOptions: "otherThanFull",
  businessSizeOption: "large",
};
export const jaSet2 = {
  acor: "No",
  exceptionToFairOpp: "YES_FAR_16_505_B_2_I_B",
  contractAction: "optionToExtend",
  addTimeCost: "Yes",
  estDelayVal: "52",
  dropDownOption: "weeks",
  govEngineer: "Yes",
  specificFeaProduct: "Yes",
  isProductOrFeature: "feature",
  capablesourceOption: "Yes",
  reviewCatalogSectionOption: "Yes",
  researchSameDate: "No",
  logicalException: "No",
  followOn: "No",
  purgeTraining: "No",
  priorProcurement: "No",
  reqIaaS: "No",
  previousContract: "Yes",
  competitiveStatusOptions: "fullOpen",
  businessSizeOption: "small",
};
export const jaSet3 = {
  acor: "No",
  exceptionToFairOpp: "YES_FAR_16_505_B_2_I_A",
  contractAction: "undefinitized",
  addTimeCost: "No",
  govEngineer: "No",
  specificFeaProduct: "No",
  capablesourceOption: "No",
  reviewCatalogSectionOption: "No",
  researchSameDate: "No",
  logicalException: "No",
  followOn: "No",
  purgeTraining: "No",
  priorProcurement: "No",
  reqIaaS: "No",
  previousContract: "No",
  competitiveStatusOptions: "sbSetAside",
  businessSizeOption: "wosb",
};
export const epSet1 = {
  evalPlanOption: "techProposal",
  setTechProposalSelectionMethod: "BVTO",
  customCompliance: "Yes",
  currentContract: "Yes",
  currentEnvironment: "Hybrid",
  hybridRadioboxes: "Onpremise",
  impactLevelCheckboxes: ["SecretIL6"],
  currentUsage: "evenlyDistributed",
  spikesUsage: "periodBased",
  storageOptions: ["Object"],
  storageOptionsList: "OBJECT", 
  storageSize: storageSize, 
  expctedStorage:  "OBJECT:" + storageSize + "GB",
  performanceTierOptions: ["computeOptimized"],
  performanceTierOptionsList:"COMPUTEOPTIMIZED",
  currentPayment: "reserved",
  currentEnvironmentDescDetails: generateCurrentEnvironmentDescDetails(
    instanceCount,
    "Hybrid",
    "Onpremise",
    ["SecretIL6"]
  ),
};
export const epSet2 = {
  evalPlanOption: "techProposal",
  setTechProposalSelectionMethod: "LPTA",
  customCompliance: "No",
  currentContract: "No",
  currentEnvironment: "Cloud",
  impactLevelCheckboxes: ["UnclassifiedIL2"],
  currentUsage: "irregularUsage",
  spikesUsage: "eventBased",
  storageOptions: ["Block"],
  storageOptionsList: "BLOCK",
  storageSize:storageSize,
  expctedStorage :  "BLOCK:" + storageSize + "GB",
  performanceTierOptions: ["generalPurpose"],
  performanceTierOptionsList:"GENERALPURPOSE",
  currentPayment: "payAsyouGo",
  currentEnvironmentDescDetails: generateCurrentEnvironmentDescDetails(
    instanceCount,
    "Cloud",
    "",
    ["UnclassifiedIL2"]
  ),
};
export const epSet3 = {
  evalPlanOption: "noTechProposal",
  currentContract: "Yes",
  currentEnvironment: "Onpremise",
  impactLevelCheckboxes: ["UnclassifiedIL5"],
  currentUsage: "irregularUsage",
  spikesUsage: "eventBased",
  storageOptions: ["Archive"],
  storageOptionsList: "ARCHIVE",
  storageSize:storageSize,
  expctedStorage : "ARCHIVE:" + storageSize + "GB",
  performanceTierOptions: "memoryOptimized",
  performanceTierOptionsList:"MEMORYOPTIMIZED",
  currentPayment: "payAsyouGo",
  currentEnvironmentDescDetails: generateCurrentEnvironmentDescDetails(
    instanceCount,
    "Onpremise",
    "",
    ["UnclassifiedIL5"]
  ),
};
export const epSet4 = {
  evalPlanOption: "equalLumpSum",
  currentContract: "No",
  currentEnvironment: "Hybrid",
  hybridRadioboxes: "Cloud",
  impactLevelCheckboxes: ["UnclassifiedIL4"],
  currentUsage: "irregularUsage",
  spikesUsage: "eventBased",
  storageOptions: ["File"],
  storageOptionsList: "FILE",
  storageSize:storageSize,
  expctedStorage : "FILE:" + storageSize + "GB",
  performanceTierOptions: "storageOptimized",
  performanceTierOptionsList:"STORAGEOPTIMIZED",
  currentPayment: "reserved",
  currentEnvironmentDescDetails: generateCurrentEnvironmentDescDetails(
    instanceCount,
    "Hybrid",
    "Cloud",
    ["UnclassifiedIL4"]
  ),
};
export const epSet5 = {
  evalPlanOption: "setLumpSum",
  setLumpSumSelectionMethod: "LowestRisk",
  currentContract: "No",
  currentEnvironment: "Hybrid",
  hybridRadioboxes: "Cloud",
  impactLevelCheckboxes: ["UnclassifiedIL2"],
  currentUsage: "irregularUsage",
  spikesUsage: "eventBased",
  storageOptions: ["File"],
  storageOptionsList: "FILE",
  storageSize:storageSize,
  expctedStorage : "FILE:" + storageSize + "GB",
  performanceTierOptions: "storageOptimized",
  performanceTierOptionsList:"STORAGEOPTIMIZED",
  currentPayment: "payAsyouGo",
  currentEnvironmentDescDetails: generateCurrentEnvironmentDescDetails(
    instanceCount,
    "Hybrid",
    "Cloud",
    ["UnclassifiedIL4"]
  ),
};
export const epSet6 = {
  evalPlanOption: "setLumpSum",
  setLumpSumSelectionMethod: "BestUse",
  currentContract: "Yes",
  currentEnvironment: "Onpremise",
  impactLevelCheckboxes: ["UnclassifiedIL2"],
  currentUsage: "irregularUsage",
  spikesUsage: "eventBased",
  storageOptions: ["Archive"],
  storageOptionsList: "ARCHIVE",
  storageSize:storageSize,
  expctedStorage : "ARCHIVE:" + storageSize + "GB",
  performanceTierOptions: "memoryOptimized",
  performanceTierOptionsList:"MEMORYOPTIMIZED",
  currentPayment: "payAsyouGo",
  currentEnvironmentDescDetails: generateCurrentEnvironmentDescDetails(
    instanceCount,
    "Onpremise",
    "",
    ["UnclassifiedIL5"]
  ),
};
