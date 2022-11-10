/* eslint-disable camelcase */
import { Component } from "vue";
import { 
  RouteConfigMultipleViews,
  RouteConfigSingleView 
} from "vue-router/types/router";

import { AdditionalButton } from "@/store/steps/types";

import { 
  CurrentContractDTO, 
  FairOpportunityDTO,
  OrganizationDTO, 
  ProjectOverviewDTO,
  ContactDTO,
  BaseTableDTO,
  ClinDTO,
} from "@/api/models";

export interface DocReviewData {
  projectOverview: ProjectOverviewDTO;
  organization: OrganizationDTO;
  fairOpportunity: FairOpportunityDTO;
  currentContract: CurrentContractDTO;
  cor: ContactDTO | null,
  acor: ContactDTO | null,
}

export interface MenuIcon {
  name: string;
  height: string;
  width: string;
  color: string;
}
export interface TopNavItem {
  title: string;
  parentTitle?: string;
  component?: Component;
  spaSectionTitle?: string;
  externalUrl?: string;
  icon?: MenuIcon;
  link?: string;
  menu?: TopNavItem[]
  menuPosition?: string;
  align?: string;
  isProfile?: boolean;
  separatorBefore?: boolean;
}

export interface MeatballMenuItem {
  title: string;
  action?: string;
  url?: string;
  disabled?: boolean;
  separatorBefore?: boolean;
  icon?: MenuIcon;
  hidden?:boolean;
}
export interface MeatballMenu {
  id: string;
  left: boolean;
  menuItems: MeatballMenuItem[];
}

export interface StepperRouteHandlerParams {
  previous: string;
  next: string;
}

export interface StepperStep {
  name: string;
  stepNumber?: string;
  completed?: boolean;
  excludeFromMenu?: boolean;
  completePercentageWeight?: number;
  menuText?: string;
  route: string;
  subSteps?: StepperStep[];
  additionalButtons?: AdditionalButton[];
  backButtonText?: string;
  continueButtonText?:string;
}

/**
 * interface for select items
 */
export interface SelectData {
  text?: string;
  value?: string;
  description?: string;
  multiSelectOrder?: number;
  disabled?: boolean;
  hidden?: boolean;
  header?: string;
  divider?: boolean;
  isSelectable?: boolean;
}

/**
 * interface for autocomplete Items
 */
export interface AutoCompleteItem {
  [key: string]: string | number | null | boolean
}

export interface AutoCompleteItemGroups {
  [key: string]: AutoCompleteItem[];
}

/**
 * Defines Stepper Route Base properties
 */
interface StepperRouteBase {

    stepNumber?: string;
    completePercentageWeight?: number;
    menuText?: string;
    completed?: boolean;
    /**
     * Setting this flag to true will prevent item from being 
     * rendered in menu but will still include it in the route record
     */
    excludeFromMenu?: boolean;
    /**
     * A handler to 
     */
    routeResolver?: (currentRoute: string, direction: string) => string;
    additionalButtons?: AdditionalButton[];
    backButtonText?: string;
    continueButtonText?: string;
}

/**
 * Stepper Route Single Extends Route Single View
 */
export interface StepperRouteSingleConfig extends StepperRouteBase, RouteConfigSingleView {
  children?: StepperRouteConfig[]
}

/**
 * Stepper Route Multiple Extends Route Multiple Views
 */
export interface StepperRouteMultipleConfig extends StepperRouteBase, RouteConfigMultipleViews {
  children?: StepperRouteConfig[]
}

/**
 * Defines a StepperRouteConfig type for Stepper Routes
 */
export type StepperRouteConfig = StepperRouteSingleConfig | StepperRouteMultipleConfig;

export interface Checkbox {
  id: string;
  label: string;
  value: string;
  description?: string;
  textfieldValue?: string;
}

export interface RadioButton extends Checkbox {
  disabled?: boolean;
  readonly?: boolean;
}

export interface FilterOption extends RadioButton {
  abbreviation?: string;
  type?: string;
}
export interface SlideoutPanelContent {
  component: Component;
  title?: string;
}

export interface CountryObj {
  name: string;
  countryCode: string;
  abbreviation: string;
  active: boolean;
  suggested?: boolean;
  mask?: string[];
}

export interface BreadCrumbItem {
    disabled?: boolean,
    exact?: boolean,
    href?: string,
    link?: boolean,
    text?: string | number,
    to?: string;
}

export interface ToastObj {
  isOpen: boolean;
  type: "success" | "info";
  message: string;
  hasUndo?: boolean;
  hasIcon?: boolean;
}

/**
 * interface for basic/generic objects
 */
export interface stringObj {
  [key: string]: string;
}

export interface PoP {
  duration: number | null;
  unitOfTime: string;
  id: string | null;
  order: number;
}

export interface RankData {
  grade: string; 
  name: string; 
  sysId: string;
}

// CorAcorSelectData needs refinement in next milestone
// currently only dummy data
export interface CorAcorSelectData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  orgName: string;
}

export interface isValidObj {
  field: string;
  message: string;
  mask: string[];
  isMaskRegex?: boolean
}

export interface mask {
  placeholder?: string;
  jitMasking?: boolean;
  regex?: string;
  mask?: string[];
  alias?: string;
  groupSeparator?: string;
  autoGroup?: boolean;
  digits?: number;
  digitsOptional?: boolean;
  rightAlign?: boolean;
}

export interface uploadingFile{
  file: File;
  fileName?: string;
  created?: number;
  progressStatus: number;
  link: string;
  attachmentId: string,
  recordId: string,
  isErrored: boolean;
  isUploaded: boolean;
}

export interface invalidFile{
  file: File;
  doesFileExist: boolean;
  SNOWError?: string;
  statusCode?: number;
}

export interface DOWPoP {
  label: string;
  sysId: string;
}

export interface DOWClassificationInstance {
  sysId?: string;
  impactLevel: string; // for sorting
  classificationLevelSysId: string;
  anticipatedNeedUsage: string;
  entireDuration: string;
  selectedPeriods?: DOWPoP[];
  labelLong?: string;
  labelShort?: string;
}

export interface DOWServiceOffering {
  name: string;
  otherOfferingName?: string;
  "sys_id": string; //service offering sys id
  serviceId: string; // id of the service
  description: string;
  classificationInstances?: DOWClassificationInstance[];
  sequence: string;
}

export interface DOWServiceOfferingGroup {
  serviceOfferingGroupId: string;
  sequence: number;
  serviceOfferings: DOWServiceOffering[];
  otherOfferingData?: OtherServiceOfferingData[];
}

export interface fundingIncrement {
  text: string;
  amt: string;
  order: number; // saved to database
  sysId?: string;
  qtrOrder: number; // used for sorting on IFP page
  hasPeriodGap?: boolean;
}
export interface IFPData {
  initialFundingIncrementStr: string;
  fundingIncrements: fundingIncrement[];
}

export interface baseGInvoiceData {
  useGInvoicing: string;
  gInvoiceNumber: string;
}

export interface lineChartDataSet {
  dataSetId: string;
  label: string;
  data: (number | null)[];
  spanGaps?: boolean;
  fill: boolean;
  borderColor: string;
  borderWidth: number;
  pointRadius: number;
  pointBackgroundColor?: string;
  pointHoverBackgroundColor?: string;
  pointHoverBorderColor?: string;
  pointBorderWidth?: number;
  pointHoverRadius?: number,
  pointHoverBorderWidth?: number;
  lineTension?: number;
  borderDash?: number[];
}
export interface lineChartData {
  labels?: string[];
  datasets?: lineChartDataSet[];
}

export interface OtherServiceOfferingData {
  instanceNumber: number;
  environmentType: string;
  classificationLevel?: string;
  deployedRegions: string[];
  deployedRegionsOther: string;
  descriptionOfNeed: string;
  entireDuration: string;
  periodsNeeded: string[];
  operatingSystemAndLicensing: string;
  numberOfVCPUs: string;
  memory: string;
  storageType: string;
  storageAmount: string;
  performanceTier: string;
  performanceTierOther: string;
  numberOfInstancesNeeded: string;
  requirementTitle?: string;
}

export interface OtherServiceSummaryTableData {
  instanceNumber: number;
  typeOrTitle?: string;
  location?: string;
  qty?: string;
  vCPU?: string;
  memory?: string;
  storage?: string;
  classification?: string;
  performance?: string;
  requirementTitle?: string;
  duration?: string;
}

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  phoneExt?: string;
  designation?: string;
  agency?: string;
}

export interface Portfolio extends BaseTableDTO {
  sysId?: string;
  title?: string;
  description?: string;
  status?: string;
  csp?: string;
  agency?: string;
  createdBy?: string;
  provisioned?: string;
  members?: User[];
  updated?: string;
  taskOrderNumber?: string;
}

export interface PortfolioCardData extends Portfolio {
  fundingStatus?: string;
  fundingAlertChipString?: string;
  branch?: string;
  lastModifiedStr?: string;
  lastModifiedDate?: string;
  currentPoP?: string;
  expiration?: string;
  totalObligated?: string;
  fundsSpent?: string;
  fundsSpentPercent?: string;
  fundsRemaining?: string;
  isManager?: boolean;
}

export interface PortfolioSummaryQueryParams {
  role?: string;
  fundingStatuses?: FilterOption[];
  csps?: FilterOption[];
  portfolioStatus?: string;
  sort?: string;
  searchString?: string;
}

export interface EmailEntry {
  key: string;
  email: string;
  isValid: boolean | null;
  isExisting: boolean | null;
}

export interface MemberInvites {
  emails: string[];
  role: string;
}

export interface FundingTrackerAlert {
   alertType: string;
}

export interface TaskOrderCardData {
  taskOrderNumber?: string,
  periodOfPerformance?: string,
  totalObligated?: string,
  totalValue?: string,
  totalLifeCycle?: string,
  totalFundsSpent?: string,
  status?: string,
  sys_id?: string,
  clins?:ClinDTO[],
}

export interface ClinTableRowData {
  isActive?: boolean,
  isExercised?: boolean,
  isExpired?: boolean,
  isPending?: boolean,
  CLINNumber?:string,
  CLINTitle?:string,
  PoP?: Record<string, string>,
  obligatedFunds?:string,
  totalCLINValue?:string,
  totalFundsSpent?:string,
  fundsRemaining?: {percent:string, fundsRemaining:string},
  isOverspent?: boolean,
  status?:string,
  statusLabel?: string;
  startNewClinGroup?: boolean,
  popStartDate: string
}

export interface LegendLink {
  id: string;
  linkText: string;
  emitText: string;
}

export interface IGCE {
  travelEstimateNeeds: boolean,
  estimatedTravelCosts: string[],
  surgeCapacity: boolean,
  surgeCapabilities: string,
}

export type EvalPlanMethod = "" | "LPTA" | "BVTO" | "BestUse" | "LowestRisk";

export type EvalPlanSourceSelection = "" | "NoTechProposal" | "TechProposal" 
  | "SetLumpSum" | "EqualSetLumpSum";

export type StorageUnit = "" | "GB" | "TB" | "PB";
export type YesNo = "" | "YES" | "NO";

export interface CurrentEnvUsageData {
  currentUsageDescription?: EnvironmentInstanceUsage;
  trafficSpikeCauses?: string[]; // EJY need to refactor in component
  isTrafficSpikeEventBased?: YesNo;
  isTrafficSpikePeriodBased?: YesNo;
  trafficSpikeEventDescription?: string;
  trafficSpikePeriodDescription?: string;
} 

export interface CurrentEnvInstanceConfig {
  licensing?: string;
  operatingSystem?: string;
  numberOfVCPUs?: number | null;
  processorSpeed?: number | null;
  memoryAmount?: number | null;
  memoryUnit?: StorageUnit;
  storageType?: string;
  storageAmount?: number | null;
  storageUnit?: StorageUnit;
}

export interface CurrentEnvPerformanceTier {
  performanceTier?: PerformanceTier;
  numberOfSimilarInstances?: number | null;
  dataEgressMonthlyAmount?: number | null;
  dataEgressMonthlyUnit?: StorageUnit;
}

export interface CurrentEnvPricingDetails {
  currentPaymentArrangement?: PaymentArrangement;
  pricingPeriodExpirationDate?: string;
}

export type EnvironmentLocation = "" | "CLOUD" | "ONPREM" | "HYBRID";
export type EnvironmentInstanceLocation = "" | "CLOUD" | "ONPREM";
export type EnvironmentReplicateOptimized = "" | "YES_REPLICATE" | "YES_OPTIMIZE" | "NO";
export type EnvironmentInstanceUsage = "" | "EVEN_USAGE" | "IRREGULAR_USAGE";
export type StorageType = "" | "BLOCK" | "OBJECT" | "FILE" | "ARCHIVE";
export type PerformanceTier = "" | "GENERAL" | "COMPUTE" | "MEMORY" | "STORAGE";
export type PaymentArrangement = "" | "PREPAID" | "PAYASYOUGO";

export interface CurrentEnvironment {
  currentEnvironmentExists?: YesNo;
  hasSystemDocumentation?: YesNo;
  systemDocumentation?: string[]; // List - sys_ids from sys_attachment table 
  hasMigrationDocumentation?: YesNo;
  migrationDocumentation?: string[]; // List - sys_ids from sys_attachment table 
  envLocation?: EnvironmentLocation;
  envClassifications?: string[]; // array of classification level sys_ids
  envInstances?: CurrentEnvironmentInstance[]; // array of sys_ids
  currentEnvironmentReplicatedOptimized?: EnvironmentReplicateOptimized;
  statementReplicatedOptimized?: string;
  additionalGrowth?: YesNo;
  anticipatedYearlyAdditionalCapacity?: number; 
  hasPhasedApproach?: YesNo;
  phasedApproachSchedule?: string; 
  needsArchitecturalDesignServices?: YesNo;
  statementArchitecturalDesign?: string; 
  applicationsNeedArchitecturalDesign?: string;
  dataClassificationsImpactLevels?: string[];
  externalFactorsArchitecturalDesign?: string;          
}

export interface CurrentEnvironmentInstance {
  instanceLocation?: EnvironmentInstanceLocation;
  deployedRegions?: string[];
  classificationLevel?: string; // classification level sys_id
  currentUsage?: CurrentEnvUsageData,
  usersPerRegion?: string; // json stringified sys_id/count pairs
  instanceConfig?: CurrentEnvInstanceConfig;
  performanceTier?: CurrentEnvPerformanceTier;
  pricingDetails?: CurrentEnvPricingDetails;
  additionalInformation?: string;
}
