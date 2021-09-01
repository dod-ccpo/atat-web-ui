import { Portfolios, ApplicationMember } from "../../../types/Portfolios";

export const applicationMembersMock: ApplicationMember[] = [
  {
    id: "john.smith@mail.mil",
    email: "john.smith@mail.mil",
    name: "John Smith",
    permissions: [
      {
        id: "edit_team",
        label: "Edit Team",
        is_granted: true,
      },
      {
        id: "manage_environments",
        label: "Manage Environments",
        is_granted: true,
      },
    ],
    environments_settings: [
      {
        id: "development",
        label: "Development",
        accessLevel: "Administrator",
      },
      {
        id: "testing",
        label: "Testing",
        accessLevel: "Administrator",
      },
      {
        id: "staging",
        label: "Staging",
        accessLevel: "Administrator",
      },
      {
        id: "production",
        label: "Production",
        accessLevel: "Administrator",
      },
    ],
  },
  {
    id: "jane.doe@mail.mil",
    email: "jane.doe@mail.mil",
    name: "Jane Doe",
    permissions: [
      {
        id: "edit_team",
        label: "Edit Team",
        is_granted: false,
      },
      {
        id: "manage_environments",
        label: "Manage Environments",
        is_granted: false,
      },
    ],
    environments_settings: [
      {
        id: "development",
        label: "Development",
        accessLevel: "Contributor",
      },
      {
        id: "testing",
        label: "Testing",
        accessLevel: "Contributor",
      },
      {
        id: "staging",
        label: "Staging",
        accessLevel: "Contributor",
      },
      {
        id: "production",
        label: "Production",
        accessLevel: "No Access",
      },
    ],
  },
]; // Noncompliant

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
  "11": {
    id: "11",
    name: "Tracker Application",
    description:
      "This Portfolio will be used to build,test and manage the native applications for the defense logistics agency",
    csp_provisioning_status: "complete",
    dod_component: ["Air Force"],
    portfolio_managers: ["joe.manager@example.com"],
    applications: [
      {
        id: "74",
        name: "Tracker Application",
        description: "APPLICATION_DESCRIPTION",
        environments: [
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Development",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Testing",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Staging",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Production",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
        ],
        members: applicationMembersMock,
      },
    ],
  },
  "10": {
    id: "10",
    name: "Global Positioning System",
    description:
      "This Portfolio will be used to build,test and manage the native applications for the defense logistics agency",
    csp_provisioning_status: "complete",
    dod_component: ["Air Force"],
    portfolio_managers: ["joe.manager@example.com"],
    applications: [
      {
        id: "74",
        name: "Global Positioning System",
        description: "APPLICATION_DESCRIPTION",
        environments: [
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Development",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Testing",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Staging",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
          {
            id: "765d364f-d7f1-4f28-be8f-123d915b68bb",
            name: "Production",
            funding_source: ["599948c4-35c1-49ee-a7ab-9190ca2c1a81"],
          },
        ],
        members: [
          {
            id: "john.smith@mail.mil",
            email: "john.smith@mail.mil",
            name: "John Smith",
            permissions: [
              {
                id: "edit_team",
                label: "Edit Team",
                is_granted: true,
              },
              {
                id: "manage_environments",
                label: "Manage Environments",
                is_granted: true,
              },
            ],
            environments_settings: [
              {
                id: "development",
                label: "Development",
                accessLevel: "Administrator",
              },
              {
                id: "testing",
                label: "Testing",
                accessLevel: "Administrator",
              },
              {
                id: "staging",
                label: "Staging",
                accessLevel: "Administrator",
              },
              {
                id: "production",
                label: "Production",
                accessLevel: "Administrator",
              },
            ],
          },
        ],
      },
    ],
  },
};
