import { Portfolio } from "types/Portfolios";
import { TaskOrderDetails, TaskOrderFile } from "types/Wizard";
import ApiClient from "../apiClient";

export default class PortfolioDraftsApi {
  client: ApiClient = new ApiClient("portfolioDrafts");

  public async getAll(): Promise<Portfolio[]> {
    const response = await this.client.get();

    if (response.status === 200) {
      return response.data.map((item: any) => this.mapPortfolio(item));
    } else {
      throw new Error(response.statusText);
    }
  }

  private mapPortfolio(item: any): Portfolio {
    const mapTaskOrder = (taskOrderItem: any): TaskOrderDetails => {
      if (taskOrderItem) {
        const taskOrderFile: TaskOrderFile = {
          id: taskOrderItem.id || "-1",
          name: taskOrderItem.name || "",
          description: taskOrderItem.description || "",
          created_at: "",
          updated_at: "",
          size: 20000,
          status: "",
        };

        const taskOrder: TaskOrderDetails = {
          task_order_number: taskOrderItem.task_order_number,
          clins: taskOrderItem.clins,
          task_order_file: taskOrderFile,
        };

        return taskOrder;
      }

      throw new Error("invalid item");
    };

    const portfolio: Portfolio = {
      id: item.id,
      description: item.portfolio_step ? item.portfolio_step.description : "",
      name: item.portfolio_step ? item.portfolio_step.name : "",
      dod_component: item.portfolio_step
        ? item.portfolio_step.dod_components
        : [],
      csp_provisioning_status: item.status,
      portfolio_managers: item.portfolio_step
        ? item.portfolio_step.portfolio_managers
        : [],
      taskOrders: item.funding_step ? [mapTaskOrder(item.funding_step)] : [],
      applications: [],
    };

    return portfolio;
  }
}
