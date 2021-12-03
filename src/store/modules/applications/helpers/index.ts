import {
  ApplicationModel,
  Application,
  OperatorModel,
  Operator,
} from "types/Portfolios";

const mapApplications = (
  applicationModels: ApplicationModel[]
): Application[] => {
  return applicationModels.map((model: ApplicationModel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = model;
    const application: Application = {
      ...baseModel,
      operators: model.operators
        ? model.operators.map((op) => {
            return {
              access: op.access,
              display_name: op.display_name,
              email: op.email,
            };
          })
        : [],
      environments: model.environments.map((env) => {
        return {
          name: env.name,
          operators: env.operators
            ? env.operators.map((op) => {
                return {
                  access: op.access,
                  display_name: op.display_name,
                  email: op.email,
                };
              })
            : [],
        };
      }),
    };

    return application;
  });
};

const mapOperators = (operatorsModels: OperatorModel[]): Operator[] => {
  return operatorsModels.map((operatorModel: OperatorModel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = operatorModel;

    const operator: Operator = {
      ...baseModel,
    };

    return operator;
  });
};
