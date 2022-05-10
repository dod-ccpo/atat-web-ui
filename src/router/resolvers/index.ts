import AcquisitionPackage from "@/store/acquisitionPackage";
import OtherContractConsiderations from "@/store/otherContractConsiderations";

import { routeNames } from "../stepper";
import { StepRouteResolver } from "@/store/steps/types";

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


export const CurrentContractRouteResolver = (current: string): string => {
  const hasCurrentContract 
    = AcquisitionPackage.currentContract?.current_contract_exists === "true";
  if (hasCurrentContract) {
    return routeNames.CurrentContractDetails;
  }
  return current === routeNames.CurrentContract
    ? routeNames.PerformanceRequirements
    : routeNames.CurrentContract;
};

export const PIIRecordResolver = (current: string): string => {
  const hasSystemOfRecord = OtherContractConsiderations.PIIRecordIncluded;
  // if system of record will be included, route to system of records page
  if (hasSystemOfRecord) {
    return routeNames.PIIRecord;
  }
  return current === routeNames.PII ? routeNames.BAA : routeNames.PII;
};

export const FOIARecordResolver = (current: string): string => {
  const needsFOIACoordinator 
    = AcquisitionPackage.sensitiveInformation?.potential_to_be_harmful === "true";
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
      = AcquisitionPackage.sensitiveInformation?.section_508_sufficient === "false";
  // if user selects "No" on Section 508 standards page,
  // then need to collect information about 508 accessibility requirements
  if (needsA11yReqs) {
    return routeNames.Section508AccessibilityRequirements;
  }
  return current === routeNames.Section508Standards
    ? routeNames.EvaluationCriteria
    : routeNames.Section508Standards;
};

export const ContractTrainigReq = (current: string): string => {
  const contractTrainig
      = AcquisitionPackage.contractConsiderations?.contractor_required_training === "YES";
  if (contractTrainig) {
    return routeNames.TrainingCourses;
  }
  return current === routeNames.Training
    ? routeNames.PII
    : routeNames.Training;
};

// add resolver here so that it can be found by invoker
const resolvers: Record<string, StepRouteResolver> = {
  AcorsRouteResolver,
  CurrentContractRouteResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  ContractTrainigReq,
};

export const InvokeResolver = (
  resolverName: string,
  currentStep: string
): string => resolvers[resolverName](currentStep);
