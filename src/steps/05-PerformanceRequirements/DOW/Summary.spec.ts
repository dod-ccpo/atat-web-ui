import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Summary from "../DOW/Summary.vue"
import { DefaultProps } from "vue/types/options";
import DescriptionOfWork from "@/store/descriptionOfWork";
Vue.use(Vuetify);

describe("Testing ServiceOfferingDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);  
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Summary, {
      localVue,
      vuetify,
    });
  });

  describe("Summary", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("setIsIncomplete() - ", async () => {
      await wrapper.setData({
        serviceGroupsMissingData: ['dummyServiceOffering']
      })
      await wrapper.vm.setIsIncomplete();
      expect(DescriptionOfWork.isIncomplete).toBe(true);
    })
  });




});
