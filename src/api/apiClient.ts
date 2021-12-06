import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { retrieveSessionConfig } from "@/atat-config-builder";
import { Auth } from "aws-amplify";

const apiUrl = retrieveSessionConfig()?.apiUrl;
const instance = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = async (): Promise<string | undefined> => {
  // attempt to retrieve the current session and get the auth token
  // If an exception occurs, the session has expired. Force the user to authenticate
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();

    return token;
  } catch {
    await Auth.federatedSignIn({
      customProvider: "IdP",
    });
  }
};

// Handle adding the authorization header based on the current session
instance.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


interface APIRequest {
  url?: string;
  params?: Record<string, string | number>;
  config?: AxiosRequestConfig;
}

export default class ApiClient {
  private endpoint: string;
  private instance: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.instance = instance;
  }

  // private upwrapResponse<TModel>(response: AxiosPromise<any>):TModel{

  //   try {
  //     const response = await this.client.get(`${id}`);
  //     if (response.status !== 200) {
  //       throw Error(`error occurred retrieving portfolio draft with id ${id}`);
  //     }
  //     const data: any = response.data;
  //     return data.id as string;
  //   } catch (error) {
  //     const axiosError = error as AxiosError;

  //     if (axiosError) {
  //       console.log(
  //         `failed with msg: ${axiosError.message} status code: ${axiosError.code}`
  //       );
  //     }
  //     console.log(`exception: ${error}`);
  //   }

  //   return null;
  // }

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
