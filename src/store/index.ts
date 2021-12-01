// https://codeburst.io/vuex-and-typescript-3427ba78cfa8

import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { Dialog, Toast } from "types/Global";
import {
  Application,
  ApplicationModel,
  Environment,
  Operator,
  OperatorModel,
  TaskOrder,
} from "types/Portfolios";
import { portfoliosApi } from "@/api";
import { TaskOrderModel } from "types/Wizard";
import { generateUid, getEntityIndex } from "@/helpers";
import { mockTaskOrders } from "./mocks/taskOrderMockData";
import moment from "moment";

import portfolios from "./modules/portfolios/store";
import applications from "./modules/applications/store";
import taskOrders from "./modules/taskOrders/store";

import { 
  validateApplication, 
  validOperator, 
  validateHasAdminOperators 
} from "@/validation/application";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.sessionStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});

const createStepOneModel = () => {
  return {
    model: {
      name: "",
      description: "",
      dod_components: [],
      csp: "",
    },
  };
};

const createStepTwoModel = () => {
  return {
    id: "",
    task_order_number: "",
    task_order_file: {
      description: "",
      id: "",
      crated_at: "",
      updated_at: "",
      size: 0,
      name: "",
      status: "",
    },
    clins: [
      {
        clin_number: "",
        idiq_clin: "",
        total_clin_value: 0,
        obligated_funds: 0,
        pop_start_date: "",
        pop_end_date: "",
      },
    ],
  };
};

const createStepThreeModel = () => {
  return {
    id: "",
    name: "",
    description: "",
    operators: [],
    environments: [
      {
        name: "Development",
        id: generateUid(),
        operators: [],
      },
      {
        name: "Testing",
        id: generateUid(),
        operators: [],
      },
      {
        name: "Staging",
        id: generateUid(),
        operators: [],
      },
      {
        name: "Production",
        id: generateUid(),
        operators: [],
      },
    ],
  };
};

const createStepFourModel = () => {
  return {};
};

const createStepFiveModel = () => {
  return {};
};

const stepsModelInitializer = [
  {
    step: 1,
    model: createStepOneModel,
  },
  {
    step: 2,
    model: createStepTwoModel,
  },
  {
    step: 3,
    model: createStepThreeModel,
  },
  {
    step: 4,
    model: createStepFourModel,
  },
  {
    step: 5,
    model: createStepFiveModel,
  },
];

const mapTaskOrders = (taskOrderModels: TaskOrderModel[]): TaskOrder[] => {
  return taskOrderModels.map((model: TaskOrderModel) => {
    //extract all properties except the id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, signed, ...baseModel } = model;

    const taskOrders: TaskOrder = {
      ...baseModel,
      task_order_file: {
        id: model.task_order_file.id,
        name: model.task_order_file.name,
      },
      clins: model.clins.map((clin) => {
        return {
          ...clin,
          total_clin_value: parseNumber(clin.total_clin_value.toString()),
          obligated_funds: parseNumber(clin.obligated_funds.toString()),
          pop_start_date: moment(clin.pop_start_date).format("YYYY-MM-DD"),
          pop_end_date: moment(clin.pop_end_date).format("YYYY-MM-DD"),
        };
      }),
    };

    return taskOrders;
  });
};

const mapApplications = (
  applicationModels: ApplicationModel[]
): Application[] => {
  return applicationModels.map((model: ApplicationModel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = model;
    const application: Application = {
      ...baseModel,
      operators: model.operators
        ? model.operators.map((op) => {
            return {
              access: op.access,
              display_name: op.display_name,
              email: op.email,
            };
          })
        : [],
      environments: model.environments.map((env) => {
        return {
          name: env.name,
          operators: env.operators
            ? env.operators.map((op) => {
                return {
                  access: op.access,
                  display_name: op.display_name,
                  email: op.email,
                };
              })
            : [],
        };
      }),
    };

    return application;
  });
};

const mapOperators = (operatorsModels: OperatorModel[]): Operator[] => {
  return operatorsModels.map((operatorModel: OperatorModel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = operatorModel;

    const operator: Operator = {
      ...baseModel,
    };

    return operator;
  });
};

const StepModelIndices: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
};

const parseNumber = (value: string) => {
  value = value.replace(",", "");
  const num = parseFloat(value);

  return num;
};

const stepModelHasData = (stepModel: any, initialModel: any) => {
  return JSON.stringify(stepModel) !== JSON.stringify(initialModel);
};

/*
█████████████████████████████████████████

███████ ████████  █████  ████████ ███████
██         ██    ██   ██    ██    ██
███████    ██    ███████    ██    █████
     ██    ██    ██   ██    ██    ██
███████    ██    ██   ██    ██    ███████

█████████████████████████████████████████
*/

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loginStatus: false,
    sideDrawerIsOpen: false,
    sideDrawerType: "",
    sideDrawerOpenerId: "",
    sideDrawerChange: false,
    isUserAuthorizedToProvisionCloudResources: false,
    isNavSideBarDisplayed: false,
    dialog: {
      isDisplayed: false,
      type: "",
      setFocus: false,
      width: "",
      height: "",
      props: null,
    },
    user: {
      title: "",
      given_name: "",
      family_name: "",
      email: "",
      phone_number: "",
      service_branch: "",
      citizenship: "",
      dod_id: "",
      designation: "",
    },
    validationStamp: {},
    toast: {
      isDisplayed: false,
      message: "",
      contentClass: "",
    },
  },
  /*
  ███████████████████████████████████████████████████████████████████████████

  ███    ███ ██    ██ ████████  █████  ████████ ██  ██████  ███    ██ ███████
  ████  ████ ██    ██    ██    ██   ██    ██    ██ ██    ██ ████   ██ ██
  ██ ████ ██ ██    ██    ██    ███████    ██    ██ ██    ██ ██ ██  ██ ███████
  ██  ██  ██ ██    ██    ██    ██   ██    ██    ██ ██    ██ ██  ██ ██      ██
  ██      ██  ██████     ██    ██   ██    ██    ██  ██████  ██   ████ ███████

  ███████████████████████████████████████████████████████████████████████████
  */
  mutations: {
    changeLoginStatus(state, status: boolean) {
      state.loginStatus = status;
    },
    changeUser(state, user: any) {
      // These attributes will come across directly and cleanly from the
      // u[stream identity provider and Cognito
      state.user.given_name = user?.given_name ?? "";
      state.user.family_name = user?.family_name ?? "";
      state.user.email = user?.email ?? "Not Provided";
      // This field will have to be a custom Cognito attribute and so
      // the source object may have a different format.
      state.user.dod_id = user?.["custom:dod_id"] ?? "1234567890";
      state.user.citizenship = user?.["custom:citizenship"] ?? "United States";
      state.user.designation = user?.["custom:designation"] ?? "Civilian";
      // This field may not be available from our identity provider
      state.user.phone_number = user?.phone ?? "(555) 555-5555";
      // There is not currently a known way to get this information from
      // the identity provider.
      state.user.service_branch = "U.S. Army";
      state.user.title = "Ms.";
    },
    changeDialog(state, dialogProps: Dialog) {
      state.dialog = dialogProps;
    },
    doCloseSideDrawer(state) {
      state.sideDrawerIsOpen = false;
      state.sideDrawerChange = !state.sideDrawerChange;
    },
    doOpenSideDrawer(state, [drawerType, openerId]) {
      state.sideDrawerIsOpen = true;
      state.sideDrawerType = drawerType;
      state.sideDrawerOpenerId = openerId;
      state.sideDrawerChange = !state.sideDrawerChange;
    },
    changeisUserAuthorizedToProvisionCloudResources(state, status: boolean) {
      state.isUserAuthorizedToProvisionCloudResources = status;
    },
    doSetCurrentPortfolioId(state, id) {
      state.currentPortfolioId = id;
    },
    setNavSideBarDisplayed(state, routeName: string) {
      if (routeName) {
        const routesWithNoNavSideBar = ["home", "dashboard", "profile"];
        state.isNavSideBarDisplayed = routesWithNoNavSideBar.every(
          (r) => r.toLowerCase() !== routeName.toLowerCase()
        );
      }
    },
    doToast(state, props) {
      state.toast = props;
    },
  },
  /*
  ██████████████████████████████████████████████████████

   █████   ██████ ████████ ██  ██████  ███    ██ ███████
  ██   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ███████ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██   ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ██   ██  ██████    ██    ██  ██████  ██   ████ ███████

  ██████████████████████████████████████████████████████
  */
  actions: {
    login({ commit }, user) {
      commit("changeLoginStatus", true);
      commit("changeUser", user);
    },
    logout({ commit }) {
      commit("changeLoginStatus", false);
      commit("changeUser", null);
      window.sessionStorage.clear();
    },
    displayNavSideBarDisplayed({ commit }, routeName: string) {
      commit("setNavSideBarDisplayed", routeName);
    },
    authorizeUser({ commit }) {
      commit("changeisUserAuthorizedToProvisionCloudResources", true);
    },
    unauthorizeUser({ commit }) {
      commit("changeisUserAuthorizedToProvisionCloudResources", false);
    },

    async loadStep3Data({ commit, getters }, draftId: string): Promise<void> {
      const applicationData = await portfoliosApi.getApplications(draftId);
      if (applicationData !== null) {
        //store the applications
        commit(
          "applications/setCurrentApplications",
          applicationData.applications
        );
        commit("applications/initializeRootAdministrators");

        const rootAdmins = applicationData.operators.map(
          (operator: Operator) => {
            const operatorModels: OperatorModel = {
              ...operator,
              id: generateUid(),
            };

            return operator;
          }
        );

        commit("applications/updateRootAdministrators", rootAdmins);
        const stepIndex: number = getters.getStepIndex(3);
        commit("doSaveStepModel", [createStepThreeModel(), 3, stepIndex, true]);
      }
    },
    openDialog(
      { commit },
      [dialogType, setFocusOnDialog, dialogWidth, dialogHeight, props]
    ) {
      const dialogProps: Dialog = {
        isDisplayed: true,
        type: dialogType,
        setFocus: setFocusOnDialog,
        width: dialogWidth,
        height: dialogHeight,
        props: props,
      };
      commit("changeDialog", dialogProps);
    },
    initDialog({ commit }) {
      const dialogProps: Dialog = {
        isDisplayed: false,
        type: "",
        setFocus: false,
        width: "",
        height: "",
        props: null,
      };
      commit("changeDialog", dialogProps);
    },
    closeSideDrawer({ commit }) {
      commit("doCloseSideDrawer");
    },
    openSideDrawer({ commit }, [drawerType, openerId]) {
      commit("doOpenSideDrawer", [drawerType, openerId]);
    },
    toast({ commit }, [message, contentClass]) {
      const toastProps: Toast = {
        isDisplayed: true,
        message: message,
        contentClass: contentClass,
      };
      commit("doToast", toastProps);
    },
  },
  /*
  ██████████████████████████████████████████████████████████

   ██████  ███████ ████████ ████████ ███████ ██████  ███████
  ██       ██         ██       ██    ██      ██   ██ ██
  ██   ███ █████      ██       ██    █████   ██████  ███████
  ██    ██ ██         ██       ██    ██      ██   ██      ██
   ██████  ███████    ██       ██    ███████ ██   ██ ███████

  ██████████████████████████████████████████████████████████
  */
  getters: {
    getInvalidSteps(state) {
      const invalidSteps: number[] = [];
      state.portfolioSteps.forEach((step) => {
        if (step.step < 5 && (step.touched === false || step.valid === false)) {
          invalidSteps.push(step.step);
        }
      });
      return invalidSteps;
    },
    getLoginStatus(state) {
      return state.loginStatus;
    },
    getIsNavSideBarDisplayed(state) {
      return state.isNavSideBarDisplayed;
    },
    getisUserAuthorizedToProvisionCloudResources(state) {
      return state.isUserAuthorizedToProvisionCloudResources;
    },
    getNavBarItems(state): Navs {
      return {
        logout: {
          id: "atat-nav__logout",
          title: "logout Nav",
          items: [],
        },
        login: {
          id: "atat-nav__login",
          title: "login Nav",
          items: [
            {
              id: 1,
              cssClass: "atat-header-nav__user-display-name",
              title: state.user.given_name + " " + state.user.family_name,
              newWindow: false,
              icon: "person",
              iconPlacement: "left",
              action: "profile",
              ariaLabel:
                "Open panel with user profile information for " +
                state.user.given_name +
                " " +
                state.user.family_name,
              ariaRole: "button",
            },
            {
              id: 2,
              cssClass: "atat-header-nav__support",
              title: "Support",
              url: "#",
              newWindow: false,
              icon: "help_outline",
              iconPlacement: "left",
              ariaLabel: "ATAT Support",
              ariaRole: "link",
            },
            {
              id: 3,
              cssClass: "atat-header-nav__logout",
              title: "Logout",
              url: "/",
              newWindow: false,
              icon: "logout",
              iconPlacement: "right",
              action: "logout",
              ariaLabel: "Log out of ATAT",
              ariaRole: "link",
            },
          ],
        },
      };
    },
    getMockTaskOrders() {
      return mockTaskOrders;
    },
    getStepModel: (state) => (stepNumber: number) => {
      const step = state.portfolioSteps.find(
        (o: { step: number }) => o.step === stepNumber
      );
      return step?.model;
    },
    getCurrentStepModel: (state) => state.currentStepModel,
    getStepTouched: (state, getters) => (stepNumber: number) => {
      const stepIndex: number = getters.getStepIndex(stepNumber);
      return state.portfolioSteps[stepIndex].touched;
    },
    getUser: (state) => state.user,
    getSideDrawerIsOpen: (state) => state.sideDrawerIsOpen,
    hasTaskOrders: (state, getters, rootState, rootGetters): boolean => {
      const taskOrderModels = rootGetters[
        "taskOrders/taskOrders"
      ] as TaskOrderModel[];

      return taskOrderModels && taskOrderModels.length > 0;
    },
    getTaskOrders: (state, rootGetters) => rootGetters["taskOrders/taskOrders"],
    getPortfolio: (state) => state.portfolioSteps[StepModelIndices[1]].model,
    getPortfolioName: (state, getters) => (defaultResponse: string) => {
      defaultResponse = defaultResponse || "this portfolio";
      let pName = defaultResponse;
      const portfolio = getters.getPortfolio;
      if (portfolio) {
        if (Object.prototype.hasOwnProperty.call(portfolio, "name")) {
          pName = portfolio.name || pName;
        }
        if (
          pName === defaultResponse &&
          Object.prototype.hasOwnProperty.call(portfolio, "model")
        ) {
          if (Object.prototype.hasOwnProperty.call(portfolio, "name")) {
            pName = portfolio.model.name || pName;
          }
        }
      }
      return pName;
    },
    hasApplications: (state, getters, rootState, rootGetters): boolean => {
      const applicationModels = rootGetters[
        "applications/applications"
      ] as ApplicationModel[];

      return applicationModels && applicationModels.length > 0;
    },
    membersModified: (state) => {
      return state.membersModified;
    },
    getStepIndex: (state) => (stepNumber: number): number => {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      return stepIndex;
    },
    isStepErrored: (state) => (stepNumber: number): boolean => {
      const es: number[] = state.erroredSteps;
      const i = es.indexOf(stepNumber);
      return i > -1;
    },
    isStepTouched: (state, getters) => (stepNumber: number): boolean => {
      const stepIndex: number = getters.getStepIndex(stepNumber);
      return state.portfolioSteps[stepIndex].touched;
    }
  },
  modules: {
    portfolios,
    applications,
    taskOrders,
  },
});
