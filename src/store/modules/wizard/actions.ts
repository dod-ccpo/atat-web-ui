import { generateUid, getEntityIndex } from "@/helpers";
import { RootState } from "@/store/types";
import { ApplicationModel, Operator, OperatorModel } from "types/Portfolios";
import { TaskOrderModel } from "types/Wizard";
import { ActionContext, ActionTree, Commit } from "vuex";
import { stepModelHasData, stepsModelInitializers } from "./helpers";
import { WizardState } from "./types";
import { WizardSteps } from "./types/PortfolioStepModels";
import { validateApplication, validOperator } from "@/validation/application";
import { portfoliosApi } from "@/api";

const validateStep = ({ commit }: { commit: Commit }, step: number): void => {
  commit("setStepValidated", step);
};

const setCurrentStepNumber = (
  { commit }: { commit: Commit },
  step: number
): void => {
  commit("setCurrentStepNumber", step);
};

const setCurrentStepModel = (
  { commit }: { commit: Commit },
  model: any
): void => {
  commit("setCurrentStepModel", model);
};

const saveStepModel = (
  { commit }: { commit: Commit },
  {
    model,
    stepNumber,
    valid,
  }: { model: any; stepNumber: number; valid: boolean }
): void => {
  commit("saveStepModel", { model, stepNumber, valid });
};

const updateStepModelValidity = (
  { commit }: { commit: Commit },
  { stepNumber, valid }: { stepNumber: number; valid: boolean }
): void => {
  commit("updateStepModelValidity", { stepNumber, valid });
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
  commit("setStepTouched", { stepNumber, isTouched });
};

const deleteTaskOrder = async (
  { commit, dispatch }: ActionContext<WizardState, RootState>,
  id: string
): Promise<void> => {
  try {
    dispatch("taskOrders/deleteTaskOrder", id, { root: true });
    commit("initializeStepModel", WizardSteps.Two);
    await dispatch("taskOrder/saveToServer", null, { root: true });
  } catch (error) {
    console.log(error);
  }
};

const addNewTaskOrder = ({
  commit,
}: ActionContext<WizardState, RootState>): void => {
  commit("initializeStepModel", WizardSteps.Two);
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
  const model = taskOrderModels[taskOrderIndex];
  const stepNumber = WizardSteps.Two;
  const valid = true;
  commit("saveStepModel", { model, stepNumber, valid });
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

const initializeSteps = ({
  commit,
}: ActionContext<WizardState, RootState>): void => {
  commit("initializeSteps");
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

  await dispatch(
    "portfolios/saveToServer",
    {
      portfolioId: state.currentPortfolioId,
      data: data,
    },
    { root: true }
  );
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
    dispatch("taskOrders/addTaskOrder", model, { root: true });
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

    dispatch(
      "taskOrders/updateTaskOrder",
      { taskOrderIndex, model },
      { root: true }
    );
    await dispatch("taskOrders/saveToServer", state.currentPortfolioId),
      null,
      { root: true };
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
      dispatch("applications/addApplication", model, { root: true });
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

      dispatch(
        "applications/updateApplication",
        { appIndx, model },
        { root: true }
      );
      await dispatch("applications/saveToServer", null, { root: true });
    }
  }
};

const saveStep4 = async (
  { state, commit, dispatch }: ActionContext<WizardState, RootState>,
  saveApps: boolean
): Promise<void> => {
  if (saveApps) {
    await dispatch("applications/saveToServer", state.currentPortfolioId, {
      root: true,
    });
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

const isStepTouched = (
  { state }: ActionContext<WizardState, RootState>,
  stepNumber: number
): boolean => {
  return state.portfolioSteps[stepNumber].touched;
};

const saveAllValidSteps = async ({
  state,
  dispatch,
}: ActionContext<WizardState, RootState>): Promise<boolean> => {
  let saved = false;
  //trigger validation
  // await this.dispatch("triggerValidation");
  // an array of promises to hold each step save api call
  const saveActions: unknown[] = [];
  // iterate over portfolio steps model and push valid models to save actions
  for (const key in state.portfolioSteps) {
    const step = state.portfolioSteps[key];

    // only save models that have changes and are valid
    if (step.touched && step.valid) {
      if (step.step === 2) {
        const modelCreator = stepsModelInitializers[WizardSteps.Two];
        if (!stepModelHasData(step.model, modelCreator())) continue;
      }

      if (step.step === 3) {
        const modelCreator = stepsModelInitializers[WizardSteps.Three];
        if (!stepModelHasData(step.model, modelCreator())) continue;
      }
      saveActions.push(dispatch("saveStepData", step.step));
    }
  }

  try {
    await Promise.all(saveActions);
    saved = true;
  } catch (error) {
    console.log(error);
  }
  return saved;
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
  const step = state.portfolioSteps[stepNumber];
  const saveAction = saveActions[stepNumber - 1];
  await dispatch(saveAction, step.model);
};

export const createPortfolioDraft = async ({
  commit,
  dispatch,
}: ActionContext<WizardState, RootState>): Promise<void> => {
  //initialize steps models
  commit("initializeSteps");

  //initilize module states
  dispatch("applications/initialize", null, { root: true });
  dispatch("taskOrders/initialize", null, { root: true });

  const portfolioDraftId = await portfoliosApi.createDraft();
  commit("setCurrentPortfolioId", portfolioDraftId);
};

const loadPortfolioDraft = async (
  { commit, dispatch }: ActionContext<WizardState, RootState>,
  draftId: string
): Promise<void> => {
  //initial step model data
  commit("initializeSteps");

  dispatch("applications/initialize", null, { root: true });

  //validate that portfolio draft id exists on the server
  const id = await portfoliosApi.getDraft(draftId);

  if (id === null) {
    throw new Error(`unable to locate portfolio draft with ${id}`);
  }

  commit("setCurrentPortfolioId", draftId);
  commit("setCurrentPorfolioId", draftId, { root: true });
  const loadActions = [
    dispatch("loadStep1Data", draftId),
    dispatch("loadStep2Data", draftId),
    dispatch("loadStep3Data", draftId),
  ];
  await Promise.all(loadActions);
  await dispatch("saveStep4", false);
};

const loadStep1Data = async (
  { commit }: ActionContext<WizardState, RootState>,
  draftId: string
): Promise<void> => {
  const draft = await portfoliosApi.getPortfolio(draftId);
  if (draft) {
    const model = {
      name: draft.name,
      description: draft.description,
      dod_components: draft.dod_components,
      csp: draft.csp,
    };

    const stepNumber = WizardSteps.One;
    const valid = true;
    // update step 1 model
    commit("doSaveStepModel", { model, stepNumber, valid });
  }
};

const loadStep2Data = async (
  { commit, dispatch }: ActionContext<WizardState, RootState>,
  draftId: string
): Promise<void> => {
  // get funding details
  const taskOrders = await portfoliosApi.getFunding(draftId);

  if (taskOrders !== null) {
    //store the tasks orders
    dispatch("taskOrders/setCurrentTaskOrders", taskOrders, { root: true });
  }
  dispatch("initializeStepModel", WizardSteps.Two);
};

const loadStep3Data = async (
  { commit, dispatch }: ActionContext<WizardState, RootState>,
  draftId: string
): Promise<void> => {
  const applicationData = await portfoliosApi.getApplications(draftId);
  if (applicationData !== null) {
    //store the applications
    commit(
      "applications/setCurrentApplications",
      applicationData.applications,
      { root: true }
    );
    commit("applications/initializeRootAdministrators", null, { root: true });

    const rootAdmins = applicationData.operators.map((operator: Operator) => {
      // const operatorModels: OperatorModel = {
      //   ...operator,
      //   id: generateUid(),
      // };

      return operator;
    });

    commit("applications/updateRootAdministrators", rootAdmins, { root: true });
    dispatch("initializeStepModel", WizardSteps.Three);
  }
};

const setReturnToReview = (
  { commit }: ActionContext<WizardState, RootState>,
  shouldReturn: boolean
): void => {
  commit("setReturnToReview", shouldReturn);
};

export const actions: ActionTree<WizardState, RootState> = {
  createPortfolioDraft,
  validateStep,
  saveStep1,
  saveStep2,
  saveStep3,
  saveStep4,
  setCurrentStepNumber,
  setCurrentStepModel,
  saveStepModel,
  saveStepData,
  isStepTouched,
  updateStepModelValidity,
  setStepTouched,
  addNewTaskOrder,
  deleteTaskOrder,
  editTaskOrder,
  addNewApplication,
  editApplication,
  updateMembersModified,
  saveAllValidSteps,
  loadPortfolioDraft,
  loadStep1Data,
  setReturnToReview,
};
