import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import VueRouter from "vue-router";
import store from "../../../../store";
import { createLocalVue, mount } from "@vue/test-utils";
import PortfolioValidationSummary from "@/views/wizard/Step5/components/PortfolioValidationSummary.vue";

Vue.use(Vuetify);

describe("Testing PortfolioValidationSummary Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;
  const item = {
    id: "75",
    title: "Portfolio Validation Summary",
    description: "Portfolio Validation Summary",
    name: "Portfolio Validation Summary",
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioValidationSummary, {
      store,
      router,
      localVue,
      vuetify,
      propsData: {
        items: {
          id: "75",
          title: "Portfolio Validation Summary",
          description: "Portfolio Validation Summary",
          name: "Portfolio Validation Summary",
        },
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("Review button click success", async () => {
    const editButton = wrapper.find("button");
    expect(editButton.exists()).toBe(true);
    await editButton.trigger("click");
    await wrapper.vm.onReviewPortfolioItem(item);
  });
});
