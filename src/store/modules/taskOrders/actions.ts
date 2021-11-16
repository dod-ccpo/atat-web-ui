import { ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import TaskOrdersState from "./types";
import { TaskOrderModel } from "types/Wizard";
import { TaskOrder } from "types/Portfolios";

const addTaskOrder = (
  { commit }: { commit: Commit },
  model: TaskOrderModel
): void => {
  commit("addTaskOrder", model);
};

const updateTaskOrder = (
  { commit }: { commit: Commit },
  { index, model }: { index: number; model: TaskOrderModel }
): void => {
  commit("updateTaskOrder", { index, model });
};

const deleteTaskOrder = ({ commit }: { commit: Commit }, id: string): void => {
  commit("deleteTaskOrder", id);
};

const setCurrentTaskOrders = (
  {commit}:{commit: Commit},
  taskOrders: TaskOrder[]
): void => {

    debugger;

    commit('setCurrentTaskOrders', taskOrders);
}

export const actions: ActionTree<TaskOrdersState, RootState> = {
  addTaskOrder,
  updateTaskOrder,
  deleteTaskOrder,
  setCurrentTaskOrders,
};
