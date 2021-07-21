import { Portfolios } from "../../../types/Portfolios";

export const allPortfolios: Portfolios = {
  "13": {
    id: "13",
    name: "Defense  Agency",
    description:
      "This Portfolio will be used to build,test and manage the native applications for the defense logistics agency",
    csp_provisioning_status: "in_progress",
    dod_component: ["Army"],
    portfolio_managers: ["joe.manager@example.com"],
    applications: [
      {
        id: "75",
        name: "APPLICATION_NAME",
        description: "APPLICATION_DESCRIPTION",
        environments: [
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "ENVIRONMENT_NAME",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
        ],
      },
    ],
  },
  "12": {
    id: "12",
    name: "Defense Logistics Agency",
    description:
      "This Portfolio will be used to build,test and manage the native applications for the defense logistics agency",
    csp_provisioning_status: "complete",
    dod_component: ["Air Force"],
    portfolio_managers: ["joe.manager@example.com"],
    applications: [
      {
        id: "74",
        name: "APPLICATION_NAME",
        description: "APPLICATION_DESCRIPTION",
        environments: [
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "ENVIRONMENT_NAME",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
        ],
      },
    ],
  },
};
