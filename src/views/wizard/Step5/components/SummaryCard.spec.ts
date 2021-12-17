import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import SummaryCard from "@/views/wizard/Step5/components/SummaryCard.vue";

Vue.use(Vuetify);

describe("Testing SummaryCard Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SummaryCard, {
      router,
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("edit button click success", async () => {
    const editButton = wrapper.find("button");
    expect(editButton.exists()).toBe(true);
    await editButton.trigger("click");
    await wrapper.vm.handleClicked("Test");
  });
});
