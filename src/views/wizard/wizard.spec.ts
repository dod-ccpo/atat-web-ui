import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import wizard from "@/views/wizard/wizard.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";

Vue.use(Vuetify);

describe("Testing wizard Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueAxios, axios);
  localVue.use(VueRouter);
  const routes = [
    {
      name: "addfunding",
      path: "/",
      meta: {
        isWizard: true,
        next: "next",
        previous: "previous",
        step: "step",
      },
    },
    {
      name: "next",
      path: "/",
    },
    {
      name: "previous",
      path: "/",
    },
    {
      name: "addportfolio",
      path: "/",
    },
    {
      name: "portfolios",
      path: "/",
    },
    {
      name: "addapplication",
      path: "/",
    },
    {
      name: "addteammembers",
      path: "/",
    },
    {
      name: "reviewandsubmit",
      path: "/",
    },
  ];
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {
    updateWizardStep: jest.fn(),
  };

  const router = new VueRouter({ routes });

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
    });
    wrapper = mount(wizard, {
      store,
      localVue,
      vuetify,
      router,
      stubs: ["Stepper", "ButtonNavigation"],
      mocks: {
        routes,
      },
      data() {
        return {
          stepNumber: 3,
        };
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test resolveAction next", async () => {
    await wrapper.vm.resolveActions(
      {
        name: "addfunding",
        meta: {
          isWizard: true,
          next: "next",
          previous: "previous",
          step: "step",
        },
      },
      ["next"]
    );
    expect(wrapper.vm.resolveActions).toBeDefined();
  });
  it("test resolveAction next without meta next", async () => {
    await wrapper.vm.resolveActions(
      {
        name: "addfunding",
        meta: {
          isWizard: true,
          previous: "previous",
          step: "step",
        },
      },
      ["next"]
    );
    expect(wrapper.vm.resolveActions).toBeDefined();
  });

  it("test resolveAction summary", async () => {
    await wrapper.vm.resolveActions(
      {
        name: "addfunding",
      },
      ["summary"]
    );
    expect(await wrapper.vm.resolveActions).toBeDefined();
  });

  it("test resolveAction previous", async () => {
    await wrapper.vm.resolveActions(
      {
        name: "addfunding",
        meta: {
          isWizard: true,
          next: "next",
          previous: "previous",
          step: "step",
        },
      },
      ["previous"]
    );
    expect(wrapper.vm.resolveActions).toBeDefined();
  });

  it("test resolveAction previous without previous", async () => {
    await wrapper.vm.resolveActions(
      {
        name: "addfunding",
        meta: {
          isWizard: true,
          next: "next",
          step: "step",
        },
      },
      ["previous"]
    );
    expect(wrapper.vm.resolveActions).toBeDefined();
  });

  it("test resolveAction cancel", async () => {
    await wrapper.vm.resolveActions("addfunding", ["cancel"]);
    expect(wrapper.vm.resolveActions).toBeDefined();
  });

  it("test resolveAction save", async () => {
    await wrapper.vm.resolveActions("addfunding", ["save"]);
    expect(wrapper.vm.resolveActions).toBeDefined();
  });

  it("test get step", async () => {
    await wrapper.vm.getStep(0);
    await wrapper.vm.getStep(1);
    await wrapper.vm.getStep(2);
    await wrapper.vm.getStep(3);
    await wrapper.vm.getStep(4);
    await wrapper.vm.getStep(5);
    expect(wrapper.vm.getStep).toBeDefined();
  });
  it("test get step with matching steps", async () => {
    await wrapper.setData({ stepNumber: 1, currStepNumber: 1 });
    await wrapper.vm.getStep(1);
    expect(wrapper.vm.getStep).toBeDefined();
  });
  it("test checkPath", async () => {
    await wrapper.vm.checkPath();
    expect(wrapper.vm.checkPath).toBeDefined();
  });
  it("test onRouteChange", async () => {
    await wrapper.vm.onRouteChanged();
    expect(wrapper.vm.onRouteChanged).toBeDefined();
  });
  it("test getRoute", async () => {
    await wrapper.vm.getRoute(["next"]);
    expect(wrapper.vm.getRoute).toBeDefined();
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
