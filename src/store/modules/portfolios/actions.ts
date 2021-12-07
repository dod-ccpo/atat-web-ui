import { ActionContext, ActionTree, Commit } from "vuex";
import { RootState } from "@/store/types";
import PortfoliosState from "./types";
import { portfoliosApi } from "@/api";

const loadPortfolioDrafts = async ({
  commit,
}: {
  commit: Commit;
}): Promise<void> => {
  const portfolioDrafts = await portfoliosApi.getAll();
  commit("updatePortfolioDrafts", portfolioDrafts);
};

const deletePortfolioDraft = async (
  { commit }: { commit: Commit },
  draftId: string
): Promise<void> => {
  await portfoliosApi.deleteDraft(draftId);
  commit("deletePortfolioDraft", draftId);
};

const saveToServer = async (
  context: ActionContext<PortfoliosState, RootState>,
  { portfolioId, data }: { portfolioId: string; data: unknown }
): Promise<void> => {
  await portfoliosApi.savePortfolio(portfolioId, data);
};

export const actions: ActionTree<PortfoliosState, RootState> = {
  loadPortfolioDrafts,
  deletePortfolioDraft,
  saveToServer,
};
