import VueRouter from "vue-router";
import StepOne from "@/steps/StepOne.vue";
import StepTwo from "@/steps/StepTwo.vue";

const routes = [
    { path: '/', component: StepOne },
    { path: '/steptwo', component: StepTwo }
  ]


const router = new VueRouter({
    routes // short for `routes: routes`
  });

export default router;
  
  