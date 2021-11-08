import Vue from "vue";
import { PortfolioDraft } from "types/Portfolios";
import { MutationTree } from "vuex";
import PortfoliosState from "./types";

const updatePortfolioDrafts = (
  state: PortfoliosState,
  portfolioDrafts: PortfolioDraft[]
): void => {
  Vue.set(state, "portfolioDrafts", [...portfolioDrafts]);
};

const deletePortfolioDraft = (
  state: PortfoliosState,
  draftId: string
): void => {
  const portfololioIndex = state.portfolioDrafts.findIndex(
    (p: PortfolioDraft) => p.id === draftId
  );

  if (portfololioIndex > -1) {
    state.portfolioDrafts.splice(portfololioIndex, 1);
  }
};

export const mutations: MutationTree<PortfoliosState> = {
  updatePortfolioDrafts,
  deletePortfolioDraft,
};
