import { Portfolio, PortfolioDraft } from "types/Portfolios";

export default interface PortfoliosStoreState {
  portfolios: Portfolio[];
  portfolioDrafts: PortfolioDraft[];
}
