import Vue from "vue";
import { generateUid, getEntityIndex } from "@/helpers";
import { TaskOrder } from "types/Portfolios";
import { TaskOrderModel } from "types/Wizard";
import { MutationTree } from "vuex";
import TaskOrdersState from "./types";

const setCurrentTaskOrders = (
  state: TaskOrdersState,
  taskOrders: TaskOrder[]
): void => {
  const taskOrderModels = taskOrders.map((taskOrder) => {
    const taskOrderModel: TaskOrderModel = {
      id: generateUid(),
      ...taskOrder,
      task_order_file: {
        id: taskOrder.task_order_file.id,
        name: taskOrder.task_order_file.name,
        created_at: "",
        updated_at: "",
        size: 0,
        status: "",
      },
      signed: true, // that the task order is signed is implicitly true
    };
    return taskOrderModel;
  });

  Vue.set(state, "taskOrderModels", taskOrderModels);
};

const addTaskOrder = (state: TaskOrdersState, model: TaskOrderModel): void => {
  state.taskOrderModels.push(model);
};

const updateTaskOrder = (
  state: TaskOrdersState,
  { index, model }: { index: number; model: TaskOrderModel }
) => {
  Vue.set(state.taskOrderModels, index, model);
};

const deleteTaskOrder = (state: TaskOrdersState, id: string): void => {
  const index = getEntityIndex(
    state.taskOrderModels,
    (taskOrder: TaskOrderModel) => taskOrder.id === id
  );

  if (index > -1) {
    state.taskOrderModels.splice(index, 1);
  } else {
    throw new Error("could not delete task order with id: " + id);
  }
};

const initialize = (state: TaskOrdersState): void => {
  Vue.set(state, "taskOrderModels", []);
};

export const mutations: MutationTree<TaskOrdersState> = {
  setCurrentTaskOrders,
  addTaskOrder,
  updateTaskOrder,
  deleteTaskOrder,
  initialize,
};
