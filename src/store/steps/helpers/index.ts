import { StepperRouteConfig } from "types/Global";
import { StepInfo, StepRouteResolver } from "../types";

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
    };

    const lastStep = map?.get(last || "");

    if (lastStep) {
      lastStep.next = stepInfo.stepName;
      stepInfo.prev = lastStep.stepName;
    }

    map?.set(stepInfo.stepName, stepInfo);
    last = stepInfo.stepName;

    routeConfig.children?.forEach((childConfig) =>
      mapStep({
        ...childConfig,
        stepNumber: stepInfo.stepNumber,
      })
    );
  };

  config.forEach((routeConfig) => mapStep(routeConfig));

  return map;
};

export const resolveNextRouteName
  = (current: string, stepInfo: StepInfo): string | undefined => {

    if (stepInfo.resolver) {
      return (stepInfo.resolver(current));
    }

    return stepInfo.stepName;
  }

export const resolvePreviousRouteName
  = (current: string, stepInfo: StepInfo): string | undefined => {

    if (!stepInfo.prev)
      return stepInfo.prev;

    const prev = (typeof stepInfo.prev === 'string') ?
      stepInfo.prev : (stepInfo.prev as StepRouteResolver)(current);

  return prev;
}
