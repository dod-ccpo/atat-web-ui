import { generateUid, getEntityIndex } from "@/helpers";
import { RootState } from "@/store/types";
import { ApplicationModel, OperatorModel } from "types/Portfolios";
import { TaskOrderModel } from "types/Wizard";
import { ActionContext, ActionTree, Commit } from "vuex";
import { getStepIndex } from "./helpers";
import WizardState from "./types";
import { WizardSteps } from "./types/PortfolioStepModels";
import { validateApplication, validOperator } from "@/validation/application";

const validateStep = ({ commit }: { commit: Commit }, step: number): void => {
  commit("setStepValidated", step);
};

const setCurrentStepNumber = (
  { commit }: { commit: Commit },
  step: number
): void => {
  commit("setCurrentStep", step);
};

const setCurrentStepModel = (
  { commit }: { commit: Commit },
  model: any
): void => {
  commit("doSetCurrentStepModel", model);
};

const saveStepModel = (
  { commit }: { commit: Commit },
  {
    model,
    stepNumber,
    valid,
  }: { model: any; stepNumber: number; valid: boolean }
): void => {
  commit("saveStepModel", [model, stepNumber, valid]);
};

const updateStepModelValidity = (
  { commit }: { commit: Commit },
  { stepNumber, valid }: { stepNumber: number; valid: boolean }
): void => {
  const stepIndex = getStepIndex(stepNumber);
  commit("updateStepModelValidity", { stepNumber, stepIndex, valid });
};

const updateMembersModified = (
  { commit }: ActionContext<WizardState, RootState>,
  added: boolean
): void => {
  commit("updateMembersModified", added);
};

const setStepTouched = (
  { commit }: { commit: Commit },
  { stepNumber, isTouched }: { stepNumber: number; isTouched: boolean }
): void => {
  const stepIndex = getStepIndex(stepNumber);
  commit("setStepTouched", { stepIndex, isTouched });
};

const deleteTaskOrder = async (
  { commit, dispatch }: ActionContext<WizardState, RootState>,
  id: string
): Promise<void> => {
  try {
    dispatch("taskOrders/deleteTaskOrder", id);
    commit("initializeStepModel", WizardSteps.Two);
    await dispatch("taskOrder/saveToServer");
  } catch (error) {
    console.log(error);
  }
};

const addNewTaskOrder = ({
  commit,
}: ActionContext<WizardState, RootState>): void => {
  commit("doInitializeStepModel", WizardSteps.Two);
};

const editTaskOrder = (
  { commit, rootGetters }: ActionContext<WizardState, RootState>,
  id: string
): void => {
  const taskOrderModels = rootGetters[
    "taskOrders/taskOrders"
  ] as TaskOrderModel[];

  const taskOrderIndex = getEntityIndex(
    taskOrderModels,
    (taskOrder: TaskOrderModel) => taskOrder.id === id
  );

  if (taskOrderIndex === -1) {
    throw new Error("unable to location task order model with id :" + id);
  }
  const taskOrder = taskOrderModels[taskOrderIndex];
  const stepNumber = WizardSteps.Two;
  const valid = true;
  commit("saveStepModel", { taskOrder, stepNumber, valid });
};

const addNewApplication = ({
  commit,
}: ActionContext<WizardState, RootState>): void => {
  commit("initializeStepModel", WizardSteps.Three);
};

const editApplication = (
  { rootGetters, commit }: ActionContext<WizardState, RootState>,
  id: string
): void => {
  const applicationModels = rootGetters[
    "applications/applications"
  ] as ApplicationModel[];

  const entityIndex = getEntityIndex(
    applicationModels,
    (entity: ApplicationModel) => entity.id === id
  );

  if (entityIndex === -1) {
    throw new Error("unable to location task order model with id :" + id);
  }
  const applicationModel = applicationModels[entityIndex];
  const stepNumber = WizardSteps.Three;
  const valid = true;
  commit("saveStepModel", { applicationModel, stepNumber, valid });
};

const saveStep1 = async (
  { state, dispatch }: ActionContext<WizardState, RootState>,
  model: any
): Promise<void> => {
  // build data from step model
  const data = {
    name: model.name,
    description: model.description,
    csp: model.csp,
    dod_components: model.dod_components,
    portfolio_managers: [],
  };

  await dispatch("portfolios/saveToServer", {
    portfolioId: state.currentPortfolioId,
    data: data,
  });
};

const saveStep2 = async (
  { state, rootGetters, dispatch }: ActionContext<WizardState, RootState>,
  model: TaskOrderModel
): Promise<void> => {
  const taskOrderModels = rootGetters[
    "taskOrders/taskOrders"
  ] as TaskOrderModel[];

  const isNew = model.id === "";

  if (isNew) {
    model.id = generateUid();
    dispatch("taskOrders/addTaskOrder", model);
  } else {
    const taskOrderIndex = getEntityIndex<TaskOrderModel>(
      taskOrderModels,
      (taskOrder) => taskOrder.id === model.id
    );

    if (taskOrderIndex === -1) {
      throw new Error(
        "unable to location task order model with id :" + model.id
      );
    }

    dispatch("taskOrders/updateTaskOrder", { taskOrderIndex, model });
    await dispatch("taskOrders/saveToServer", state.currentPortfolioId);
  }
};

const saveStep3 = async (
  { rootGetters, dispatch }: ActionContext<WizardState, RootState>,
  model: any
): Promise<void> => {
  const applicationModels = rootGetters[
    "applications/applications"
  ] as ApplicationModel[];

  const portfolioOperators = rootGetters[
    "applications/portfolioOperators"
  ] as OperatorModel[];

  const application = model as ApplicationModel;

  const validRootAdmins =
    portfolioOperators.length > 0
      ? portfolioOperators.every((operator) => validOperator(operator))
      : true;

  // a very basic validation test before attempting to update and save
  if (validateApplication(application) && validRootAdmins) {
    if (model.id === "") {
      model.id = generateUid();
      dispatch("applications/addApplication", model);
    } else {
      const appIndx = getEntityIndex<ApplicationModel>(
        applicationModels,
        (application) => application.id === model.id
      );
      if (appIndx === -1) {
        throw new Error(
          "unable to locate application model with id :" + model.id
        );
      }

      dispatch("applications/updateApplication", { appIndx, model });
      await dispatch("applications/saveToServer");
    }
  }
};

const saveStep4 = async (
  { state, commit, dispatch }: ActionContext<WizardState, RootState>,
  saveApps: boolean
): Promise<void> => {
  if (saveApps) {
    await dispatch("applications/saveToServer", state.currentPortfolioId);
  }

  const [isStep4Valid, portfolioHasOperators] = (await dispatch(
    "applications/validateAdminOperators"
  )) as boolean[];
  setStepTouched(
    { commit },
    { stepNumber: WizardSteps.Four, isTouched: portfolioHasOperators }
  );
  if (portfolioHasOperators) {
    dispatch("updateStepModelValidity", {
      stepNumber: WizardSteps.Four,
      valid: isStep4Valid,
    });
  }
  dispatch("updateMembersModified", false);
};

const saveActions = ["saveStep1", "saveStep2", "saveStep3", "saveStep4"];

/**
 *
 * saves step data to backend based on step number
 */
const saveStepData = async (
  { state, dispatch }: ActionContext<WizardState, RootState>,
  stepNumber: number
): Promise<void> => {
  const stepIndex = stepNumber - 1;
  const step = state.portfolioSteps[stepIndex];
  const saveAction = saveActions[stepIndex];
  await dispatch(saveAction, step.model);
};

export const actions: ActionTree<WizardState, RootState> = {
  validateStep,
  setCurrentStepNumber,
  setCurrentStepModel,
  saveStepModel,
  updateStepModelValidity,
  setStepTouched,
  addNewTaskOrder,
  deleteTaskOrder,
  editTaskOrder,
  addNewApplication,
  editApplication,
  updateMembersModified,
};
