import { Route, RouteConfigSingleView } from "vue-router/types/router";

/**
 *
 * @param {wizardStep} RouteConfigSingleView the route configuration
 * @param {previous}  string name of the previous route of the previous step
 * @param {next}  string  name of the next wizard route (route after this route)
 * @returns
 */
function CreateWizardRoute(
  wizardStep: RouteConfigSingleView,
  previous?: string,
  next?: string,
  step?: number
): RouteConfigSingleView {
  //adding metadata unique to wizard route
  wizardStep.meta = {
    isWizard: true,
    next: next,
    previous: previous,
    step: step,
  };

  return wizardStep;
}

const addportfolio: RouteConfigSingleView = {
  path: "",
  name: "addportfolio",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step1/views/Step1.vue"),
};

const addfunding: RouteConfigSingleView = {
  path: "addfunding",
  name: "addfunding",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step2/views/Step2.vue"),
};

const fundingsummary: RouteConfigSingleView = {
  path: "fundingsummary",
  name: "fundingsummary",
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../wizard/Step2/views/Step2Summary.vue"
    ),
};

const editfunding: RouteConfigSingleView = {
  path: "editfunding/:id",
  name: "editfunding",
  props: true,
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step2/views/Step2.vue"),
};

const addapplication: RouteConfigSingleView = {
  path: "addapplication",
  name: "addapplication",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step3/views/Step3.vue"),
};

const applicationsummary: RouteConfigSingleView = {
  path: "applicationsummary",
  name: "applicationsummary",
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../wizard/Step3/views/Step3Summary.vue"
    ),
};

const editapplication: RouteConfigSingleView = {
  path: "editapplication/:id",
  name: "editapplication",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step3/views/Step3.vue"),
};

const addteammembers: RouteConfigSingleView = {
  path: "addteammembers",
  name: "addteammembers",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step4/views/Step4.vue"),
};

const reviewandsubmit: RouteConfigSingleView = {
  path: "reviewandsubmit",
  name: "reviewandsubmit",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step5/views/Step5.vue"),
};

const postreview: RouteConfigSingleView = {
  path: "postreview",
  name: "postreview",
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../wizard/Step5/views/PostReview.vue"
    ),
};

const submit: RouteConfigSingleView = {
  path: "submit",
  name: "submit",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/Step5/views/Submit.vue"),
};

const wizard: RouteConfigSingleView = {
  path: "/wizard",
  name: "wizard",
  component: () =>
    import(/* webpackChunkName: "style" */ "../wizard/wizard.vue"),
  children: [
    //main routes
    CreateWizardRoute(addportfolio, undefined, addfunding.name, 1),
    CreateWizardRoute(addfunding, addportfolio.name, fundingsummary.name, 2),
    CreateWizardRoute(fundingsummary, addfunding.name, addapplication.name, 2),
    CreateWizardRoute(
      addapplication,
      fundingsummary.name,
      applicationsummary.name,
      3
    ),
    CreateWizardRoute(
      applicationsummary,
      addapplication.name,
      addteammembers.name,
      3
    ),
    CreateWizardRoute(
      editapplication,
      applicationsummary.name,
      applicationsummary.name,
      3
    ),
    CreateWizardRoute(
      addteammembers,
      applicationsummary.name,
      reviewandsubmit.name,
      4
    ),
    CreateWizardRoute(reviewandsubmit, addteammembers.name, postreview.name, 5),
    CreateWizardRoute(postreview, reviewandsubmit.name, submit.name, 5),
    CreateWizardRoute(submit, postreview.name, undefined, 5),
    CreateWizardRoute(editfunding, undefined, reviewandsubmit.name, 2),
    {
      path: "showvalidationsummary",
      name: "showvalidationsummary",
      component: () =>
        import(
          /* webpackChunkName: "style" */ "../wizard/Step5/views/Step5.vue"
        ),
    },
  ],
};

export default wizard;
