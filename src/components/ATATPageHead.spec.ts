import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATPageHead from "@/components/ATATPageHead.vue";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const headline = "Test Heading";

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATPageHead, {
      localVue,
      vuetify,
      propsData: {
        headline,
      }
    });
  });

  describe("INITIALIZATION", () => { 
      it("renders successfully", async () => {
        expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("headline", async()=>{
      const headerSpan = wrapper.find(".h3");
      expect(headerSpan).toBeDefined;
      expect(headerSpan.text()).toBe(headline)
    });
  });

  describe("CONTENT", () => { 
    it("has expected buttons", async()=>{
      const personButton = wrapper.find("#Person_Button");
      expect(personButton).toBeDefined;
      const personIcon = personButton.find(".v-icon");
      expect (personIcon.text()).toBe("person_add_alt_1");

      const moreButton = wrapper.find("#More_Button");
      expect(moreButton).toBeDefined;
      const moreIcon = moreButton.find(".v-icon");
      expect (moreIcon.text()).toBe("more_horiz");
    });
  });

});