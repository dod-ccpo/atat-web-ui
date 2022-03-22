import {RouteConfigMultipleViews, RouteConfigSingleView} from "vue-router/types/router";

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
  routeResolver?: (currentRoute: string) => string
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

export interface CountryObj {
  name: string;
  countryCode: string;
  abbreviation: string;
}