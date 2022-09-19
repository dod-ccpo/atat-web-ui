import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import form  from "@/documentReview/Form.vue";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(form, {
      localVue,
      vuetify,
      propsData:{
        docData:{
          acqPackage:{
            title: "title",
            scope: "scope",
            // eslint-disable-next-line camelcase
            emergency_declaration: "Yes"
          }
        }
      }
    });
   
  });

  it("renders successfully", async () => {
    expect(await wrapper.exists()).toBe(true);
  });

})
