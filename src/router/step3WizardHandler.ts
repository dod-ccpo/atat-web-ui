import { NavigationGuardNext, Route } from "vue-router";
import { Store } from "vuex";
import { ATATRouteHandler } from "./routerMiddleWare";
import { addfunding, addapplication, applicationsummary } from "./wizard";

const navigatingToAddApplication = (to: Route) =>
  to.name === addapplication.name;

const hasApplications = (store?: Store<any>) =>
  store && store.getters["wizard/hasApplications"];

const comingFromApplicationSummary = (from: Route) =>
  from.name === applicationsummary.name;

const previousButtonNavigationFromApplicationSummary = (
  to: Route,
  from: Route
) =>
  comingFromApplicationSummary(from) &&
  to.params &&
  to.params.source === "wizard-previous";

declare type Navigation = (
  to: Route,
  from: Route,
  next: NavigationGuardNext<any>
) => any;

/**
 *
 *  forwards the user to the application summary if
 *  there are one or more applications
 * @param store
 * @returns ATATRouteHandleradd
 */
const step3RouteHandler: ATATRouteHandler =
  (store?: Store<any>) =>
  (to: Route, from: Route, next: NavigationGuardNext<any>) => {
    //requests to add application get rerouted to application summary
    // where there are one or more existing applications
    if (navigatingToAddApplication(to) && hasApplications(store)) {
      //forward the previous button from application summary to
      //add  add funding (a.k.a step 2)
      //all other requests to add application gets redirected to application summary
      if (comingFromApplicationSummary(from) && to.params) {
        if (previousButtonNavigationFromApplicationSummary(to, from)) {
          next({ name: addfunding.name });
        } else {
          next();
        }
      } else {
        next({ name: applicationsummary.name });
      }
    } else {
      next();
    }
  };

export default step3RouteHandler;
