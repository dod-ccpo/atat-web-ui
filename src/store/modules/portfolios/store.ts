import { Module } from "vuex";
import PortfoliosState from "./types/index";
import { RootState } from "@/store/types";
import { actions } from "./actions";
import { mutations } from "./mutations";

const state: PortfoliosState = {
  portfolioDrafts: [],
};

const portfolios: Module<PortfoliosState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default portfolios;
