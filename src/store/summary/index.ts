import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import { SummaryItem } from "types/Global";
import Periods from "../periods";
import AcquisitionPackage from "../acquisitionPackage";
import { ContractTypeApi } from "@/api/contractDetails";
import { 
  ContractTypeDTO, 
  CrossDomainSolutionDTO,
  PeriodDTO,
  PeriodOfPerformanceDTO,
  SelectedClassificationLevelDTO } from "@/api/models";
import ClassificationRequirements from "../classificationRequirements";
import { convertStringArrayToCommaList } from "@/helpers";
import { onlyOneClassification } from "@/router/resolvers"

export const isStepTouched = (stepNumber: number): boolean =>{
  return (Summary.summaryItems.some(
    (si: SummaryItem) => si.step === stepNumber && si.isTouched 
  ))
} 

export const isStepComplete = (stepNumber: number): boolean =>{
  return (Summary.summaryItems.every(
    (si: SummaryItem) => si.step === stepNumber && si.isComplete 
  ))
}

export const validateStep = async(stepNumber: number): Promise<void> =>{
  switch(stepNumber){
  case 3:
    Summary.validateStepThree();
    break;
  default:
    break;
  }
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

  /**
   * assess all 3 substeps in Step 3 to determine 
   * if substep is touched and/or completed
   * 
   * The function creates 3 summary step objects for each
   * substep in step 3 
   */

  @Action({rawError: true})
  public async validateStepThree(): Promise<void> {
    await Summary.assessPeriodOfPerformance();
    await Summary.assessContractType();
    await Summary.assessClassificationRequirements();
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
    const hasRequestedStartDate = PoP?.pop_start_request;
    if (hasRequestedStartDate === "YES"){
      return selectedPeriods.length>0
        && PoP?.recurring_requirement !== ""
        && PoP?.requested_pop_start_date !== ""
    } else if (hasRequestedStartDate === "NO"){
      return selectedPeriods.length>0
        && PoP?.recurring_requirement !== ""
    }
    return false;
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
    const cds = ClassificationRequirements.cdsSolution as CrossDomainSolutionDTO;
    const oneClassification =
      onlyOneClassification(ClassificationRequirements.selectedClassificationLevels)

    let isCDSDurationValid = false;
    if(oneClassification || cds.cross_domain_solution_required === "NO"){
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

