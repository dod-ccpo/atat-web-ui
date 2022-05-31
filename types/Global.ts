import { Component } from "vue";
import { 
  RouteConfigMultipleViews,
  RouteConfigSingleView 
} from "vue-router/types/router";

import { AdditionalButton } from "@/store/steps/types";

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
  text: string;
  value?: string;
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
  placeholder: string;
  jitMasking: boolean;
  regex?: string;
  mask?: string[];
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

export interface DOWInstanceClassificationLevelLabels {
  longLabel: string;
  shortLabel: string;
}

export interface DOWPoP {
  label: string;
  sysId: string;
}

export interface DOWClassificationInstance {
  sysId?: string;
  classificationLevelLabels?: DOWInstanceClassificationLevelLabels;
  impactLevel: string; // for sorting
  classificationLevelSysId: string;
  anticipatedNeedUsage: string;
  entireDuration: string;
  selectedPeriods?: DOWPoP[];
}

export interface DOWServiceOffering {
  name: string;
  otherOfferingName?: string;
  "sys_id": string;
  description: string;
  classificationInstances?: DOWClassificationInstance[];
  sequence: string;
}

export interface DOWServiceOfferingGroup {
  serviceOfferingGroupId: string;
  serviceOfferings: DOWServiceOffering[];
}


