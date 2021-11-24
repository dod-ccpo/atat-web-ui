import { ApplicationModel, OperatorModel } from "types/Portfolios";

export const validOperator = (operator: OperatorModel): boolean => {
  return (
    operator.access !== "" &&
    operator.display_name !== "" &&
    operator.email !== ""
  );
};

export const validateApplication = (application: ApplicationModel): boolean => {
  const isNameValid =
    application.name !== "" &&
    application.name.length <= 100 &&
    application.name.length >= 4;
  const hasEnvironments =
    application.environments && application.environments.length > 0;

  const uniqueNames = new Set(application.environments.map((v) => v.name));
  const noDuplicateEnvironments =
    uniqueNames.size === application.environments.length;

  const hasValidOperators =
    application.operators.length > 0
      ? application.operators.every((operator) => validOperator(operator))
      : true;

  return (
    isNameValid &&
    hasEnvironments &&
    noDuplicateEnvironments &&
    hasValidOperators
  );
};

export const validateHasAdminOperators = (
  rootAdmins: OperatorModel[], 
  applicationModels: ApplicationModel[]
  ): boolean[] => {
  
  if (rootAdmins && rootAdmins.length) {
    return [true, true];
  }
  let operatorCount = 0;
  // no root admins, check each application for admins
  const validApplicationIndices = [];
  for (let a = 0; a < applicationModels.length; a++) {
    const application = applicationModels[a];
    operatorCount += application.operators.length;

    const hasAppLevelAdmin = application.operators.some((e: OperatorModel) => e.access === "administrator");
    if (hasAppLevelAdmin) {
      // this app has an admin
      validApplicationIndices.push(a);
    } else {
      // check that all environments have an admin
      let allEnvsHaveAdmin = true;
      for (let e = 0; e < application.environments.length; e++) {
        const envOperators: any = application.environments[e].operators;
        operatorCount += envOperators.length;
        if (!envOperators.some((o: OperatorModel) => o.access === "administrator")) {
          allEnvsHaveAdmin = false;
          break;
        }
      }
      if (allEnvsHaveAdmin) {
        validApplicationIndices.push(a);
      }
    }
  }
  const isValid = validApplicationIndices.length === applicationModels.length;
  const isTouched = operatorCount > 0;
  return [isValid, isTouched];
};
