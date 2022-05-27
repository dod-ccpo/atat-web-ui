import { StepperRouteConfig } from "types/Global";
import { StepInfo, StepPathResolver, StepRouteResolver } from "../types";

export const mapStepConfigs = (
  config: StepperRouteConfig[]
): Map<string, StepInfo> => {
  const map = new Map<string, StepInfo>();
  let last = "";
  const mapStep = (routeConfig: StepperRouteConfig) => {
    const stepInfo: StepInfo = {
      stepNumber: routeConfig.stepNumber || "",
      stepName: routeConfig.name || "",
      stepLabel: routeConfig.menuText || "",
      prev: undefined,
      next: undefined,
      resolver: routeConfig.routeResolver,
      additionalButtons: routeConfig.additionalButtons || [],
      backButtonText: routeConfig.backButtonText || "Back",
    };
   
    const lastStep = map?.get(last || "");

    if (lastStep) {
      lastStep.next = stepInfo.stepName;
      stepInfo.prev = lastStep.stepName;
    }
        
    //we use step name for dynamic routing
    //since by convention the parent route configs
    //don't have a name we will fall through to child routes
    if(stepInfo.stepName.length > 0){
      map?.set(stepInfo.stepName, stepInfo);
      last = stepInfo.stepName;
    }

    routeConfig.children?.forEach((childConfig) =>
    {
      mapStep({
        ...childConfig,
        stepNumber: stepInfo.stepNumber,
      })
    }
    );
  };
  config.forEach((routeConfig) => mapStep(routeConfig));

  return map;
};

export const isRouteResolver = (resolver: StepRouteResolver | StepPathResolver | string) 
: boolean => {
  const name = (resolver as (current: string)=> string ).name;
  return name !==undefined && ! name.includes('PathResolver');
}
export const isPathResolver = (resolver:  StepRouteResolver | StepPathResolver | string)
: boolean => {
  const name = (resolver as (current: string, direction: string)=> string ).name;
  return name !== undefined && name.includes('PathResolver');
}

export const resolveNextRouteName = (current: string, stepInfo: StepInfo): string | undefined => {
  if (stepInfo.resolver) {

    return isRouteResolver(stepInfo.resolver) ? (stepInfo.resolver as StepRouteResolver)(current) :
      (stepInfo.resolver as StepPathResolver)(current, "next");
  }

  return stepInfo.stepName;
}

export const resolvePreviousRouteName = 
(current: string, stepInfo: StepInfo): string | undefined => {
  if (!stepInfo.prev)
    return stepInfo.prev;

  const prev = (typeof stepInfo.prev === 'string')
    ? stepInfo.prev
    : (isRouteResolver(stepInfo.prev) ? 
      (stepInfo.prev as StepRouteResolver)(current) : 
      (stepInfo.prev as StepPathResolver)(current, "previous"));

  return prev;
}
