import Vue from "vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { sanitizeOfferingName } from "@/helpers";
import { routeNames } from "../stepper";
import { RouteDirection, StepPathResolver, StepRouteResolver } from "@/store/steps/types";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Steps from "@/store/steps";


export const AcorsRouteResolver = (current: string): string => {
  const hasAlternativeContactRep = AcquisitionPackage.hasAlternativeContactRep;

  //routing from alternate cor and the user does not have
  //and alternatative contact rep
  if (
    current === routeNames.AlternateCor &&
    hasAlternativeContactRep === false
  ) {
    return routeNames.Summary;
  }

  //routing from summary and user does not have
  if (current === routeNames.Summary && hasAlternativeContactRep === false) {
    return routeNames.AlternateCor;
  }

  return routeNames.AcorInformation;
};


export const CurrentContractDetailsRouteResolver = (current: string): string => {
  const hasCurrentContract 
    = AcquisitionPackage.currentContract?.current_contract_exists === "YES";
  if (hasCurrentContract) {
    return routeNames.CurrentContractDetails;
  }
  return current === routeNames.CurrentContract
    ? routeNames.PeriodOfPerformance
    : routeNames.CurrentContract;
};

export const CurrentContractEnvRouteResolver = (current: string): string => {
  const hasCurrentContract 
    = AcquisitionPackage.currentContract?.current_contract_exists === "YES";
  if (hasCurrentContract) {
    return routeNames.CurrentEnvironment;
  }
  return current === routeNames.PeriodOfPerformance
    ? routeNames.CurrentContract
    : routeNames.PeriodOfPerformance;
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
    ? routeNames.EvaluationCriteria
    : routeNames.Section508Standards;
};

export const ContractTrainingReq = (current: string): string => {
  const contractTraining
      = AcquisitionPackage.contractConsiderations?.contractor_required_training === "YES";
  if (contractTraining) {
    return routeNames.TrainingCourses;
  }
  return current === routeNames.Training
    ? routeNames.PII
    : routeNames.Training;
};

const basePerformanceRequirementsPath =  "performance-requirements";
const descriptionOfWorkSummaryPath = "performance-requirements/dow-summary";

const baseOfferingDetailsPath =  `${basePerformanceRequirementsPath}/service-offering-details/`;
const getServiceOfferingsDetailsPath= (groupId: string, serviceName: string)=> {
  let path = `${baseOfferingDetailsPath}${groupId.toLowerCase()}/`
  path += `${sanitizeOfferingName(serviceName)}`;
  return path;
}

const getOfferingGroupServicesPath = (groupId: string)=>
  `${basePerformanceRequirementsPath}/service-offerings/${groupId.toLowerCase()}`

export const RequirementsPathResolver = (current: string, direction: string): string =>
{
  const atBeginningOfSericeOfferings = DescriptionOfWork.isAtBeginningOfServiceOfferings;
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
    !atBeginningOfOfferingGroups && atBeginningOfSericeOfferings){
    const previousGroup = DescriptionOfWork.prevOfferingGroup;
    if(previousGroup === undefined)
    {
      throw new Error('unable to get previous group');
    }
    DescriptionOfWork.setCurrentOfferingGroupId(previousGroup);
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

export const OfferGroupOfferingsPathResolver = (
  current: string, direction: string
): string => {
  DescriptionOfWork.setBackToContractDetails(false);
  Steps.clearAltBackButtonText();

  DescriptionOfWork.setCurrentGroupRemoved(false);
  // if no options selected on category page, or if only "None apply" checkboxes checked, 
  // or if last group was removed, send to summary page
  const DOWObject = DescriptionOfWork.DOWObject;
  const atLastNoneApply = DescriptionOfWork.currentGroupId === DescriptionOfWork.cloudNoneValue;
  const onlyNoneApplySelected = DOWObject.every((e) => {
    return e.serviceOfferingGroupId.indexOf("NONE") > -1;
  });
  const lastGroupRemoved = DescriptionOfWork.lastGroupRemoved;

  // if reviewing service group from store, set "atServicesEnd" to false 
  const reviewGroupFromSummary = DescriptionOfWork.reviewGroupFromSummary;
  const atServicesEnd = reviewGroupFromSummary ? false : DescriptionOfWork.isEndOfServiceOfferings;
  DescriptionOfWork.setReviewGroupFromSummary(false);

  const returnToDOWSummary = DescriptionOfWork.returnToDOWSummary;
  const addGroupFromSummary = DescriptionOfWork.addGroupFromSummary;
  const currentGroupRemovedForNav = DescriptionOfWork.currentGroupRemovedForNav;

  const nowhereToGo = DOWObject.length === 0 
    || onlyNoneApplySelected 
    || atLastNoneApply 
    || lastGroupRemoved

  if (!addGroupFromSummary 
    && ((currentGroupRemovedForNav && lastGroupRemoved) 
    || (currentGroupRemovedForNav && returnToDOWSummary)
    || (returnToDOWSummary && atServicesEnd) 
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
      return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
    }

    if (atBeginningOfOfferingGroups && atBeginningOfSericeOfferings && 
      current !== routeNames.ServiceOfferingDetails) {
      return basePerformanceRequirementsPath;
    }

    //if we are at the beginning of offering groups but not at the beginning of service offerings
    //get the next service offering and display it in service offering details
    if (atBeginningOfOfferingGroups && !atBeginningOfSericeOfferings){
      const previousServiceOffering = DescriptionOfWork.previousServiceOffering;
      const groupId = DescriptionOfWork.currentGroupId;
      if (previousServiceOffering === undefined) {
        throw new Error('unable to get previous service offering group');
      }
      DescriptionOfWork.setCurrentOffering(previousServiceOffering);

      return getServiceOfferingsDetailsPath(groupId, previousServiceOffering.name);
    }

    //at the beginning of service offerings for a given offering group
    if (!atBeginningOfOfferingGroups && atBeginningOfSericeOfferings) {
      //if routing from service offering details
      //send the user to the step to select the Service Offerings (Service Offerings)
      if (current === routeNames.ServiceOfferingDetails) {
        //display service offering group page
        return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
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
      const groupId = DescriptionOfWork.currentGroupId;

      //can we get the previous service offering for this group?
      const canGetPreviousOffering = DescriptionOfWork.canGetPreviousServiceOffering;

      if (canGetPreviousOffering) {
        const serviceOffering = DescriptionOfWork.previousServiceOffering;

        if (serviceOffering === undefined) {
          throw new Error('unable to get previous service offering');
        }

        DescriptionOfWork.setCurrentOffering(serviceOffering);

        return getServiceOfferingsDetailsPath(groupId, serviceOffering.name);
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

  //default  
  return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
}

//this will always return the path for the current group and the current offering
export const OfferingDetailsPathResolver = (current: string, direction: string): string => {
  Steps.clearAltBackButtonText();

  if (DescriptionOfWork.summaryBackToContractDetails) {
    DescriptionOfWork.setBackToContractDetails(false);
    return "period-of-performance/period-of-performance";
  }

  const missingClassification = DescriptionOfWork.missingClassificationLevels;

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
      // future todo: route to step 4 summary if user lands on DOW Summary from other step  
    } else {
      DescriptionOfWork.setLastGroupRemoved(false);
      DescriptionOfWork.setReturnToDOWSummary(false);
      return descriptionOfWorkSummaryPath;    
    }
  }

  const groupId = DescriptionOfWork.currentGroupId;
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
  if (!missingClassification) {
    const offering = sanitizeOfferingName(DescriptionOfWork.currentOfferingName);
    if (offering) {
      return `${baseOfferingDetailsPath}${groupId.toLowerCase()}/${offering.toLowerCase()}`;  
    }
  } 

  let group;
  if (current === routeNames.DOWSummary) {
    group = DescriptionOfWork.lastOfferingGroup;
  } else {
    group = direction === "next" 
      ? DescriptionOfWork.nextOfferingGroup 
      : DescriptionOfWork.prevOfferingGroup;
  }

  if (group) {
    // send to group offerings page
    const serviceOffering = routeNames.ServiceOfferings
    DescriptionOfWork.setCurrentOfferingGroupId(group);
    return OfferGroupOfferingsPathResolver(serviceOffering , direction);
  }

  DescriptionOfWork.setReturnToDOWSummary(false);
  return descriptionOfWorkSummaryPath
}

export const DowSummaryPathResolver = (current: string, direction: string): string =>{
  DescriptionOfWork.setBackToContractDetails(false);
  Steps.clearAltBackButtonText();

  if(current === routeNames.PropertyDetails){
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
}

// add resolver here so that it can be found by invoker
const routeResolvers: Record<string, StepRouteResolver> = {
  AcorsRouteResolver,
  CurrentContractDetailsRouteResolver,
  CurrentContractEnvRouteResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  ContractTrainingReq,
};

// add path resolvers here 
const pathResolvers: Record<string, StepPathResolver> = {
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
