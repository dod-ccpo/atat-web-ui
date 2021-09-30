import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const apiUrl =
  "https://gj78s0sep8.execute-api.us-gov-west-1.amazonaws.com/prod/";
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
