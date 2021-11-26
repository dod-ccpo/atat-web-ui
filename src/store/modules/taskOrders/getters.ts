import { RootState } from "@/store/types";
import { GetterTree } from "vuex";
import TaskOrdersState from "./types";

export const getters: GetterTree<TaskOrdersState, RootState> = {
  taskOrders: (state) => state.taskOrderModels,
};
