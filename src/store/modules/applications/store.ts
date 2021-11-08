import { Module } from "vuex";
import ApplicationsState from "./types/index";
import { RootState } from "@/store/types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const state: ApplicationsState = {
  applicationModels: [],
  portfolioOperators: [],
  currentApplicationId: "",
};

const applications: Module<ApplicationsState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default applications;
