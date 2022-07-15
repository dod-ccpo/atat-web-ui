/* eslint-disable camelcase */
import { AxiosRequestConfig, AxiosResponse } from "axios";
import baseApi from "./base";

export class ApiBase extends baseApi {
  protected endpointName: string;

  constructor(endpointName: string) {
    super();
    this.endpointName = endpointName;
  }

  protected get endPoint(): string {
    return this.endpointName;
  }

  protected async post<TData>(
    data?: TData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return this.instance.post(this.endPoint, data, config);
  }

  private async get(config:AxiosRequestConfig): Promise<AxiosResponse>{
    return this.instance.get(this.endPoint, config);
  }

  private async getAll(config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(this.endPoint, config);
  }



}
