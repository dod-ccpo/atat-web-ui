import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import { sanitizeOfferingName } from "@/helpers";
import { routeNames } from "../stepper";
import { RouteDirection, StepPathResolver, StepRouteResolver } from "@/store/steps/types";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Steps from "@/store/steps";
import TaskOrder from "@/store/taskOrder";
import Periods from "@/store/periods";
import IGCEStore from "@/store/IGCE";
import { ClassificationLevelDTO, EvaluationPlanDTO } from "@/api/models";
import ClassificationRequirements from "@/store/classificationRequirements";
import Vue from "vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import IGCE from "@/store/IGCE";


export const AcorsRouteResolver = (current: string): string => {
  const hasAlternativeContactRep = AcquisitionPackage.hasAlternativeContactRep;

  //routing from alternate cor and the user does not have an ACOR
  if (current === routeNames.AlternateCor && hasAlternativeContactRep === false) {
    return routeNames.Exceptions;
  }

  //routing from summary and user does not have ACOR
  if (current === routeNames.Exceptions && !hasAlternativeContactRep) {
    return routeNames.AlternateCor;
  }

  return routeNames.AcorInformation;
};

const evalPlanRequired = (): boolean => {
  return AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity === "NO_NONE";
}

const missingEvalPlanMethod = (evalPlan: EvaluationPlanDTO): boolean => {
  // if user selected either the required tech proposal (LPTA or BVTO options) or 
  // the set lump sum for one CSP ("best use" or "lowest risk" options), and
  // does not select an option, send to summary page.
  const source = evalPlan.source_selection;
  const method = evalPlan.method;
  return (source === "TECH_PROPOSAL" || source === "SET_LUMP_SUM") && !method ? true : false;
}

export const CreateEvalPlanRouteResolver = (current: string): string => {
  if (current === routeNames.NoEvalPlan) {
    return routeNames.PeriodOfPerformance;
  }
  if(current === routeNames.EvalPlanDetails){
    return routeNames.CreateEvalPlan
  }
  return current === routeNames.Exceptions
    ? routeNames.CreateEvalPlan
    : routeNames.Exceptions;
};

export const UploadJAMRRDocumentsRouteResolver = (current: string): string => {
  return !evalPlanRequired() 
    ? routeNames.UploadJAMRRDocuments 
    : routeNames.ReadyToGeneratePackage;
};

export const EvalPlanDetailsRouteResolver = (current: string): string => {
  const evalPlan = EvaluationPlan.evaluationPlan as EvaluationPlanDTO;
  if (missingEvalPlanMethod(evalPlan)) {
    return routeNames.PeriodOfPerformance;
  }
  Steps.setAdditionalButtonText({
    buttonText: "I don’t need other assessment areas", 
    buttonId: "NoOtherAssessmentAreas"
  });

  if (evalPlan.source_selection === "SET_LUMP_SUM") {
    Steps.setAdditionalButtonHide(false);
  } else {
    Steps.setAdditionalButtonHide(true);
  }

  return current === routeNames.CreateEvalPlan || routeNames.Differentiators
    ? routeNames.EvalPlanDetails
    : routeNames.CreateEvalPlan;
};

export const BVTOResolver = (current: string): string => {
  const evalPlan = EvaluationPlan.evaluationPlan as EvaluationPlanDTO;
  if (current === routeNames.PeriodOfPerformance){
    if (!evalPlanRequired()) {
      return routeNames.NoEvalPlan;
    }
    if (missingEvalPlanMethod(evalPlan)) {
      return routeNames.CreateEvalPlan;
    }
  }

  if (evalPlan?.method === "BVTO") {
    return routeNames.Differentiators;
  }

  return current === routeNames.EvalPlanDetails
    ? routeNames.PeriodOfPerformance
    : routeNames.EvalPlanDetails;
};

export const NoEvalPlanRouteResolver = (current: string): string => {
  if(current === routeNames.CreateEvalPlan){
    return routeNames.Exceptions
  }
  if (evalPlanRequired()) {
    return routeNames.CreateEvalPlan;
  }
  return current === routeNames.Exceptions
    ? routeNames.NoEvalPlan
    : routeNames.Exceptions;
};

export const CurrentContractDetailsRouteResolver = (current: string): string => {
  const hasCurrentContract 
    = AcquisitionPackage.currentContract?.current_contract_exists === "YES";
  if (hasCurrentContract) {
    return routeNames.CurrentContractDetails;
  }
  return current === routeNames.CurrentContract
    ? (IGCE.requirementsCostEstimate?.has_DOW_and_PoP === "YES")
      ? routeNames.DOWSummary : routeNames.RequirementCategories
    : routeNames.CurrentContract;
};

export const ReplicateDetailsResolver = (current: string): string => {
  if (needsReplicateOrOptimize()) {
    return routeNames.ReplicateDetails;
  }
  return current === routeNames.ReplicateAndOptimize
    ? routeNames.ArchitecturalDesign
    : routeNames.ReplicateAndOptimize;
}

export const ArchitecturalDesignDetailsRouteResolver = (current: string): string => {
  const needsArchitectureDesign
      = CurrentEnvironment.currentEnvironment?.needs_architectural_design_services === "YES";
  const hasCurrentEnv
      = CurrentEnvironment.currentEnvironment?.current_environment_exists === "YES";
  const hasCurrentContract 
      = AcquisitionPackage.currentContract?.current_contract_exists === "YES";
 
  if (current === routeNames.DOWSummary || 
      current === routeNames.RequirementCategories){
    if (!hasCurrentContract){  // if no current contract
      return routeNames.CurrentContract;
    } else if (hasCurrentContract && !hasCurrentEnv){ // if current contract & NO current env
      return routeNames.CurrentEnvironment;
    } else if (hasCurrentEnv){
      return needsArchitectureDesign 
        ? routeNames.ArchitecturalDesignDetails
        : routeNames.ArchitecturalDesign
    }
  }
  return needsArchitectureDesign
    ? routeNames.ArchitecturalDesignDetails 
    : (IGCE.requirementsCostEstimate?.has_DOW_and_PoP === "YES")
      ? routeNames.DOWSummary : routeNames.RequirementCategories
};

export const CurrentEnvRouteResolver = (current: string): string => {
  const hasCurrentEnv
    = CurrentEnvironment.currentEnvironment?.current_environment_exists === "YES";
  if (hasCurrentEnv) {
    return routeNames.UploadSystemDocuments;
  }
  return current === routeNames.CurrentEnvironment 
    ? (IGCE.requirementsCostEstimate?.has_DOW_and_PoP === "YES")
      ? routeNames.DOWSummary : routeNames.RequirementCategories
    : routeNames.CurrentEnvironment;
};

export const PIIRecordResolver = (current: string): string => {
  const hasSystemOfRecord = AcquisitionPackage.sensitiveInformation?.pii_present === "YES";
  // if system of record will be included, route to system of records page
  if (hasSystemOfRecord) {
    return routeNames.PIIRecord;
  }
  return current === routeNames.PII ? routeNames.BAA : routeNames.PII;
};

export const FOIARecordResolver = (current: string): string => {
  const needsFOIACoordinator 
    = AcquisitionPackage.sensitiveInformation?.potential_to_be_harmful === "YES";
  // if user selects "Yes" on FOIA (Public Disclosure of Information) page,
  // then need to collect information about the FOIA Coordinator
  if (needsFOIACoordinator) {
    return routeNames.FOIACoordinator;
  }
  return current === routeNames.FOIA
    ? routeNames.Section508Standards
    : routeNames.FOIA;
};
export const A11yRequirementResolver = (current: string): string => {
  const needsA11yReqs
      = AcquisitionPackage.sensitiveInformation?.section_508_sufficient === "NO";
  // if user selects "No" on Section 508 standards page,
  // then need to collect information about 508 accessibility requirements
  if (needsA11yReqs) {
    return routeNames.Section508AccessibilityRequirements;
  }
  return current === routeNames.Section508Standards
    ? routeNames.CreatePriceEstimate
    : routeNames.Section508Standards;
};

const basePerformanceRequirementsPath =  "performance-requirements";
const descriptionOfWorkSummaryPath = "performance-requirements/dow-summary";

const otherServiceOfferings = [
  "compute",
  "database",
  "storage",
  "general_xaas",
  "advisory_assistance",
  "help_desk_services",
  "training",
  "documentation_support",
  "general_cloud_support",
]; // future ticket - add "database"
const otherServiceOfferingSummaryPath = "performance-requirements/service-offerings/other/summary";

const baseOfferingDetailsPath =  `${basePerformanceRequirementsPath}/service-offering-details/`;
const getServiceOfferingsDetailsPath= (groupId: string, serviceName: string)=> {
  let path = `${baseOfferingDetailsPath}${groupId.toLowerCase()}/`
  path += `${sanitizeOfferingName(serviceName)}`;
  return path;
}

const getOfferingGroupServicesPath = (groupId: string)=>
  `${basePerformanceRequirementsPath}/service-offerings/${groupId.toLowerCase()}`


export const RequirementsPathResolver = (current: string, direction: string): string => {
  const atBeginningOfOfferingGroups = DescriptionOfWork.isAtBeginningOfServiceGroups;
  const missingClassification = DescriptionOfWork.missingClassificationLevels;
  if (current === routeNames.ServiceOfferings
    && missingClassification 
    && !atBeginningOfOfferingGroups
  ) {
    const group = direction === "next" 
      ? DescriptionOfWork.nextOfferingGroup 
      : DescriptionOfWork.prevOfferingGroup;
    if (group) {
      // send to group offerings page
      const serviceOffering = routeNames.ServiceOfferings
      DescriptionOfWork.setCurrentOfferingGroupId(group);
      return OfferGroupOfferingsPathResolver(serviceOffering , direction);
    }
  }

  if(current === routeNames.ClassificationRequirements){
    return basePerformanceRequirementsPath;
  }

  //if comming from Service Offerings and we have more
  // service offerings groups to navigate through
  if(current === routeNames.ServiceOfferings && 
    !atBeginningOfOfferingGroups){ 
    const previousGroup = DescriptionOfWork.prevOfferingGroup;

    if (DescriptionOfWork.returnToDOWSummary) {
      return descriptionOfWorkSummaryPath;
    }

    if (previousGroup === undefined) {
      throw new Error('unable to get previous group');
    }

    DescriptionOfWork.setCurrentOfferingGroupId(previousGroup);
    
    //Compute, General XaaS, etc. don't have service offerings
    if (otherServiceOfferings.indexOf(previousGroup.toLowerCase()) > -1) {
      return otherServiceOfferingSummaryPath;
    }

    const lastOfferingForGroup = DescriptionOfWork.lastOfferingForGroup;

    if(lastOfferingForGroup === undefined)
    {
      throw new Error(`unable to get last offering for group ${previousGroup}`);
    }
    DescriptionOfWork.setCurrentOffering(lastOfferingForGroup);
      
    return getServiceOfferingsDetailsPath(previousGroup, lastOfferingForGroup.name);
  }
    
  return basePerformanceRequirementsPath;
}


export const DOWArchitecturalDesignResolver = (current: string): string => {
  const DOWNeedsArch = DescriptionOfWork.DOWHasArchitecturalDesignNeeds;
  if (DOWNeedsArch) {
    // coming from either direction, if needs architectural design, go there
    return routeNames.DOWArchitecturalDesign;
  }
  const xaasServices = DescriptionOfWork.hasXaasService;
  return current === routeNames.RequirementCategories 
    ? xaasServices ? routeNames.AnticipatedUserAndDataNeeds : routeNames.ServiceOfferings
    : routeNames.RequirementCategories;
}

export const AnticipatedUserAndDataNeedsResolver = (current:string): string => {
  const xaasServices = DescriptionOfWork.hasXaasService;
  const hasBeenVisited = DescriptionOfWork.anticipatedUsersAndDataHasBeenVisited
  if ((current === routeNames.DOWArchitecturalDesign 
    || current === routeNames.RequirementCategories)
    && xaasServices && !hasBeenVisited
  ) {
    return routeNames.AnticipatedUserAndDataNeeds
  }
  return current === routeNames.DOWArchitecturalDesign 
    ? routeNames.ServiceOfferings
    : routeNames.DOWArchitecturalDesign;
}

export const OtherOfferingSummaryPathResolver = (current: string, direction: string): string=>{
  const groupId = DescriptionOfWork.currentGroupId;
  if (otherServiceOfferings.indexOf(groupId.toLowerCase()) > -1) {
    return otherServiceOfferingSummaryPath; 
  }

  if(current === routeNames.ServiceOfferingDetails && direction === "next"){
    return DowSummaryPathResolver(current, direction);
  }

  if(current === routeNames.DOWSummary){
    return OfferingDetailsPathResolver(current, direction);
  }

  return descriptionOfWorkSummaryPath;
}

export const OfferGroupOfferingsPathResolver = (
  current: string, direction: string
): string => {
  DescriptionOfWork.setBackToContractDetails(false);
  Steps.clearAltBackButtonText();

  DescriptionOfWork.setCurrentGroupRemoved(false);
  // if no options selected on category page, or if only "None apply" checkboxes checked, 
  // or if last group was removed, send to summary page
  const DOWObject = DescriptionOfWork.DOWObject;
  const currentGroupId = DescriptionOfWork.currentGroupId;
  const isOtherOffering = otherServiceOfferings.indexOf(currentGroupId.toLowerCase()) > -1;

  const atLastNoneApply = currentGroupId === DescriptionOfWork.cloudNoneValue;
  const onlyNoneApplySelected = DOWObject.every((e) => {
    return e.serviceOfferingGroupId.indexOf("NONE") > -1;
  });
  const lastGroupRemoved = DescriptionOfWork.lastGroupRemoved;

  // if reviewing service group from store, set "atServicesEnd" to false 
  const reviewGroupFromSummary = DescriptionOfWork.reviewGroupFromSummary;
  const atServicesEnd = reviewGroupFromSummary || isOtherOffering
    ? false 
    : DescriptionOfWork.isEndOfServiceOfferings;
  DescriptionOfWork.setReviewGroupFromSummary(false);
  
  const returnToDOWSummary = DescriptionOfWork.returnToDOWSummary;
  const addGroupFromSummary = DescriptionOfWork.addGroupFromSummary;
  const currentGroupRemovedForNav = DescriptionOfWork.currentGroupRemovedForNav;

  const nowhereToGo = DOWObject.length === 0 
    || onlyNoneApplySelected 
    || atLastNoneApply 
    || lastGroupRemoved

  const directionNext = direction ===  "next";

  if (!addGroupFromSummary 
    && ((currentGroupRemovedForNav && lastGroupRemoved) 
    || (currentGroupRemovedForNav && returnToDOWSummary)
    || (returnToDOWSummary && atServicesEnd && directionNext)
    || nowhereToGo)
  ) {
    // return to summary
    DescriptionOfWork.setReturnToDOWSummary(false);
    DescriptionOfWork.setLastGroupRemoved(false);
    DescriptionOfWork.setCurrentGroupRemovedForNav(false); 
    return descriptionOfWorkSummaryPath;
  } 

  DescriptionOfWork.setAddGroupFromSummary(false);

  //handles moving backwards or forwards through service offerings
  if (current === routeNames.ServiceOfferingDetails &&
    direction.toUpperCase() === RouteDirection.PREVIOUS) {  
    const atBeginningOfSericeOfferings = DescriptionOfWork.isAtBeginningOfServiceOfferings;
    const atBeginningOfOfferingGroups = DescriptionOfWork.isAtBeginningOfServiceGroups;

    //at the beginning of service offerings and offering groups
    // direct the user back to the performance requirements step
    if (current === routeNames.ServiceOfferingDetails && 
      atBeginningOfOfferingGroups && atBeginningOfSericeOfferings){
      return getOfferingGroupServicesPath(currentGroupId);
    }

    if (atBeginningOfOfferingGroups && atBeginningOfSericeOfferings && 
      current !== routeNames.ServiceOfferingDetails) {
      return basePerformanceRequirementsPath;
    }

    //if we are at the beginning of offering groups but not at the beginning of service offerings
    //get the next service offering and display it in service offering details
    if (atBeginningOfOfferingGroups && !atBeginningOfSericeOfferings){
      const previousServiceOffering = DescriptionOfWork.previousServiceOffering;
      if (previousServiceOffering === undefined) {
        throw new Error('unable to get previous service offering group');
      }
      DescriptionOfWork.setCurrentOffering(previousServiceOffering);

      return getServiceOfferingsDetailsPath(currentGroupId, previousServiceOffering.name);
    }

    //at the beginning of service offerings for a given offering group
    if (!atBeginningOfOfferingGroups && atBeginningOfSericeOfferings) {
      //if routing from service offering details
      //send the user to the step to select the Service Offerings (Service Offerings)
      if (current === routeNames.ServiceOfferingDetails) {
        //display service offering group page
        return getOfferingGroupServicesPath(currentGroupId);
      }

      const previousGroup = DescriptionOfWork.prevOfferingGroup;
      if (previousGroup === undefined) {
        throw new Error('unable to get previous offering group');
      }

      DescriptionOfWork.setCurrentOfferingGroupId(previousGroup);
      const lastServiceOfferingForGroup = DescriptionOfWork.lastOfferingForGroup;

      if (lastServiceOfferingForGroup === undefined) {
        throw new Error(`unable to get last offering for group ${previousGroup}`);
      }
      DescriptionOfWork.setCurrentOffering(lastServiceOfferingForGroup);
      return getServiceOfferingsDetailsPath(previousGroup, lastServiceOfferingForGroup.name);
    }

    //not at the beginning of service offerings or offering groups
    //get the next server offering and display in service offering details
    if (!atBeginningOfOfferingGroups && !atBeginningOfSericeOfferings) {
      //can we get the previous service offering for this group?
      const canGetPreviousOffering = DescriptionOfWork.canGetPreviousServiceOffering;

      if (canGetPreviousOffering) {
        const serviceOffering = DescriptionOfWork.previousServiceOffering;

        if (serviceOffering === undefined) {
          throw new Error('unable to get previous service offering');
        }

        DescriptionOfWork.setCurrentOffering(serviceOffering);

        return getServiceOfferingsDetailsPath(currentGroupId, serviceOffering.name);
      } else {
        //we couldn't get the previous offering so try to get the previous offering group
        const previousGroup = DescriptionOfWork.prevOfferingGroup;
        if(previousGroup === undefined)
        {
          throw new Error('unable to get previous offering group');
        }

        DescriptionOfWork.setCurrentOfferingGroupId(previousGroup);
        const lastServiceOfferingForGroup = DescriptionOfWork.lastOfferingForGroup;
  
        if(lastServiceOfferingForGroup === undefined)
        {
          throw new Error(`unable to get last offering for group ${previousGroup}`);
        }
        DescriptionOfWork.setCurrentOffering(lastServiceOfferingForGroup);
        return getServiceOfferingsDetailsPath(previousGroup, lastServiceOfferingForGroup.name);
      }
    }     
  }
  
  let dontNeedButtonText = "I don’t need ";
  /* eslint-disable camelcase */
  const offeringNames: Record<string, string> = {
    compute: "Compute",
    developer_tools: "Developer Tools and Services",
    applications: "Application services",
    machine_learning: "Machine Learning",
    networking: "Networking",
    security: "Security",
    database: "Database",
    storage: "Storage",
    edge_computing: "Edge Computing and Tactical Edge",
    iot: "Internet of Things",
    general_xaas: "General IaaS, PaaS, and SaaS",
  }
  /* eslint-enable camelcase */
  
  const offeringStr = offeringNames[currentGroupId.toLowerCase()] || "these cloud resources";
  dontNeedButtonText += offeringStr;

  Steps.setAdditionalButtonText({
    buttonText: dontNeedButtonText, 
    buttonId: "DontNeedResources"
  });

  Steps.setAdditionalButtonHide(false);

  if (isOtherOffering) {
    const currentInstanceNumber = DescriptionOfWork.currentOtherServiceInstanceNumber;
    const otherOfferingData = DescriptionOfWork.otherOfferingObject.otherOfferingData;
    if (current !== routeNames.OtherOfferingSummary) {
      if (otherOfferingData && otherOfferingData.length) {
        return otherServiceOfferingSummaryPath;
      }
    } else if (otherOfferingData && otherOfferingData.length > 0 
      && !(currentInstanceNumber === 1 && otherOfferingData.length === 1) 
    ) {
      // if more than one "Other" offering (Compute, General XaaS, Database) 
      // instance/requirement, hide the "I don't need ____ resources" button
      Steps.setAdditionalButtonHide(true);
    }
  }
  //default  
  return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
}

//this will always return the path for the current group and the current offering
export const OfferingDetailsPathResolver = (current: string, direction: string): string => {
  Steps.clearAltBackButtonText();
  Steps.setAdditionalButtonHide(false);
  if (DescriptionOfWork.summaryBackToContractDetails) {
    DescriptionOfWork.setBackToContractDetails(false);
    return "current-contract/current-contract";
  }

  const groupId = DescriptionOfWork.currentGroupId;
  const isOtherOffering = otherServiceOfferings.indexOf(groupId.toLowerCase()) > -1;
  
  const missingClassification = DescriptionOfWork.missingClassificationLevels;

  if(current === routeNames.OtherOfferingSummary && 
    isOtherOffering && direction === "previous"){
    if(DescriptionOfWork.returnToDOWSummary){
      return descriptionOfWorkSummaryPath;
    }
    if(DescriptionOfWork.prevOfferingGroup){
      const group = DescriptionOfWork.prevOfferingGroup
      DescriptionOfWork.setCurrentOfferingGroupId(group);
    }
    else{
      return descriptionOfWorkSummaryPath;
    }
  }

  if(current === routeNames.ServiceOfferings && isOtherOffering && direction === "next"){
    return OtherOfferingSummaryPathResolver(current, direction);
  }

  if ((missingClassification && DescriptionOfWork.returnToDOWSummary) 
    || (DescriptionOfWork.currentGroupRemovedForNav && DescriptionOfWork.lastGroupRemoved)) {
    // and no more groups after
    DescriptionOfWork.setReturnToDOWSummary(false);
    return descriptionOfWorkSummaryPath;
  }

  if (current === routeNames.DOWSummary){
    if (DescriptionOfWork.currentGroupId === "") {
      return basePerformanceRequirementsPath;
    }
    if (!DescriptionOfWork.currentOfferingGroupHasOfferings) { 
      // send to group offerings page
      const serviceOffering = routeNames.ServiceOfferings
      return OfferGroupOfferingsPathResolver(serviceOffering , direction);
    }

    if (DescriptionOfWork.currentOfferingName === ""){
      //get the last offering and display
      const offering = DescriptionOfWork.lastOfferingForGroup;
      if (offering && !missingClassification) {
        DescriptionOfWork.setCurrentOffering(offering);
      } else {
        const serviceOffering = routeNames.ServiceOfferings
        return OfferGroupOfferingsPathResolver(serviceOffering , direction);
      }
    }
  }

  if (!DescriptionOfWork.prevOfferingGroup && !DescriptionOfWork.currentGroupId) {
    // only "none apply" options selected.
    if (current === routeNames.DOWSummary) {
      return basePerformanceRequirementsPath;
    } else {
      DescriptionOfWork.setLastGroupRemoved(false);
      DescriptionOfWork.setReturnToDOWSummary(false);
      return descriptionOfWorkSummaryPath;    
    }
  }

  if (DescriptionOfWork.currentGroupRemoved) {
    DescriptionOfWork.setCurrentGroupRemoved(false);
    if (groupId && !DescriptionOfWork.lastGroupRemoved) {
      return getOfferingGroupServicesPath(groupId);
    }
    // if last group removed, currentGroupId === "", send to summary page
    DescriptionOfWork.setLastGroupRemoved(false);
    DescriptionOfWork.setReturnToDOWSummary(false);
    return descriptionOfWorkSummaryPath;   
  } 
  if (!missingClassification && current !== routeNames.OtherOfferingSummary) {
    const offering = sanitizeOfferingName(DescriptionOfWork.currentOfferingName);
    if (offering) {
      return `${baseOfferingDetailsPath}${groupId.toLowerCase()}/${offering.toLowerCase()}`;  
    }
  } 

  let nextOrPrevGroup;
  if (current === routeNames.DOWSummary) {
    nextOrPrevGroup = DescriptionOfWork.lastOfferingGroup;
  } else {
    nextOrPrevGroup = direction === "next" 
      ? DescriptionOfWork.nextOfferingGroup 
      : DescriptionOfWork.prevOfferingGroup;
  }

  if (nextOrPrevGroup && !(current === routeNames.OtherOfferingSummary 
    && otherServiceOfferings.indexOf(nextOrPrevGroup.toLowerCase()) > -1)) {
    // send to group offerings page
    const serviceOffering = routeNames.ServiceOfferings
    DescriptionOfWork.setCurrentOfferingGroupId(nextOrPrevGroup);
    return OfferGroupOfferingsPathResolver(serviceOffering , direction);
  }

  DescriptionOfWork.setReturnToDOWSummary(false);
  return descriptionOfWorkSummaryPath
}

export const DowSummaryPathResolver = (current: string, direction: string): string =>{
  DescriptionOfWork.setBackToContractDetails(current === routeNames.ConflictOfInterest);
  Steps.clearAltBackButtonText();
  if(current === routeNames.ConflictOfInterest){
    if(DescriptionOfWork.DOWObject.length > 0){
      DescriptionOfWork.setReturnToDOWSummary(false);
      return descriptionOfWorkSummaryPath
    }
    else{
      return basePerformanceRequirementsPath;
    }
  }

  const atServicesEnd = DescriptionOfWork.isEndOfServiceOfferings;
  const atOfferingsEnd = DescriptionOfWork.isEndOfServiceGroups;

  // If added a new offering group or editing/reviewing existing offering from the summary page, and
  // at last service in group, send back to summary page
  if (DescriptionOfWork.returnToDOWSummary && atServicesEnd) {
    DescriptionOfWork.setReturnToDOWSummary(false);
    return descriptionOfWorkSummaryPath;
  }

  // coming from service offering details step
  if(current === routeNames.ServiceOfferingDetails){

    //no more offerings or services to process go to summary
    if(atOfferingsEnd && atServicesEnd){
      DescriptionOfWork.setReturnToDOWSummary(false);
      return descriptionOfWorkSummaryPath;
    }

    //there's more services to process
    if(atOfferingsEnd && !atServicesEnd){
      const nextServiceOffering = DescriptionOfWork.nextServiceOffering;
      if(nextServiceOffering === undefined)
      {
        throw new Error('unable to retrieve next service offering');
      }

      DescriptionOfWork.setCurrentOffering(nextServiceOffering);
      return OfferingDetailsPathResolver(current, direction);
    }

    if(!atOfferingsEnd && !atServicesEnd){
      //not at the end of offering groups yet
      //get the next one and forward to the OfferGroupOfferings path
      //resolver 
      const nextServiceOffering = DescriptionOfWork.nextServiceOffering;
      if(nextServiceOffering === undefined)
      {
        throw new Error('unable to retreive next service offering');
      }

      DescriptionOfWork.setCurrentOffering(nextServiceOffering);
      return OfferingDetailsPathResolver(current, direction);
    }

    if(!atOfferingsEnd && atServicesEnd){
      //not at the end of offering groups yet
      //get the next one and forward to the OfferGroupOfferings path
      //resolver 
      const nextOfferingGroup = DescriptionOfWork.nextOfferingGroup;
      if(nextOfferingGroup === undefined)
      {
        throw new Error('unable to retrive next offering group');
      }
      DescriptionOfWork.setCurrentOfferingGroupId(nextOfferingGroup);
      return OfferGroupOfferingsPathResolver(current , direction);
    }
  }

  return OfferingDetailsPathResolver(current, direction);
};

export const IGCESurgeCapabilities =  (current:string): string =>{
  const surgeCapacity =
    IGCEStore.requirementsCostEstimate?.surge_requirements.capabilities as string;
  if (surgeCapacity.toUpperCase() !== "YES" && current === routeNames.SurgeCapacity){
    return routeNames.FeeCharged;
  }
  if (surgeCapacity.toUpperCase() !== "YES" && current === routeNames.FeeCharged){
    return routeNames.SurgeCapacity;
  }
  return routeNames.SurgeCapabilities;
}


const needsReplicateOrOptimize = (): boolean => {
  return (
    CurrentEnvironment.currentEnvironment !== null &&
    CurrentEnvironment.currentEnvironment
      .current_environment_replicated_optimized.indexOf("YES") > -1
  );
}

const currentEnvNeedsArchitectureDesign = (): boolean => {
  return CurrentEnvironment.currentEnvironment?.needs_architectural_design_services === "YES";
}
const DOWNeedsArchitectureDesign = (): boolean | null => {
  return DescriptionOfWork.DOWHasArchitecturalDesignNeeds;
}


export const IGCECannotProceedResolver = (current: string): string => {
  if (!(IGCEStore.requirementsCostEstimate?.has_DOW_and_PoP === "YES")){
    return routeNames.CannotProceed;
  }

  if (current === routeNames.CreatePriceEstimate) {
    if (needsReplicateOrOptimize()) {
      return routeNames.OptimizeOrReplicate;
    }
    if (currentEnvNeedsArchitectureDesign()) {
      return routeNames.ArchitecturalDesignSolutions;
    }
    return routeNames.GatherPriceEstimates
  }
  return routeNames.CreatePriceEstimate;
}

export const IGCEOptimizeOrReplicateResolver = (current: string): string => {
  if (current === routeNames.CannotProceed){
    return routeNames.FundingPlanType;
  }

  if (needsReplicateOrOptimize()) {
    return routeNames.OptimizeOrReplicate;
  }

  return current === routeNames.ArchitecturalDesignSolutions 
    ? routeNames.CreatePriceEstimate
    : routeNames.ArchitecturalDesignSolutions;
}

export const IGCEArchitecturalDesignSolutionsResolver = (current: string): string => {
  if (currentEnvNeedsArchitectureDesign() || DOWNeedsArchitectureDesign()) {
    return routeNames.ArchitecturalDesignSolutions;
  }

  return current === routeNames.GatherPriceEstimates && needsReplicateOrOptimize()
    ? routeNames.OptimizeOrReplicate
    : current === routeNames.GatherPriceEstimates
      ? routeNames.CreatePriceEstimate
      : routeNames.GatherPriceEstimates;
}

export const IGCESupportingDocumentationResolver = (current: string): string => {
  if (current === routeNames.EstimatesDeveloped) {
    return routeNames.SupportingDocumentation;
  } else {
    return current === routeNames.FundingPlanType &&
    (IGCEStore.requirementsCostEstimate?.has_DOW_and_PoP === "YES")
      ? routeNames.SupportingDocumentation
      : routeNames.CannotProceed;
  }
};

export const MIPRResolver = (current: string): string => {
  const fundingType = FinancialDetails.fundingRequestType;
  if (fundingType === "MIPR") {
    return routeNames.MIPR;
  }
  return current === routeNames.GInvoicing
    ? routeNames.FundingPlanType
    : routeNames.GInvoicing;
};

export const GInvoicingResolver = (current: string): string => {
  const fundingType = FinancialDetails.fundingRequestType;
  if (fundingType === "FS_FORM") {
    return routeNames.GInvoicing;
  }
  
  return current === routeNames.SeverabilityAndIncrementalFunding
    ? routeNames.MIPR
    : routeNames.SeverabilityAndIncrementalFunding
}

export const Upload7600Resolver = (current: string): string => {
  const useGInvoicing = FinancialDetails.gInvoicingData.useGInvoicing === "YES";
  if (!useGInvoicing) {
    const fundingType = FinancialDetails.fundingRequestType;
    return fundingType === "MIPR" 
      ? routeNames.MIPR
      : routeNames.Upload7600;
  }

  return current === routeNames.SeverabilityAndIncrementalFunding
    ? routeNames.GInvoicing
    : routeNames.SeverabilityAndIncrementalFunding;
}
const cutOff = 270;
export async function calcBasePeriod(): Promise<number> {
  const periods = await Periods.loadPeriods()
  let basePeriod = 0
  let multiplier = 1;
  if (periods.length) {
    switch (periods[0].period_unit) {
    case "WEEK":
      multiplier = 7;
      break;
    case "MONTH":
      multiplier = 30;
      break;
    case "YEAR":
      multiplier = 365;
      break;
    default:
    }
    basePeriod = Number(periods[0].period_unit_count) * multiplier;
    return basePeriod
  }
  return 0;
}

export const IncrementalFundingResolver = (current: string): string => {
  let baseDuration
  calcBasePeriod().then(value => {
    baseDuration = value
  })

  const isIncrementallyFunded = TaskOrder.value.incrementally_funded

  if (baseDuration && baseDuration < cutOff || isIncrementallyFunded === "NO") {
    return routeNames.UploadJAMRRDocuments;
  }

  return current === routeNames.IncrementalFunding
    ? routeNames.FinancialPOCForm
    : routeNames.IncrementalFunding
}

export const FinancialPOCResolver =  (current: string): string => {
  const isIncrementallyFunded = TaskOrder.value.incrementally_funded
  let baseDuration
  calcBasePeriod().then(value => {
    baseDuration = value
  })
  if (current === routeNames.UploadJAMRRDocuments && baseDuration && baseDuration < cutOff ||
      current === routeNames.UploadJAMRRDocuments && isIncrementallyFunded === "NO") {
    return routeNames.SeverabilityAndIncrementalFunding;
  }

  return current === routeNames.FinancialPOCForm
    ? routeNames.UploadJAMRRDocuments
    : routeNames.FinancialPOCForm

}

export const SecurityRequirementsResolver = (current: string): string => {
  const classifications = ClassificationRequirements.selectedClassificationLevels
  let secretOrTopSecret = false
  classifications.forEach(classification => {
    if(classification.classification === "S" || classification.classification === "TS"){
      secretOrTopSecret = true
    }
  })
  if(secretOrTopSecret){
    return routeNames.SecurityRequirements
  }

  return current === routeNames.ClassificationRequirements
    ? routeNames.CrossDomain
    : routeNames.ClassificationRequirements
}


// add resolver here so that it can be found by invoker
const routeResolvers: Record<string, StepRouteResolver> = {
  AcorsRouteResolver,
  CurrentContractDetailsRouteResolver,
  ReplicateDetailsResolver,
  CurrentEnvRouteResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  IGCECannotProceedResolver,
  IGCEOptimizeOrReplicateResolver,
  IGCEArchitecturalDesignSolutionsResolver,
  IGCESupportingDocumentationResolver,
  MIPRResolver,
  IGCESurgeCapabilities,
  GInvoicingResolver,
  Upload7600Resolver,
  IncrementalFundingResolver,
  FinancialPOCResolver,
  CreateEvalPlanRouteResolver,
  BVTOResolver,
  NoEvalPlanRouteResolver,
  EvalPlanDetailsRouteResolver,
  ArchitecturalDesignDetailsRouteResolver,
  SecurityRequirementsResolver,
  UploadJAMRRDocumentsRouteResolver,
  AnticipatedUserAndDataNeedsResolver,
  DOWArchitecturalDesignResolver,
};

// add path resolvers here 
const pathResolvers: Record<string, StepPathResolver> = {
  OtherOfferingSummaryPathResolver,
  OfferGroupOfferingsPathResolver,
  OfferingDetailsPathResolver,
  DowSummaryPathResolver,
  RequirementsPathResolver,
}

export const InvokeRouteResolver = (
  resolverName: string,
  currentStep: string
): string => routeResolvers[resolverName](currentStep);

export const InvokePathResolver = (
  resolverName: string,
  currentStep: string,
  direction: string
): string => pathResolvers[resolverName](currentStep, direction); 
