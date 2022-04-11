import { AxiosRequestConfig, AxiosResponse } from "axios";
import baseApi from "./base";

export class TableApiBase<TableDTO> extends baseApi {
  private tableName: string;

  constructor(tableName: string) {
    super();
    this.tableName = tableName;
  }

  protected get endPoint(): string {
    return `/now/table/${this.tableName}`;
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
   * Creates a TableDTO object
   * @param data TableDTO
   * @returns TableDTO
   */
  async create(data?: TableDTO): Promise<TableDTO> {
    try {
      const response = await this.post<TableDTO>(data);
      if (response.status === 201) {
        const { result } = response.data;
        return result as TableDTO;
      } else {
        throw new Error(`unable to create ${this.tableName}`);
      }
    } catch (error) {
      throw new Error(`unable to create ${this.tableName} : ${error}`);
    }
  }

  /**
   * Updates a TableDTO object
   * @param sys_id the system id of the TableDTO object
   * @param data TableDTO
   * @returns updated TableDTO object
   */
  async update(sys_id: string, data: TableDTO): Promise<TableDTO> {
    try {
      const response = await this.patch(sys_id, data);
      if (response.status === 200) {
        const { result } = response.data;
        return result as TableDTO;
      } else {
        throw new Error(`unable to update ${this.tableName}`);
      }
    } catch (error) {
      throw new Error(`unable to update ${this.tableName} : ${error}`);
    }
  }

  /**
   * Retrieves TableDTO object from stored Table data
   * @param sys_id the system id of the Table DTO object to retrieve
   * @returns the retrieved TableDTO object
   */
  async retrieve(sys_id: string): Promise<TableDTO> {
    try {
      const response = await this.get(sys_id);
      if (response.status === 200) {
        const { result } = response.data;
        return result as TableDTO;
      } else {
        throw new Error(
          `unable to retrieve ${this.tableName} with sys_id: ${sys_id}`
        );
      }
    } catch (error) {
      throw new Error(`unable to retrieve ${this.tableName} : ${error}`);
    }
  }

  async all(config?: AxiosRequestConfig): Promise<TableDTO[]> {
    try {
      const response = await this.getAll(config);
      if (response.status === 200) {
        const { result } = response.data;
        return result as TableDTO[];
      } else {
        throw new Error(`unable to retrieve ${this.tableName}`);
      }
    } catch (error) {
      throw new Error(`unable to retrieve ${this.tableName} : ${error}`);
    }
  }
}
