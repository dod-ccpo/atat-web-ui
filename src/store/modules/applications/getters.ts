import { getEntityIndex } from "@/helpers";
import { RootState } from "@/store/types";
import { ApplicationModel } from "types/Portfolios";
import { GetterTree } from "vuex";
import ApplicationsState from "./types";

export const getters: GetterTree<ApplicationsState, RootState> = {
  applications: (state) => state.applicationModels,
  currentApplication: (state) => {
    const applicationIndex = getEntityIndex(
      state.applicationModels,
      (application: ApplicationModel) =>
        application.id === state.currentApplicationId
    );
    return state.applicationModels[applicationIndex];
  },
  portfolioOperators: (state) => state.portfolioOperators,
  portfolioHasHadMembersAdded: (state) => state.portfolioHasHadMembersAdded,
};
