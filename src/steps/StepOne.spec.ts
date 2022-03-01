import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import StepOne from "./ProjectOverview.vuee.vue"
Vue.use(Vuetify);

describe("Testing StepOne View", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  window.alert = jest.fn();
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(StepOne, {
      localVue,
      vuetify,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('no autoComplete fn exist', async () => {
    expect(wrapper.vm.noAutoCompleteResultsAction())
  })
  
});