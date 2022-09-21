import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import preview  from "@/documentReview/Preview.vue";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  /* eslint-disable camelcase */

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(preview, {
      localVue,
      vuetify,
      propsData:{
        docData:{
          projectOverview:{
            title: "title",
            scope: "scope",
            emergency_declaration: "Yes"
          },
          organization: {},
          fairOpportunity: {
            exception_to_fair_opportunity: "",
          },      
          currentContract: {
            current_contract_exists: "true"
          }
        }
      }
    });

  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
 
})
  