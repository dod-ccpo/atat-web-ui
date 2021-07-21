export interface Portfolios {
  [key: string]: Portfolio;
}
export interface Portfolio {
  id: string;
  name: string;
  description: string;
  csp_provisioning_status: string;
  dod_component: string[];
  portfolio_managers: string[];
  applications: Application[];
}
export interface Application {
  id: string;
  name: string;
  description: string;
  environments: Environment[];
}
export interface Environment {
  id: string;
  name: string;
  funding_source: string[];
}
