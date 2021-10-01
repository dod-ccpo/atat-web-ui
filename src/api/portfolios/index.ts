import { AxiosError } from "axios";
import { Portfolio } from "types/Portfolios";
import { TaskOrderDetails, TaskOrderFile, TaskOrders } from "types/Wizard";
import ApiClient from "../apiClient";

export default class PortfolioDraftsApi {
  client: ApiClient = new ApiClient("portfolioDrafts");

  /**
   *
   * @returns all portfolio drafts
   */
  public async getAll(): Promise<Portfolio[]> {
    const response = await this.client.get();

    if (response.status === 200) {
      return response.data.map((item: any) => this.mapPortfolio(item));
    } else {
      throw new Error(response.statusText);
    }
  }

  /**
   *
   * @returns a new Portfolio Draft Id
   */
  public async createDraft(): Promise<string> {
    const response = await this.client.post();
    if (response.status === 201) {
      //just returning the draft id here for the moment
      return response.data.id;
    } else {
      throw new Error(response.statusText);
    }
  }

  public async getDraft(id: string): Promise<string | null> {
    try {
      const response = await this.client.get(`${id}`);
      if (response.status !== 200) {
        throw Error(`error occured saving portfolio draft with id ${id}`);
      }
      const data: any = response.data;
      return data.id;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError) {
        console.log(
          `failed with msg: ${axiosError.message} status code: ${axiosError.code}`
        );
      }
      console.log(`exception: ${error}`);
    }

    return null;
  }

  public async deleteDraft(id: string): Promise<void> {
    const response = await this.client.delete(id);
    if (response.status !== 204) {
      throw Error(`error deleting portfolio with id:  ${id}`);
    }
  }

  public async savePortfolio(id: string, model: any): Promise<void> {
    //build api draft model
    const data = {
      name: model.name,
      description: model.description,
      dod_components: model.dod_components,
      portfolio_managers: model.portfolio_managers || [],
    };

    const response = await this.client.post(`${id}/portfolio`, data);
    if (response.status !== 201) {
      throw Error(`error occured saving portfolio draft with id ${id}`);
    }
  }

  public async getPortfolio(id: string): Promise<Portfolio | null> {
    //todo: handle scenario where no portfolio is returned (e.g. 404)
    try {
      const response = await this.client.get(`${id}/portfolio`);
      if (response.status !== 200) {
        throw Error(`error occured saving portfolio draft with id ${id}`);
      }

      const data: any = response.data;
      const portfolioDraft: Portfolio = {
        id: id,
        name: data.name,
        description: data.description,
        dod_component: data.dod_components,
        portfolio_managers: data.portfolio_managers,
        csp_provisioning_status: "",
        applications: [],
      };

      return portfolioDraft;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError) {
        console.log(
          `failed with msg: ${axiosError.message} status code: ${axiosError.code}`
        );
      }
      console.log(`exception: ${error}`);
    }

    return null;
  }

  public async createFunding(id: string, model: any): Promise<void> {
    const data = {
      task_orders: model.task_orders,
    };

    const response = await this.client.post(`${id}/funding`, data);
    if (response.status !== 201) {
      throw Error(
        `error occured saving funding details for portfolio draft with id ${id}`
      );
    }
  }

  public async getFunding(id: string): Promise<TaskOrders | null> {
    try {
      const response = await this.client.get(`${id}/funding`);
      if (response.status === 404) {
        return null;
      }

      if (response.status !== 200) {
        throw Error(" error occurred retrieving funding details");
      }

      const task_orders = response.data.task_orders;

      return {
        details: task_orders,
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError) {
        console.log(
          `failed with msg: ${axiosError.message} status code: ${axiosError.code}`
        );
      }
      console.log(`exception: ${error}`);
    }
    return null;
  }

  public async getTaskOrderFile(fileId: string): Promise<TaskOrderFile | null> {
    try {
      const response = await this.client.get(`taskOrderFiles/${fileId}`);
      if (response.status === 404) {
        return null;
      }

      if (response.status !== 200) {
        throw Error(" error occurred retrieving funding details");
      }

      const data = response.data;

      const taskOrderFile: TaskOrderFile = {
        name: data.name,
        updated_at: data.updated_at,
        created_at: data.created_at,
        id: data.id,
        size: data.size,
        status: data.status,
      };

      return taskOrderFile;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError) {
        console.log(
          `failed with msg: ${axiosError.message} status code: ${axiosError.code}`
        );
      }
      console.log(`exception: ${error}`);
    }
    return null;
  }

  private mapPortfolio(item: any): Portfolio {
    const mapTaskOrder = (taskOrderItem: any): TaskOrderDetails => {
      if (taskOrderItem) {
        const taskOrderFile: TaskOrderFile = {
          id: taskOrderItem.id || "-1",
          name: taskOrderItem.name || "",
          // description: taskOrderItem.description || "",
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
      name: item.portfolio_step ? item.portfolio_step.name : "Untitled",
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
