import { RouteConfigSingleView } from "vue-router/types/router";

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
    title: wizardStep?.meta?.title,
  };

  return wizardStep;
}

const addportfolio: RouteConfigSingleView = {
  path: "",
  name: "addportfolio",
  meta: {
    title: "Portfolio Details and CSP Selection",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step1/views/Step1.vue"
    ),
  props: {
    step: 1,
  },
};
const editportfolio: RouteConfigSingleView = {
  path: "editportfolio/:id",
  name: "editportfolio",
  meta: {
    title: "Edit Portfolio Details and CSP Selection",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step1/views/Step1.vue"
    ),
  props: {
    step: 1,
  },
};

const addfunding: RouteConfigSingleView = {
  path: "addfunding",
  name: "addfunding",
  meta: {
    title: "Add a New Task Order",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step2/views/Step2.vue"
    ),
  props: {
    step: 2,
  },
};

const fundingsummary: RouteConfigSingleView = {
  path: "fundingsummary",
  name: "fundingsummary",
  meta: {
    title: "Your Task Order Summary",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step2/views/Step2Summary.vue"
    ),
};

const editfunding: RouteConfigSingleView = {
  path: "editfunding/:id",
  name: "editfunding",
  meta: {
    title: "Edit Task Order",
  },
  props: {
    step: 2,
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step2/views/Step2.vue"
    ),
};

const addapplication: RouteConfigSingleView = {
  path: "addapplication",
  name: "addapplication",
  meta: {
    title: "Add Application",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step3/views/Step3.vue"
    ),
  props: {
    step: 3,
  },
};

const applicationsummary: RouteConfigSingleView = {
  path: "applicationsummary",
  name: "applicationsummary",
  meta: {
    title: "Application Summary",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step3/views/Step3Summary.vue"
    ),
};

const editapplication: RouteConfigSingleView = {
  path: "editapplication/:id",
  name: "editapplication",
  meta: {
    title: "Edit Application",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step3/views/Step3.vue"
    ),
  props: {
    step: 3,
  },
};

const addteammembers: RouteConfigSingleView = {
  path: "addteammembers",
  name: "addteammembers",
  meta: {
    title: "Add Root Administrators and Team Members",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step4/views/Step4.vue"
    ),
};
const editmembers: RouteConfigSingleView = {
  path: "editmembers/:type/:id",
  name: "editmembers",
  meta: {
    title: "Edit Team Members",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step4/views/Step4.vue"
    ),
};

const teammembersummary: RouteConfigSingleView = {
  path: "teammembersummary",
  name: "teammembersummary",
  meta: {
    title: "Team Member Summary",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step4/views/SummaryReview.vue"
    ),
};

const reviewandsubmit: RouteConfigSingleView = {
  path: "reviewandsubmit",
  name: "reviewandsubmit",
  meta: {
    title: "Review and Submit",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step5/views/Step5.vue"
    ),
};

const postreview: RouteConfigSingleView = {
  path: "postreview",
  name: "postreview",
  meta: {
    title: "Authorization Acknowledgement",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step5/views/PostReview.vue"
    ),
};

const submit: RouteConfigSingleView = {
  path: "submit",
  name: "submit",
  meta: {
    title: "Submit Portfolio",
  },
  component: () =>
    import(
      /* webpackChunkName: "style" */ "../views/wizard/Step5/views/Submit.vue"
    ),
};

const wizard: RouteConfigSingleView = {
  path: "/wizard",
  name: "wizard",
  meta: {
    title: "Portfolio Details and CSP Selection",
  },
  component: () =>
    import(/* webpackChunkName: "style" */ "../views/wizard/wizard.vue"),
  children: [
    //main routes
    CreateWizardRoute(addportfolio, undefined, addfunding.name, 1),
    CreateWizardRoute(editportfolio, undefined, addfunding.name, 1),
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
      teammembersummary.name,
      4
    ),
    CreateWizardRoute(
      editmembers,
      applicationsummary.name,
      teammembersummary.name,
      4
    ),
    CreateWizardRoute(
      teammembersummary,
      addteammembers.name,
      reviewandsubmit.name,
      4
    ),
    CreateWizardRoute(
      reviewandsubmit,
      teammembersummary.name,
      postreview.name,
      5
    ),
    CreateWizardRoute(postreview, reviewandsubmit.name, submit.name, 5),
    CreateWizardRoute(submit, postreview.name, undefined, 5),
    CreateWizardRoute(editfunding, addportfolio.name, fundingsummary.name, 2),
    {
      path: "showvalidationsummary",
      name: "showvalidationsummary",
      component: () =>
        import(
          /* webpackChunkName: "style" */ "../views/wizard/Step5/views/Step5.vue"
        ),
    },
  ],
};

export {
  wizard,
  addportfolio,
  addfunding,
  fundingsummary,
  editfunding,
  addapplication,
  editapplication,
  applicationsummary,
  addteammembers,
  editmembers,
  teammembersummary,
  editportfolio,
};
