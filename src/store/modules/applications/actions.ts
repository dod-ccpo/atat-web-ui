import { ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import ApplicationsState from "./types";
import { portfoliosApi } from "@/api";
import {
  Application,
  ApplicationModel,
  EnvironmentModel,
  OperatorModel,
} from "types/Portfolios";

const initialize = ({ commit }: { commit: Commit }): void => {
  commit("initialize");
};

const setCurrentApplicationId = (
  { commit }: { commit: Commit },
  id: string
): void => {
  commit("setCurrentApplicationId", id);
};

const setCurrentApplications = (
  { commit }: { commit: Commit },
  applications: Application[]
): void => {
  commit("setCurrentApplications", applications);
};

const addApplication = (
  { commit }: { commit: Commit },
  model: ApplicationModel
): void => {
  commit("addApplication", model);
};

const updateApplication = (
  { commit }: { commit: Commit },
  { index, model }: { index: number; model: ApplicationModel }
): void => {
  commit("updateApplication", { index, model });
};

const deleteApplication = async (
  {
    commit,
    state,
    rootState,
  }: { commit: Commit; state: ApplicationsState; rootState: RootState },
  id: string
): Promise<void> => {
  try {
    commit("deleteApplication", id);
    //todo fix reference to root store here
    //commit("doInitializeStepModel", [createStepThreeModel(), 3]);

    const _applications = state.applicationModels.map((model: Application) => {
      const application: Application = {
        ...model,
      };

      return application;
    });

    const data = {
      applications: _applications,
    };

    await portfoliosApi.saveApplications(rootState.currentPortfolioId, data);
  } catch (error) {
    console.log(error);
  }
};

const updateEnvironmentOperators = (
  { commit }: { commit: Commit },
  { appId, environments }: { appId: string; environments: EnvironmentModel[] }
): void => {
  commit("updateEnvironmentOperators", { appId, environments });
};

const updateRootAdminInfo = (
  { commit }: { commit: Commit },
  {
    index,
    display_name,
    email,
  }: { index: number; display_name: string; email: string }
): void => {
  commit("updateRootAdminInfo", [index, display_name, email]);
};

const updateApplicationOperatorInfo = (
  { commit }: { commit: Commit },
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
  commit("updateApplicationOperatorInfo", [
    applicationId,
    access,
    display_name,
    email,
    originalEmail,
  ]);
};

const updateEnvironmentOperatorInfo = (
  { commit }: { commit: Commit },
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
  commit("updateEnvironmentOperatorInfo", [
    applicationId,
    display_name,
    email,
    originalEmail,
    updatedEnvs,
  ]);
};

const updateApplicationOperators = (
  { commit }: { commit: Commit },
  { appId, operators }: { appId: string; operators: OperatorModel[] }
): void => {
  commit("updateApplicationOperators", { appId, operators });
};

const updateRootAdministrators = (
  { commit }: { commit: Commit },
  operators: OperatorModel[]
): void => {
  commit("updateRootAdministrators", operators);
};

const initializeRootAdministrators = ({ commit }: { commit: Commit }): void => {
  commit("initializeRootAdministrators");
};

export const actions: ActionTree<ApplicationsState, RootState> = {
  initialize,
  setCurrentApplicationId,
  setCurrentApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  updateEnvironmentOperators,
  updateApplicationOperators,
  updateRootAdministrators,
  updateRootAdminInfo,
  updateApplicationOperatorInfo,
  updateEnvironmentOperatorInfo,
  initializeRootAdministrators,
};
