import {TableApiBase} from "@/api/tableApiBase";
import { ApiBase } from "../apiBase";
import {PortfolioSummaryDTO, PortfolioSummaryMetadataAndDataDTO} from "@/api/models";
import { AxiosRequestConfig, AxiosError } from "axios";
export const TABLENAME = "x_g_dis_atat_portfolio";
export const APINAME = "x_g_dis_atat/portfolios";

export class PortfolioTableApi extends TableApiBase<PortfolioSummaryDTO> {
  constructor() {
    super(TABLENAME);
  }
}

export class PortfolioApi extends ApiBase{
  constructor(){
    super(APINAME)
  }

  public async getPortfolioSummaryList(
    userSysId: string
  ): Promise<PortfolioSummaryMetadataAndDataDTO> {
    try {
      /* eslint-disable camelcase */
      const config: AxiosRequestConfig = {
        params: {
          userId: userSysId
        }
      }
      /* eslint-enable camelcase */
      const response = await this.instance.get( `${this.endPoint}/summary`, config);
      if (response.status === 200) {
        const { result } = response.data;
        return result;
      } else {
        const { error } = response.data;
        return error;
      }
    } catch(error) {
      const axiosError = error as AxiosError;
      if (axiosError.response !== undefined && axiosError.response.status === 404) {
        return {} as PortfolioSummaryMetadataAndDataDTO;
      }
      throw new Error(error as string)
    }
  }
}
