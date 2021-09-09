import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import fileUpload from "@/components/ATATFileUpload.vue";
// import axios from "axios";
// import VueAxios from "vue-axios";

Vue.use(Vuetify);

describe("Testing ATATFileUpload Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  // localVue.use(VueAxios, axios);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {
    updateWizardStep: jest.fn(),
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
    });
    wrapper = mount(fileUpload, {
      store,
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  it('computed property -> hasErrors', () => {
    
  });
});
