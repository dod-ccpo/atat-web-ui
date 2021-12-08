import { ActionContext, ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import TaskOrdersState from "./types";
import { TaskOrderModel } from "types/Wizard";
import { TaskOrder } from "types/Portfolios";
import { portfoliosApi } from "@/api";
import { mapTaskOrders } from "./helpers";
import taskOrders from "./store";

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

const deleteTaskOrder = async (
  { commit, state, rootGetters }: ActionContext<TaskOrdersState, RootState>,
  id: string
): Promise<void> => {
  commit("deleteTaskOrder", id);
  const taskOrderModels = state.taskOrderModels;
  const currentPortfolioId = rootGetters["wizard/currentPortfolioId"];
  await postData(taskOrderModels, currentPortfolioId);
};

const setCurrentTaskOrders = (
  { commit }: { commit: Commit },
  taskOrders: TaskOrder[]
): void => {
  commit("setCurrentTaskOrders", taskOrders);
};

const postData = async (
  taskOrderModels: TaskOrderModel[],
  portfolioId: string
): Promise<void> => {
  const taskOrders = {
    task_orders: mapTaskOrders(taskOrderModels),
  };
  await portfoliosApi.saveFunding(portfolioId, taskOrders);
};

const saveToServer = async (
  { state }: ActionContext<TaskOrdersState, RootState>,
  portfolioId: string
): Promise<void> => {
  const taskOrderModels = state.taskOrderModels;
  await postData(taskOrderModels, portfolioId);
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
