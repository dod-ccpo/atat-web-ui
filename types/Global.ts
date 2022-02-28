import { RouteConfigMultipleViews, 
    RouteConfigSingleView } from "vue-router/types/router";

export interface StepperStep {
    name: string;
    stepNumber?: string;
    completed?: boolean;
    completePercentageWeight?: number;
    menuText?: string;
    route: string;
    subSteps?: StepperStep[];   
}


/**
 * Defines Stepper Route Base properties
 */
 interface StepperRouteBase {

    stepNumber?: string;
    completePercentageWeight?: number;
    menuText?: string;
 }

 /**
  * Stepper Route Single Extends Route Single View
  */
 export interface StepperRouteSingleConfig extends StepperRouteBase, RouteConfigSingleView{

    children? : StepperRouteConfig[]
 }

  /**
  * Stepper Route Multiple Extends Route Multiple Views
  */
 export interface StepperRouteMultipleConfig extends StepperRouteBase, RouteConfigMultipleViews{
    children? : StepperRouteConfig[]

 }

/**
 * Defines a StepperRouteConfig type for Stepper Routes
 */
 export type StepperRouteConfig = StepperRouteSingleConfig | StepperRouteMultipleConfig;

