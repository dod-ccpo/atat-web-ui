import { StepperRouteConfig } from "types/Global";
import { StepInfo } from "../types";

export const mapStepConfigs = (
  config: StepperRouteConfig[]
): Map<string, StepInfo> => {
  const map = new Map<string, StepInfo>();
  let last = "";
  const mapStep = (routeConfig: StepperRouteConfig) => {
    const stepInfo: StepInfo = {
      stepNumber: routeConfig.stepNumber || "",
      stepName: routeConfig.name || "",
      stepLabel : routeConfig.menuText  || "",
      prev: undefined,
      next: undefined,
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
