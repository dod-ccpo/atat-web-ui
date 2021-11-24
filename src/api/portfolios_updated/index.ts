import { AxiosError } from "axios";
import ApiClient from "../apiClient";
import { PortfolioSummary } from "types/Portfolio";

export class PorfoliosApi {
  client: ApiClient = new ApiClient("portfolios");

  async getPortfolioSummaries(
    offset?: number,
    limit?: number
  ): Promise<PortfolioSummary> {
    const response = await this.client.getRequest({
      params: {
        offset: offset,
        limit: limit,
      },
    });
  }
}
