import { PortfolioManagerPermissions } from "@/../types/Managers";

export const portfolioManagerPermissions: PortfolioManagerPermissions = {
  EDIT_TASK_ORDER: {
    id: "EDIT_TASK_ORDER",
    label: "Edit Funding",
    description: "Can add or modify Task Orders to fund this Portfolio",
  },
  EDIT_APPLICATION: {
    id: "EDIT_APPLICATION",
    label: "Edit Application",
    description: "Can create, edit and remove Applications in this Portfolio",
  },
  VIEW_PORTFOLIO_FUNDING: {
    id: "VIEW_PORTFOLIO_FUNDING",
    label: "Manage Reporting",
    description: "Can create, edit and remove Applications in this Portfolio",
  },
  EDIT_PORTFOLIO_POC: {
    id: "EDIT_PORTFOLIO_POC",
    label: "Edit Portfolio",
    description:
      "Can update Portfolio settings, add Portfolio Managers and delete this Portfolio",
    description_note:
      "NOTE: The option to delete this Portfolio will only be available as a draft. A Portfolio cannot be removed from ATAT after it has been provisioned.",
  },
};
