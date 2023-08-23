import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import {
  DOWClassificationInstance,
  DOWServiceOffering,
  DOWServiceOfferingGroup,
  OtherServiceOfferingData,
  SummaryItem,
} from "types/Global";
import Periods from "../periods";
import AcquisitionPackage, { isMRRToBeGenerated } from "../acquisitionPackage";
import { ContractTypeApi } from "@/api/contractDetails";
import {
  ContractConsiderationsDTO,
  ContractTypeDTO,
  CrossDomainSolutionDTO, CurrentContractDTO,
  EvaluationPlanDTO,
  FairOpportunityDTO,
  PeriodDTO,
  PeriodOfPerformanceDTO,
  SelectedClassificationLevelDTO,
  SensitiveInformationDTO
} from "@/api/models";
import ClassificationRequirements, { isClassLevelUnclass } from "../classificationRequirements";
import { convertStringArrayToCommaList, toTitleCase } from "@/helpers";
import _ from "lodash";
import DescriptionOfWork from "../descriptionOfWork";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import EvaluationPlan from "../acquisitionPackage/evaluationPlan";


export const isStepValidatedAndTouched = async (stepNumber: number): Promise<boolean> =>{
  await validateStep(stepNumber);
  return isStepTouched(stepNumber)
} 

export const isStepTouched = (stepNumber: number): boolean =>{
  return (Summary.summaryItems.some(
    (si: SummaryItem) => si.step === stepNumber && si.isTouched 
  ))
} 

export const isSubStepValidatedAndTouched = async (
  stepNumber: number, 
  subStepNumber: number
): Promise<boolean> =>{
  await validateStep(stepNumber);
  return isSubStepComplete(stepNumber, subStepNumber)
} 

export const isSubStepTouched = (
  stepNumber: number, 
  subStepNumber: number
): boolean =>{
  return (Summary.summaryItems.filter(
    (si: SummaryItem) => 
      si.step === stepNumber && si.substep === subStepNumber
  ))[0].isTouched;
} 

export const isStepValidatedAndComplete = async (stepNumber: number): Promise<boolean> =>{
  await validateStep(stepNumber);
  return isStepComplete(stepNumber);
}

export const isStepComplete = (stepNumber: number): boolean =>{
  return Summary.summaryItems.filter(
    (si: SummaryItem) => si.step === stepNumber
  ).every((si: SummaryItem)=> si.isComplete)
}

export const isSubStepVaidatedAndComplete = async (
  stepNumber: number, 
  subStepNumber: number): 
Promise<boolean> =>{
  await validateStep(stepNumber);
  return isSubStepComplete(stepNumber, subStepNumber);
}

export const isSubStepComplete = (
  stepNumber: number, 
  subStepNumber: number): boolean =>{
  return  Summary.summaryItems.filter(
    (si: SummaryItem) => si.step === stepNumber && si.substep === subStepNumber
  )[0].isComplete;
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

export const validateStep = async(stepNumber: number): Promise<void> =>{
  switch(stepNumber){
  case 2:
    await Summary.validateStepTwo();
    break;
  case 3:
    await Summary.validateStepThree();
    break;
  case 4:
    await Summary.validateStepFour();
    break;
  case 5:
    await Summary.validateStepFive();
    break;
  case 6:
    await Summary.validateStepSix();
    break;
  case 7:
    await Summary.validateStepSeven();
    break;
  default:
    break;
  }
}

export const getSelectedClassLevelsAsDescription = 
  async(selectedClassLevels?: string[]): Promise<string> =>{
    const classReqs = ClassificationRequirements.selectedClassificationLevels;
    const selectClassLevelsSysIds = selectedClassLevels || 
        classReqs.map(cr => cr.classification_level);
    const classLevelDisplayNames = ClassificationRequirements.classificationLevels.filter(
      cl => selectClassLevelsSysIds.includes(cl.sys_id as string)
    ).map(cl => cl.display?.replaceAll(" - ", "/")).sort();
    return convertStringArrayToCommaList(classLevelDisplayNames as string[], "and")
  }

/**
 * 
 * @param stepNumber 
 * @returns summaryItems for requested step and sosrted by substep
 */
export const getSummaryItemsforStep = async(stepNumber: number): Promise<SummaryItem[]> =>{
  return Summary.summaryItems.filter(
    si => si.step === stepNumber
  ).sort((a,b) => (a.substep > b.substep) ? 1 : -1)
}


@Module({
  name: 'SummaryStore',
  namespaced: true,
  dynamic: true,
  store: rootStore
})

export class SummaryStore extends VuexModule {
  summaryItem: SummaryItem ={
    title: "",
    description: "",
    isComplete: false,
    isTouched: false,
    routeName: "",
    step: 0,
    substep: 0
  }

  public summaryItems: SummaryItem[] = [];
  public hasCurrentStepBeenVisited = false;

  @Action({rawError:true})
  public setHasCurrentStepBeenVisited(isVisited: boolean):void{
    this.doSetHasCurrentStepBeenVisited(isVisited);
  }

  @Mutation
  public doSetHasCurrentStepBeenVisited(isVisited: boolean):void{
    this.hasCurrentStepBeenVisited = isVisited;
  }

  @Action({rawError:true})
  public async toggleButtonColor(stepNumber: number):Promise<void>{
    const color = stepNumber > 0
      ? isStepComplete(stepNumber) ? "primary" : "secondary"
      : ""
    await AcquisitionPackage.setContinueButtonColor(color);
  }

  //#region STEP 2
  /*
   * assess all 2 substeps in Step 3 to determine 
   * if substep is touched and/or completed
   * 
   * The function creates 3 summary step objects for each
   * substep in step 2 
   */
  @Action({rawError: true})
  public async validateStepTwo(): Promise<void> {
    const fairOppObjectKeys = [
      "barriers_",
      "cause_",
      "exception_",
      "justification",
      "market_research_",
      "min_govt_",
      "other_facts_",
      "procurement_discussion_",
      "proposed_csp",
      "requirement_",
      "research_",
      "sys_",
      "technical_",
      "why_csp"
    ];
    const evalPlanObjectKeys = [
      "custom_",
      "method",
      "source_",
      "standard_",
      "sys_"
    ];
    await this.assessFairOpportunity(fairOppObjectKeys);
    await this.assessEvalPlan(evalPlanObjectKeys);
  }

  @Action({rawError: true})
  public async assessFairOpportunity(objectKeys: string[]): Promise<void>{
    const fairOppStore = AcquisitionPackage.fairOpportunity as FairOpportunityDTO;
    const keysToIgnore = objectKeys.filter(
      x => x !== "sys_"
    );
    const monitor = {object: fairOppStore, keysToIgnore};
    const isTouched = await this.isTouched(monitor)
    const FairOpportunityItem: SummaryItem = {
      title: "Exception to Fair Opportunity",
      description: "",
      isComplete: false,
      isTouched,
      routeName: "Exceptions", 
      step:2,
      substep: 1
    }
    await this.doSetSummaryItem(FairOpportunityItem)
  }

  @Action({rawError: true})
  public async assessEvalPlan(objectKeys: string[]): Promise<void>{
    const evalPlanStore = EvaluationPlan.evaluationPlan as EvaluationPlanDTO;
    const keysToIgnore = objectKeys.filter(
      x => ["custom_","method", "source_", "standard_"].indexOf(x) === -1
    );
    const monitor = {object: evalPlanStore, keysToIgnore};
    const isTouched = await this.isTouched(monitor)
    const evalPlan: SummaryItem = {
      title: "Evaluation Plan",
      description: "",
      isComplete: false,
      isTouched,
      routeName: "CreateEvalPlan", 
      step:2,
      substep: 2
    }
    await this.doSetSummaryItem(evalPlan)
  }


  //#endregion




  //#region STEP 3
  /*
   * assess all 3 substeps in Step 3 to determine 
   * if substep is touched and/or completed
   * 
   * The function creates 3 summary step objects for each
   * substep in step 3 
   */

  @Action({rawError: true})
  public async validateStepThree(): Promise<void> {
    await this.assessPeriodOfPerformance();
    await this.assessContractType();
    await this.assessClassificationRequirements();
  }

  
  @Action({rawError: true})
  public async assessPeriodOfPerformance(): Promise<void>{
    const PoP = Periods.periodOfPerformance;
    const description = await Periods.formatPeriodOfPerformance();
    const selectedPeriods = Periods.periods;
    const isTouched = selectedPeriods.length>0
      || PoP?.pop_start_request !== ""
      || PoP?.recurring_requirement !== ""
    const isComplete = await this.isPOPComplete(selectedPeriods);
    const POPSummaryItem: SummaryItem = {
      title: "Period of Performance (PoP)",
      description,
      isComplete,
      isTouched,
      routeName: "PeriodOfPerformance",
      step:3,
      substep: 1
    }
    await this.doSetSummaryItem(POPSummaryItem)
  }

  @Action({rawError: true})
  public async isPOPComplete(
    selectedPeriods: PeriodDTO[]
  ): Promise<boolean>{
    const PoP = Periods.periodOfPerformance as PeriodOfPerformanceDTO;
    const isRequestedStartDateValid = 
      (PoP?.pop_start_request === "YES" && PoP?.requested_pop_start_date !== "")
      || PoP?.pop_start_request === "NO"
    const isRecurringRequirementValid = 
      (isMRRToBeGenerated() 
        && PoP?.recurring_requirement === "YES"
        && PoP?.is_requirement_follow_on_procurement_sole_sourced !== "")
      || ( !isMRRToBeGenerated() 
        && PoP?.recurring_requirement === "YES")
      || PoP?.recurring_requirement === "NO";
    return isRequestedStartDateValid && isRecurringRequirementValid;
  }

  @Action({rawError: true})
  public async assessContractType(): Promise<void>{
    const title = "Contract Type";
    const contractType = AcquisitionPackage.contractType as ContractTypeDTO;

    const isFfp = contractType.firm_fixed_price.toLowerCase() === "true";
    const isTm = contractType.time_and_materials.toLowerCase() === "true";
    const hasJustification = contractType?.contract_type_justification.trim() !== "";

    const description = await this.setContractTypeDescription({isFfp, isTm});

    const isTouched = isFfp || isTm;
  
    const isComplete = await this.setContractTypeIsComplete({
      isFfp, isTm, hasJustification
    });
    const POPSummaryItem: SummaryItem = {
      title,
      description,
      isComplete,
      isTouched,
      routeName: "ContractType",
      step:3,
      substep: 2
    }
    await this.doSetSummaryItem(POPSummaryItem)
  }

  @Action({rawError: true})
  public async setContractTypeIsComplete(
    contractType:{
        isFfp:boolean, 
        isTm:boolean,
        hasJustification: boolean
    }): Promise<boolean>{
    if (contractType.isFfp && contractType.isTm && contractType.hasJustification){
      return true;
    }
    else if (contractType.isTm && contractType.hasJustification){
      return true;
    }
    else if (contractType.isFfp && !contractType.isTm){
      return true;
    }
    return false;
  }

  @Action({rawError: true})
  public async setContractTypeDescription(
    contractType:{
        isFfp:boolean, 
        isTm:boolean
    }): Promise<string>{
    if (contractType.isFfp && contractType.isTm){
      return "Firm-fixed-price (FFP) and Time-and-materials (T&M)"
    }
    else if (contractType.isFfp){
      return "Firm-fixed-price (FFP)"
    }
    else if (contractType.isTm){
      return "Time-and-materials (T&M)"
    }
    return "";
  }
  
  @Action({rawError: true})
  public async assessClassificationRequirements(): Promise<void>{
    const title = "Classification Requirements";
    const classReqs  = ClassificationRequirements.selectedClassificationLevels;
    const hasSecretOrTS = classReqs.some(cr => cr.classification !== "U");
    const description = await this.setClassificationRequirementsDesc(
      hasSecretOrTS);
    const isTouched = await this.isClassificationRequirementTouchedOrComplete(classReqs)
      || await this.isSecurityRequirementsTouched(hasSecretOrTS)
      || await this.isCDSTouched(hasSecretOrTS)
    const isComplete = await this.isClassificationRequirementsComplete(
      {hasSecretOrTS, classReqs}
    )
    const POPSummaryItem: SummaryItem = {
      title,
      description,
      isComplete,
      isTouched,
      routeName: "ClassificationRequirements",
      step:3,
      substep: 3
    }
    await this.doSetSummaryItem(POPSummaryItem)
  }

  @Action({rawError: true})
  public async isClassificationRequirementsComplete( 
    config:{
      hasSecretOrTS: boolean
      classReqs:SelectedClassificationLevelDTO[]
  }): Promise<boolean>{
    const hasSelectedClassLevels = config.classReqs.length>0;
    if (!config.hasSecretOrTS){
      return hasSelectedClassLevels;
    }

    return await hasSelectedClassLevels
      && await this.isSecurityRequirementsComplete(config.hasSecretOrTS)
      && await this.isCDSComplete(config.hasSecretOrTS);
  }

  @Action({rawError: true})
  public async setClassificationRequirementsDesc(
    hasSecretOrTS: boolean
  ): Promise<string>{
    const cds = ClassificationRequirements.cdsSolution;
   
    const missingCDSVerbiage = !(await this.isCDSComplete(hasSecretOrTS))
      ? "<br />(Cross Domain Solution Required)" : ""

    return ClassificationRequirements.selectedClassificationLevels.length > 0
      ? await getSelectedClassLevelsAsDescription() + missingCDSVerbiage
      : "";
  }

  @Action({rawError: true})
  public async isClassificationRequirementTouchedOrComplete(
    classReqs: SelectedClassificationLevelDTO[]): Promise<boolean>{
    return classReqs.length > 0;
  }

  @Action({rawError: true})
  public async isSecurityRequirementsTouched(
    hasSecretOrTS: boolean): Promise<boolean>{
    return hasSecretOrTS 
      ? ClassificationRequirements.securityRequirements?.length>0
      : false
  }

  @Action({rawError: true})
  public async isSecurityRequirementsComplete(
    hasSecretOrTS: boolean): Promise<boolean>{
    return hasSecretOrTS 
      ? ClassificationRequirements.securityRequirements?.every(
        sr => sr.classification_information_type.length > 0
      )
      : false
  }

  @Action({rawError: true})
  public async isCDSTouched(
    hasSecretOrTS: boolean
  ): Promise<boolean>{
    const keysToIgnore = [
      "sys_",
      "acquisition_package"
    ]
    return hasSecretOrTS 
      ? await this.isTouched({
        object: ClassificationRequirements.cdsSolution as CrossDomainSolutionDTO,
        keysToIgnore, 
      }) 
      : false;
  }

  @Action({rawError: true})
  public async isCDSComplete(
    hasSecretOrTS: boolean
  ): Promise<boolean>{
    // validate CDS
    let isCDSComplete = false;
    const oneClassification =
        onlyOneClassification(ClassificationRequirements.selectedClassificationLevels)

    let isCDSDurationValid = false;
    const cds = ClassificationRequirements.cdsSolution as CrossDomainSolutionDTO;
    if(oneClassification || (cds && cds.cross_domain_solution_required === "NO")){
      return true
    }
    const keysToIgnore = [
      "sys_",
      "duration",
      "selected_periods"
    ]

    if (cds){
      isCDSComplete = cds && cds.cross_domain_solution_required !== "NO"
        ? await this.isComplete({
          object: cds,
          keysToIgnore, 
        })
        : true

      // validate duration
      isCDSDurationValid = await this.isDurationValid({
        isNeeded: cds.need_for_entire_task_order_duration,
        selectedPeriods: cds.selected_periods
      })
    }

    return hasSecretOrTS 
      ? isCDSComplete && isCDSDurationValid
      : true;
  }
  //#endregion

  //#region step 4
  /**
   *  assess all substeps in Step 4 to determine
   *  if substep is touched and/or completed
   *
   *  The function creates 4 summary step objects for each
   *  substep in step 4
   *
   */
  @Action({rawError: true})
  public async validateStepFour(): Promise<void> {
    await this.assessProcurementHistory();
    await this.assessCurrentEnvironment();
  }

  @Action({rawError: true})
  public async assessProcurementHistory(): Promise<void> {
    const hasCurrentOrPreviousContract = AcquisitionPackage.hasCurrentOrPreviousContracts;
    const isExceptionToFairOpp =
      AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity;
    const currentContracts = AcquisitionPackage.currentContracts;
    let currentContractDetailsIsComplete = !!currentContracts
      && currentContracts.length !== 0;

    if (currentContracts) {
      if (isExceptionToFairOpp !== "NO_NONE") {
        currentContracts?.forEach((contract) => {
          if (contract.contract_number === "" ||
            contract.competitive_status === "" ||
            contract.contract_order_expiration_date === "" ||
            contract.contract_order_start_date === "" ||
            contract.incumbent_contractor_name === "" ||
            contract.business_size === "") currentContractDetailsIsComplete = false;
        });
      } else {
        currentContracts?.forEach((contract) => {
          if (contract.contract_number === "" ||
            contract.contract_order_expiration_date === "" ||
            contract.incumbent_contractor_name === "") currentContractDetailsIsComplete = false;
        });
      }
    }

    const isTouched = hasCurrentOrPreviousContract !== ""
      || (!!AcquisitionPackage.currentContracts && AcquisitionPackage.currentContracts.length > 0);
    const isComplete =  currentContractDetailsIsComplete
      || hasCurrentOrPreviousContract === "NO";

    const taskOrderNumbers = currentContracts?.map(
      (contract) => contract.task_delivery_order_number).join(", ");
    const prevContracts = currentContracts?.length === 1
      ? `${currentContracts?.length} previous contract:\n${taskOrderNumbers}`
      : `${currentContracts?.length} previous contracts:\n${taskOrderNumbers}`

    const description = isTouched ?
      hasCurrentOrPreviousContract === "YES"
        ? prevContracts
        : "No previous contracts"
      : "";

    const procurementHistorySummaryItem: SummaryItem = {
      title: "Procurement History",
      description,
      isComplete,
      isTouched,
      routeName: "CurrentContract",
      step: 4,
      substep: 1
    }

    await this.doSetSummaryItem(procurementHistorySummaryItem)
  }
  @Action({rawError: true})
  public async assessCurrentEnvironment(): Promise<void> {
    const currentEnvironmentKeys = [

    ]
    const currentEnvironment = await CurrentEnvironment.getCurrentEnvironment()
    const currentEnvironmentInstances = await  CurrentEnvironment.getCurrentEnvironmentInstances()
    const hasSystemDocs = currentEnvironment?.has_system_documentation === "YES"
    const systemDocsLength = currentEnvironment?.system_documentation
      ? currentEnvironment?.system_documentation.length : 0
    const hasMigrationDocs = currentEnvironment?.has_migration_documentation === "YES"
    const migrationDocsLength = currentEnvironment?.migration_documentation
      ? currentEnvironment?.migration_documentation.length : 0;
    const envLocation = currentEnvironment?.env_location
    const envOnPremClass = currentEnvironment?.env_classifications_onprem
    const envCloudClass = currentEnvironment?.env_classifications_cloud
    let locationHasClassification = false
    const systemDocsComplete = !hasSystemDocs || (hasSystemDocs && systemDocsLength > 0)
    const migrationDocsComplete = !hasMigrationDocs || (hasMigrationDocs && migrationDocsLength > 0)
    if(envLocation === "HYBRID" && envOnPremClass && envCloudClass){
      locationHasClassification = (envOnPremClass?.length > 0 && envCloudClass?.length > 0)
    }
    else if(envLocation === "ON_PREM" && envOnPremClass){
      locationHasClassification = envOnPremClass?.length > 0
    }else if(envLocation === "CLOUD" && envCloudClass){
      locationHasClassification = envCloudClass?.length > 0
    }
    const isTouched = currentEnvironment?.current_environment_exists !== "";
    const isComplete =  currentEnvironment?.current_environment_exists === "NO"
    // eslint-disable-next-line max-len
    || systemDocsComplete && migrationDocsComplete && locationHasClassification && currentEnvironmentInstances.length > 0;
    const description = ""
    const currentEnvironmentSummaryItem: SummaryItem = {
      title: "Current Environment",
      description,
      isComplete,
      isTouched,
      routeName: "CurrentEnvironment",
      step: 4,
      substep: 2
    }

    await this.doSetSummaryItem(currentEnvironmentSummaryItem)
  }


  //#region Step 5

  /** assesses all selected service offerings and 
   * Anticipated Users and Data object
  */

  /**
   * 
   * @param dowObjects DOWServiceOfferingGroup[]
   * @returns string[]
   */
  @Action({rawError: true})
  public async validateStepFive(): Promise<void> {
    //eslint-disable-next-line prefer-const
    // validates dowObjects.otherOfferingData
    await this.validateAnticipatedUsersAndData();
    const dowObjects = await DescriptionOfWork.getDOWObject();
    await dowObjects.forEach(async (dow)=> 
    {
      const id = dow.serviceOfferingGroupId;
      const hasServiceOfferings = dow.serviceOfferings?.length > 0;
      const hasOtherOfferings = 
        (dow.otherOfferingData as OtherServiceOfferingData[])?.length >0
      if (hasServiceOfferings){
        dow.serviceOfferings?.forEach(async (so)=>{
          return await this.isServiceOfferingDataObjComplete(so);
        }) 
        dow.isComplete = dow.serviceOfferings.every(
          vso => vso.isComplete 
        )
      } else if (hasOtherOfferings){
        dow.otherOfferingData?.forEach(async (ood)=>{
          return await this.isOtherOfferingDataObjComplete(
            {
              otherOfferingData: ood,
              id: id,
              assessSecurityRequirements:true
            })
        })
        dow.isComplete = dow.otherOfferingData?.every(
          vso => vso.isComplete 
        ) || false
      } else {
        dow.isComplete = false;
      }
          
      await this.doSetSummaryItem(
        await this.createServiceOfferingSummaryItem(dow)
      );
    })
  };


  /**
   *
   * validates Anticipated Users and Data data in 
   * ClassificationRequirements.selectedClassificationLevels 
   * store object & creates an Anticipated Users and Data summary item
   * in the Summary store
   */
  @Action({rawError: true})
  public async validateAnticipatedUsersAndData(): Promise<void>{
    const classLevels = 
      await ClassificationRequirements.getSelectedClassificationLevels();
    classLevels.forEach((level)=>{
      const data: Record<string, any> = _.clone(level);
      let additionalFields = [""]
      let requiredFields = [
        "data_egress_monthly_amount",
        "data_egress_monthly_unit",
        "users_per_region",
        "increase_in_users",
        "data_increase"
      ] 

      if(data["increase_in_users"]==="YES"){
        additionalFields = [
          "user_growth_estimate_type",
          "user_growth_estimate_percentage",
        ]
      }
      if(data["data_increase"]==="YES"){
        additionalFields = [
          "data_growth_estimate_type",
          "data_growth_estimate_percentage",
        ]
      }

      requiredFields = requiredFields.concat(additionalFields);
      level.isAnticipatedUsersAndDataIsComplete = requiredFields.every(f => {
        if (f === "increase_in_users" && data.increase_in_users === "YES"){
          return data.user_growth_estimate_percentage.length > 0 &&
            data.user_growth_estimate_percentage[0] !== ""
        }
        if (f === "data_increase" && data.data_increase === "YES"){
          return data.data_growth_estimate_percentage.length > 0 &&
            data.data_growth_estimate_percentage[0] !== ""
        }
        return data[f] !== ""
      })
    });
    await this.doSetSummaryItem(
      await this.createAnticipatedUsersAndDataSummaryItem(classLevels)
    );
  }

  /**
   * 
   * @param classLevels SelectedClassificationLevelDTO[]
   * @returns  Anticipated Users and Data summaryItem 
   * 
   * creates a summary item for Anticipated Users and Data
   */
  @Action({rawError: true})
  public async createAnticipatedUsersAndDataSummaryItem(
    classLevels: SelectedClassificationLevelDTO[]
  ): 
  Promise<SummaryItem>
  {
    const isComplete = classLevels.every(
      cl => cl.isAnticipatedUsersAndDataIsComplete
    )

    return  {
      title: "Anticipated users and data",
      description:"",
      isComplete,
      isTouched: false,
      routeName: "",
      step: 5,
      substep: 0
    } as SummaryItem
  }

  /**
   * 
   * @param dow DOWServiceOfferingGroup
   * @returns Summary Item for the service offering
   */
  @Action({rawError: true})
  public async createServiceOfferingSummaryItem(dow: DOWServiceOfferingGroup): 
  Promise<SummaryItem>
  {
    const verbiageInfo =  await DescriptionOfWork.getServiceGroupVerbiageInfoWithGroupId(
      dow.serviceOfferingGroupId
    );
    const title = verbiageInfo 
      ? verbiageInfo.offeringName
      : toTitleCase(dow.serviceOfferingGroupId)

    return  {
      title,
      description: await this.getDOWSummaryDescription(dow),
      isComplete: dow.isComplete as boolean,
      isTouched: false,
      routeName: dow.serviceOfferingGroupId,
      step: 5,
      substep: await this.getServiceOfferingSubstep(dow.serviceOfferingGroupId)
    } as SummaryItem
  }


  /**
   * created description text for the summary item
   * 
   * @param serviceOfferingGroupId 
   * @returns 
   */  
  @Action({rawError: true})
  public async getDOWSummaryDescription(dow: DOWServiceOfferingGroup): Promise<string> {
    const selectedClassLevelsForPP = dow.otherOfferingData?.map(
      ood => ood.classificationLevel
    )

    return dow.serviceOfferingGroupId === "PORTABILITY_PLAN"
      ? await getSelectedClassLevelsAsDescription(selectedClassLevelsForPP as string[])
      : ""
  }

  /**
     * 
     * @param title 
     * @returns (index of title + 1) 
     */
  @Action({rawError: true})
  public async getServiceOfferingSubstep(
    title: string)
  : Promise<number> {
    return [
      'STORAGE',
      'DATABASE',
      'GENERAL_XAAS',
      'IOT',
      'EDGE_COMPUTING',
      'SECURITY',
      'NETWORKING',
      'MACHINE_LEARNING',
      'APPLICATIONS',
      'DEVELOPER_TOOLS',
      'COMPUTE',
      'PORTABILITY_PLAN',
      'ADVISORY_ASSISTANCE',
      'HELP_DESK_SERVICES',
      'TRAINING',
      'DOCUMENTATION_SUPPORT',
      'GENERAL_CLOUD_SUPPORT',
    ].findIndex(serviceOfferingTitle => serviceOfferingTitle === title) + 1
  }
  /**
   * validates the serviceOffering.classificationInstances 
   * 
   * @param serviceOffering 
   * @returns DOWServiceOffering 
   */
  @Action({rawError: true})
  public async isServiceOfferingDataObjComplete(serviceOffering: DOWServiceOffering)
  : Promise<DOWServiceOffering> {
    serviceOffering.classificationInstances?.forEach(
      (instance) => {
        const data: Record<string, any> = _.clone(instance);
        const requiredFields = [
          "anticipatedNeedUsage",
          "entireDuration",
          "selectedPeriods",
          "classificationLevelSysId"
        ] 
        instance.isComplete = requiredFields.every(f => {
          if (f === "selectedPeriods"){
            return data.entireDuration === "NO"
              ? data.selectedPeriods.length > 0
              : true
          }
          return data[f] !== ""
        })
      });
    serviceOffering.isComplete = 
      serviceOffering.classificationInstances?.every(
        (ci => ci.isComplete)
      ) && serviceOffering.classificationInstances.length>0
    return serviceOffering;
  }

  /**
   * validates the otherServiceOfferingData 
   * 
   * @param attribs.otherOfferingData: OtherServiceOfferingData
   * @param attribs.id: string
   * @param attribs.assessSecurityRequirements: boolean
   * @returns 
   */
  @Action({rawError: true})
  public async isOtherOfferingDataObjComplete(
    attribs: {
      otherOfferingData: OtherServiceOfferingData
      id: string,
      assessSecurityRequirements: boolean
    })
    : Promise<OtherServiceOfferingData> {
    //eslint-disable-next-line prefer-const
    let incompleteOfferings = [""];
    let requiredFields = [""];
    const isCompute = attribs.id === "COMPUTE";
    const isDatabase = attribs.id === "DATABASE";
    const isStorage = attribs.id === "STORAGE";
    const isPortabilityPlan = attribs.id === "PORTABILITY_PLAN";
    const isTraining = attribs.id === "TRAINING";
    const isGeneralXaas = attribs.id === "GENERAL_XAAS"; 
    const isAdvisoryAssistance = attribs.id === "ADVISORY_ASSISTANCE";
    const isHelpDesk = attribs.id === "HELP_DESK_SERVICES";
    const isDocumentation = attribs.id === "DOCUMENTATION_SUPPORT";
    const isGeneralCloudSupport = attribs.id === "GENERAL_CLOUD_SUPPORT";
    
    const data: Record<string, any> = _.clone(attribs.otherOfferingData);
    let additionalFields:string[] = [];
    if(isCompute){
      requiredFields = [
        "environmentType",
        "entireDuration",
        "memoryAmount",
        "descriptionOfNeed",
        "numberOfInstances",
        "numberOfVCPUs",
        "operatingSystem",
        "operatingSystemAndLicensing",
        "performanceTier",
        "storageAmount",
        "storageType",
        "entireDuration",
        "periodsNeeded",
        "classificationLevel"
      ];
    } else if (isDatabase) {
      requiredFields = [
        "databaseType",
        "databaseLicensing",
        "licensing",
        "memoryAmount",
        "memoryUnit",
        "networkPerformance",
        "numberOfVCPUs",
        "numberOfInstances",
        "operatingSystem",
        "databaseLicensing",
        "operatingSystemLicense",
        "storageType",
        "storageAmount",
        "storageUnit",
        "descriptionOfNeed",
        "entireDuration",
        "periodsNeeded",
        "classificationLevel"
      ]
    } else if(isStorage){
      requiredFields = [
        "numberOfInstances",
        "storageAmount",
        "storageType",
        "storageUnit",
        "entireDuration",
        "descriptionOfNeed",
        "periodsNeeded",
        "classificationLevel"
      ]
    } else if (isGeneralXaas) {
      requiredFields = [
        "descriptionOfNeed",
        "entireDuration",
        "periodsNeeded",
        "classificationLevel"
      ];
    } else if (isTraining){
      requiredFields= [
        "trainingRequirementTitle",
        "trainingType",
        "trainingPersonnel",
        "entireDuration",
        "descriptionOfNeed",
        "periodsNeeded",
        "classificationLevel"
      ]

      switch(data.trainingType?.toUpperCase()){
      case "ONSITE_INSTRUCTOR_CONUS":
        additionalFields = ["trainingFacilityType","trainingLocation"];
        break;
      case "ONSITE_INSTRUCTOR_OCONUS":
        additionalFields = ["trainingLocation"];
        break;
      case "VIRTUAL_INSTRUCTOR":
        additionalFields = ["trainingTimeZone"];
        break;
      default:
        break;
      }
    } else if (isPortabilityPlan) {
      requiredFields = ["classificationLevel"]
    } else if(
      isAdvisoryAssistance 
        || isDocumentation 
        || isHelpDesk 
        || isGeneralCloudSupport){
      requiredFields = [
        "descriptionOfNeed",
        "personnelOnsiteAccess",
        "entireDuration",
        "periodsNeeded",
        "classificationLevel"
      ] 
      // validate classifiedInformationTypes if classlevel is TS/S
      if (attribs.assessSecurityRequirements
        && !isClassLevelUnclass(data["classificationLevel"])){
        additionalFields = ["classifiedInformationTypes"];
      }
    }
    requiredFields = requiredFields.concat(additionalFields);
    attribs.otherOfferingData.isComplete = requiredFields.every(f => {
      if (f === "periodsNeeded"){
        return data.entireDuration === "NO"
          ? data.periodsNeeded.length > 0
          : true
      }
      return data[f] !== ""
    })
    return attribs.otherOfferingData;
  };
  //#endregion

  //#region STEP 6
  @Action({rawError: true})
  public async validateStepSix(): Promise<void> {
    await this.assessCOI();
    await this.assessPackagingPackingShipping();
    await this.assessTravel();
  }

  @Action({rawError: true})
  public async assessCOI(): Promise<void> {
    const contractConsiderations =
      AcquisitionPackage.contractConsiderations as ContractConsiderationsDTO;

    const coi = contractConsiderations.potential_conflict_of_interest;
    const coiInfo = contractConsiderations.conflict_of_interest_explanation;
    const isTouched = coi === "YES" ? true : coi === "NO";
    const isComplete =  coi === "NO" || (coiInfo !== undefined && coiInfo.length > 0);
    let description = ""
    if(isTouched && isComplete){
      description = isComplete && coi !=="NO"? "Potential organizational COI exists."
        :"No organizational COI"
    }
    const conflictOfInterestSummaryItem: SummaryItem = {
      title: "Conflict of Interest (COI)",
      description,
      isComplete,
      isTouched,
      routeName: "ConflictOfInterest",
      step: 6,
      substep: 1
    }

    await this.doSetSummaryItem(conflictOfInterestSummaryItem)
  }

  @Action({rawError: true})
  public async assessPackagingPackingShipping(): Promise<void> {
    const contractConsiderations =
      AcquisitionPackage.contractConsiderations as ContractConsiderationsDTO;

    const selections = [
      contractConsiderations.contractor_provided_transfer,
      contractConsiderations.packaging_shipping_other,
      contractConsiderations.packaging_shipping_none_apply
    ]
    const isTouched = selections.includes('true');
    const explanation = contractConsiderations.packaging_shipping_other_explanation;
    const needsExplanation = selections[1] === 'true';
    const description = isTouched 
      ? await this.getPackagingPackingShippingTitle(selections[2] === 'true') 
      : "";
    const isComplete = needsExplanation ?
      (isTouched && explanation !== undefined && explanation.length > 0) : isTouched;

    const packagingPackingShippingSummaryItem: SummaryItem = {
      title: "Packaging, Packing, and Shipping",
      description,
      isComplete,
      isTouched,
      routeName: "PackagingPackingAndShipping",
      step: 6,
      substep: 2
    }

    await this.doSetSummaryItem(packagingPackingShippingSummaryItem)
  }

  @Action({rawError: true})
  public async getPackagingPackingShippingTitle(isNone: boolean): Promise<string> {
    return isNone 
      ? 'No requirement for packaging, packing, and shipping.'
      : 'Effort requires CSP to comply with packaging, packing, and shipping instructions.'
  }


  @Action({rawError: true})
  public async assessTravel(): Promise<void> {
    await DescriptionOfWork.loadTravel()
    const isTravelSkipped = AcquisitionPackage.isTravelNeeded === "NO"
    const isTravelTouched = AcquisitionPackage.isTravelTouched
    const travelInfo = await DescriptionOfWork.getTravel()
    let description = ""
    if(travelInfo.length > 0) {
      let numberOfTrips = 0;
      const tripInformation: string[] = []
      travelInfo.forEach(instance =>{
        tripInformation.push(`${instance.trip_location} (${instance.number_of_trips})`);
        numberOfTrips += Number(instance.number_of_trips)
      })
      description = `${numberOfTrips} trips required within this task order:
       \n
      ${convertStringArrayToCommaList(tripInformation,"and")}`
    }
    if(isTravelSkipped){
      description = "No travel requirements for contractor employees"
    }
    const isTouched = isTravelTouched||travelInfo.length > 0
    const isComplete =  isTravelSkipped
      || travelInfo.length > 0;
    const travelSummaryItem: SummaryItem = {
      title: "Travel",
      description,
      isComplete,
      isTouched,
      routeName: "Travel",
      step: 6,
      substep: 3
    }
    await this.doSetSummaryItem(travelSummaryItem)
  }


  //#endregion

  //#region STEP 7
  @Action({rawError: true})
  public async validateStepSeven(): Promise<void> {
    const objectKeys = [
      "baa_",
      "sys_",
      "pii_",
      "foia_",
      "potential_",
      "508",
      "acquisition",
      "record_name", 
      "work_"
    ];
    await this.assessPII(objectKeys);
    await this.assessBAA(objectKeys);
    await this.assessFOIA(objectKeys);
    await this.assess508Standards(objectKeys);
   
  }

  
  @Action({rawError: true})
  public async assessPII(objectKeys: string[]): Promise<void>{
    const sensitiveInfo = AcquisitionPackage.sensitiveInformation as SensitiveInformationDTO;
    const description = await this.getPIIDescription(sensitiveInfo);
    const keysToIgnore = objectKeys.filter(
      x => ["pii_","record_name", "work_"].indexOf(x) === -1
    );
    const monitor = {object: sensitiveInfo, keysToIgnore};
    const isTouched = await this.isTouched(monitor)
    const isComplete =  monitor.object.pii_present === "NO" 
      || await this.isComplete(monitor);
    const standardsAndComplianceSummaryItem: SummaryItem = {
      title: "Personally Identifiable Information (PII)",
      description,
      isComplete,
      isTouched, 
      routeName: "PII",
      step:7,
      substep: 1
    }
    await this.doSetSummaryItem(standardsAndComplianceSummaryItem)
  }

  @Action({rawError: true})
  public async getPIIDescription(sensitiveInfo: SensitiveInformationDTO): Promise<string>{
    let desc = "";
    if (sensitiveInfo.pii_present === "YES"
      && sensitiveInfo.system_of_record_name !== "" ){
      desc = "System of records: " + sensitiveInfo.system_of_record_name
    } else if (sensitiveInfo.pii_present === "NO"){
      desc = "Effort does not include a system of records on individuals."
    }
    return desc;
  }

  @Action({rawError: true})
  public async assessBAA(objectKeys: string[]): Promise<void>{
    const sensitiveInfo = AcquisitionPackage.sensitiveInformation as SensitiveInformationDTO;
    const description = await this.getBAADescription(sensitiveInfo);
    const keysToIgnore = objectKeys.filter(
      x => ["baa_"].indexOf(x) === -1
    );
    const bAAMonitor = {object: sensitiveInfo, keysToIgnore};
    const isTouched = await this.isTouched(bAAMonitor)
    const isComplete = await this.isComplete(bAAMonitor)
    const standardsAndComplianceSummaryItem: SummaryItem = {
      title: "Business Associate Agreement (BAA)",
      description,
      isComplete,
      isTouched, 
      routeName: "BAA",
      step:7,
      substep: 2
    }
    await this.doSetSummaryItem(standardsAndComplianceSummaryItem)
  }

  @Action({rawError: true})
  public async getBAADescription(sensitiveInfo: SensitiveInformationDTO): Promise<string>{
    let desc = "";
    if (sensitiveInfo.baa_required === "YES" ){
      desc = "Effort requires a BAA to safeguard e-PHI."
    } else if (sensitiveInfo.baa_required === "NO"){
      desc = "Effort does not require a BAA to safeguard e-PHI."
    }
    return desc;
  }

  @Action({rawError: true})
  public async assessFOIA(objectKeys: string[]): Promise<void>{
    const sensitiveInfo = AcquisitionPackage.sensitiveInformation as SensitiveInformationDTO;
    const description = await this.getFOIADescription(sensitiveInfo);
    const keysToIgnore = objectKeys.filter(
      x => ["foia_"].indexOf(x) === -1
    );
    keysToIgnore.push("foia_street_address_2");
    const fOIAMonitor = {object: sensitiveInfo, keysToIgnore};
    const isTouched = await this.isTouched(fOIAMonitor)
    const isComplete = sensitiveInfo.potential_to_be_harmful === "NO"
      || await this.isComplete(fOIAMonitor);
    const standardsAndComplianceSummaryItem: SummaryItem = {
      title: "Public Disclosure of Information",
      description,
      isComplete,
      isTouched, 
      routeName: "FOIA",
      step:7,
      substep: 3
    }
    await this.doSetSummaryItem(standardsAndComplianceSummaryItem)
  }

  @Action({rawError: true})
  public async getFOIADescription(sensitiveInfo: SensitiveInformationDTO): Promise<string>{
    let desc = "";
    if (sensitiveInfo.potential_to_be_harmful === "YES"
      && sensitiveInfo.foia_full_name !== "" 
      && sensitiveInfo.foia_email !== "" ){
      desc = "FOIA Coordinator: " + sensitiveInfo.foia_full_name + "<br />"  
        + sensitiveInfo.foia_email 
    } else if (sensitiveInfo.potential_to_be_harmful === "NO"){
      desc = "Disclosure is not harmful to the government."
    }
    return desc;
  }


  @Action({rawError: true})
  public async assess508Standards(objectKeys: string[]): Promise<void>{
    const sensitiveInfo = AcquisitionPackage.sensitiveInformation as SensitiveInformationDTO;
    const description = await this.get508StandardsDescription(sensitiveInfo);
    const keysToIgnore = objectKeys.filter(
      x => ["508"].indexOf(x) === -1
    );
    const standardsMonitor = {object: sensitiveInfo, keysToIgnore};
    const isTouched = await this.isTouched(standardsMonitor)
    const isComplete = (sensitiveInfo.section_508_sufficient === "NO" 
      && sensitiveInfo.accessibility_reqs_508 !== "")
      || sensitiveInfo.section_508_sufficient === "YES"
    const standardsAndComplianceSummaryItem: SummaryItem = {
      title: "Section 508 Standards",
      description,
      isComplete,
      isTouched, 
      routeName: "Section508Standards",
      step:7,
      substep: 4
    }
    await this.doSetSummaryItem(standardsAndComplianceSummaryItem)
  }

  @Action({rawError: true})
  public async get508StandardsDescription(sensitiveInfo: SensitiveInformationDTO): Promise<string>{
    let desc = "";
    if (sensitiveInfo.section_508_sufficient === "YES"){
      desc = "Accessibility standards in the JWCC contract are sufficient."
    } else if (sensitiveInfo.section_508_sufficient === "NO"){
      desc = "Custom accessibility standards are required."
    }
    return desc;
  }

  //#endregion

  @Action({rawError: true})
  public async isDurationValid(
    duration: {
      isNeeded: string, 
      selectedPeriods: string | string[]
  }): Promise<boolean>{
    return duration.isNeeded.toUpperCase() === "NO"
      ? duration.selectedPeriods.length !== 0
      : true
  }

  @Action({rawError: true})
  public async isTouched(
    config:{
    object: object
    keysToIgnore: string[]
  }): Promise<boolean>{
    return  config.object && await Object.keys(config.object).filter((key: string) => {
      if (config.keysToIgnore.every(ignoredKey => key.indexOf(ignoredKey)===-1)){
        const dynamicKey = key as keyof unknown;
        const objAttrib = config.object[dynamicKey];
        return objAttrib !== "" && objAttrib !== "[]"
      }
    }).length > 0;
  }

  @Action({rawError: true})
  public async isComplete(
    config:{
      object: object
      keysToIgnore: string[],
    }): Promise<boolean>{
    return  config.object && Object.keys(config.object).filter((key: string) => {
      if (config.keysToIgnore.every(ignoredKey => key.indexOf(ignoredKey)===-1)){
        const dynamicKey = key as keyof unknown;
        const objAttrib = config.object[dynamicKey];
        return objAttrib === "" && objAttrib !== "[]"
      }
    }).length === 0;
  }
  
  @Mutation
  public async doSetSummaryItem(summaryItem:SummaryItem):Promise<void>{
    const existingIndex = this.summaryItems.findIndex(
      si=>(si.step === summaryItem.step) && (si.substep === summaryItem.substep));
    existingIndex > -1
      ? this.summaryItems.splice(existingIndex, 1, summaryItem)
      : this.summaryItems.push(summaryItem)
  }


}

const Summary = getModule(SummaryStore);
export default Summary;

