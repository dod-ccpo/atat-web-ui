import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import validators from "@/plugins/validation";
import DoDAAC from "@/steps/01-AcquisitionPackageDetails/components/DoDAAC.vue";
import ATATTextField from "@/components/ATATTextField.vue";

describe("Testing DoDAAC Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;
  localVue.use(validators);

  beforeEach(() => {
    // test
    vuetify = new Vuetify();
    wrapper = mount(DoDAAC, {
      localVue,
      vuetify,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("sets value on input focus", async () => {
    wrapper.vm.onFocus("foo");    
    expect(wrapper.vm.$data.valueOnFocus).toBe("foo");
  });
  it("sets value on input blur", async () => {
    wrapper.vm.$data.valueOnFocus = "foo";
    wrapper.vm.onBlur("bar");   
    expect(wrapper.emitted().valueChange).toBeTruthy(); 

  });


});
