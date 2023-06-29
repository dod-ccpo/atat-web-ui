import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import { SummaryItem } from "types/Global";
import Periods from "../periods";
import AcquisitionPackage, { isMRRToBeGenerated } from "../acquisitionPackage";
import { ContractTypeApi } from "@/api/contractDetails";
import { 
  ContractTypeDTO, 
  CrossDomainSolutionDTO,
  PeriodDTO,
  PeriodOfPerformanceDTO,
  SelectedClassificationLevelDTO, 
  SensitiveInformationDTO} from "@/api/models";
import ClassificationRequirements from "../classificationRequirements";
import { convertStringArrayToCommaList } from "@/helpers";


export const isStepTouched = (stepNumber: number): boolean =>{
  return (Summary.summaryItems.some(
    (si: SummaryItem) => si.step === stepNumber && si.isTouched 
  ))
} 

export const isStepComplete = (stepNumber: number): boolean =>{
  const isComplete =  Summary.summaryItems.filter(
    (si: SummaryItem) => si.step === stepNumber
  ).every((si: SummaryItem)=> si.isComplete)
  return isComplete;
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
  case 3:
    Summary.validateStepThree();
    break;
  case 7:
    await Summary.validateStepSeven();
    break;
  default:
    break;
  }
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

  public summaryItems: SummaryItem[] = []

  @Action({rawError:true})
  public async toggleButtonColor(stepNumber: number):Promise<void>{
    const color = stepNumber > 0
      ? isStepComplete(stepNumber) ? "primary" : "secondary"
      : ""
    await AcquisitionPackage.setContinueButtonColor(color);
  }

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
    const classReqs  = ClassificationRequirements.selectedClassificationLevels;
    const selectClassLevelsSysIds = classReqs.map(cr => cr.classification_level);
    const classLevelDisplayNames = ClassificationRequirements.classificationLevels.filter(
      cl => selectClassLevelsSysIds.includes(cl.sys_id as string)
    ).map(cl => cl.display?.replaceAll(" - ", "/")).sort();
    const missingCDSVerbiage = !(await this.isCDSComplete(hasSecretOrTS))
      ? "<br />(Cross Domain Solution Required)" : ""

    return classReqs.length > 0
      ? convertStringArrayToCommaList(classLevelDisplayNames as string[], "and") 
        + missingCDSVerbiage
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
    const pIIMonitor = {object: sensitiveInfo, keysToIgnore};
    const isTouched = await this.isTouched(pIIMonitor)
    const isComplete = await this.isComplete(pIIMonitor)
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
      desc = "System of records: [" + sensitiveInfo.system_of_record_name + "]"
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
    } else if (sensitiveInfo.pii_present === "NO"){
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
    const isComplete = await this.isComplete(fOIAMonitor)
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
    } else if (sensitiveInfo.pii_present === "NO"){
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
    const isComplete = await this.isComplete(standardsMonitor)
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

