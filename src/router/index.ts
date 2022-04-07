import VueRouter from "vue-router";
import {stepperRoutes} from "./stepper";

const routes = [
  ...stepperRoutes,
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

export default router;
