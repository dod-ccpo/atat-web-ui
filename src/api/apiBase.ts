/* eslint-disable camelcase */
import { AxiosRequestConfig, AxiosResponse } from "axios";
import baseApi from "./base";

export class ApiBase<TData> extends baseApi {
  private endpointName: string;

  constructor(endpointName: string) {
    super();
    this.endpointName = endpointName;
  }

  protected get endPoint(): string {
    return `/now/${this.endpointName}`;
  }

  private urlWithSysId(sys_id: string): string {
    return `${this.endPoint}/${sys_id}`;
  }

  private async post<TData>(
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.post(this.endPoint, data, config);
  }

  private async get(
    sys_id: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.get(this.urlWithSysId(sys_id), config);
  }

  private async getAll(config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(this.endPoint, config);
  }

  private async put<TData>(
    sys_id: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.put(this.urlWithSysId(sys_id), this.endPoint, config);
  }

  private async delete(
    sys_id: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.delete(this.urlWithSysId(sys_id), config);
  }

  private async patch<TData>(
    sys_id: string,
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.patch(this.urlWithSysId(sys_id), data, config);
  }

  /**
   * Retrieves TData object from stored Table data
   * @param sys_id the system id of the Table DTO object to retrieve
   * @returns the retrieved TData object
   */
  async retrieve(sys_id: string): Promise<TData> {
    try {
      const response = await this.get(sys_id);
      if (response.status === 200) {
        const { result } = response.data;
        return result as TData;
      } else {
        throw new Error(
          `unable to retrieve ${this.endpointName} with sys_id: ${sys_id}`
        );
      }
    } catch (error) {
      throw new Error(`unable to retrieve ${this.endpointName} : ${error}`);
    }
  }

  async all(config?: AxiosRequestConfig): Promise<TData[]> {
    try {
      const response = await this.getAll(config);
      if (response.status === 200) {
        const { result } = response.data;
        return result as TData[];
      } else {
        throw new Error(`unable to retrieve ${this.endpointName}`);
      }
    } catch (error) {
      throw new Error(`unable to retrieve ${this.endpointName} : ${error}`);
    }
  }
}
