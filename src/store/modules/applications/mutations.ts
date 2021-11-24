import Vue from "vue";
import {
  Application,
  ApplicationModel,
  EnvironmentModel,
  OperatorModel,
} from "types/Portfolios";
import { MutationTree } from "vuex";
import ApplicationsState from "./types";
import { generateUid, getEntityIndex } from "@/helpers";

const setCurrentApplicationId = (
  state: ApplicationsState,
  id: string
): void => {
  state.currentApplicationId = id;
};

const setCurrentApplications = (
  state: ApplicationsState,
  applications: Application[]
): void => {
  const applicationModels = applications.map((application) => {
    const applicationModel: ApplicationModel = {
      ...application,
      id: generateUid(),
      operators: application.operators
        ? application.operators.map((operator) => {
            return {
              ...operator,
              id: generateUid(),
            };
          })
        : [],
      environments: application.environments.map((environment) => {
        return {
          ...environment,
          id: generateUid(),
          operators: environment.operators
            ? environment.operators.map((operator) => {
                return {
                  ...operator,
                  id: generateUid(),
                };
              })
            : [],
        };
      }),
    };

    return applicationModel;
  });

  Vue.set(state, "applicationModels", applicationModels);
};

const addApplication = (
  state: ApplicationsState,
  model: ApplicationModel
): void => {
  state.applicationModels.push(model as never);
};

const updateApplication = (
  state: ApplicationsState,
  { index, model }: { index: number; model: ApplicationModel }
): void => {
  Vue.set(state.applicationModels, index, model);
};

const deleteApplication = (state: ApplicationsState, id: string): void => {
  const index = getEntityIndex(
    state.applicationModels,
    (application: ApplicationModel) => application.id === id
  );

  if (index > -1) {
    state.applicationModels.splice(index, 1);
  } else {
    throw new Error("could not delete application order with id: " + id);
  }
};

const updateEnvironmentOperators = (
  state: ApplicationsState,
  { appId, environments }: { appId: string; environments: EnvironmentModel[] }
) => {
  const index = getEntityIndex(
    state.applicationModels,
    (application: ApplicationModel) => application.id === appId
  );
  const appModel: ApplicationModel = state.applicationModels[index];
  environments.forEach((env: EnvironmentModel) => {
    const envId = env.id;
    const index = getEntityIndex(
      appModel.environments,
      (environment: EnvironmentModel) => environment.id === envId
    );
    const envModel: EnvironmentModel = appModel.environments[index];
    if (Object.prototype.hasOwnProperty.call(envModel, "operators")) {
      envModel.operators.push(...env.operators);
    } else {
      envModel.operators = env.operators;
    }
  });
};

const updateRootAdminInfo = (
  state: ApplicationsState,
  {
    index,
    display_name,
    email,
  }: { index: number; display_name: string; email: string }
): void => {
  const portfolioOperators: OperatorModel[] = state.portfolioOperators;
  portfolioOperators[index].display_name = display_name;
  portfolioOperators[index].email = email;
};

const updateApplicationOperatorInfo = (
  state: ApplicationsState,
  {
    applicationId,
    access,
    display_name,
    email,
    originalEmail,
  }: {
    applicationId: string;
    access: string;
    display_name: string;
    email: string;
    originalEmail: string;
  }
): void => {
  const apps: ApplicationModel[] = state.applicationModels;
  const appIndex = apps.map((a) => a.id).indexOf(applicationId);
  const app: ApplicationModel = apps[appIndex];
  const appOperators: OperatorModel[] = app.operators || [];
  const opIndex = appOperators.map((o) => o.email).indexOf(originalEmail);
  if (opIndex > -1) {
    // if existing, update info
    appOperators[opIndex].display_name = display_name;
    appOperators[opIndex].email = email;
    appOperators[opIndex].access = access;
  } else {
    // if new, push into array
    const newOp: OperatorModel = {
      display_name: display_name,
      email: email,
      access: access,
      id: generateUid(),
    };
    appOperators.push(newOp);
  }
  // remove member from environment-level access if any
  const envs: EnvironmentModel[] = app.environments;
  envs.forEach((env) => {
    const ops: OperatorModel[] = env.operators || [];
    const newOps = ops.filter((o) => o.email !== originalEmail);
    ops.splice(0, ops.length, ...newOps);
  });
};

const updateEnvironmentOperatorInfo = (
  state: ApplicationsState,
  {
    applicationId,
    display_name,
    email,
    originalEmail,
    updatedEnvs,
  }: {
    applicationId: string;
    display_name: string;
    email: string;
    originalEmail: string;
    updatedEnvs: any;
  }
): void => {
  const apps: ApplicationModel[] = state.applicationModels;
  const appIndex = apps.map((a) => a.id).indexOf(applicationId);
  const app: ApplicationModel = apps[appIndex];
  const appOperators: OperatorModel[] = app.operators || [];
  // remove from application operators if member was previously app operator
  if (appOperators.length) {
    const appOpIndex = appOperators.findIndex((a) => a.email === originalEmail);
    if (appOpIndex > -1) {
      appOperators.splice(appOpIndex, 1);
    }
  }
  // assign new environment access
  const envs: EnvironmentModel[] = app.environments || [];
  if (envs.length) {
    envs.forEach((envInModel) => {
      const ops: OperatorModel[] = envInModel.operators || [];
      const opIndex = ops.findIndex((o) => o.email === originalEmail);
      // find env id in updatedEnvs
      const updatedEnvIndex = updatedEnvs.findIndex(
        (u: any) => u.env_id === envInModel.id
      );
      const updatedInfo = updatedEnvs[updatedEnvIndex];
      if (opIndex > -1) {
        if (updatedInfo.role_value === "no_access") {
          // remove if found in operators for this env
          const newOps = ops.filter((o) => o.email !== originalEmail);
          ops.splice(0, ops.length, ...newOps);
        } else {
          // update env operator info
          ops[opIndex].display_name = display_name;
          ops[opIndex].email = email;
          ops[opIndex].access = updatedInfo.role_value;
        }
      } else {
        // add member to this environment operators
        const newOp = {
          display_name: display_name,
          email: email,
          access: updatedInfo.role_value,
          id: generateUid(),
        };
        ops.push(newOp);
      }
    });
  }
};

const updateApplicationOperators = (
  state: ApplicationsState,
  { appId, operators }: { appId: string; operators: OperatorModel[] }
): void => {
  const index = getEntityIndex(
    state.applicationModels,
    (application: ApplicationModel) => application.id === appId
  );
  const appModel: ApplicationModel = state.applicationModels[index];
  if (Object.prototype.hasOwnProperty.call(appModel, "operators")) {
    appModel.operators.push(...operators);
  } else {
    appModel.operators = operators;
  }
};

const updateRootAdministrators = (
  state: ApplicationsState,
  operators: OperatorModel[]
): void => {
  const rootAdmins: OperatorModel[] = state.portfolioOperators;
  rootAdmins.push(...operators);
};

const initializeRootAdministrators = (state: ApplicationsState): void => {
  Vue.set(state, "portfolioOperators", []);
};

const initialize = (state: ApplicationsState): void => {
  Vue.set(state, "applicationModels", []);
  Vue.set(state, "portfolioOperators", []);
};

export const mutations: MutationTree<ApplicationsState> = {
  initialize,
  setCurrentApplicationId,
  setCurrentApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  updateEnvironmentOperators,
  updateApplicationOperators,
  updateRootAdminInfo,
  updateApplicationOperatorInfo,
  updateEnvironmentOperatorInfo,
  updateRootAdministrators,
  initializeRootAdministrators,
};
