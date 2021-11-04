import Vue from "vue";
import { MutationTree } from "vuex";
import ApplicationsState from "./types";

const setCurrentApplicationId = (
  state: ApplicationsState,
  id: string
): void => {
  state.currentApplicationId = id;
};


export const mutations: MutationTree<ApplicationsState> = {
  setCurrentApplicationId,
};
