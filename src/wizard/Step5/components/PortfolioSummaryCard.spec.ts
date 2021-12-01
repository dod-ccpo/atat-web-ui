import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuex from "vuex";
import PortfolioSummaryCard from "@/wizard/Step5/components/PortfolioSummaryCard.vue";

Vue.use(Vuetify);

describe("Testing PortfolioSummaryCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(Vuex);
  const router = new VueRouter();
  let vuetify: any;
  let store: any;
  let wrapper: any;
  const state = {};

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store(state);
    wrapper = mount(PortfolioSummaryCard, {
      localVue,
      router,
      vuetify,
      store,
      propsData: {
        portfolio: {
          name: "Tracker",
          description: "Test",
          dod_components: [],
          csp: "CSP1",
        },
        dataItems: [],
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Edit button click success", async () => {
    const editButton = wrapper.find("button");
    expect(editButton.exists()).toBe(true);
    await editButton.trigger("click");
    await wrapper.vm.onEdit();
  });
});
