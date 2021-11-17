import { Module } from "vuex";
import { RootState } from "@/store/types";
import TaskOrdersState from "./types";
import { actions } from "./actions";
import { mutations } from "./mutations";
import { getters } from "./getters";

const state: TaskOrdersState = {
  taskOrderModels: [],
};

const taskOrders: Module<TaskOrdersState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

export default taskOrders;
