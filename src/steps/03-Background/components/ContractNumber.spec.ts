import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import {DefaultProps} from "vue/types/options";
import Vue from "vue";
import validators from "@/plugins/validation";
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import ATATTextField from "@/components/ATATTextField.vue";

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;
  localVue.use(validators);

  beforeEach(() => {
    // test
    vuetify = new Vuetify();
    wrapper = mount(ContractNumber, {
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

  it("should work in a form input mode", async () => {
    await wrapper.setData({isForm: true})
    expect(wrapper.findComponent(ATATTextField).element).toBeInTheDOM();
    expect(wrapper.find('dl').element).not.toBeInTheDOM();
  });

  it("should work in a review mode", async () => {
    await wrapper.setData({isForm: false})
    expect(wrapper.findComponent(ATATTextField).element).not.toBeInTheDOM();
    expect(wrapper.find('dl').element).toBeInTheDOM();
  });
});
