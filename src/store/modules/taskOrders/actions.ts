import { ActionContext, ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import TaskOrdersState from "./types";
import { TaskOrderModel } from "types/Wizard";
import { TaskOrder } from "types/Portfolios";
import { portfoliosApi } from "@/api";
import { mapTaskOrders } from "./helpers";

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
  { commit }: { commit: Commit },
  taskOrders: TaskOrder[]
): void => {
  commit("setCurrentTaskOrders", taskOrders);
};

const saveToServer = async (
  { state }: ActionContext<TaskOrdersState, RootState>,
  portfolioId: string
): Promise<void> => {
  const taskOrderModels = state.taskOrderModels;
  const taskOrders = {
    task_orders: mapTaskOrders(taskOrderModels),
  };
  await portfoliosApi.saveFunding(portfolioId, taskOrders);
};

const initialize = ({ commit }: { commit: Commit }): void => {
  commit("initialize");
};

export const actions: ActionTree<TaskOrdersState, RootState> = {
  addTaskOrder,
  updateTaskOrder,
  deleteTaskOrder,
  saveToServer,
  setCurrentTaskOrders,
  initialize,
};
