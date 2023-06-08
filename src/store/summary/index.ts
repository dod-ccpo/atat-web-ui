import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import { SummaryItem } from "types/Global";
import Periods from "../periods";
import AcquisitionPackage from "../acquisitionPackage";
import { ContractTypeApi } from "@/api/contractDetails";
import { ClassificationLevelDTO, ContractTypeDTO, CrossDomainSolutionDTO } from "@/api/models";
import ClassificationRequirements from "../classificationRequirements";
import { convertStringArrayToCommaList } from "@/helpers";

export const isStepTouched = (stepNumber: number): boolean =>{
  return (Summary.summaryItems.some(
    si => si.step === stepNumber && si.isTouched 
  ))
} 

export const isStepComplete = (stepNumber: number): boolean =>{
  return (Summary.summaryItems.every(
    si => si.step === stepNumber && si.isComplete 
  ))
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


  @Action({rawError: true})
  public async validateStepThree(): Promise<void> {
    await Summary.assessPeriodOfPerformance();
    await Summary.assessContractType();
    await Summary.assessClassificationRequirements();
  }

  
  
  @Action({rawError: true})
  // step 4 periodOfPerformance
  public async assessPeriodOfPerformance(): Promise<void>{
    const selectedPeriods = Periods.periods;
    const isTouched = (selectedPeriods.length>0)
    const isComplete =  (!isTouched)
      || (selectedPeriods.length >0 && selectedPeriods.every(
        sp => sp.period_unit_count !== ""
      ));
    const POPSummaryItem: SummaryItem = {
      title: "Period of Performance (PoP)",
      description: " 1-year base period with two 1-year options",
      isComplete,
      isTouched,
      routeName: "PeriodOfPerformance",
      step:3,
      substep: 1
    }
    await this.doSetSummaryItem(POPSummaryItem)
  }

  @Action({rawError: true})
  public async assessContractType(): Promise<void>{
    const title = "Contract Type";
    const contractType = AcquisitionPackage.contractType as ContractTypeDTO;

    const ffp = contractType.firm_fixed_price.toLowerCase() === "true";
    const tm = contractType.time_and_materials.toLowerCase() === "true";
    const hasJustification = contractType?.contract_type_justification.trim() !== "";

    const description = await this.setContractTypeDescription({ffp, tm});

    const isTouched = ffp || tm;
  
    const isComplete = await this.setContractTypeIsComplete({
      ffp, tm, hasJustification
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
        ffp:boolean, 
        tm:boolean,
        hasJustification: boolean
    }): Promise<boolean>{
    if (contractType.ffp && contractType.tm && contractType.hasJustification){
      return true;
    }
    else if (contractType.tm && contractType.hasJustification){
      return true;
    }
    else if (contractType.ffp && !contractType.tm){
      return true;
    }
    return false;
  }

  @Action({rawError: true})
  public async setContractTypeDescription(
    contractType:{
        ffp:boolean, 
        tm:boolean
    }): Promise<string>{
    if (contractType.ffp && contractType.tm){
      return "Firm-fixed-price (FFP) and Time-and-materials (T&M)"
    }
    else if (contractType.ffp){
      return "Firm-fixed-price (FFP)"
    }
    else if (contractType.tm){
      return "Time-and-materials (T&M)"
    }
    return "";
  }

  
  @Action({rawError: true})
  public async assessClassificationRequirements(): Promise<void>{
    const title = "Classification Requirements";
    const classReqs  = ClassificationRequirements.selectedClassificationLevels;
    const hasSecretOrTS = classReqs.some(cr => cr.classification !== "U");
    const description = await this.setClassificationRequirementsDesc(classReqs);
    const isTouched = await this.isClassificationRequirementTouchedOrComplete(classReqs)
      && await this.isSecurityRequirementsTouched(hasSecretOrTS)
      && await this.isCDSTouched(hasSecretOrTS)
    const isComplete = await this.isClassificationRequirementTouchedOrComplete(classReqs)
      && await this.isSecurityRequirementsComplete(hasSecretOrTS)
      && await this.isCDSComplete(hasSecretOrTS);
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
  public async setClassificationRequirementsDesc(
    classReqs: ClassificationLevelDTO[]): Promise<string>{
    const selectClassLevelsSysIds = classReqs.map(cr => cr.classification_level);
    const classLevelDisplayNames = ClassificationRequirements.classificationLevels.filter(
      cl => selectClassLevelsSysIds.includes(cl.sys_id)
    ).map(cl => cl.display?.replaceAll(" - ", "/")).sort();

    return classReqs.length > 0
      ? convertStringArrayToCommaList(classLevelDisplayNames as string[], "and")
      : "";
  }

  @Action({rawError: true})
  public async isClassificationRequirementTouchedOrComplete(
    classReqs: ClassificationLevelDTO[]): Promise<boolean>{
    return classReqs.length > 0;
  }

  @Action({rawError: true})
  public async isSecurityRequirementsTouched(
    hasSecretOrTS: boolean): Promise<boolean>{
    return hasSecretOrTS 
      ? ClassificationRequirements.securityRequirements?.length>0
      : true
  }

  @Action({rawError: true})
  public async isSecurityRequirementsComplete(
    hasSecretOrTS: boolean): Promise<boolean>{
    return hasSecretOrTS 
      ? ClassificationRequirements.securityRequirements?.every(
        sr => sr.classification_information_type.length > 0
      )
      : true
  }

  @Action({rawError: true})
  public async isCDSTouched(
    hasSecretOrTS: boolean
  ): Promise<boolean>{

    return hasSecretOrTS 
      ? await this.isTouched({
        object: ClassificationRequirements.cdsSolution as CrossDomainSolutionDTO,
        keysToIgnore:[""], 
      }) 
      : true;
  }

  @Action({rawError: true})
  public async isCDSComplete(
    hasSecretOrTS: boolean
  ): Promise<boolean>{
    // validate CDS
    const keysToIgnore = [
      "sys_",
      "duration",
      "selected_periods"
    ]
    const cds = ClassificationRequirements.cdsSolution as CrossDomainSolutionDTO;
    const isCDSComplete = await this.isComplete({
      object: cds,
      keysToIgnore, 
    })

    // validate duration
    const isCDSDurationValid = await this.isDurationValid({
      isNeeded: cds.need_for_entire_task_order_duration,
      selectedPeriods: cds.selected_periods
    })

    return hasSecretOrTS 
      ? isCDSComplete && isCDSDurationValid
      : true;
  }

  @Action({rawError: true})
  public async isDurationValid(
    duration: {
      isNeeded: string, 
      selectedPeriods: string
  }): Promise<boolean>{
    return duration.isNeeded.toUpperCase() === "NO"
      ? duration.selectedPeriods !== ""
      : true
  }

  @Action({rawError: true})
  public async isTouched(
    config:{
    object: object
    keysToIgnore: string[]
  }): Promise<boolean>{
    return  config.object && Object.keys(config.object).filter((key: string) => {
      if (config.keysToIgnore.every(ignoredKey => key.indexOf(ignoredKey)===-1)){
        let dynamicKey = key as keyof unknown;
        return config.object[dynamicKey] !== "" && config.object[dynamicKey] !== "[]"
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
        let dynamicKey = key as keyof unknown;
        const objAttrib = config.object[dynamicKey];
        return  objAttrib === "" && config.object[dynamicKey] !== "[]"
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


// export const formatPeriodOfPerformance = (
//   basePeriod: PeriodOfPerformanceDTO, 
//   optionPeriods: PeriodOfPerformanceDTO[]): 
// string => {
//   let formattedPop = "";
//   formattedPop += basePeriod.periodUnitCount;
//   formattedPop += " ";
//   formattedPop += basePeriod.periodUnit.toLowerCase();
//   formattedPop += " base period";
//   formattedPop += optionPeriods.length > 0 ? ", plus " : "";

//   const extractFromOptionGroup = (group: PeriodOfPerformanceDTO[], prefix: string): string => {
//     let section = "";
//     // section += formattedPop.includes("option") ? " and " : "";
//     section += prefix;
//     section += converter.toWords(group.length);
//     section += " ";
//     section += group[0].periodUnitCount;
//     section += "-";
//     section += group[0].periodUnit.toLowerCase();
//     section += " option period";
//     section += group.length > 1 ? "s" : "";
//     return section;
//   };

//   const orderedPeriods: PeriodOfPerformanceDTO[] = 
//      [...optionPeriods].sort((a, b) => a.optionOrder - b.optionOrder);
//   let previousPeriod!: PeriodOfPerformanceDTO;
//   let currentGroup: PeriodOfPerformanceDTO[] = [];
//   const allGroups: PeriodOfPerformanceDTO[][] = [];
//   for (const period of orderedPeriods) {
//     if (
//       previousPeriod &&
//       (previousPeriod.periodUnit !== period.periodUnit || 
//        previousPeriod.periodUnitCount !== period.periodUnitCount)
//     ) {
//       // If the current period is different from the last one, 
//        extract the current group and reset the array
//       allGroups.push(currentGroup);
//       currentGroup = [];
//     }
//     currentGroup.push(period);
//     previousPeriod = period;
//   }

//   // Extract the final remaining group when we're done
//   if (currentGroup.length > 0) {
//     allGroups.push(currentGroup);
//   }

//   // Now that we've assembled all the groups, extract the text from them
//   for (const [index, group] of allGroups.entries()) {
//     if (index === 0) {
//       formattedPop += extractFromOptionGroup(group, "");
//     } else if (index === allGroups.length - 1) {
//       formattedPop += extractFromOptionGroup(group, " and ");
//     } else {
//       formattedPop += extractFromOptionGroup(group, ", ");
//     }
//   }
//   return formattedPop;
// };