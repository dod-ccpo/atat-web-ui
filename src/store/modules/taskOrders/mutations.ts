import { generateUid } from "@/helpers";
import { TaskOrder } from "types/Portfolios";
import { TaskOrderModel } from "types/Wizard";
import Vue from "vue/types/umd";
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

export const mutations: MutationTree<TaskOrdersState> = {
  setCurrentTaskOrders,
  addTaskOrder,
};
