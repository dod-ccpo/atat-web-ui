import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import ReviewDocuments from "@/steps/11-GeneratePackageDocuments/components/ReviewDocuments.vue";
Vue.use(Vuetify);

describe("Testing ReviewDocuments component ", () => {
  const localVue = createLocalVue();
  const vuetify = new Vuetify();
  const wrapper = mount(ReviewDocuments, {
    localVue,
    vuetify,
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
});
  
  