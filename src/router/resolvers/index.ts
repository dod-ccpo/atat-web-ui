import AcquisitionPackage from "@/store/acquisitionPackage";
import OtherContractConsiderations from "@/store/otherContractConsiderations";
import { sanitizeOfferingName } from "@/helpers";
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

const basePerformanceRequirementsPath =  `performance-requirements`;
const descriptionOfWorkSummaryPath=  "performance-requirements/dow-summary";

const baseOfferingDetailsPath =  `${basePerformanceRequirementsPath}/service-offering-details/`;
const getServiceOfferingsDetailsPath= (groupId: string, serviceName: string)=> {
  let path = `${baseOfferingDetailsPath}${groupId.toLowerCase()}/`
  path += `${sanitizeOfferingName(serviceName)}`;
  return path;
}
  

const getOfferingGroupServicesPath = (groupId: string)=>
  `${basePerformanceRequirementsPath}/service-offerings/${groupId.toLowerCase()}`

export const RequirementsPathResolver = (current: string): string =>
{
  
  const atBeginningOfSericeOfferings = DescriptionOfWork.isAtBeginningOfServiceOfferings;
  const atBeginningOfOfferingGroups = DescriptionOfWork.isAtBeginningOfServiceGroups;

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

export const OfferGroupOfferingsPathResolver = (current: string, 
  direction: string): string => {

  if(DescriptionOfWork.currentGroupId === "XaaS_NONE")
  {
    //we go straight to the summary for now... 
    //this might change slightly in the future...
    return descriptionOfWorkSummaryPath;
  }

  //handles moving backwards or forwards through service offerings
  if(current === routeNames.ServiceOfferingDetails &&
     direction.toUpperCase() === RouteDirection.PREVIOUS)
  {  
    const atBeginningOfSericeOfferings = DescriptionOfWork.isAtBeginningOfServiceOfferings;
    const atBeginningOfOfferingGroups = DescriptionOfWork.isAtBeginningOfServiceGroups;

    //at the beginning of service offerings and offering groups
    // direct the user back to the performance requirements step
    if(current === routeNames.ServiceOfferingDetails && 
      atBeginningOfOfferingGroups && atBeginningOfSericeOfferings){
      return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
    }

    if(atBeginningOfOfferingGroups && atBeginningOfSericeOfferings && 
      current !== routeNames.ServiceOfferingDetails)
    {
      return basePerformanceRequirementsPath;
    }

    //if we are at the beginning of offering groups but not at the beginning of service offerings
    //get the next service offering and display it in service offering details
    if(atBeginningOfOfferingGroups && !atBeginningOfSericeOfferings){
      const previousServiceOffering = DescriptionOfWork.previousServiceOffering;
      const groupId = DescriptionOfWork.currentGroupId;
      if(previousServiceOffering === undefined)
      {
        throw new Error('unable to get previous service offering group');
      }
      DescriptionOfWork.setCurrentOffering(previousServiceOffering);

      return getServiceOfferingsDetailsPath(groupId, previousServiceOffering.name);
    }

    //at the beginning of service offerings for a given offering group
    if(!atBeginningOfOfferingGroups && atBeginningOfSericeOfferings){

      //if routing from service offering details
      //send the user to the step to select the Service Offerings (Service Offerings)
      if(current === routeNames.ServiceOfferingDetails){
        //display service offering group page
        return getOfferingGroupServicesPath(DescriptionOfWork.currentGroupId);
      }

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

    //not at the beginning of service offerings or offering groups
    //get the next server offering and display in service offering details
    if(!atBeginningOfOfferingGroups && !atBeginningOfSericeOfferings)
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

        return getServiceOfferingsDetailsPath(groupId, serviceOffering.name);

      }
      else{
          
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
export const OfferingDetailsPathResolver =(): string => {

  const groupId = DescriptionOfWork.currentGroupId
  const offering = sanitizeOfferingName(DescriptionOfWork.currentOfferingName);
  return `${baseOfferingDetailsPath}${groupId.toLowerCase()}/${offering.toLowerCase()}`;

}

export const DowSummaryPathResolver = (current: string, direction: string): string =>{
  
  // coming from service offering details step
  if(current === routeNames.ServiceOfferingDetails){
    const atServicesEnd = DescriptionOfWork.isEndOfServiceOfferings;
    const atOfferingsEnd = DescriptionOfWork.isEndOfServiceGroups;

    //no more offerings or services to process go to summary
    if(atOfferingsEnd && atServicesEnd){
      return descriptionOfWorkSummaryPath;
    }

    //there's more services to process
    if(atOfferingsEnd && !atServicesEnd){
      const nextServiceOffering = DescriptionOfWork.nextServiceOffering;
      if(nextServiceOffering === undefined)
      {
        throw new Error('unable to retreive next service offering');
      }

      DescriptionOfWork.setCurrentOffering(nextServiceOffering);
      return OfferingDetailsPathResolver();
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
      return OfferingDetailsPathResolver();
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

    //should never get here
    return OfferingDetailsPathResolver();


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