import Vue from "vue";
import Vuetify from "vuetify";
Vue.use(Vuetify);
Vue.config.productionTip = false;

import StyledFields from "@/components/StyledFields.vue";

import { mount } from "@vue/test-utils";

 describe("Testing Button Navigation Bar", () => {
 
  describe("Component Initialization", () => {
    it("wizard page", () => {
      expect(true);
    });
    
    it("button navigation bar", () => {
      expect(true);
    });
    it("button navigation bar::data structure", () => {
      expect(true);
    });
    
  });
  describe("Testing Interactivity", () => {
    
    it("Step 1 - Click to save and close", () => {
      expect(true);
    });
    
    it("Step 1 - Click to advance to step 2", () => {
      expect(true);
    });

    it("Step 2 - Validate Button", () => {
      expect(true);
    });

    it("Step 2 - Click to return to step 1", () => {
      expect(true);
    });
  });



  //   const vuetify = new Vuetify();
//   it("renders props.msg when passed", () => {
//     const msg = "Hello World";

//     const wrapper = mount(StyledFields, {
//       vuetify,
//       stubs: ["atat-select", "atat-text-field"],
//       propsData: { msg },
//     });
//     expect(true);
//     expect(wrapper.text()).toMatch(msg);
//   });
});
