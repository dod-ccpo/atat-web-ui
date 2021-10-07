import { NavigationGuardNext, Route } from "vue-router";
import { Store } from "vuex";
import { ATATRouteHandler } from "./routerMiddleWare";
import { addportfolio, addfunding, fundingsummary } from "./wizard";

/**
 *  forwards the user to the funding summary if
 *  there are one or more task orders
 * @param store
 * @returns ATATRouteHandler
 */
const step2RouteHandler: ATATRouteHandler =
  (store?: Store<any>) =>
  (to: Route, from: Route, next: NavigationGuardNext<any>) => {
    if (
      to.name === addfunding.name &&
      store &&
      store.state.taskOrderModels.length > 0
    ) {
      //forward the previous button from funding summary to
      //add portfolio (a.k.a step 1)
      //all other requests to add funding gets redirected to funding summary
      if (from.name === fundingsummary.name && to.params) {
        if (to.params.source === "wizard-previous") {
          next({ name: addportfolio.name });
        } else {
          next();
        }
      } else {
        next({ name: fundingsummary.name });
      }
    } else {
      next();
    }
  };

export default step2RouteHandler;
