import { Portfolio, PortfolioDraft } from "types/Portfolios";

export default interface PortfoliosState {
  portfolios: Portfolio[];
  portfolioDrafts: PortfolioDraft[];
}
