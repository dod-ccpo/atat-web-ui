import { ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import ApplicationsState from "./types";
import { portfoliosApi } from "@/api";
import {
  Application,
  ApplicationModel,
  EnvironmentModel,
} from "types/Portfolios";

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

export const actions: ActionTree<ApplicationsState, RootState> = {
  setCurrentApplicationId,
  setCurrentApplications,
  updateApplication,
  deleteApplication,
  updateEnvironmentOperators,
};
