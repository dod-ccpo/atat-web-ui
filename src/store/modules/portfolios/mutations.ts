import Vue from "vue";
import { Portfolio, PortfolioDraft } from "types/Portfolios";
import { MutationTree } from "vuex";
import PortfoliosState from "./types";

const updatePortfolioDrafts = (
  state: PortfoliosState,
  portfolioDrafts: PortfolioDraft[]
): void => {
  Vue.set(state, "portfolioDrafts", [...portfolioDrafts]);
};

const deletePortfolioDraft = (state: PortfoliosState, draftId: string) => {
  const portfololioIndex = state.portfolios.findIndex(
    (p: Portfolio) => p.id === draftId
  );

  if (portfololioIndex > -1) {
    state.portfolios.splice(portfololioIndex, 1);
  }
};

export const mutations: MutationTree<PortfoliosState> = {
  updatePortfolioDrafts,
  deletePortfolioDraft,
}
