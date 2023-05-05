import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import { sanitizeOfferingName } from "@/helpers";
import { routeNames } from "../stepper";
import { RouteDirection, StepPathResolver, StepRouteResolver } from "@/store/steps/types";
import DescriptionOfWork from "@/store/descriptionOfWork";
import Steps from "@/store/steps";
import Periods from "@/store/periods";
import IGCEStore from "@/store/IGCE";
import { EvaluationPlanDTO, SelectedClassificationLevelDTO } from "@/api/models";
import ClassificationRequirements from "@/store/classificationRequirements";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import EvaluationPlan from "@/store/acquisitionPackage/evaluationPlan";
import IGCE from "@/store/IGCE";

import { provWorkflowRouteNames } from "../provisionWorkflow"
import PortfolioStore from "@/store/portfolio";
import AcquisitionPackageSummary from "@/store/acquisitionPackageSummary";

export const showDITCOPageResolver = (current: string): string => {
  return current === routeNames.ContractingShop
    ? routeNames.DAPPSChecklist 
    : routeNames.ContractingShop;
};

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

export const EvalPlanDetailsRouteResolver = (current: string): string => {
  const evalPlan = EvaluationPlan.evaluationPlan as EvaluationPlanDTO;
  if (!evalPlanRequired() || missingEvalPlanMethod(evalPlan)) {
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
    // moving backwards
    if (!evalPlanRequired() || missingEvalPlanMethod(evalPlan)) {
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

const isProdEnv = (): boolean | null => {
  return AcquisitionPackage.isProdEnv || AcquisitionPackage.emulateProdNav;
}

export const ProposedCSPRouteResolver = (current: string): string => {
  // TODO - remove isProdEnv condition below when J&A/MRR ready for production
  return current === routeNames.Exceptions && (isProdEnv() || evalPlanRequired()) 
    ? routeNames.CreateEvalPlan
    : routeNames.ProposedCSP
};

export const CertificationPOCsRouteResolver = (current: string): string => {
  // TODO - remove isProdEnv condition below when J&A/MRR ready for production
  return (isProdEnv() || evalPlanRequired()) && current === routeNames.CreateEvalPlan
    ? routeNames.Exceptions
    : routeNames.CertificationPOCs
}

const plansToRemoveBarriers = ():boolean =>{
  const generated = AcquisitionPackage.fairOpportunity?.barriers_plans_to_remove_generated
  const custom = AcquisitionPackage.fairOpportunity?.barriers_plans_to_remove_custom
  return (generated !== "" || custom !== "")
} 
export const removeBarriersRouteResolver = (current: string): string => {
  return current === routeNames.OtherSupportingFactors && plansToRemoveBarriers()
    ? routeNames.ReviewBarriers
    : routeNames.RemoveBarriers
};

const needContractAction = ():boolean =>{
  return AcquisitionPackage.fairOpportunity?.contract_action !=='NONE'
}
export const conductedResearchRouteResolver = (current: string): string => {
  return current === routeNames.OtherSupportingFactors && needContractAction()
    ? routeNames.MarketResearchReview
    : routeNames.WhoConductedResearch
};

export const CurrentContractDetailsRouteResolver = (current: string): string => {
  const hasCurrentContract 
    = AcquisitionPackage.currentContract?.current_contract_exists === "YES";
  if (hasCurrentContract) {
    return routeNames.CurrentContractDetails;
  }
  return current === routeNames.CurrentContract
    ? routeNames.DOWLandingPage
    : routeNames.CurrentContract;
};
export const ReplicateAndOptimizeResolver = (current: string): string => {
  return current === routeNames.DOWLandingPage || current === routeNames.ReplicateDetails
    ? routeNames.ReplicateAndOptimize
    : routeNames.DOWLandingPage;
}

export const ReplicateDetailsResolver = (current: string): string => {
  if (needsReplicateOrOptimize()&& current !== routeNames.ArchitecturalDesign) {
    return routeNames.ReplicateDetails;
  }
  //back from Architectural design
  if(current === routeNames.ArchitecturalDesign){
    return routeNames.DOWLandingPage
  }
  return current === routeNames.ReplicateAndOptimize
    ? routeNames.DOWLandingPage
    : routeNames.ReplicateAndOptimize;
}

export const CurrentEnvRouteResolver = (current: string): string => {
  const hasCurrentEnv
    = CurrentEnvironment.currentEnvironment?.current_environment_exists === "YES";
  if (hasCurrentEnv) {
    return routeNames.UploadSystemDocuments;
  }
  return current === routeNames.CurrentEnvironment 
    ? routeNames.DOWLandingPage
    : routeNames.CurrentEnvironment;
};

export const CurrentEnvironmentSummaryResolver = (current: string): string => {
  return current === routeNames.ReplicateAndOptimize 
    ? routeNames.DOWLandingPage
    : routeNames.EnvironmentSummary;
}

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

// export const ContractTrainingReq = (current: string): string => {
//   const contractTraining
//       = AcquisitionPackage.contractConsiderations?.contractor_required_training === "YES";
//   if (contractTraining) {
//     return routeNames.TrainingCourses;
//   }
//   return current === routeNames.Training
//     ? routeNames.PII
//     : routeNames.Training;
// };
export const ContractingInfoResolver = (current: string): string => {
  const needsContractInformation =
      AcquisitionPackage.acquisitionPackage?.contracting_shop === "OTHER";

  if (needsContractInformation) {
    return routeNames.ContractingOfficeInfo;
  }
  return current === routeNames.ContractingShop 
    ? routeNames.ProjectOverview : routeNames.ContractingShop;
};

/****************************************************************************/
/****************************************************************************/
/****************************************************************************

██████   ██████  ██     ██               ███████ ████████  █████  ██████  ████████ 
██   ██ ██    ██ ██     ██               ██         ██    ██   ██ ██   ██    ██    
██   ██ ██    ██ ██  █  ██     █████     ███████    ██    ███████ ██████     ██    
██   ██ ██    ██ ██ ███ ██                    ██    ██    ██   ██ ██   ██    ██    
██████   ██████   ███ ███                ███████    ██    ██   ██ ██   ██    ██    


/****************************************************************************/
/****************************************************************************/

const setDontNeedButton = (groupId: string) => {
  /* eslint-disable camelcase */
  const offeringText: Record<string, string> = {
    compute: "Compute",
    developer_tools: "Developer Tools and Services",
    applications: "Application Services",
    machine_learning: "Machine Learning",
    networking: "Networking",
    security: "Security",
    database: "Database",
    storage: "Storage",
    edge_computing: "Edge Computing and Tactical Edge",
    iot: "Internet of Things",
    general_xaas: "General IaaS, PaaS, and SaaS",
    advisory_assistance: "Advisory and Assistance",
    help_desk_services: "Help Desk Services",
    training: "Training",
    portability_plan: "a Portability Plan",
    documentation_support: "Documentation Support",
    general_cloud_support: "General Cloud Support",
  }
  /* eslint-enable camelcase */
  let dontNeedButtonText = "I don’t need ";
  const offeringStr = offeringText[groupId.toLowerCase()] || "these cloud resources";
  dontNeedButtonText += offeringStr;

  Steps.setAdditionalButtonText({
    buttonText: dontNeedButtonText, 
    buttonId: "DontNeedResources"
  });

}


const otherServiceOfferings = DescriptionOfWork.otherServiceOfferings;

const basePerformanceRequirementsPath =  "performance-requirements";
const requirementCategories = "/requirement-categories";
const descriptionOfWorkSummaryPath = "performance-requirements/dow-summary";
const DOWSecurityRequitementsPath = "performance-requirements/dow-security-requirements";
const otherServiceOfferingSummaryPath = "performance-requirements/service-offerings/other/summary";

const baseOfferingDetailsPath =  `${basePerformanceRequirementsPath}/service-offering-details/`;
const getServiceOfferingsDetailsPath= (groupId: string, serviceName: string)=> {
  let path = `${baseOfferingDetailsPath}${groupId.toLowerCase()}/`
  path += `${sanitizeOfferingName(serviceName)}`;
  return path;
}

const getOfferingGroupServicesPath = (groupId: string)=>
  `${basePerformanceRequirementsPath}/service-offerings/${groupId.toLowerCase()}`

/****************************************************************************

 ██████  █████  ████████ ███████  ██████   ██████  ██████  ██ ███████ ███████ 
██      ██   ██    ██    ██      ██       ██    ██ ██   ██ ██ ██      ██      
██      ███████    ██    █████   ██   ███ ██    ██ ██████  ██ █████   ███████ 
██      ██   ██    ██    ██      ██    ██ ██    ██ ██   ██ ██ ██           ██ 
 ██████ ██   ██    ██    ███████  ██████   ██████  ██   ██ ██ ███████ ███████ 

/****************************************************************************/
export const ArchitecturalDesignResolver = (current: string): string => {
  const groupId = DescriptionOfWork.currentGroupId;
  setDontNeedButton(groupId);
  //coming from replicate and optimize or replicate details
  if(current === routeNames.ReplicateAndOptimize ||
    current === routeNames.ReplicateDetails){
    return routeNames.DOWLandingPage
  }
  //coming back from Architectural Design details
  if(current === routeNames.ArchitecturalDesignDetails){
    return routeNames.ArchitecturalDesign
  }
  return current === routeNames.DOWLandingPage
    ? routeNames.ArchitecturalDesign
    : routeNames.DOWLandingPage;
}

export const ArchitecturalDesignDetailsResolver = (current: string): string => {
  if (current === routeNames.RequirementCategories) {
    return routeNames.DOWLandingPage
  }
  const hasCurEnvArchDesignNeeds = DescriptionOfWork
    .DOWArchitectureNeeds.needs_architectural_design_services === "YES";

  return hasCurEnvArchDesignNeeds
    ? routeNames.ArchitecturalDesignDetails
    : routeNames.DOWLandingPage;
}

export const RequirementsPathResolver = (current: string, direction: string): string => {
  if (current === routeNames.DOWLandingPage) {
    if ((DescriptionOfWork.currentDOWSection === "XaaS"
      && !DescriptionOfWork.hasXaasService)
      || (DescriptionOfWork.currentDOWSection === "CloudSupport"
      && !DescriptionOfWork.hasCloudService)
    ) {
      return requirementCategories;
    } else {
      return descriptionOfWorkSummaryPath;
    }
  }

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
      setDontNeedButton(group);
    
      return ServiceOfferingsPathResolver(serviceOffering , direction);
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
    setDontNeedButton(previousGroup);
    
    //Compute, General XaaS, etc. don't have service offerings
    if (otherServiceOfferings.indexOf(previousGroup) > -1) {
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

/****************************************************************************

 █████  ██████   ██████ ██   ██     ██████  ███████ ███████ ██  ██████  ███    ██ 
██   ██ ██   ██ ██      ██   ██     ██   ██ ██      ██      ██ ██       ████   ██ 
███████ ██████  ██      ███████     ██   ██ █████   ███████ ██ ██   ███ ██ ██  ██ 
██   ██ ██   ██ ██      ██   ██     ██   ██ ██           ██ ██ ██    ██ ██  ██ ██ 
██   ██ ██   ██  ██████ ██   ██     ██████  ███████ ███████ ██  ██████  ██   ████ 


/****************************************************************************/



/****************************************************************************

██    ██ ███████ ███████ ██████  ███████     ██ ██████   █████  ████████  █████  
██    ██ ██      ██      ██   ██ ██         ██  ██   ██ ██   ██    ██    ██   ██ 
██    ██ ███████ █████   ██████  ███████   ██   ██   ██ ███████    ██    ███████ 
██    ██      ██ ██      ██   ██      ██  ██    ██   ██ ██   ██    ██    ██   ██ 
 ██████  ███████ ███████ ██   ██ ███████ ██     ██████  ██   ██    ██    ██   ██ 


/****************************************************************************/

export const AnticipatedUserAndDataNeedsResolver = (current:string): string => {
  const groupId = DescriptionOfWork.currentGroupId;
  setDontNeedButton(groupId);

  if (
    (DescriptionOfWork.XaaSNoneSelected && DescriptionOfWork.currentDOWSection === "XaaS") ||
    (DescriptionOfWork.cloudNoneSelected && DescriptionOfWork.currentDOWSection === "CloudSupport")
  ) {
    return routeNames.DOWLandingPage;
  }

  if (current === routeNames.DOWSummary ||
    current === routeNames.RequirementCategories
    && DescriptionOfWork.currentDOWSection === "XaaS"
    && DescriptionOfWork.hasXaasService
  ) {
    return routeNames.AnticipatedUserAndDataNeeds
  }

  return current === routeNames.RequirementCategories
    ? routeNames.ServiceOfferings
    : routeNames.RequirementCategories;
}
/****************************************************************************

██████   █████   ██████  ███████     ██████  
██   ██ ██   ██ ██       ██               ██ 
██████  ███████ ██   ███ █████        █████  
██      ██   ██ ██    ██ ██          ██      
██      ██   ██  ██████  ███████     ███████ 

/****************************************************************************/

// This is the "simple 7" 2nd-level checkbox list page for non-"other offering" categories
// ... the service offering checkbox list for a selected offering group...
// AND the "other offering" form page

export const ServiceOfferingsPathResolver = (
  current: string, direction: string
): string => {
  DescriptionOfWork.setBackToContractDetails(false);
  Steps.clearAltBackButtonText();
  DescriptionOfWork.setCurrentGroupRemoved(false);
  
  if (DescriptionOfWork.returnToDOWSummary && DescriptionOfWork.getFromAnticipatedUsersAndData) {
    DescriptionOfWork.setReturnToDOWSummary(false);
    DescriptionOfWork.setFromAnticipatedUsersAndData(false);
    DescriptionOfWork.setLastGroupRemoved(false);
    DescriptionOfWork.setCurrentGroupRemovedForNav(false);
    return descriptionOfWorkSummaryPath;
  }
  // if no options selected on category page, or if only "None apply" checkboxes checked, 
  // or if last group was removed, send to summary page
  const DOWObject = DescriptionOfWork.DOWObject;
  const currentGroupId = DescriptionOfWork.currentGroupId;
  const isOtherOffering = otherServiceOfferings.indexOf(currentGroupId) > -1;

  const atLastNoneApply = DescriptionOfWork.currentDOWSection === "XaaS"
    ? currentGroupId === DescriptionOfWork.xaaSNoneValue
    : currentGroupId === DescriptionOfWork.cloudNoneValue;

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
      setDontNeedButton(previousGroup);
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
        setDontNeedButton(previousGroup);
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

  setDontNeedButton(currentGroupId);

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

/****************************************************************************

███████ ██ ███    ███ ██████  ██      ███████      ██████      ███████  ██████  ██████  ███    ███ 
██      ██ ████  ████ ██   ██ ██      ██          ██           ██      ██    ██ ██   ██ ████  ████ 
███████ ██ ██ ████ ██ ██████  ██      █████       ███████      █████   ██    ██ ██████  ██ ████ ██ 
     ██ ██ ██  ██  ██ ██      ██      ██          ██    ██     ██      ██    ██ ██   ██ ██  ██  ██ 
███████ ██ ██      ██ ██      ███████ ███████      ██████      ██       ██████  ██   ██ ██      ██ 

/****************************************************************************/


//this will always return the path for the current group and the current offering
export const OfferingDetailsPathResolver = (current: string, direction: string): string => {
  Steps.clearAltBackButtonText();
  Steps.setAdditionalButtonHide(false);
  const groupId = DescriptionOfWork.currentGroupId;
  setDontNeedButton(groupId);
  const isOtherOffering = otherServiceOfferings.indexOf(groupId) > -1;

  if (DescriptionOfWork.summaryBackToContractDetails) {
    DescriptionOfWork.setBackToContractDetails(false);
    return "current-contract/current-contract";
  }
  
  const missingClassification = DescriptionOfWork.missingClassificationLevels;

  if(current === routeNames.OtherOfferingSummary && 
    isOtherOffering && direction === "previous"){
    if(DescriptionOfWork.returnToDOWSummary){
      return descriptionOfWorkSummaryPath;
    }
    if(DescriptionOfWork.prevOfferingGroup){
      const group = DescriptionOfWork.prevOfferingGroup
      DescriptionOfWork.setCurrentOfferingGroupId(group);
      setDontNeedButton(group);
    } else {
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
      return ServiceOfferingsPathResolver(serviceOffering , direction);
    }

    if (DescriptionOfWork.currentOfferingName === ""){
      //get the last offering and display
      const offering = DescriptionOfWork.lastOfferingForGroup;
      if (offering && !missingClassification) {
        DescriptionOfWork.setCurrentOffering(offering);
      } else {
        const serviceOffering = routeNames.ServiceOfferings
        return ServiceOfferingsPathResolver(serviceOffering , direction);
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
    && otherServiceOfferings.indexOf(nextOrPrevGroup) > -1)) {
    // send to group offerings page
    const serviceOffering = routeNames.ServiceOfferings
    DescriptionOfWork.setCurrentOfferingGroupId(nextOrPrevGroup);
    setDontNeedButton(nextOrPrevGroup);
    return ServiceOfferingsPathResolver(serviceOffering , direction);
  }

  DescriptionOfWork.setReturnToDOWSummary(false);
  return descriptionOfWorkSummaryPath
}


/****************************************************************************
 ██████      ██████         ███████ ██    ██ ███    ███ ███    ███  █████  ██████  ██    ██ 
██    ██    ██    ██        ██      ██    ██ ████  ████ ████  ████ ██   ██ ██   ██  ██  ██  
██    ██    ██    ██        ███████ ██    ██ ██ ████ ██ ██ ████ ██ ███████ ██████    ████   
██    ██    ██    ██             ██ ██    ██ ██  ██  ██ ██  ██  ██ ██   ██ ██   ██    ██    
 ██████  ██  ██████  ██     ███████  ██████  ██      ██ ██      ██ ██   ██ ██   ██    ██    
/****************************************************************************/

export const OtherOfferingSummaryPathResolver = (current: string, direction: string): string => {
  const packageHasSecretOrHigher = ClassificationRequirements.packageHasSecretOrHigher;
  const showSecurityRequirements = DescriptionOfWork.showSecurityRequirements;
  if (packageHasSecretOrHigher && showSecurityRequirements) {
    DescriptionOfWork.doSetNeedsSecurityRequirements(false);
    return DOWSecurityRequitementsPath;  
  }

  const groupId = DescriptionOfWork.currentGroupId;
  if (otherServiceOfferings.indexOf(groupId) > -1) {
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

/****************************************************************************

███████ ███████  ██████ ██    ██ ██████  ██ ████████ ██    ██     ██████  ███████  ██████  
██      ██      ██      ██    ██ ██   ██ ██    ██     ██  ██      ██   ██ ██      ██    ██ 
███████ █████   ██      ██    ██ ██████  ██    ██      ████       ██████  █████   ██    ██ 
     ██ ██      ██      ██    ██ ██   ██ ██    ██       ██        ██   ██ ██      ██ ▄▄ ██ 
███████ ███████  ██████  ██████  ██   ██ ██    ██       ██        ██   ██ ███████  ██████  

/****************************************************************************/


export const DOWSecurityRequirementsPathResolver 
  = (current: string, direction: string): string => {
    const packageHasSecretOrHigher = ClassificationRequirements.packageHasSecretOrHigher;
    const showSecurityRequirements = DescriptionOfWork.showSecurityRequirements;

    if (packageHasSecretOrHigher && showSecurityRequirements) {
      DescriptionOfWork.doSetNeedsSecurityRequirements(false);
      return DOWSecurityRequitementsPath;
    }

    const groupId = DescriptionOfWork.currentGroupId;
    const isOtherOffering = otherServiceOfferings.indexOf(groupId) > -1;

    if (isOtherOffering && direction === "prev") {
      return OtherOfferingSummaryPathResolver(current, direction);
    } else if (direction === "prev") {
      return OfferingDetailsPathResolver(current, direction);
    }
    DescriptionOfWork.doSetNeedsSecurityRequirements(false);
    return DowSummaryPathResolver(current, direction);
  };


/****************************************************************************

██████   ██████  ██     ██     ███████ ██    ██ ███    ███  █████  ███    ███ ██████  ██    ██ 
██   ██ ██    ██ ██     ██     ██      ██    ██ ████  ████ ██   ██ ████  ████ ██   ██  ██  ██  
██   ██ ██    ██ ██  █  ██     ███████ ██    ██ ██ ████ ██ ███████ ██ ████ ██ ██████    ████   
██   ██ ██    ██ ██ ███ ██          ██ ██    ██ ██  ██  ██ ██   ██ ██  ██  ██ ██   ██    ██    
██████   ██████   ███ ███      ███████  ██████  ██      ██ ██   ██ ██      ██ ██   ██    ██    

/****************************************************************************/

export const DowSummaryPathResolver = (current: string, direction: string): string =>{
  DescriptionOfWork.setBackToContractDetails(current === routeNames.ConflictOfInterest);
  Steps.clearAltBackButtonText();
  if (current === routeNames.DOWLandingPage) {
    const hasCurrentContract 
      = AcquisitionPackage.currentContract?.current_contract_exists === "YES";
    if (hasCurrentContract) {
      return CurrentEnvironment.currentEnvironment.current_environment_exists === "YES" 
        && CurrentEnvironment.currentEnvInstances.length > 0
        ? "/current-contract/environment-summary"
        : "/current-contract/current-environment"
    } else {
      return "/current-contract/current-contract"
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
  if(current === routeNames.ServiceOfferingDetails
    || current === routeNames.DOWSecurityRequirements
  ){

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
      setDontNeedButton(nextOfferingGroup);
      return ServiceOfferingsPathResolver(current , direction);
    }
  }
  return OfferingDetailsPathResolver(current, direction);
};


/****************************************************************************/
/****************************************************************************/
/****************************************************************************

██████   ██████  ██     ██               ███████ ███    ██ ██████  
██   ██ ██    ██ ██     ██               ██      ████   ██ ██   ██ 
██   ██ ██    ██ ██  █  ██     █████     █████   ██ ██  ██ ██   ██ 
██   ██ ██    ██ ██ ███ ██               ██      ██  ██ ██ ██   ██ 
██████   ██████   ███ ███                ███████ ██   ████ ██████  

/****************************************************************************/
/****************************************************************************/
/****************************************************************************

██  ██████   ██████ ███████               ███████ ████████  █████  ██████  ████████ 
██ ██       ██      ██                    ██         ██    ██   ██ ██   ██    ██    
██ ██   ███ ██      █████       █████     ███████    ██    ███████ ██████     ██    
██ ██    ██ ██      ██                         ██    ██    ██   ██ ██   ██    ██    
██  ██████   ██████ ███████               ███████    ██    ██   ██ ██   ██    ██    

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

const IGCERouteNext = (current: string): string => {

  if (needsReplicateOrOptimize() && current === routeNames.CreatePriceEstimate) {
    return routeNames.OptimizeOrReplicate;
  }
  
  if ((currentEnvNeedsArchitectureDesign() || DOWNeedsArchitectureDesign()) &&
    (current === routeNames.CreatePriceEstimate 
    || current === routeNames.OptimizeOrReplicate)) {
    return routeNames.ArchitecturalDesignSolutions;
  }
  if (hasServiceOfferings() && 
    (current === routeNames.CreatePriceEstimate
    || current === routeNames.OptimizeOrReplicate
    || current === routeNames.ArchitecturalDesignSolutions)
  ) {
    return routeNames.GatherPriceEstimates;
  }
  if (dowHasTraining() && 
    (current === routeNames.CreatePriceEstimate
    || current === routeNames.OptimizeOrReplicate
    || current === routeNames.ArchitecturalDesignSolutions
    || current === routeNames.GatherPriceEstimates)
  ) {
    IGCE.setIgceTrainingIndex(0);
    return routeNames.IGCETraining;
  }
  if (needsTravelEstimate() && 
    (current === routeNames.CreatePriceEstimate
    || current === routeNames.OptimizeOrReplicate
    || current === routeNames.ArchitecturalDesignSolutions
    || current === routeNames.GatherPriceEstimates
    || current === routeNames.IGCETraining)
  ) {
    return routeNames.TravelEstimates;
  }
  return routeNames.SurgeCapacity;

}



export const IGCECannotProceedResolver = (current: string): string => {
  if (!(IGCEStore.requirementsCostEstimate?.has_DOW_and_PoP === "YES")){
    return routeNames.CannotProceed;
  }

  if (current === routeNames.CreatePriceEstimate) {
    return IGCERouteNext(current);
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

  // moving backwards
  if (current === routeNames.ArchitecturalDesignSolutions
    || current === routeNames.GatherPriceEstimates
    || current === routeNames.IGCETraining
    || current === routeNames.TravelEstimates
  ) {
    return routeNames.CreatePriceEstimate;
  }

  // move forwards
  return IGCERouteNext(current);
}

export const IGCEArchitecturalDesignSolutionsResolver = (current: string): string => {
  if (currentEnvNeedsArchitectureDesign() || DOWNeedsArchitectureDesign()) {
    return routeNames.ArchitecturalDesignSolutions;
  }

  // moving backwards
  if (current === routeNames.GatherPriceEstimates
    || current === routeNames.IGCETraining
    || current === routeNames.TravelEstimates
  ) {
    return needsReplicateOrOptimize() 
      ? routeNames.OptimizeOrReplicate 
      : routeNames.CreatePriceEstimate;
  }

  // move forwards
  return IGCERouteNext(current);
}

export const IGCETrainingPathResolver = (current: string, direction: string): string =>{
  const basePath = "requirements-cost-estimate/";
  const createPriceEstimatePath = basePath + "create-price-estimate";
  const repOptimizePath = basePath + "optimize-or-replicate";
  const archDesignPath = basePath + "architectural-design-solutions";
  const gatherPriceEstimatesPath = basePath + "gather-price-estimates";
  const igceTrainingPath = basePath + "training-estimate";
  const travelEstimatePath = basePath + "travel-estimate";
  const surgeCapacityPath = basePath + "surge-capacity";

  const hasTraining = dowHasTraining();
  const isFirstTraining = isFirstIGCETraining();
  const isLastTraining = isLastIGCETraining();
  const isSingleTraining = isSingleTrainingInstance();

  const needsArchDesign 
    = currentEnvNeedsArchitectureDesign() || DOWNeedsArchitectureDesign();
  const needsRepOrOpt = needsReplicateOrOptimize();
  const hasTravel = needsTravelEstimate();
  const hasOfferings = hasServiceOfferings();

  // =======================================================
  // MOVING FORWARD
  if (current === routeNames.ArchitecturalDesignSolutions) {
    if (hasOfferings) return gatherPriceEstimatesPath;
  }
  if (current === routeNames.ArchitecturalDesignSolutions 
    || current === routeNames.GatherPriceEstimates
  ) {
    if (hasTraining) {
      IGCE.setIgceTrainingIndex(0);
      return igceTrainingPath;
    } 
    if (hasTravel) return travelEstimatePath;
    return surgeCapacityPath;
  }
  // =======================================================
  // MOVING BACKWARD
  if (current === routeNames.SurgeCapacity) {
    if (hasTravel) return travelEstimatePath;
  }
  if (current === routeNames.SurgeCapacity || current === routeNames.TravelEstimates) {
    if (hasTraining) {
      IGCE.setIgceTrainingIndex(lastTrainingIndex());
      return igceTrainingPath;
    } 
    if (hasOfferings) return gatherPriceEstimatesPath;
    if (needsArchDesign) return archDesignPath;
    if (needsRepOrOpt) return repOptimizePath;
    return createPriceEstimatePath;
  }

  // =======================================================
  // STARTING FROM TRAINING - DETERMINE IF LOOP OR MOVE ON

  // IF MULTIPLE TRAINING INSTANCES
  if (!isSingleTraining) {  
    // increase or decrease training instance index 
    const newIdx = direction === "next"
      ? IGCE.igceTrainingIndex + 1 : IGCE.igceTrainingIndex - 1;
    IGCE.setIgceTrainingIndex(newIdx);

    if (isFirstTraining) {
      if (direction === "previous") {
        if (hasOfferings) return gatherPriceEstimatesPath;
        if (needsArchDesign) return archDesignPath;
        if (needsRepOrOpt) return repOptimizePath;
        return createPriceEstimatePath;
      }
      return igceTrainingPath;

    } 
    if (isLastTraining && direction === "next") {
      return hasTravel ? travelEstimatePath : surgeCapacityPath;
    } 
    return igceTrainingPath;
  }

  // going previous from Training single instance
  if (direction === "previous") {
    if (hasOfferings) return gatherPriceEstimatesPath;
    if (needsArchDesign) return archDesignPath;
    if (needsRepOrOpt) return repOptimizePath;
    return createPriceEstimatePath;  
  }

  // going next from Training single instance to either Travel or Surge Capacity
  return hasTravel ? travelEstimatePath : surgeCapacityPath; 
}

export const IGCESurgeCapabilities =  (current:string): string =>{
  const surgeCapacity =
    IGCEStore.requirementsCostEstimate?.surge_requirements.capabilities as string;

  if (surgeCapacity.toUpperCase() !== "YES") {
    if (current === routeNames.SurgeCapacity){
      // TODO: change routeNames.EstimatesDeveloped below to routeNames.CostSummary
      // when cost summary page is reinstated
      return contractingShopIsDitco() ? routeNames.CostSummary : routeNames.FeeCharged;
    }
    if (current === routeNames.FeeCharged){
      return routeNames.SurgeCapacity;
    }
  } 
  return routeNames.SurgeCapabilities;
}

export const FeeChargedResolver = (current: string): string => {
  const surgeCapacity =
    IGCEStore.requirementsCostEstimate?.surge_requirements.capabilities as string;

  if (!contractingShopIsDitco()) {
    return routeNames.FeeCharged
  }

  if (current === routeNames.CostSummary) {
    return surgeCapacity === "YES" 
      ? routeNames.SurgeCapabilities
      : routeNames.SurgeCapacity;
  }
  // TODO: change routeNames.EstimatesDeveloped below to routeNames.CostSummary
  // when cost summary page is reinstated
  return routeNames.CostSummary;
}

const contractingShopIsDitco = (): boolean => {
  return AcquisitionPackage.contractingShop === "DITCO"
}

const hasServiceOfferings = (): boolean => {
  const offerings = DescriptionOfWork.DOWObject.filter(obj => {
    return obj.serviceOfferingGroupId !== "TRAINING" 
      && obj.serviceOfferingGroupId.indexOf("NONE") === -1
  });
  return offerings.length >= 1;
}

const needsTravelEstimate = (): boolean => {
  return DescriptionOfWork.travelSummaryInstances.length>0;
}

const isFirstIGCETraining = (): boolean => {
  const trainingIndex = IGCE.igceTrainingIndex;
  return trainingIndex <= 0;
}

const isLastIGCETraining = (): boolean => {
  const trainingOfferings = DescriptionOfWork.DOWObject.find(
    item => item.serviceOfferingGroupId === "TRAINING"
  );
  const trainingIndex = IGCE.igceTrainingIndex;
  return trainingOfferings?.otherOfferingData 
    ? trainingIndex >= trainingOfferings.otherOfferingData.length - 1 : false;
}

const isSingleTrainingInstance = (): boolean => {
  const trainingOfferings = DescriptionOfWork.DOWObject.find(
    item => item.serviceOfferingGroupId === "TRAINING"
  );
  return trainingOfferings?.otherOfferingData?.length === 1 ? true : false;
}

const lastTrainingIndex = (): number => {
  const trainingOfferings = DescriptionOfWork.DOWObject.find(
    item => item.serviceOfferingGroupId === "TRAINING"
  );
  return trainingOfferings?.otherOfferingData?.length 
    ? trainingOfferings?.otherOfferingData?.length - 1
    : -1;
}

const dowHasTraining = (): boolean => {
  const trainingOfferings = DescriptionOfWork.DOWObject.find(
    item => item.serviceOfferingGroupId === "TRAINING"
  );

  return trainingOfferings?.otherOfferingData 
    ? trainingOfferings.otherOfferingData.length > 0 : false;
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
  return DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services === "YES";
}


/****************************************************************************/
/****************************************************************************/
/****************************************************************************

██  ██████   ██████ ███████               ███████ ███    ██ ██████  
██ ██       ██      ██                    ██      ████   ██ ██   ██ 
██ ██   ███ ██      █████       █████     █████   ██ ██  ██ ██   ██ 
██ ██    ██ ██      ██                    ██      ██  ██ ██ ██   ██ 
██  ██████   ██████ ███████               ███████ ██   ████ ██████  

/****************************************************************************/
/****************************************************************************/
/****************************************************************************/


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

  const isIncrementallyFunded = FinancialDetails.fundingRequirement?.incrementally_funded;

  if (baseDuration && baseDuration < cutOff || isIncrementallyFunded === "NO") {
    return routeNames.ReadyToGeneratePackage;
  }

  return current === routeNames.IncrementalFunding
    ? routeNames.FinancialPOCForm
    : routeNames.IncrementalFunding
}

export const FinancialPOCResolver =  (current: string): string => {
  const isIncrementallyFunded = FinancialDetails.fundingRequirement?.incrementally_funded;
  let baseDuration
  calcBasePeriod().then(value => {
    baseDuration = value
  })
  if (current === routeNames.ReadyToGeneratePackage && baseDuration && baseDuration < cutOff ||
      current === routeNames.ReadyToGeneratePackage && isIncrementallyFunded === "NO") {
    return routeNames.SeverabilityAndIncrementalFunding;
  }
  return current === routeNames.FinancialPOCForm
    ? routeNames.ReadyToGeneratePackage
    : routeNames.FinancialPOCForm
}
export const onlyOneClassification = (classifications: SelectedClassificationLevelDTO[])=>{
  const onlyUnclassified = classifications
    .every(classification => classification.classification === "U")
  const onlySecret = classifications
    .every(classification => classification.classification === "S")
  const onlyTopSecret = classifications
    .every(classification => classification.classification === "TS")
  return (onlySecret||onlyUnclassified||onlyTopSecret)
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

  if(onlyOneClassification(classifications) &&
      current === routeNames.ClassificationRequirements){
    return routeNames.CurrentContract
  }
  return current === routeNames.ClassificationRequirements
    ? routeNames.CrossDomain
    : routeNames.ClassificationRequirements
}
  
export const CrossDomainResolver = (current: string): string => {
  //create function for this to be reused
  const classifications = ClassificationRequirements.selectedClassificationLevels
  onlyOneClassification(classifications)

  //forward
  if(onlyOneClassification(classifications) &&
  current === routeNames.SecurityRequirements){
    return routeNames.CurrentContract
  }

  //backwards
  let secretOrTopSecret = false
  classifications.forEach(classification => {
    if(classification.classification === "S" || classification.classification === "TS"){
      secretOrTopSecret = true
    }
  })
  if(onlyOneClassification(classifications) &&
      current === routeNames.CurrentContract && secretOrTopSecret){
    return routeNames.SecurityRequirements
  }
  if(current === routeNames.CurrentContract && !onlyOneClassification(classifications)){
    return routeNames.CrossDomain
  }


  return current === routeNames.SecurityRequirements
    ? routeNames.CrossDomain
    : routeNames.ClassificationRequirements
}

export const GeneratedFromPackageRouteResolver = (current: string): string => {
  const packageCount = AcquisitionPackageSummary.packagesWaitingForTaskOrder;
  const acqPkgSysId = PortfolioStore.getSelectedAcquisitionPackageSysId;
  const showPackageSelection = PortfolioStore.showTOPackageSelection;
  if (packageCount && (!acqPkgSysId || showPackageSelection)) {
    return provWorkflowRouteNames.GeneratedFromPackage;
  }
  return current === provWorkflowRouteNames.PortfolioDetails
    ? provWorkflowRouteNames.AwardedTaskOrder
    : provWorkflowRouteNames.PortfolioDetails;
}


// add resolver here so that it can be found by invoker
const routeResolvers: Record<string, StepRouteResolver> = {
  showDITCOPageResolver,
  AcorsRouteResolver,
  ArchitecturalDesignResolver,
  ArchitecturalDesignDetailsResolver,
  CurrentContractDetailsRouteResolver,
  removeBarriersRouteResolver,
  conductedResearchRouteResolver,
  ReplicateAndOptimizeResolver,
  ReplicateDetailsResolver,
  CurrentEnvRouteResolver,
  CurrentEnvironmentSummaryResolver,
  PIIRecordResolver,
  FOIARecordResolver,
  A11yRequirementResolver,
  IGCECannotProceedResolver,
  IGCEOptimizeOrReplicateResolver,
  IGCEArchitecturalDesignSolutionsResolver,
  IGCESupportingDocumentationResolver,
  MIPRResolver,
  IGCESurgeCapabilities,
  FeeChargedResolver,
  GInvoicingResolver,
  Upload7600Resolver,
  IncrementalFundingResolver,
  FinancialPOCResolver,
  BVTOResolver,
  EvalPlanDetailsRouteResolver,
  ProposedCSPRouteResolver,
  CertificationPOCsRouteResolver,
  SecurityRequirementsResolver,
  CrossDomainResolver,
  AnticipatedUserAndDataNeedsResolver,
  ContractingInfoResolver,
  GeneratedFromPackageRouteResolver,
};

// add path resolvers here 
const pathResolvers: Record<string, StepPathResolver> = {
  OtherOfferingSummaryPathResolver,
  DOWSecurityRequirementsPathResolver,
  ServiceOfferingsPathResolver,
  OfferingDetailsPathResolver,
  DowSummaryPathResolver,
  RequirementsPathResolver,
  IGCETrainingPathResolver,
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
