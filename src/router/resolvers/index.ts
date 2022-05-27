import AcquisitionPackage from "@/store/acquisitionPackage";
import OtherContractConsiderations from "@/store/otherContractConsiderations";

import { routeNames } from "../stepper";
import { RouteDirection, StepPathResolver, StepRouteResolver } from "@/store/steps/types";
import DescriptionOfWork from "@/store/descriptionOfWork";

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

const baseOfferingDetailsPath =  `performance-requirements/service-offering-details/`;
const getServiceOfferingsDetailsPath= (groupId: string, serviceName: string)=> {
  let path = `${baseOfferingDetailsPath}${groupId.toLowerCase()}/`
  path += `${serviceName.toLowerCase().replace(/ /g, "_")}`;
  return path;
}
  

const getOfferingGroupServicesPath = (groupId: string)=>
  `performance-requirements/service-offerings/${groupId.toLowerCase()}`

export const OfferGroupOfferingsPathResolver = (current: string, 
  direction: string): string => {

  //handles moving backwards or forwards through service offerings
  if(current === routeNames.ServiceOfferingDetails &&
     direction.toUpperCase() === RouteDirection.PREVIOUS)
  {  
    const atBeginningOfSericeOfferings = DescriptionOfWork.isAtBeginningOfServiceOfferings;
    const atBeginningOfOfferingGroups = DescriptionOfWork.isAtBeginningOfServiceGroups;

    if(atBeginningOfSericeOfferings && !atBeginningOfOfferingGroups){
      //display the service offerings list for group
      return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
    }

    if(atBeginningOfSericeOfferings && atBeginningOfOfferingGroups){
      //there's more service offerings to work backwards towards
      const previousServiceOffering = DescriptionOfWork.prevOfferingGroup;
      const groupId = DescriptionOfWork.currentGroupId;
      if(previousServiceOffering === undefined)
      {
        throw new Error('unable to get previous service offering group');
      }
      DescriptionOfWork.setCurrentOffering(previousServiceOffering);

      return getServiceOfferingsDetailsPath(groupId, previousServiceOffering);
    }

    if(!atBeginningOfSericeOfferings && !atBeginningOfOfferingGroups)
    {
      const groupId = DescriptionOfWork.currentGroupId;

      //can we get the previous service offering for this group?
      const canGetPreviousOffering = DescriptionOfWork.canGetPreviousServiceOffering;

      if(canGetPreviousOffering){
        const serviceOffering = DescriptionOfWork.previousServiceOffering;

        if(serviceOffering === undefined)
        {
          throw new Error('unable to get previous service offering');
        }

        DescriptionOfWork.setCurrentOffering(serviceOffering);

        return getServiceOfferingsDetailsPath(groupId, serviceOffering);

      }
      else{

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
        return getServiceOfferingsDetailsPath(previousGroup, lastServiceOfferingForGroup);
      }
    }     
  }

  return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
}


export const OfferingDetailsPathResolver =(): string => {

  const groupId = DescriptionOfWork.currentGroupId
  const offering = DescriptionOfWork.currentOffering.replace(/ /g, "_");

  return `${baseOfferingDetailsPath}${groupId.toLowerCase()}/${offering.toLowerCase()}`;

}

export const DowSummaryPathResolver = (current: string, direction: string): string =>{
  

  if(current === routeNames.ServiceOfferingDetails){
    //we were navigating away from another details page
    const atOfferingsEnd = DescriptionOfWork.isEndOfServiceOfferings;
    const atServicesEnd = DescriptionOfWork.isEndOfServiceGroups;

    if(!atOfferingsEnd){
      const nextServiceOffering = DescriptionOfWork.nextServiceOffering;
      if(nextServiceOffering === undefined)
      {
        throw new Error('unable to retreive next service offering');
      }

      DescriptionOfWork.setCurrentOffering(nextServiceOffering);
      return OfferingDetailsPathResolver();
    }
    else{

      if(atServicesEnd){

        return "performance-requirements/dow-summary";
      }
      else{

        const nextOfferingGroup = DescriptionOfWork.nextOfferingGroup;
        if(nextOfferingGroup === undefined)
        {
          throw new Error('unable to retrive next offering group');
        }
        DescriptionOfWork.setCurrentOfferingGroupId(nextOfferingGroup);
        return OfferGroupOfferingsPathResolver(current , direction);

      }
    }
  }
  else{
    return OfferingDetailsPathResolver();
  }
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