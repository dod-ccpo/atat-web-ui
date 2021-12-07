import { ActionContext, ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import ApplicationsState from "./types";
import { portfoliosApi } from "@/api";
import {
  Application,
  ApplicationModel,
  EnvironmentModel,
  OperatorModel,
} from "types/Portfolios";
import { mapApplications, mapOperators } from "./helpers";
import { validateHasAdminOperators } from "@/validation/application";

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
  { commit, state, rootGetters }: ActionContext<ApplicationsState, RootState>,
  id: string
): Promise<void> => {
  try {
    commit("deleteApplication", id);
    const applicationModels = state.applicationModels;
    const portfolioOperators = state.portfolioOperators;
    const currentPortfolioId = rootGetters["wizard/currentPortfolioId"];
    await postData(applicationModels, portfolioOperators, currentPortfolioId);
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
  commit("updateRootAdminInfo", { index, display_name, email });
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
  commit("updateApplicationOperatorInfo", {
    applicationId,
    access,
    display_name,
    email,
    originalEmail,
  });
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
  commit("updateEnvironmentOperatorInfo", {
    applicationId,
    display_name,
    email,
    originalEmail,
    updatedEnvs,
  });
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

export const postData = async (
  applicationModels: ApplicationModel[],
  operatorModels: OperatorModel[],
  portfolioId: string
): Promise<void> => {
  if (applicationModels.length) {
    const applications = mapApplications(applicationModels);
    const operators = mapOperators(operatorModels);

    const data = {
      operators: operators,
      applications: applications,
    };
    await portfoliosApi.saveApplications(portfolioId, data);
  }
};

const saveToServer = async (
  { state }: ActionContext<ApplicationsState, RootState>,
  portfolioId: string
): Promise<void> => {
  const applicationModels = state.applicationModels;
  const portfolioOperators = state.portfolioOperators;
  await postData(applicationModels, portfolioOperators, portfolioId);
};

const validateAdminOperators = ({
  state,
}: ActionContext<ApplicationsState, RootState>): boolean[] => {
  const applications = state.applicationModels;
  const operators = state.portfolioOperators;
  return validateHasAdminOperators(operators, applications);
};

const setPortfolioHasHadMembersAdded = (
  { commit }: { commit: Commit },
  membersAdded: boolean
): void => {
  commit("setPortfolioHasHadMembersAdded", membersAdded);
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
  saveToServer,
  validateAdminOperators,
  setPortfolioHasHadMembersAdded,
};
