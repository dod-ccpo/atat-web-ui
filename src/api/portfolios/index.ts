import { AxiosError } from "axios";
import { NightwatchAssert } from "nightwatch";
import {
  ApplicationDTO,
  Portfolio,
  PortfolioDraft,
  PortFolioDraftDTO,
} from "types/Portfolios";
import { TaskOrderFile, TaskOrders } from "types/Wizard";
import ApiClient from "../apiClient";

export default class PortfolioDraftsApi {
  client: ApiClient = new ApiClient("portfolioDrafts");

  /**
   *
   * @returns all portfolio drafts
   */
  public async getAll(): Promise<PortfolioDraft[]> {
    const response = await this.client.get();

    if (response.status === 200) {
      const portfolioDrafts: PortfolioDraft[] = response.data;
      return portfolioDrafts;
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
        throw Error(`error occurred retrieving portfolio draft with id ${id}`);
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

  public async savePortfolio(
    id: string,
    data: PortFolioDraftDTO
  ): Promise<void> {
    const response = await this.client.post(`${id}/portfolio`, data);
    if (response.status !== 201) {
      throw Error(`error occurred saving portfolio draft with id ${id}`);
    }
  }

  public async getPortfolio(id: string): Promise<Portfolio | null> {
    //todo: handle scenario where no portfolio is returned (e.g. 404)
    try {
      const response = await this.client.get(`${id}/portfolio`);
      if (response.status !== 200) {
        throw Error(`error occurred saving portfolio draft with id ${id}`);
      }

      const data: any = response.data;

      const portfolioDraft: Portfolio = {
        id: id,
        name: data.name,
        description: data.description,
        csp: data.csp,
        dod_components: data.dod_components,
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

  public async saveFunding(id: string, model: any): Promise<void> {
    const data = {
      task_orders: model.task_orders,
    };

    const response = await this.client.post(`${id}/funding`, data);
    if (response.status !== 201) {
      throw Error(
        `error occurred saving funding details for portfolio draft with id ${id}`
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

  public async saveApplication(id: string, data: any): Promise<void> {
    const response = await this.client.post(`${id}/application`, data);
    if (response.status !== 201) {
      throw Error(
        `error occurred saving application details for portfolio draft with id ${id}`
      );
    }
  }

  public async getApplications(id: string): Promise<ApplicationDTO[] | null> {
    try {
      const response = await this.client.get(`${id}/application`);

      if (response.status !== 200) {
        throw Error(
          `error occurred retrieving applications for portfolio draft with id: ${id}`
        );
      }

      const data = response.data as ApplicationDTO[];

      return data;
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
}
