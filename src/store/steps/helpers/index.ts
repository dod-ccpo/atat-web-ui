import { StepperRouteConfig } from "types/Global";
import { StepInfo } from "../types";

const buildStepInfo = (config: StepperRouteConfig, steps: StepInfo[]) => {
  const pushStep = (config: StepperRouteConfig) => {
    const stepInfo: StepInfo = {
      stepNumber: config.stepNumber || "",
      stepName: config.name || "",
      prev: undefined,
      next: undefined,
    };

    const length = steps.push(stepInfo);

    if (length >= 2) {
      const prev = steps[length - 2];
      prev.next = stepInfo;
      stepInfo.prev = prev;
    }
  };

  pushStep(config);

  if (config.children) {
    config.children.forEach((child) => buildStepInfo({
        ...child,
        stepNumber: config.stepNumber,
    }, steps));
  }
};

export const buildStepList = (
  stepperRouteConfigs: StepperRouteConfig[]
): StepInfo[] => {
  const steps: StepInfo[] = [];
  stepperRouteConfigs.forEach((step) => buildStepInfo(step, steps));
  return steps;
};
