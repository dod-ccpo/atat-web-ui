import Vue from "vue";
import { Commit } from "vuex";
import { Portfolio, PortfolioDraft } from "types/Portfolios";
import { portfoliosApi } from "@/api";
import PortfoliosStoreState from "./PortfolioStoreState";

const state: PortfoliosStoreState = {
  portfolios: [],
  portfolioDrafts: [],
};

/*
  ███████████████████████████████████████████████████████████████████████████

  ███    ███ ██    ██ ████████  █████  ████████ ██  ██████  ███    ██ ███████
  ████  ████ ██    ██    ██    ██   ██    ██    ██ ██    ██ ████   ██ ██
  ██ ████ ██ ██    ██    ██    ███████    ██    ██ ██    ██ ██ ██  ██ ███████
  ██  ██  ██ ██    ██    ██    ██   ██    ██    ██ ██    ██ ██  ██ ██      ██
  ██      ██  ██████     ██    ██   ██    ██    ██  ██████  ██   ████ ███████

  ███████████████████████████████████████████████████████████████████████████
  */

const updatePortfolioDrafts = (
  state: PortfoliosStoreState,
  portfolioDrafts: PortfolioDraft[]
) => {
  Vue.set(state, "portfolioDrafts", [...portfolioDrafts]);
};

const doDeletePortfolioDraft = (
  state: PortfoliosStoreState,
  draftId: string
) => {
  const portfololioIndex = state.portfolios.findIndex(
    (p: Portfolio) => p.id === draftId
  );

  if (portfololioIndex > -1) {
    state.portfolios.splice(portfololioIndex, 1);
  }
};

/*
  ██████████████████████████████████████████████████████

   █████   ██████ ████████ ██  ██████  ███    ██ ███████
  ██   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ███████ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██   ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ██   ██  ██████    ██    ██  ██████  ██   ████ ███████

  ██████████████████████████████████████████████████████
  */

const loadPortfolioDrafts = async ({
  commit,
}: {
  commit: Commit;
}): Promise<void> => {
  const portfolioDrafts = await portfoliosApi.getAll();
  commit("updatePortfolioDrafts", portfolioDrafts);
};

/*
  ██████████████████████████████████████████████████████████

   ██████  ███████ ████████ ████████ ███████ ██████  ███████
  ██       ██         ██       ██    ██      ██   ██ ██
  ██   ███ █████      ██       ██    █████   ██████  ███████
  ██    ██ ██         ██       ██    ██      ██   ██      ██
   ██████  ███████    ██       ██    ███████ ██   ██ ███████

  */

const getAllPortfolios = (state: PortfoliosStoreState): Portfolio[] => {
  return state.portfolios;
};

const getPortfolioById =
  (state: PortfoliosStoreState) =>
  (id: string): PortfolioDraft | undefined => {
    const values = Object.values(state.portfolioDrafts);
    const portfoliobyId = values.filter((portfolio) => portfolio.id === id);
    if (portfoliobyId.length > 0) {
      return portfoliobyId[0];
    } else {
      return undefined;
    }
  };

export default {
  namespaced: true,
  mutations: {
    updatePortfolioDrafts,
    doDeletePortfolioDraft,
  },
  actions: {
    loadPortfolioDrafts,
  },
  getters: {
    getAllPortfolios,
    getPortfolioById,
  },
};
