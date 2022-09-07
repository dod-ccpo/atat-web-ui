import { Component } from "vue";
import { 
  RouteConfigMultipleViews,
  RouteConfigSingleView 
} from "vue-router/types/router";

import { AdditionalButton } from "@/store/steps/types";

export interface SubmenuIcon {
  name: string;
  height: string;
  width: string;
  color: string;
}
export interface TopNavItems {
  title: string;
  component?: Component;
  icon?: SubmenuIcon;
  link?: string;
  menu?: TopNavItems[]
  menuPosition?: string;
  align?: string;
  isProfile?: boolean;
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
  multiSelectOrder?: number;
  disabled?: boolean;
  hidden?: boolean;
  header?: string;
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

export interface RadioButton {
  id: string;
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface Checkbox {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface SlideoutPanelContent {
  component: Component;
  title: string;
}

export interface CountryObj {
  name: string;
  countryCode: string;
  abbreviation: string;
  active: boolean;
  suggested?: boolean;
  mask?: string[];
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

// export interface ComputeInstanceTableData {
//   instanceNumber: number;
//   type: string;
//   location: string;
//   qty: string;
//   vCPU: string;
//   memory: string;
//   storage: string;
//   classification: string;
//   performance: string;
// }

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
}
export interface Portfolio {
  title?: string;
  description?: string;
  status?: string;
  csp?: string;
  serviceAgency?: string;
  createdBy?: string;
  provisioned?: string;
  members?: User[];
  updated?: string;
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
