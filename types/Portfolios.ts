import { TaskOrderDetails } from "./Wizard";

export interface Portfolios {
  [key: string]: Portfolio;
}
export interface Portfolio {
  id: string;
  name: string;
  description: string;
  csp: string;
  csp_provisioning_status: string;
  dod_components: string[];
  portfolio_managers: string[];
  applications: Application[];
  taskOrders?: TaskOrderDetails[];
}

export interface PortFolioDraftDTO {
  id: string;
  name: string;
  description: string;
  csp: string;
  dod_components: string[];
  portfolio_managers: string[];
}

export interface PortfolioDraft {
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  name: string;
  description: string;
  num_portfolio_managers: number;
  num_task_orders: number;
  num_applications: number;
  num_environments: number;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  environments?: Environment[];
  members?: ApplicationMember[];
}
export interface Environment {
  id: string;
  name: string;
  funding_source: string[];
}
// Aplication Members:
export interface ApplicationMember {
  id: string;
  email: string;
  name: string;
  permissions?: ApplicationMemberPermissions[];
  environments_settings?: ApplicationMemberEnvironment[];
}
export interface ApplicationMemberPermissions {
  id: string;
  label: string;
  is_granted: boolean;
}
export interface ApplicationMemberEnvironment {
  id: string;
  label: string;
  accessLevel: "Administrator" | "Contributor" | "No Access";
}

export interface ApplicationDTO {
  environments: EnvironmentsDTO[];
}
export interface EnvironmentsDTO {
  operators: OperatorDTO[];
  name: string;
}
export interface OperatorDTO {
  access: string;
  last_name: string;
  first_name: string;
  email: string;
}
