import { ApplicationModel, OperatorModel } from "types/Portfolios";

export const validOperator = (operator: OperatorModel): boolean => {
  return (
    operator.access !== "" &&
    operator.display_name !== "" &&
    operator.email != ""
  );
};

export const validateApplication = (application: ApplicationModel): boolean => {
  const isNameValid =
    application.name != "" &&
    application.name.length <= 100 &&
    application.name.length >= 4;
  const hasEnvironments =
    application.environments && application.environments.length > 0;

  const uniqueNames = new Set(application.environments.map((v) => v.name));
  const noDuplicateEnvironments =
    uniqueNames.size == application.environments.length;

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
