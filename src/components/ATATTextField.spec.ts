import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATTextField from "@/components/ATATTextField.vue";
import {DefaultProps} from "vue/types/options";
Vue.use(Vuetify);

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let textField: Wrapper<Vue,Element>;
  // let textField: HTMLInputElement;
  const propsId = "testId";
  const id = "#" + propsId + "_text_field";
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTextField, {
      localVue,
      vuetify,
      propsData: {
        id: propsId,
      },
    });
    textField = wrapper.find(id);
  });

  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("EVENTS", () => { 
    it("onInput", async () => {
      // const spy = jest.spyOn(wrapper.vm, "onInput");
      // await wrapper.vm.onInput("newInputValue")
      // expect(spy).toHaveBeenCalled();
      textField.trigger("input");
      await wrapper.vm.$nextTick(()=>{
        console.log(wrapper.emitted());
      })
    });

    // it("onBlur", async () => {
    //   // const spy = jest.spyOn(wrapper.vm, "onBlur");
    //   // await wrapper.vm.onBlur("")
    //   // expect(spy).toHaveBeenCalled();
      
    //   textField.trigger("blur");
    //   await wrapper.vm.$nextTick(()=>{
    //     console.log(wrapper.emitted().blur);
    //   })
      
    // });
  });
});
