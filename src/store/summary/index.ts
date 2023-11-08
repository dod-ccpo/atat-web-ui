/* eslint-disable camelcase */
import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import rootStore from "../index";
import {
  baseGInvoiceData,
  DOWClassificationInstance,
  DOWServiceOffering,
  DOWServiceOfferingGroup,
  OtherServiceOfferingData,
  SummaryItem,
} from "types/Global";
import Periods from "../periods";
import AcquisitionPackage, { isMRRToBeGenerated, isDitcoUser } from "../acquisitionPackage";
import {
  ContactDTO,
  ContractConsiderationsDTO,
  ContractTypeDTO,
  CrossDomainSolutionDTO,
  CurrentEnvironmentInstanceDTO,
  EvaluationPlanDTO,
  FairOpportunityDTO,
  FundingRequestDTO,
  FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO,
  FundingRequirementDTO, OrganizationDTO,
  PeriodOfPerformanceDTO,
  ReferenceColumn,
  RequirementsCostEstimateDTO,
  SelectedClassificationLevelDTO,
  SensitiveInformationDTO,
} from "@/api/models";
import ClassificationRequirements, { isClassLevelUnclass } from "../classificationRequirements";
import {
  convertStringArrayToCommaList,
  toTitleCase,
  toCurrencyString, convertEvalPlanDifferentiatorToCheckbox,
} from "@/helpers";
import _ from "lodash";
import DescriptionOfWork from "../descriptionOfWork";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import EvaluationPlan from "../acquisitionPackage/evaluationPlan";
import api from "@/api";
import FinancialDetails from "@/store/financialDetails";
import IGCE  from "../IGCE";
import Attachments from "../attachments";
import { TABLENAME as REQUIREMENTS_COST_ESTIMATE_TABLE } from "@/api/requirementsCostEstimate";
import OrganizationData from "@/store/organizationData";

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
  case 1:
    await Summary.validateStepOne();
    break;
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
  case 8:
    await Summary.validateStepEight();
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
    hasDelete:false,
    hasShowMore:false,
    routeName: "",
    step: 0,
    substep: 0
  }

  public summaryItems: SummaryItem[] = [];
  public hasCurrentStepBeenVisited = false;
  private attachmentServiceName = REQUIREMENTS_COST_ESTIMATE_TABLE;

  @Action({rawError:true})
  public setHasCurrentStepBeenVisited(isVisited: boolean):void{
    this.doSetHasCurrentStepBeenVisited(isVisited);
  }

  @Mutation
  public doSetHasCurrentStepBeenVisited(isVisited: boolean):void{
    this.hasCurrentStepBeenVisited = isVisited;
  }

  @Action({rawError:true})
  public removeSummaryItem(itemToDelete: SummaryItem):void{
    this.doRemoveSummaryItem(itemToDelete);
  }

  @Mutation
  public doRemoveSummaryItem(itemToDelete: SummaryItem):void{
    this.summaryItems = this.summaryItems.filter(item => item !== itemToDelete)

  }

  @Mutation
  public async clearSummaryItems():Promise<void>{
    this.summaryItems = [];
  }


  @Action({rawError:true})
  public async toggleButtonColor(stepNumber: number):Promise<void>{
    const color = stepNumber > 0
      ? isStepComplete(stepNumber) ? "_primary" : "_secondary"
      : ""
    await AcquisitionPackage.setContinueButtonColor(color);
  }

  //#region STEP 1
  /*
   * assess all substeps in Step 1 to determine
   * if substep is touched and/or completed
   */
  @Action({rawError: true})
  public async validateStepOne(): Promise<void> {
    await this.assessAcquisitionDetails();
    await this.assessOrganizationDetails();
    await this.assessPrimaryPOC();
    await this.assessCOR();
    await this.assessACOR()
  }
  @Action({rawError: true})
  public async assessAcquisitionDetails(): Promise<void>{
    const projectOverview = AcquisitionPackage?.projectOverview;

    let title = "Acquisition Details";
    let description = "";
    const isTouched = projectOverview ? !!projectOverview.title : false;
    let isComplete = false;

    if (projectOverview && isTouched) {
      const processingOffice = AcquisitionPackage.contractingShop === "DITCO" ? "DITCO"
        : "An external contracting office";
      description = `${processingOffice} will process this JWCC task order.`;
      title = projectOverview.title;

      const isCompleteWithoutCjadc2 = !!projectOverview.title
          && !!projectOverview.scope && !!projectOverview.emergency_declaration
          && !!projectOverview.cjadc2 && !!projectOverview.project_disclaimer;

      isComplete = projectOverview.cjadc2 === "YES"
        ? isCompleteWithoutCjadc2 && !!projectOverview.cjadc2_percentage
        : isCompleteWithoutCjadc2;
    }

    const AcquisitionDetail: SummaryItem = {
      title,
      description,
      isComplete,
      isTouched,
      hasDelete:false,
      hasShowMore:false,
      routeName: "ContractingShop",
      step: 1,
      substep: 1
    }
    await this.doSetSummaryItem(AcquisitionDetail);
  }
  @Action({rawError: true})
  public async assessOrganizationDetails(): Promise<void>{
    const organization = AcquisitionPackage?.organization as OrganizationDTO;
    let organizationKeys:string[] = []
    if(organization){
      organizationKeys = Object.keys(organization)
    }
    const agencies = OrganizationData.agency_data
    const disaAgency = OrganizationData.disa_org_data
    let title = "Your Organization";
    const disa = typeof organization?.disa_organization_reference === "object"?
        (organization?.disa_organization_reference as ReferenceColumn).value as string
      : organization?.disa_organization_reference as string;
    const agency =  typeof organization?.agency === "object"?
        (organization?.agency as ReferenceColumn).value as string
      : organization?.agency as string;
    if(agency && agencies){
      const orgAgency = agencies.filter(item=> item.sys_id === agency)
      if(orgAgency.length > 0){
        title = orgAgency[0].label
      }
    }
    let disaDescription =""
    if(disa && disaAgency){
      const disaAgencyName = disaAgency.filter(item=> item.sys_id === disa)
      disaDescription = disaAgencyName[0].full_name
    }
    let description = "";
    if (organization?.dodaac && disaDescription) {
      description = `${disaDescription} (${organization.dodaac})`
    }else if(disaDescription) {
      description = `${disaDescription}`
    }else if(organization?.dodaac && !disaDescription) {
      description = `${organization.organization_name} (${organization.dodaac})`
    }else{
      description = `${organization?.organization_name} `
    }

    const orgnameKey =
        organization.disa_organization_reference ? "disa_organization_reference":"organization_name"

    const foreignKeys =
        // eslint-disable-next-line max-len
        [orgnameKey,"agency", "dodaac","street_address_1","city","zip_code","country","state"]
    const civilKeys =
        // eslint-disable-next-line max-len
        [orgnameKey,"agency", "dodaac","street_address_1","city","state","zip_code"]
    const keysToIgnore = organization?.address_type === "FOREIGN"?
      organizationKeys.filter(
        x => foreignKeys.indexOf(x) === -1
      ): organizationKeys.filter(
        x => civilKeys.indexOf(x) === -1)
    const isTouched = !!organization?.agency || !!organization?.organization_name
        || !!organization?.dodaac || !!organization?.address_type;
    const hasCompleteAddress = organization?.street_address_1
        && organization.city && organization.state && organization.zip_code
    const showMoreData = hasCompleteAddress?{address: `${organization.street_address_1} 
    ${organization.city}, ${organization.state} ${organization.zip_code} ${organization?.country}`}
      : {address: "Missing Address"}
    const monitor = {object: organization, keysToIgnore};
    const organizationDetails: SummaryItem = {
      title,
      description,
      isTouched,
      isComplete: await this.isComplete(monitor),
      hasDelete:false,
      hasShowMore:true,
      showMoreData,
      routeName: "OrganizationInfo",
      step:1,
      substep: 2
    }
    await this.doSetSummaryItem(organizationDetails);
  }
  @Action({rawError: true})
  public async assessPrimaryPOC(): Promise<void>{
    const contactInfo = AcquisitionPackage.contactInfo as ContactDTO
    let contactInfoKeys:string[] = []
    let keysToIgnore:string[] =[]
    let showMoreData:Record<string, string> = {}
    let title = "Primary Point of Contact"
    if(contactInfo){
      contactInfoKeys = Object.keys(contactInfo)
      const civilianKeys = ["role","first_name","last_name","phone","email","title"]
      const militaryKeys =
          ["role","first_name","last_name","rank_components","phone","email","title"]
      keysToIgnore = contactInfo.role === "MILITARY"? contactInfoKeys.filter(
        x => militaryKeys.indexOf(x) === -1
      ): contactInfoKeys.filter(
        x => civilianKeys.indexOf(x) === -1)

      showMoreData = {
        address:"",
        email:contactInfo.email || "Missing email address",
        phone:contactInfo.phone || "Missing phone number",
        title:contactInfo.title || "Missing job title",
        role:contactInfo.role || "Missing role"
      }
      title =contactInfo.first_name && contactInfo.last_name?
        `${contactInfo.first_name} ${contactInfo.last_name}`
        : "Primary Point of Contact"
    }

    const monitor = {object: contactInfo, keysToIgnore};
    const isTouched = await this.isTouched(monitor)
    const PrimaryPOC: SummaryItem = {
      title,
      description: "Primary Point of Contact",
      isComplete: await this.isComplete(monitor),
      isTouched,
      hasDelete:false,
      hasShowMore:true,
      showMoreData,
      routeName: "ContactInformation",
      step:1,
      substep: 3
    }
    await this.doSetSummaryItem(PrimaryPOC)
  }
  @Action({rawError: true})
  public async assessCOR(): Promise<void>{
    const contactInfo = AcquisitionPackage.corInfo as ContactDTO
    let contactInfoKeys:string[] = []
    let showMoreData:Record<string, string> = {}
    let keysToIgnore:string[] =[]
    let title = "Contracting Officer's Representative"
    if(contactInfo){
      contactInfoKeys = Object.keys(contactInfo)
      const civilianKeys = ["role","first_name","last_name","phone","email","dodaac"]
      const militaryKeys =
          ["role","first_name","last_name","rank_components","phone","email",]
      keysToIgnore = contactInfo.role === "MILITARY"? contactInfoKeys.filter(
        x => militaryKeys.indexOf(x) === -1
      ): contactInfoKeys.filter(
        x => civilianKeys.indexOf(x) === -1)
      showMoreData = {
        address:"",
        email:contactInfo.email || "Missing email address",
        phone:contactInfo.phone || "Missing phone number",
        dodaac: contactInfo.dodaac ? `DoDAAC - ${contactInfo.dodaac}` : "Missing DoDAAC",
        title:contactInfo.title || "Missing job title",
        role:contactInfo.role || "Missing role"
      }
      title =contactInfo.first_name && contactInfo.last_name?
        `${contactInfo.first_name} ${contactInfo.last_name}`
        : "Contracting Officer's Representative"
    }
    const monitor = {object: contactInfo, keysToIgnore};
    const isTouched = await this.isTouched(monitor)
    const CORDetails: SummaryItem = {
      title,
      description: "Contracting Officer's Representative",
      isComplete: await this.isComplete(monitor),
      isTouched,
      hasDelete:false,
      hasShowMore:true,
      ACORButton:true,
      showMoreData,
      routeName: "CorInformation",
      step:1,
      substep: 4
    }
    await this.doSetSummaryItem(CORDetails)
  }
  @Action({rawError: true})
  public async assessACOR(): Promise<void>{
    const contactInfo = AcquisitionPackage.acorInfo as ContactDTO
    let contactInfoKeys:string[] = []
    let keysToIgnore:string[] =[]
    let showMoreData:Record<string, string> = {}
    let title = "Alternate Contracting Officer's Representative"
    if(contactInfo){
      contactInfoKeys = Object.keys(contactInfo)
      const civilianKeys = ["role","first_name","last_name","phone","email","dodaac"]
      const militaryKeys =
          ["role","first_name","last_name","rank_components","phone","email","dodaac"]
      keysToIgnore = contactInfo.role === "MILITARY"? contactInfoKeys.filter(
        x => militaryKeys.indexOf(x) === -1
      ): contactInfoKeys.filter(
        x => civilianKeys.indexOf(x) === -1)
      showMoreData = {
        address:"",
        email:contactInfo.email || "Missing email address",
        phone:contactInfo.phone || "Missing phone number",
        dodaac:contactInfo.dodaac ? `DoDAAC - ${contactInfo.dodaac}` : "Missing DoDAAC",
        role:contactInfo.role || "Missing role"
      }
      // first_name && last_name will only show in "Show more" if they're missing
      // since they're already included in the title when they're present
      if (!contactInfo.first_name && !contactInfo.last_name) {
        showMoreData['name'] = "Missing name"
      } else {
        if (!contactInfo.first_name) showMoreData['first_name'] = "Missing first name"
        if (!contactInfo.last_name) showMoreData['last_name'] = "Missing last name"
      }
      title =contactInfo.first_name && contactInfo.last_name?
        `${contactInfo.first_name} ${contactInfo.last_name}`
        : "Alternate Contracting Officer's Representative"
    }
    const monitor = {object: contactInfo, keysToIgnore};
    const isTouched = await this.isTouched(monitor)
    const ACORDetails: SummaryItem = {
      title,
      description: "Alternate Contracting Officer's Representative",
      isComplete: await this.isComplete(monitor),
      isTouched,
      hasDelete:true,
      hasShowMore:true,
      showMoreData,
      routeName: "AcorInformation",
      step:1,
      substep: 5
    }
    if(AcquisitionPackage.hasAlternativeContactRep){
      await this.doSetSummaryItem(ACORDetails)
    } else {  //remove existingACOR item if necessary
      const existingACORSummaryItem = this.summaryItems.find(
        si => si.routeName.toUpperCase() === "ACORINFORMATION"
      ) as SummaryItem;
      if (existingACORSummaryItem){
        await this.removeSummaryItem(existingACORSummaryItem)
      }
    }

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
    const evalPlanObjectKeys = [
      "custom_",
      "method",
      "source_",
      "standard_",
      "sys_",
      "display",
    ];
    await this.assessFairOpportunity();
    await this.assessEvalPlan(evalPlanObjectKeys);
  }

  @Action({rawError: true})
  public async assessFairOpportunity(): Promise<void>{
    const fairOpp = AcquisitionPackage.fairOpportunity as FairOpportunityDTO;
    const keysToIgnore = ["sys_", "cause_migration_estimated_cost"];
    const isTouched = await this.isTouched({object: fairOpp, keysToIgnore});
    const isComplete = await this.isFairOpportunityComplete(fairOpp);
    const FairOpportunityItem: SummaryItem = {
      title: "Exception to Fair Opportunity",
      description: await this.setFairOpportunityDescription({fairOpp, isComplete}),
      isComplete,
      isTouched,
      hasDelete:false,
      hasShowMore:false,
      routeName: "Exceptions",
      step:2,
      substep: 1
    }
    await this.doSetSummaryItem(FairOpportunityItem)
  }

  @Action({rawError: true})
  public async setFairOpportunityDescription(
    resources:{
        fairOpp: FairOpportunityDTO,
        isComplete:boolean
      }): Promise<string>{
    let MRRText = "";
    const FARSelection =
        resources.fairOpp.exception_to_fair_opportunity?.split("_").slice(-1).join()
    let FARText = "";
    switch(FARSelection){
    case "A":
      FARText = "FAR 16.505(b)(2)(i)(A) – Unusual and compelling urgency.";
      break;
    case "B":
      FARText = "FAR 16.505(b)(2)(i)(B) – Unique or highly specialized capabilities.";
      break;
    case "C":
      FARText = "FAR 16.505(b)(2)(i)(C) – Logical follow-on.";
      break;
    default:
      FARText = "No exceptions apply to this acquisition.<br />" +
            "A J&A and MRR are NOT required in your final acquisition package."
      break;
    }

    const needsMRR = resources.fairOpp.contract_action === "NONE" ;
    if (FARSelection !== "NONE"){
      MRRText = needsMRR
        ? "A J&A and Sole Source MRR are required in final acquisition package."
        : "A J&A is required in final acquisition package.";
    }

    return resources.isComplete
      ? FARText + "<br />" + MRRText
      : ""

  }

  @Action({rawError: true})
  public async isFairOpportunityComplete(fairOpp: FairOpportunityDTO): Promise<boolean>{
    const hasNoFairOpp = fairOpp.exception_to_fair_opportunity === "NO_NONE"
    const hasProposedCSP = fairOpp.proposed_csp !== "";
    const hasJustification = fairOpp.justification !== "";
    const hasMinGovtRequirements = fairOpp.min_govt_requirements !== ""
        && fairOpp.min_govt_requirements !== "The cloud service offerings must continue at their " +
        "current level in order to support...\n\nThese offerings include..."
    return (hasNoFairOpp) ||
        (hasProposedCSP
            && hasJustification
            && hasMinGovtRequirements
            && await this.hasSoleSourceSituation(fairOpp)
            && await this.hasProcurement(fairOpp)
            && fairOpp.requirement_impact !== ""
            && fairOpp.contract_action !== ""
            && await this.hasMarketResearchEfforts(fairOpp)
            && await this.hasMarketResearchConductors(fairOpp)
            && await this.hasOtherFactsToSupportLogicalFollowOn(fairOpp)
            && await this.hasActionsToRemoveBarriers(fairOpp)
            && await this.hasCertificationPOCS(fairOpp)
        );
  }

  @Action({rawError: true})
  public async hasSoleSourceSituation(fairOpp: FairOpportunityDTO): Promise<boolean>{
    // assess first question
    // 1. Would a fair opportunity competition require your project to migrate from
    //    one platform to another, resulting in additional time and cost?
    const causeMigrationSelection = fairOpp.cause_migration_addl_time_cost;
    let isCauseMigrationSelection = false;
    if (causeMigrationSelection === "YES"){
      isCauseMigrationSelection =  fairOpp.cause_migration_estimated_cost !== ""
          && ["0.00", "0", ""].every(
            invalidValue => invalidValue !== fairOpp.cause_migration_estimated_cost?.trim())
          && fairOpp.cause_migration_estimated_delay_amount !== ""
          && fairOpp.cause_migration_estimated_delay_unit !== ""
    } else if (causeMigrationSelection === "NO"){
      isCauseMigrationSelection =  true
    }

    // assess second question
    // 2. Are your Government engineers trained and certified in a specific cloud
    //    platform or technology that is unique to Microsoft?
    const causeGovtEngineers = fairOpp.cause_govt_engineers_training_certified;
    let isCauseGovtEngineersComplete = false;
    if (causeGovtEngineers === "YES"){
      isCauseGovtEngineersComplete = fairOpp.cause_govt_engineers_platform_name !==""
          && fairOpp.cause_govt_engineers_insufficient_time_reason !== ""
          && fairOpp.cause_govt_engineers_insufficient_time_reason !== "Due to ..., there is "
          + "insufficient time to retrain and obtain certification in another "
          + "platform/technology.";
    } else if (causeGovtEngineers === "NO"){
      isCauseGovtEngineersComplete = true
    }
    // assess third question
    // 3. Is there a specific product or feature that is peculiar to Microsoft?
    const causeProductFeaturePeculiarToCSP = fairOpp.cause_product_feature_peculiar_to_csp;
    let isCauseProductFeaturePeculiarToCSP = false;
    if (causeProductFeaturePeculiarToCSP === "YES"){
      isCauseProductFeaturePeculiarToCSP =
          fairOpp.cause_product_feature_type !== ""
          && fairOpp.cause_product_feature_name !== ""
          && fairOpp.cause_product_feature_why_essential !== ""
          && fairOpp.cause_product_feature_why_essential !== "This product is essential to the "
          +"Government’s requirements due to..."
          && fairOpp.cause_product_feature_why_others_inadequate !== ""
          && fairOpp.cause_product_feature_why_others_inadequate !== "Other similar products do not"
          +" meet, nor can be modified to meet, the Government’s requirements due to..."
    } else if (causeProductFeaturePeculiarToCSP === "NO"){
      isCauseProductFeaturePeculiarToCSP = true
    }

    // validates if sole source cause is generated or custom
    let isSoleSourceCause = false;
    isSoleSourceCause = fairOpp.cause_of_sole_source_for_docgen === "GENERATED"
      ? fairOpp.cause_of_sole_source_generated !== ""
      : fairOpp.cause_of_sole_source_custom !== ""

    // validates why CSP is only source capable
    const whyCSPIsOnlyCapableSource = fairOpp.why_csp_is_only_capable_source !== "";

    return isCauseMigrationSelection
        && isCauseGovtEngineersComplete
        && isCauseProductFeaturePeculiarToCSP
        && isSoleSourceCause
        && whyCSPIsOnlyCapableSource;
  }

  @Action({rawError: true})
  public async hasProcurement(fairOpp: FairOpportunityDTO): Promise<boolean>{
    const procurementDiscussion = fairOpp.procurement_discussion !== "";
    const procurementHasExistingEnv = fairOpp.procurement_has_existing_env === "NO"
      ? true
      : fairOpp.procurement_previous_impact !== "";
    return procurementDiscussion
        && procurementHasExistingEnv;
  }

  @Action({rawError: true})
  public async hasMarketResearchEfforts(fairOpp: FairOpportunityDTO): Promise<boolean>{
    //  If the user selected 'Undefinitized contract aciton (UCA)', 'Bridge contract Action', or
    // 'Option to Extend Services' on the previous screen.
    const hasContractAction = fairOpp.contract_action !== "NONE"
    // assess first question
    // 1. Did you review the specific capabilities in the JWCC Contracts to
    //    determine that Microsoft is the only source capable of fulfilling the Government’s
    //    minimum needs in the manner and time frame required?
    const researchIsCSPOnlySourceCapable = fairOpp.research_is_csp_only_source_capable;
    let hasResearchIsCSPOnlySourceCapable = false;
    if (researchIsCSPOnlySourceCapable === "YES"){
      const hasDates = (fairOpp.research_start_date !== "" && fairOpp.research_end_date !== "")
          || fairOpp.research_start_date !== ""
      hasResearchIsCSPOnlySourceCapable = hasDates
          && fairOpp.research_supporting_data !== ""
    } else if (researchIsCSPOnlySourceCapable === "NO"){
      hasResearchIsCSPOnlySourceCapable = true
    }

    // assess first question
    // 2. Thinking of the unique product that you previously told us about, did you review the JWCC
    //    contractor’s catalogs to determine if other similar offerings meet or can be modified
    //    to satisfy your requirements?
    let hasResearchReviewCatalogsReviewed = true;
    const hasProductOrFeature = fairOpp.cause_product_feature_type !== "";
    const researchReviewCatalogsReviewed = fairOpp.research_review_catalogs_reviewed;
    if (hasProductOrFeature){
      const sameResearchDate
          = fairOpp.research_review_catalogs_same_research_date;
      let hasSameResearchDate = false;
      const researchReviewCatalogsReviewResults = fairOpp.research_review_catalogs_review_results;
      let hasReviewResults = false;
      if (researchReviewCatalogsReviewed === "YES"){
        const hasDates =
            (fairOpp.research_review_catalogs_start_date !== ""
                && fairOpp.research_review_catalogs_end_date !== "") ||
            fairOpp.research_review_catalogs_start_date !== ""
        hasSameResearchDate = sameResearchDate === "YES"
          ? true
          : hasDates

        hasReviewResults =
            researchReviewCatalogsReviewResults !== ""
            && researchReviewCatalogsReviewResults !== "The results have determined that no other "
            + "offering is suitable as follows..."

        hasResearchReviewCatalogsReviewed =
            hasSameResearchDate
            && hasReviewResults
      }
    }
    // if there is no contract action && both Q1 and Q2 === 'NO'
    const isOtherTechniquesRequired =
        !hasContractAction
        && researchIsCSPOnlySourceCapable === "NO"
        && researchReviewCatalogsReviewed === "NO";
    const hasOtherTechniques = isOtherTechniquesRequired
      ? fairOpp.research_other_techniques_used !== ""
        && fairOpp.research_techniques_summary !== ""
      : true;

    // if Q1 or Q2 === 'YES' and 1 item is checked in fairOpp.research_other_techniques_used
    // checkbox list then fairOpp.research_techniques_summary is required
    const noContractActionAndNoProduct = !hasContractAction && !hasProductOrFeature
    let hasResearchTechniquesSummary = true;
    if ((researchIsCSPOnlySourceCapable === "YES" || researchReviewCatalogsReviewed === "YES")
        || (researchIsCSPOnlySourceCapable === "NO" && !noContractActionAndNoProduct)){
      // By default, `REVIEW_JWCC_CONTRACTS_AND_OR_CONTRACTORS_CATALOG` is selected.
      // Validate that at least 2 items have been selected.
      hasResearchTechniquesSummary = hasContractAction
        ? true
        : (fairOpp.research_other_techniques_used as string).split(",").length>1
          ? fairOpp.research_techniques_summary !== ""
          : true
    }

    // if `other` is selected, then validate the `other text box`
    const otherOptionSysId = AcquisitionPackage.marketResearchTechniques?.find(
      (option) => option.technique_label.toUpperCase() === "OTHER"
    )?.sys_id as string;
    const isOtherOptionSelected =
        fairOpp.research_other_techniques_used?.includes(otherOptionSysId)
          ? fairOpp.research_other_technique !== ""
          : true

    // validates market research efforts is generated or custom
    let hasMarketResearchDetails = false;
    hasMarketResearchDetails = fairOpp.research_details_for_docgen === "GENERATED"
      ? fairOpp.research_details_generated !== ""
      : fairOpp.research_details_custom !== ""

    //todo eval to true
    return hasResearchIsCSPOnlySourceCapable
        && hasResearchReviewCatalogsReviewed
        && isOtherOptionSelected
        && hasOtherTechniques
        && hasMarketResearchDetails
        && hasResearchTechniquesSummary;
  }

  @Action({rawError: true})
  public async hasMarketResearchConductors(fairOpp: FairOpportunityDTO): Promise<boolean>{
    if (fairOpp.contract_action === "NONE"){
      const conductors =
          JSON.parse(fairOpp.market_research_conducted_by as string) as Record<string, string>[];
      return conductors.length>0
          && conductors.every((c) => Object.values(c).every(c=>c!==""))
    }
    return true;
  }

  @Action({rawError: true})
  public async hasOtherFactsToSupportLogicalFollowOn(fairOpp: FairOpportunityDTO): Promise<boolean>{
    return fairOpp.other_facts_to_support_logical_follow_on === "NO"
      ? true
      : fairOpp.other_facts_to_support_logical_follow_on_details !== ""
  }

  @Action({rawError: true})
  public async hasActionsToRemoveBarriers(fairOpp: FairOpportunityDTO): Promise<boolean>{
    // assess question one
    // 1. Is your agency preparing a fair opportunity competitive follow-on requirement?
    const followOnRequirement = fairOpp.barriers_follow_on_requirement;
    const hasFollowOnRequirement = (followOnRequirement !== "" && followOnRequirement === "NO")
      ? true
      : fairOpp.barriers_follow_on_expected_date_awarded !=="" ;

    //assess question two
    // 2. Is your agency pursuing training and/or certifications for Government engineers
    //    in other technologies?
    const isAgencyPursuingTrainingOrCerts =
        fairOpp.barriers_agency_pursuing_training_or_certs !== "";

    //assess question three
    // 3. Are you planning future development and enhancement of Infrastructure as a Service (IaaS)
    //    components that will shift to a containerized platform?
    const isPlanningFutureDevleopment =
        fairOpp.barriers_planning_future_development !== "";

    //assess question three
    // 4. Are you planning future development and enhancement of Infrastructure as a Service (IaaS)
    //    components that will shift to a containerized platform?
    const hasJA = fairOpp.barriers_j_a_prepared !== ""
    const isJAPrepared =
        hasJA && fairOpp.barriers_j_a_prepared === "NO"
          ? true
          : fairOpp.barriers_j_a_prepared_results !== "";


    // validates market research efforts is generated or custom
    let hasPlansToRemoveBarriers = false;
    hasPlansToRemoveBarriers = fairOpp.barriers_plans_to_remove_for_docgen === "GENERATED"
      ? fairOpp.barriers_plans_to_remove_generated!== ""
      : fairOpp.barriers_plans_to_remove_custom !== ""

    return hasFollowOnRequirement
        && isAgencyPursuingTrainingOrCerts
        && isPlanningFutureDevleopment
        && isJAPrepared
        && hasPlansToRemoveBarriers
  }

  @Action({rawError: true})
  public async hasCertificationPOCS(fairOpp: FairOpportunityDTO): Promise<boolean>{
    const reqPOCType = fairOpp.requirements_poc_type;
    const reqPOCId = fairOpp.requirements_poc;
    const technicalPOCType = fairOpp.technical_poc_type;
    const technicalPOCId = fairOpp.technical_poc;
    const hasExistingTechPOC = technicalPOCId !== "" && technicalPOCType !=="";
    const hasExistingReqPOC = reqPOCId !="" && reqPOCType !="" ;
    if (reqPOCType === "NEW"){
      if (await this.isNewPOCValid(reqPOCId as string) === false){
        return false;
      };
    }
    if (technicalPOCType === "NEW"){
      if (await this.isNewPOCValid(technicalPOCId as string) === false){
        return false;
      };
    }
    return hasExistingReqPOC && hasExistingTechPOC
  }

  @Action({rawError: true})
  public async isNewPOCValid(sysID: string): Promise<boolean>{
    const contactResponse: ContactDTO[] = await api.contactsTable.getQuery({
      params: {
        // eslint-disable-next-line camelcase
        sysparm_query: "sys_id=" + sysID
      }
    });
    if (contactResponse.length>0){
      const contact = contactResponse[0];
      const keysToIgnore = Object.keys(contact).filter(
        x => ["role","first_name","last_name","title","phone"].indexOf(x) === -1
      );
      const monitor = {object: contact, keysToIgnore};
      const isMilitary = contact.role.toUpperCase() === "MILITARY";
      const hasRankComponents = contact.rank_components !== "" ;
      const isComplete = await this.isComplete(monitor);
      return isMilitary
        ? isComplete && hasRankComponents
        : isComplete;
    } else {
      return false;
    }
  }

  @Action({rawError: true})
  public async assessEvalPlan(objectKeys: string[]): Promise<void>{
    const fairOpp = AcquisitionPackage.fairOpportunity?.exception_to_fair_opportunity as string;
    const hasEmptyFairOpp = fairOpp === "";
    const hasNoFairOpp = fairOpp === "NO_NONE"
    const hasFairOpp = !hasNoFairOpp && !hasEmptyFairOpp;
    const evalPlanStore = EvaluationPlan.evaluationPlan as EvaluationPlanDTO;
    const keysToIgnore = objectKeys.filter(
      x => ["custom_","method", "source_", "standard_"].indexOf(x) === -1
    );
    const monitor = {object: evalPlanStore, keysToIgnore};
    const isTouched = hasNoFairOpp ? await this.isTouched(monitor) : true;
    const isComplete = hasFairOpp ? true : await this.isEvalPlanComplete(evalPlanStore);
    const evalPlan: SummaryItem = {
      title: "Evaluation Plan",
      description: await this.setEvalPlanDescription({evalPlanStore, isComplete, fairOpp}),
      isComplete: hasNoFairOpp ? isComplete : (!hasEmptyFairOpp ? true : false),
      isTouched: hasNoFairOpp ? isTouched : (!hasEmptyFairOpp ? true : false),
      hasDelete:false,
      hasShowMore:false,
      routeName: "CreateEvalPlan",
      step:2,
      substep: 2
    }
    await this.doSetSummaryItem(evalPlan)
  }

  @Action({rawError: true})
  public async setEvalPlanDescription(
    config:{
        evalPlanStore:EvaluationPlanDTO,
        isComplete: boolean,
        fairOpp: string
      }): Promise<string> {
    const method = config.evalPlanStore.method;
    const selection = config.evalPlanStore.source_selection;
    const hasNoFairOpp = config.fairOpp === "NO_NONE"
    let description = "No Evaluation Plan is required.";
    if (!hasNoFairOpp && config.isComplete){
      return description;
    }

    if (!config.isComplete){
      return "";
    }

    switch(selection){
    case "NO_TECH_PROPOSAL":
      description = "Technical proposal not required; award will be made on a LPTA basis."
      break;
    case "TECH_PROPOSAL":
      description = (method ?? "") !==  ""
        ? "Technical proposal required; award will be made on a " + method + " basis."
        : "";
      break;
    case "SET_LUMP_SUM":
      description = (method ?? "") !==  ""
        ? "Purchase a set lump sum dollar amount from one CSP; " +
            "award will be made to the “" + method + "” solution."
        : "";
      break;
    case "EQUAL_SET_LUMP_SUM":
      description = "Purchase an equal set lump sum dollar amount from each CSP."
      break;
    }
    return description;
  }

  @Action({rawError: true})
  public async missingCustomDifferentiator(evalPlanStore:EvaluationPlanDTO): Promise<boolean> {
    const differentiator = convertEvalPlanDifferentiatorToCheckbox(
      EvaluationPlan.differentiatorData
    );
    const otherIdx = differentiator.findIndex(object => object.label.includes("Other"))
    const otherDifferentiatorSysId = differentiator[otherIdx].value
    const selectedDifferentiators = evalPlanStore.standard_differentiators?.split(',')
    const selectedDifferentiatorsIncludesOther
        = evalPlanStore.standard_differentiators?.includes(otherDifferentiatorSysId)
    const customDifferentiators = evalPlanStore.custom_differentiators
    if(selectedDifferentiators
        && selectedDifferentiators?.length === 1
        && selectedDifferentiatorsIncludesOther) {
      return customDifferentiators === "";
    }
    return false;
  }

  @Action({rawError: true})
  public async isEvalPlanComplete(evalPlanStore:EvaluationPlanDTO): Promise<boolean> {
    const hasCustomSpecs = (evalPlanStore.has_custom_specifications ?? "") !== "";
    const hasStandardDifferentiators = (evalPlanStore.standard_differentiators ?? "") !==  "";
    const hasBestUseOrLowestRiskMethod =
        (evalPlanStore.method === "BEST_USE" || evalPlanStore.method === "LOWEST_RISK")
    const hasLPTAMethod = evalPlanStore.method === "LPTA";
    const needsCustomValue = await this.missingCustomDifferentiator(evalPlanStore)
    let isComplete = false;
    switch(evalPlanStore.source_selection){
    case "NO_TECH_PROPOSAL":
      isComplete = hasCustomSpecs;
      break;
    case "TECH_PROPOSAL":
      isComplete = hasLPTAMethod
        ? hasCustomSpecs
        : hasCustomSpecs && hasStandardDifferentiators && !needsCustomValue
      break;
    case "SET_LUMP_SUM":
      isComplete = hasBestUseOrLowestRiskMethod;
      break;
    case "EQUAL_SET_LUMP_SUM":
      isComplete = true;
      break;
    }
    return isComplete;
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
    const isComplete = await this.isPOPComplete();
    const POPSummaryItem: SummaryItem = {
      title: "Period of Performance (PoP)",
      description,
      isComplete,
      isTouched,
      hasDelete:false,
      hasShowMore:false,
      routeName: "PeriodOfPerformance",
      step:3,
      substep: 1
    }
    await this.doSetSummaryItem(POPSummaryItem)
  }

  @Action({rawError: true})
  public async isPOPComplete(): Promise<boolean>{
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

    const isFfp = contractType?.firm_fixed_price.toLowerCase() === "true";
    const isTm = contractType?.time_and_materials.toLowerCase() === "true";
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
      hasDelete:false,
      hasShowMore:false,
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
      hasDelete:false,
      hasShowMore:false,
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
        || (!!currentContracts && currentContracts.length > 0);
    const isComplete =  currentContractDetailsIsComplete
        || hasCurrentOrPreviousContract === "NO";

    const contractNumbers = currentContracts?.map(
      (contract) => contract.contract_number).join(", ");
    const prevContracts = currentContracts?.length === 1
      ? `${currentContracts?.length} previous contract:\n${contractNumbers}`
      : `${currentContracts?.length} previous contracts:\n${contractNumbers}`
    const description = isTouched && currentContracts && currentContracts.length > 0?
      hasCurrentOrPreviousContract === "YES"
        ? prevContracts
        : "No previous contracts"
      : "";

    const procurementHistorySummaryItem: SummaryItem = {
      title: "Procurement History",
      description,
      isComplete,
      isTouched,
      hasDelete:false,
      hasShowMore:false,
      routeName: "CurrentContract",
      step: 4,
      substep: 1
    }

    await this.doSetSummaryItem(procurementHistorySummaryItem)
  }
  @Action({rawError: true})
  public async isCurrentEnvironmentComplete(
    environmentInstances: CurrentEnvironmentInstanceDTO[]
  ): Promise<boolean>{
    const requiredFields = [
      "instance_location",
      "classification_level",
      "current_usage_description",
      "users_per_region",
      "operating_system",
      "licensing",
      "number_of_vcpus",
      "processor_speed",
      "memory_amount",
      "storage_type",
      "storage_amount",
      "performance_tier",
      "number_of_instances",
      "data_egress_monthly_amount",
    ];
    const results:boolean[] = []
    for(const instance of environmentInstances){
      const instanceKeys = Object.keys(instance)
      const keysToIgnore = instanceKeys.filter(key => requiredFields.indexOf(key) === -1)
      const complete = await this.isComplete({object:instance, keysToIgnore:keysToIgnore})
      results.push(complete)
    }
    return results.every(value => value)
  }

  @Action({rawError: true})
  public async sortDeployedInstances(
    deployedInstances: string[]
  ): Promise<string[]>{
    const result:string[] = []
    const unclassified = deployedInstances.findIndex(value => value === "Unclassified")
    const secret = deployedInstances.findIndex(value => value === "Secret")
    const topSecret = deployedInstances.findIndex(value => value === "Top Secret")
    if(unclassified > -1){
      result.push(deployedInstances[unclassified])
    }if(secret > -1){
      result.push(deployedInstances[secret])
    }if(topSecret > -1){
      result.push(deployedInstances[topSecret])
    }
    return result
  }

  @Action({rawError: true})
  public async assessCurrentEnvironment(): Promise<void> {
    const classificationLevels = await ClassificationRequirements.getAllClassificationLevels()
    const currentEnvironment = await CurrentEnvironment.getCurrentEnvironment()
    const currentEnvironmentInstances = await  CurrentEnvironment.getCurrentEnvironmentInstances()
    const systemDocs = currentEnvironment?.has_system_documentation !== ""
    const hasSystemDocs = currentEnvironment?.has_system_documentation === "YES"
    const systemDocsLength = currentEnvironment?.system_documentation
      ? currentEnvironment?.system_documentation.length : 0
    const migrationDocs = currentEnvironment?.has_migration_documentation !== ""
    const hasMigrationDocs = currentEnvironment?.has_migration_documentation === "YES"
    const migrationDocsLength = currentEnvironment?.migration_documentation
      ? currentEnvironment?.migration_documentation.length : 0;
    const envLocation = currentEnvironment?.env_location
    const envOnPremClass = currentEnvironment?.env_classifications_onprem
    const envCloudClass = currentEnvironment?.env_classifications_cloud
    let locationHasClassification = false
    const systemDocsComplete = (systemDocs &&!hasSystemDocs)
        || (hasSystemDocs && systemDocsLength > 0)
    const migrationDocsComplete = (migrationDocs &&!hasMigrationDocs)
        || (hasMigrationDocs && migrationDocsLength > 0)
    if(envLocation === "HYBRID" && envOnPremClass && envCloudClass){
      locationHasClassification = (envOnPremClass?.length > 0 && envCloudClass?.length > 0)
    }
    else if(envLocation === "ON_PREM" && envOnPremClass){
      locationHasClassification = envOnPremClass?.length > 0
    }else if(envLocation === "CLOUD" && envCloudClass){
      locationHasClassification = envCloudClass?.length > 0
    }
    const isCurrentEnvironmentComplete
        = this.isCurrentEnvironmentComplete(currentEnvironmentInstances)
    const isTouched = currentEnvironment?.current_environment_exists !== "";
    const isComplete =  currentEnvironment?.current_environment_exists === "NO"
        // eslint-disable-next-line max-len
        || systemDocsComplete && migrationDocsComplete && locationHasClassification && await isCurrentEnvironmentComplete;
    let description = ""
    let showMoreData:Record<string, [string, number][]> = {}
    const deployedLocations:string[] = []
    if(currentEnvironmentInstances.length){
      const onPremInstances:Record<string, number> = {}
      const cloudInstances:Record<string, number> = {}
      currentEnvironmentInstances.forEach(instance =>{
        const classification = classificationLevels
          .find(CL=> CL.sys_id === instance.classification_level)
        if(classification){
          if(classification.display){
            const classificationLocation = classification?.display.split("-")[0].trim()
            if(!deployedLocations.includes(classificationLocation)){
              deployedLocations.push(classificationLocation as string)
            }
          }
          const classificationLabels: Record<string, Record<string, string>> = {
            CLOUD: {
              IL2: "Unclassified/IL2",
              IL4: "Unclassified/IL4",
              IL5: "Unclassified/IL5",
              IL6: "Secret",
              TS: "Top Secret",
            },
            ON_PREM: {
              IL2: "Unclassified (DoD information approved for public release)",
              IL4: "Unclassified (DoD CUI)",
              IL5: "Unclassified (DoD CUI & National Security Systems)",
              IL6: "Secret",
              TS: "Top Secret",
            },
          }
          if(instance.instance_location==="CLOUD"){
            // eslint-disable-next-line max-len
            const convertedKey = classificationLabels["CLOUD"][classification.impact_level || classification.classification]
            cloudInstances[convertedKey] = (cloudInstances[convertedKey] || 0) +1
          }else{
            // eslint-disable-next-line max-len
            const convertedKey = classificationLabels["ON_PREM"][classification.impact_level || classification.classification]
            onPremInstances[convertedKey] = (onPremInstances[convertedKey] || 0) +1
          }
        }
      })

      showMoreData = {
        onPrem: Object.entries(onPremInstances),
        cloud: Object.entries(cloudInstances)
      }
      const envString = envLocation === "HYBRID"?"Hybrid"
        :envLocation === "CLOUD"?"Cloud":"On-premise"
      const orderedDeployedInstances = await this.sortDeployedInstances(deployedLocations)
      // eslint-disable-next-line max-len
      description = `${envString} environment deployed in ${convertStringArrayToCommaList(orderedDeployedInstances, "and")}`
    }
    if(currentEnvironment?.current_environment_exists === "NO"){
      description = "No existing environment"
    }
    const currentEnvironmentSummaryItem: SummaryItem = {
      title: "Current Environment",
      description,
      isComplete,
      isTouched,
      showMoreData,
      hasDelete:false,
      hasShowMore:currentEnvironment?.current_environment_exists !== "NO",
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
      const data = _.clone(level);
      let additionalFields: Array<(keyof SelectedClassificationLevelDTO)> = []
      let requiredFields: Array<(keyof SelectedClassificationLevelDTO)> = [
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
          if (!data.user_growth_estimate_percentage) return false
          return data.user_growth_estimate_percentage.length > 0 &&
              data.user_growth_estimate_percentage[0] !== ""
        }
        if (f === "data_increase" && data.data_increase === "YES"){
          if (!data.data_growth_estimate_percentage) return false
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
        const data = _.clone(instance);
        const requiredFields: Array<keyof DOWClassificationInstance> = [
          "anticipatedNeedUsage",
          "entireDuration",
          "selectedPeriods",
          "classificationLevelSysId"
        ]
        instance.isComplete = requiredFields.every(f => {
          if (f === "selectedPeriods"){
            return data.entireDuration === "NO"
              ? (data.selectedPeriods ? data.selectedPeriods.length > 0 : false)
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
    let requiredFields: Array<keyof OtherServiceOfferingData> = [];
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

    const data = _.clone(attribs.otherOfferingData);
    let additionalFields: Array<keyof OtherServiceOfferingData> = [];
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
        "operatingSystemAndLicensing",
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
          && !isClassLevelUnclass(data["classificationLevel"] ?? '')){
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
      hasDelete:false,
      hasShowMore:false,
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
      hasDelete:false,
      hasShowMore:false,
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
      hasDelete:false,
      hasShowMore:false,
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
      hasDelete:false,
      hasShowMore:false,
      routeName: "PII",
      step:7,
      substep: 1
    }
    await this.doSetSummaryItem(standardsAndComplianceSummaryItem)
  }

  @Action({rawError: true})
  public async getPIIDescription(sensitiveInfo: SensitiveInformationDTO): Promise<string>{
    let desc = "";
    if (sensitiveInfo?.pii_present === "YES"
        && sensitiveInfo?.system_of_record_name !== "" ){
      desc = "System of records: " + sensitiveInfo.system_of_record_name
    } else if (sensitiveInfo?.pii_present === "NO"){
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
      hasDelete:false,
      hasShowMore:false,
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
    keysToIgnore.push("foia_country");
    const fOIAMonitor = {object: sensitiveInfo, keysToIgnore};
    const isTouched = await this.isTouched(fOIAMonitor)
    const isComplete = sensitiveInfo.potential_to_be_harmful === "NO"
        || await this.isComplete(fOIAMonitor);
    const standardsAndComplianceSummaryItem: SummaryItem = {
      title: "Public Disclosure of Information",
      description,
      isComplete,
      isTouched,
      hasDelete:false,
      hasShowMore:false,
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
      hasDelete:false,
      hasShowMore:false,
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

  //#region STEP 8
  @Action({rawError: true})
  public async validateStepEight(): Promise<void> {
    await this.assessRequirementsCostEstimate();
    await this.assessFunding();
    await this.assessIncrementalFunding();
  }

  @Action({rawError: true})
  public async assessRequirementsCostEstimate(): Promise<void> {
    const data = IGCE.requirementsCostEstimate as RequirementsCostEstimateDTO;
    const hasSupportingDocs = await this.hasSupportingIGCEDocumentation(data);
    const isTouched = await this.isRCETouched({data, hasSupportingDocs});
    const isComplete = await this.isRCEComplete({data});
    await this.getCostSummary(isComplete);

    const requirementsCostEstimateSummaryItem: SummaryItem = {
      title: "Requirements Cost Estimate",
      description: await this.setRCEDescription({data, isComplete}),
      isComplete,
      isTouched,
      routeName: "CreatePriceEstimate",
      step: 8,
      substep: 1
    }
    await this.doSetSummaryItem(requirementsCostEstimateSummaryItem)
  };

  /**
   *
   * if summary step is complete, set store properties for
   * total_price and base_year_price
   *
   * @param isComplete boolean - if true, make the API call
   */
  @Action({rawError: true})
  public async getCostSummary(isComplete: boolean): Promise<void> {
    if (isComplete){
      try{
        const costData = await api.costEstimateTable.search(AcquisitionPackage.packageId)
        IGCE.doSetCostEstimateTotals({
          base: costData.payload.subtotal["Base Period"],
          grand: costData.payload.grand_total_with_fee["Total"]
        })
      } catch(error){
        console.log(error);
      }
    }
  }

  @Action({rawError: true})
  public async hasSupportingIGCEDocumentation(rce: RequirementsCostEstimateDTO): Promise<boolean> {
    const attachments = await Attachments.getAttachmentsByTableSysIds({
      serviceKey: this.attachmentServiceName,
      tableSysId: rce.sys_id as string
    });
    return attachments.length>0
  }

  @Action({rawError: true})
  public async setRCEDescription(
    rce:{
        data: RequirementsCostEstimateDTO
        isComplete: boolean
      }): Promise<string> {
    let description = "";
    const baseYearTotal = toCurrencyString(rce.data.baseYearTotal as number, true)
    const grandTotal = toCurrencyString(rce.data.grandTotal as number, true)
    if (baseYearTotal !== ""){
      description += "Subtotal for base period: $" + baseYearTotal
    }
    if (grandTotal !== ""){
      description += "<br />Grand total with fees for all periods: $" + grandTotal
    }
    return description;
  }

  @Action({rawError: true})
  public async isRCETouched(
    rce:{
        data: RequirementsCostEstimateDTO
        hasSupportingDocs: boolean
      }): Promise<boolean> {
    return rce.data.optimize_replicate.option !== ""
        || rce.data.architectural_design_performance_requirements.option !== ""
        || (IGCE.igceEstimateList.length > 0
            && IGCE.igceEstimateList.every((ce) => ce.unit_price?.toString() !== "0"))
        || rce.data.travel.option !== ""
        || IGCE.trainingItems.some(item => item.costEstimateType !== "")
        || rce.data.surge_requirements.capabilities !== ""
        || rce.data.fee_specs.is_charged !== ""
        || rce.data.how_estimates_developed.tools_used !== ""
        || rce.data.how_estimates_developed.cost_estimate_description !== ""
        || rce.data.how_estimates_developed.previous_cost_estimate_comparison.options !== ""
  }

  @Action({rawError: true})
  public async isRCEComplete (
    rce:{
        data: RequirementsCostEstimateDTO
      }): Promise<boolean> {

    return await this.hasCompletedReplicateOrOptimizeAction(rce.data)
        && await this.hasCompletedArchitecturalDesigns(rce.data)
        && await this.hasCompletedCostEstimates()
        && await this.hasCompletedIGCETraining()
        && await this.hasCompletedIGCETravel(rce.data)
        && await this.hasCompletedSurgeRequirements(rce.data)
        && await this.hasCompletedChargedFee(rce.data)
        && await this.hasCompletedHowEstimatesDeveloped(rce.data)
  }

  @Action({rawError: true})
  public async hasCompletedReplicateOrOptimizeAction(
    rce: RequirementsCostEstimateDTO
  ): Promise<boolean> {
    const action = CurrentEnvironment.currentEnvironment.current_environment_replicated_optimized;
    return action.includes("YES")
      ? rce.optimize_replicate.estimated_values.every(val=>val !== "")
        && rce.optimize_replicate.option !== ""
      : true;
  }

  @Action({rawError: true})
  public async hasCompletedArchitecturalDesigns(
    rce: RequirementsCostEstimateDTO
  ): Promise<boolean> {
    return DescriptionOfWork.DOWArchitectureNeeds.needs_architectural_design_services === "YES"
      ? rce.architectural_design_performance_requirements.estimated_values.every(val=>val !== "")
        && rce.architectural_design_performance_requirements.option !== ""
      : true;
  }

  @Action({rawError: true})
  public async hasCompletedCostEstimates(): Promise<boolean> {
    const estimates = IGCE.igceEstimateList;
    const offerings =
        DescriptionOfWork.DOWObject
          .filter(dow=>["TRAINING", "TRAVEL"].every (off => off !== dow.serviceOfferingGroupId))
          .reduce((acc,curr)=>acc + (curr.otherOfferingData?.length || 0), 0);
    if (offerings > estimates.length){
      return false;
    }

    return estimates.every(
      (ce) => {
        return (ce.title === "PORTABILITY_PLAN" ? true : ce.description !== "")
              && ce.title !== ""
              && ["0", "0.00", ""].every(
                invalidPrice => ce.unit_price?.toString() !== invalidPrice
              )
      }
    )
  }

  @Action({rawError: true})
  public async hasCompletedIGCETraining(): Promise<boolean> {
    if (IGCE.trainingItems.length>0){
      const assessedTrainingItems = IGCE.trainingItems.map(
        (ti)=>{
          const hasValidEstimatedTrainingPrice =
                ["0", "0.00", ""].every(price => price !== ti.estimatedTrainingPrice);
          return ti.costEstimateType === "ANNUAL_SUBSCRIPTION"
            ? hasValidEstimatedTrainingPrice
            : hasValidEstimatedTrainingPrice
                && ti.trainingOption !== ""
                && ti.estimate.estimated_values !== ""
                && ti.estimate.option !== "";
        }
      )
      return assessedTrainingItems.every(ati => ati === true);
    }
    return true;
  }

  @Action({rawError: true})
  public async hasCompletedIGCETravel(rce: RequirementsCostEstimateDTO): Promise<boolean> {
    if (DescriptionOfWork.travelSummaryInstances.length === 0){
      return true
    } else if (rce.travel.option !== ""){
      if (!rce.travel.estimated_values?.toUpperCase().includes("UNDEFINED")){
        const estimatedValues = Object.values(JSON.parse(rce.travel.estimated_values as string))
        const totalPop = Periods.periods.length;

        return rce.travel.option === "SINGLE"
          ? estimatedValues.every((ev)=> (ev as number) > 0 )
          : (estimatedValues.length === totalPop) // if MULTIPLE
            ? estimatedValues.every((ev)=> (ev as number) >= 0 ) // multiple values can === 0
            : false
      }
      return false;
    }
    return false;

  }

  @Action({rawError: true})
  public async hasCompletedSurgeRequirements(rce: RequirementsCostEstimateDTO): Promise<boolean> {
    return rce.surge_requirements.capabilities === "NO"
      ? true
      : rce.surge_requirements.capabilities === "YES"
        && ["0", null].every(capacity => capacity !== rce.surge_requirements.capacity)
  }

  @Action({rawError: true})
  public async hasCompletedChargedFee(rce: RequirementsCostEstimateDTO): Promise<boolean> {
    if (AcquisitionPackage.contractingShop === "OTHER"){
      return rce.fee_specs && rce.fee_specs.is_charged === "NO"
        ? true
        : ["0", null, ""].every(percentage => percentage !== rce.fee_specs.percentage)
    }
    return true;
  }

  @Action({rawError: true})
  public async hasCompletedHowEstimatesDeveloped(
    rce: RequirementsCostEstimateDTO
  ): Promise<boolean> {
    const howEstimatesDeveloped = rce.how_estimates_developed;
    const pcec =  howEstimatesDeveloped.previous_cost_estimate_comparison;
    const isHowEstimatesDevelopedValid = howEstimatesDeveloped.tools_used !== ""
        && howEstimatesDeveloped.cost_estimate_description !== ""

    const isHowOtherEstimatesDeveloped = howEstimatesDeveloped.tools_used.includes("OTHER")
      ? howEstimatesDeveloped.other_tools_used !== ""
      : true

    const isPreviousCostEstimateComparisonValid = pcec.options.includes("_THAN")
      ? (pcec.percentage as number) > 0
      : pcec.options.includes("SAME") ? true : false;

    return isHowEstimatesDevelopedValid
        && isHowOtherEstimatesDeveloped
        && isPreviousCostEstimateComparisonValid;
  }


  @Action({rawError: true})
  public async assessFunding(): Promise<void> {
    const request = await FinancialDetails.fundingRequest as FundingRequestDTO;
    const gInv = await FinancialDetails.gInvoicingData as baseGInvoiceData;
    const fsForm = FinancialDetails.fundingRequestFSForm as FundingRequestFSFormDTO;
    const mipr = FinancialDetails.fundingRequestMIPRForm as FundingRequestMIPRFormDTO;
    const fairOpp =
        (AcquisitionPackage.fairOpportunity as FairOpportunityDTO).exception_to_fair_opportunity;
    const fundingRequirement = FinancialDetails.fundingRequirement as FundingRequirementDTO
    const hasFairOpp = ["NO_NONE", ""].every(noValue => noValue !== fairOpp );
    const isDitco = isDitcoUser()
    const fundingDataObjs = {request,gInv,fsForm,mipr,hasFairOpp,fundingRequirement,isDitco};
    const isComplete =  await this.isFundingComplete(fundingDataObjs);
    const fundingSummaryItem: SummaryItem = {
      title: "Funding",
      description: await this.setFundingDescription({fsForm, request, mipr, isComplete}),
      isComplete,
      isTouched: await this.isFundingTouched(fundingDataObjs),
      routeName: "CurrentlyHasFunding",
      step: 8,
      substep: 3
    }
    await this.doSetSummaryItem(fundingSummaryItem)
  };

  @Action({rawError: true})
  public async setFundingDescription(
    funding:{
        fsForm: FundingRequestFSFormDTO,
        request: FundingRequestDTO,
        mipr: FundingRequestMIPRFormDTO,
        isComplete: boolean
      }): Promise<string>{
    // eslint-disable-next-line max-len
    if(AcquisitionPackage.acquisitionPackage
      ?.contracting_shop_require_funding_documents_for_submission_of_package === "NO"
      && !isDitcoUser()
    ){
      return "Funding documents are not required by contracting office"
    }
    if (funding.request && funding.fsForm){
      const hasMIPRNumber = funding.mipr?.mipr_number !== ""
      const hasOrderNumber = funding.fsForm?.order_number !== ""
      const hasGTCNumber = funding.fsForm?.gt_c_number !== ""
      if(!hasGTCNumber){
        return "Missing funding documents"
      }
      if(funding.request.funding_request_type === "FS_FORM" && !hasOrderNumber){
        return "Missing funding documents"
      }else if(funding.request.funding_request_type === "MIPR" && !hasMIPRNumber){
        return "Missing funding documents"

      }
      return funding.request.funding_request_type === "MIPR"
        ? (hasMIPRNumber ? "MIPR: " + funding.mipr.mipr_number  : "")
        : (hasGTCNumber ? "GT&C: " + funding.fsForm.gt_c_number + "<br />" : "")
          + (hasOrderNumber ? "Order: " + funding.fsForm.order_number : "")
    }
    return ""
  }

  @Action({rawError: true})
  public async isFundingTouched(
    funding:{
        request: FundingRequestDTO,
        gInv: baseGInvoiceData,
        fsForm: FundingRequestFSFormDTO,
        mipr: FundingRequestMIPRFormDTO,
        hasFairOpp: boolean
        fundingRequirement: FundingRequirementDTO
        isDitco:boolean
      }): Promise<boolean>{
    if (funding.request && funding.fsForm){
      const keysToIgnore = Object.keys(funding.fsForm).filter(k=>!k.includes("fs_form_7600a"))
      const hasAppropriationOfFunds = funding.hasFairOpp
        ? funding.request.appropriation_fiscal_year !== ""
          || funding.request.appropriation_funds_type !== ""
        : false
      if(!funding.isDitco){
        return AcquisitionPackage.acquisitionPackage
          ?.contracting_shop_require_funding_documents_for_submission_of_package !== ""
      }

      return funding.request.funding_request_type !== ""
          || funding.gInv.useGInvoicing !== ""
          || funding.fsForm.order_number !== ""
          || funding.fsForm.gt_c_number !== ""
          || await this.isTouched({object: funding.fsForm, keysToIgnore}) //validates 2 docs
          || hasAppropriationOfFunds
          || funding.fundingRequirement.has_funding !== ""
    }
    return false
  }


  @Action({rawError: true})
  public async isFundingComplete(
    funding:{
        request: FundingRequestDTO,
        gInv: baseGInvoiceData,
        fsForm: FundingRequestFSFormDTO,
        mipr: FundingRequestMIPRFormDTO,
        hasFairOpp: boolean
        fundingRequirement: FundingRequirementDTO
        isDitco:boolean
      }): Promise<boolean>{
    const needsFunding = AcquisitionPackage.acquisitionPackage
      ?.contracting_shop_require_funding_documents_for_submission_of_package === "YES"
    console.log('here1')
    if(!funding.isDitco && !needsFunding){
      return true
    }
    console.log('here2')
    if (funding.fsForm === null && funding.mipr === null){
      return false
    }
    console.log('here3')
    const keysToIgnore = Object.keys(funding.fsForm).filter(k=>!k.includes("fs_form_7600a"))
    const fsForm7600AComplete = await this.isComplete({object: funding.fsForm, keysToIgnore})
        && funding.fsForm.gt_c_number !== ""
    const needsFundingInfo = funding.fundingRequirement?.has_funding === "NO_FUNDING"
    console.log('fsForm7600AComplete: ', fsForm7600AComplete) // true
    console.log('needsFundingInfo: ', needsFundingInfo) // false
    const hasFunding = (needsFundingInfo && fsForm7600AComplete)
    console.log('here4')
    if (funding.request && funding.fsForm){
      let hasAppropriationOfFunds = false;
      let isComplete = false;
      console.log('here5')
      if (funding.request.funding_request_type === "FS_FORM"){
        console.log('here6')
        isComplete =  await this.isFSFormComplete({
          fsForm: funding.fsForm,
          gInv: funding.gInv,
          request: funding.request
        }) && fsForm7600AComplete;
      } else if (funding.request.funding_request_type === "MIPR"){
        console.log('here7')
        isComplete = await this.isMIPRComplete(funding.mipr) && fsForm7600AComplete;
      }

      console.log('here8')
      hasAppropriationOfFunds = funding.hasFairOpp
        ? funding.request.appropriation_fiscal_year !== ""
          && funding.request.appropriation_funds_type !== ""
        : true
      
      console.log('isComplete: ', isComplete) // true
      console.log('hasAppropriationOfFunds: ', hasAppropriationOfFunds) // true
      console.log('hasFunding: ', hasFunding) // false

      return isComplete
          && hasAppropriationOfFunds
          && hasFunding;
    }
    console.log('here10')
    return false;
  }

  @Action({rawError: true})
  public async isMIPRComplete(mipr: FundingRequestMIPRFormDTO): Promise<boolean>{
    return await this.isComplete({object: mipr, keysToIgnore: ["sys_"]})
  }

  @Action({rawError: true})
  public async isFSFormComplete(
    funding:{
        fsForm: FundingRequestFSFormDTO,
        gInv: baseGInvoiceData,
        request: FundingRequestDTO,
      }
  ): Promise<boolean>{
    let isComplete = false;
    const fsForm700BGInvoice = funding.fsForm.fs_form_7600b_use_g_invoicing
    if (fsForm700BGInvoice === "Yes"){
      isComplete = funding.gInv.gInvoiceNumber !== ""
    } else if (fsForm700BGInvoice === "NO"){
      const keysToIgnore = Object.keys(funding.fsForm).filter(k=>!k.includes("fs_form_7600b"))
      isComplete =  funding.fsForm.order_number !== ""
          && await this.isComplete({object: funding.fsForm, keysToIgnore}) //validates 2 docs
    }
    return isComplete
  }

  @Action({rawError: true})
  public async assessIncrementalFunding(): Promise<void> {
    const req = FinancialDetails.fundingRequirement as FundingRequirementDTO;
    const poc = AcquisitionPackage.financialPocInfo as ContactDTO;
    const isPopBaseLessThanNineMonths =
        AcquisitionPackage.totalBasePoPDuration >0 && AcquisitionPackage.totalBasePoPDuration <= 270
    const fundingDataObjects = {req, poc, isPopBaseLessThanNineMonths}
    const isTouched = await this.isIncrementalFundingTouched(fundingDataObjects);
    const isComplete = await this.isIncrementalFundingComplete(fundingDataObjects);
    const incrementalFundingSummaryItem: SummaryItem = {
      title: "Incremental Funding",
      description: await this.setIncrementalFundingDescription({
        poc,req,isComplete,isTouched,isPopBaseLessThanNineMonths}
      ),
      isComplete,
      isTouched,
      routeName: "SeverabilityAndIncrementalFunding",
      step: 8,
      substep: 2
    }
    await this.doSetSummaryItem(incrementalFundingSummaryItem)
  };

  @Action({rawError: true})
  public async setIncrementalFundingDescription(
    funding:{
        poc: ContactDTO,
        req: FundingRequirementDTO,
        isComplete: boolean,
        isTouched: boolean,
        isPopBaseLessThanNineMonths: boolean
      }): Promise<string> {
    if (funding.req){
      const incFunding = funding.req.incrementally_funded;
      let description = "";
      if (funding.isPopBaseLessThanNineMonths){
        description =  "Effort does not qualify for incremental funding."
      } else if (incFunding==="NO"){
        description =  "Not Requested"
      } else if (funding.isTouched && !funding.isComplete && incFunding==="YES"){
        description =  "Requesting to incrementally fund requirement";
      } else if (funding.isComplete && incFunding === "YES" && funding.poc !== null){
        description =
          "<p class='mb-8'>Requesting to incrementally fund requirement</p>" +
          "Financial POC: " + funding.poc?.first_name + " " + funding.poc?.last_name + "<br>" +
          funding.poc?.email
      }
      return description;
    }
    return "";
  }

  @Action({rawError: true})
  public async isIncrementalFundingTouched(
    funding:{
        req: FundingRequirementDTO,
        poc: ContactDTO,
        isPopBaseLessThanNineMonths: boolean
      }): Promise<boolean> {
    if (funding.req){
      return funding.isPopBaseLessThanNineMonths
        ? true
        : funding.req.incrementally_funded !== ""
          || (FinancialDetails.fundingIncrements.length > 0
              && FinancialDetails.fundingIncrements.every(
                fi => ["0.00", "0",""].every(invalidAmt => invalidAmt !== fi.amt)))
          || (funding.poc && funding.poc?.role !== "")
    }
    return false;
  }

  @Action({rawError: true})
  public async isIncrementalFundingComplete(
    funding:{
        req: FundingRequirementDTO,
        poc: ContactDTO,
        isPopBaseLessThanNineMonths: boolean
      }): Promise<boolean> {
    if(funding.req){
      const incrementallyFundedValue = funding.req.incrementally_funded;
      if (funding.isPopBaseLessThanNineMonths){
        return true;
      } else if (incrementallyFundedValue === ""){
        return false;
      } else if (incrementallyFundedValue === "YES"){
        return await this.hasCompleteIncrementalFundingAndPOC(funding);
      } else if (incrementallyFundedValue === "NO") {
        return true
      }
      return true;
    }
    return false
  }

  @Action({rawError: true})
  public async hasCompleteIncrementalFundingAndPOC(
    funding:{
        req: FundingRequirementDTO,
        poc: ContactDTO
      }): Promise<boolean> {

    // determines if fundingIncrements is valid
    const isFundingIncrementsComplete = (FinancialDetails.fundingIncrements.length > 0
        && FinancialDetails.fundingIncrements.every(
          fi => ["0.00", "0",""].every(invalidAmt => invalidAmt !== fi.amt)))

    // determines if POC is valid
    let isPOCComplete = false;
    isPOCComplete = funding.poc?.first_name !== ""
      && funding.poc?.last_name !== ""
      && funding.poc?.phone !== ""
      && funding.poc?.email !== ""

    if (funding.poc?.role === "MILITARY"){
      isPOCComplete = isPOCComplete && funding.poc.rank_components !== ""
    }
    return isFundingIncrementsComplete
        && isPOCComplete
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
    if (summaryItem){
      const existingIndex = this.summaryItems.findIndex(
        si=>(si.step === summaryItem.step) && (si.substep === summaryItem.substep));
      existingIndex > -1
        ? this.summaryItems.splice(existingIndex, 1, summaryItem)
        : this.summaryItems.push(summaryItem)
    }
  }


}

const Summary = getModule(SummaryStore);
export default Summary;
