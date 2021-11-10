import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { retrieveSessionConfig } from "@/atat-config-builder";

const apiUrl = retrieveSessionConfig()?.apiUrl;
const instance = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default class ApiClient {
  private endpoint: string;
  private instance: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.instance = instance;
  }

  public get(url?: string, config?: AxiosRequestConfig): AxiosPromise {
    url = url ? `${this.endpoint}/${url}` : this.endpoint;
    return instance.get(url, config);
  }

  public post(
    url?: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    url = url ? `${this.endpoint}/${url}` : this.endpoint;
    return instance.post(url, data, config);
  }

  public delete(url?: string, config?: AxiosRequestConfig): AxiosPromise {
    url = url ? `${this.endpoint}/${url}` : this.endpoint;
    return instance.delete(url, config);
  }
}
