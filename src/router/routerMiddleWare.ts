import _Vue from "vue"; 
import VueRouter, {
  NavigationGuard,
  NavigationGuardNext,
  Route,
} from "vue-router";
import { Store } from "vuex";
import router from ".";

function runMiddleware(
  handlers: NavigationGuard[],
  to: Route,
  from: Route,
  next: NavigationGuardNext<any>
) {
  const handlersLeft = handlers.slice(0);
  const nextHandler = handlersLeft.shift();

  if (nextHandler === undefined) {
    next();
    return;
  }


  nextHandler(to, from, (nextArg) => {
    if (nextArg === undefined) {
      runMiddleware(handlersLeft, to, from, next);
      return;
    }

    next(nextArg);
  });
}

export type ATATRouteHandler = (
  store?: Store<any>
) => (to: Route, from: Route, next: NavigationGuardNext<any>) => any;


export class RouterMiddleWareOptions {
  router!: VueRouter;
  store!: Store<any>;
  handlers!: ATATRouteHandler[];
}

/**
 * Plugin to boostrap route handling middleware
 */
export default {
  install: (Vue: typeof _Vue, options: RouterMiddleWareOptions) => {
    if (options.handlers === undefined || !Array.isArray(options.handlers)) {
      throw new Error("handlers option required");
    }

    const handlers = options.handlers.map((handler: ATATRouteHandler) =>
      handler(options.store)
    );

    router.beforeEach((to, from, next) => {
      return runMiddleware(handlers, to, from, next);
    });
  },
};
