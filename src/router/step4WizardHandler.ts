import { NavigationGuardNext, Route } from "vue-router";
import { Store } from "vuex";
import { ATATRouteHandler } from "./routerMiddleWare";
import {
  addteammembers,
  teammembersummary,
  applicationsummary,
} from "./wizard";

/**
 *  forwards the user to the funding summary if
 *  there are one or more task orders
 * @param store
 * @returns ATATRouteHandler
 */
const step4RouteHandler: ATATRouteHandler =
  (store?: Store<any>) =>
  (to: Route, from: Route, next: NavigationGuardNext<any>) => {
    if (
      to.name === addteammembers.name &&
      store &&
      store.getters.hasApplications
    ) {
      if (from.name === teammembersummary.name && to.params) {
        if (to.params.source === "wizard-previous") {
          next({ name: applicationsummary.name });
        } else {
          next();
        }
      } else {
        next({ name: teammembersummary.name });
      }
    } else {
      next();
    }
  };

export default step4RouteHandler;
