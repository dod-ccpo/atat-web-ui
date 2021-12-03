// https://codeburst.io/vuex-and-typescript-3427ba78cfa8

import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { Dialog, Toast } from "types/Global";
import { ApplicationModel } from "types/Portfolios";
import { TaskOrderModel } from "types/Wizard";
import { mockTaskOrders } from "./mocks/taskOrderMockData";

import portfolios from "./modules/portfolios/store";
import applications from "./modules/applications/store";
import taskOrders from "./modules/taskOrders/store";
import wizard from "./modules/wizard/store";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.sessionStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});

// const parseNumber = (value: string) => {
//   value = value.replace(",", "");
//   const num = parseFloat(value);

//   return num;
// };

// const stepModelHasData = (stepModel: any, initialModel: any) => {
//   return JSON.stringify(stepModel) !== JSON.stringify(initialModel);
// };

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
    currentPortfolioId: "",
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
    returnToReview: false,
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
    setCurrentPortfolioId(state, id: string) {
      state.currentPortfolioId = id;
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
    getUser: (state) => state.user,
    getSideDrawerIsOpen: (state) => state.sideDrawerIsOpen,
    hasTaskOrders: (state, getters, rootState, rootGetters): boolean => {
      const taskOrderModels = rootGetters[
        "taskOrders/taskOrders"
      ] as TaskOrderModel[];

      return taskOrderModels && taskOrderModels.length > 0;
    },
    getTaskOrders: (state, rootGetters) => rootGetters["taskOrders/taskOrders"],
    hasApplications: (state, getters, rootState, rootGetters): boolean => {
      const applicationModels = rootGetters[
        "applications/applications"
      ] as ApplicationModel[];

      return applicationModels && applicationModels.length > 0;
    },
  },
  modules: {
    portfolios,
    applications,
    taskOrders,
    wizard,
  },
});
