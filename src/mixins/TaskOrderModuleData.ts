import { Component } from "vue-property-decorator";
import Vue from "vue";
import { State, Action, Getter } from "vuex-class";
import TaskOrdersState from "@/store/modules/taskOrders/types";
import { TaskOrderModel } from "types/Wizard";

const namespace = "taskOrders";

@Component({})
export default class TaskOrderModuleData extends Vue {
  @State(namespace) taskOrdersState!: TaskOrdersState;

  @Getter("taskOrders", { namespace })
  taskOrders!: TaskOrderModel[];
}
