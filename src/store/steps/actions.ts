import { ActionContext, ActionTree } from "vuex"
import { mutationTypes, actionTypes, StepsState} from "./types"
import { RootState } from "../types"

const setCurrentStep = (
    { commit }: ActionContext<StepsState, RootState>,
      {stepNumber, stepName}: {stepNumber: string, stepName: string}
  ): void => {
    commit(mutationTypes.setCurrentStep, {stepNumber, stepName});
  };

export const actions: ActionTree<StepsState, RootState> = {
    [actionTypes.setCurrentStep]: setCurrentStep,
}