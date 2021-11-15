import { Module } from "vuex";
import { RootState } from "@/store/types";
import TaskOrdersState from "./types";
// import { actions } from "./actions";
// import { mutations } from "./mutations";

const state: TaskOrdersState = {
  taskOrderModels: [],
};

const taskOrders: Module<TaskOrdersState, RootState> = {
  namespaced: true,
  state,
};

export default taskOrders;
