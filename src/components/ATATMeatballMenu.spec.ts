import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";

Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATMeatballMenu, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("menuItemClick() - emits clicked item", async () => {
    wrapper.vm.menuItemClick("foo");
    expect(wrapper.emitted().menuItemClick).toBeTruthy();
  })

  it("getIdText() - removes spaces etc from string", async () => {
    const str = wrapper.vm.getIdText("Foo Bar");
    expect(str).toBe("FooBar");
  })


});
