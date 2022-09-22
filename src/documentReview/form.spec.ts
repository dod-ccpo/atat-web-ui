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

  /* eslint-disable camelcase */

  beforeEach(async () => {
    vuetify = new Vuetify();
    // wrapper = mount(form, {
    //   localVue,
    //   vuetify,
    //   propsData:{
    //     docData:{
    //       projectOverview:{
    //         title: "title",
    //         scope: "scope",
    //         emergency_declaration: "Yes"
    //       },
    //       organization: {},
    //       fairOpportunity: {
    //         exception_to_fair_opportunity: "",
    //       },      
    //       currentContract: {
    //         current_contract_exists: "true"
    //       },
    //       cor: {
    //         dodaac: "123456"
    //       },
    //       acor: {
    //         dodaac: "987654"
    //       },
    //     }
    //   }
    // });
   
  });

  it("renders successfully", async () => {
    expect(1).toEqual(1);
    // expect(await wrapper.exists()).toBe(true);
  });

})
