import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import VueRouter from "vue-router";
import ATATModalDelete from "@/components/ATATModalDelete.vue";
Vue.use(Vuetify);

describe("Testing ATATModalDelete Component", () => {
  const localVue = createLocalVue();
  localVue.use(VueRouter);
  const router = new VueRouter();
  let vuetify: any;
  let wrapper: any;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATModalDelete, {
      router,
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("method > cancel dialog ", async () => {
    await wrapper.setProps({ showDialogWhenClicked: true });
    const cancelDialog = await wrapper.find("#dialog_cancel");
    expect(cancelDialog.exists()).toBe(true);
    await cancelDialog.trigger("click");
    await wrapper.vm.cancelItem();
  });

  it("method > delete dialog ", async () => {
    await wrapper.setProps({ showDialogWhenClicked: true });
    const cancelDialog = await wrapper.find("#dialog_ok");
    expect(cancelDialog.exists()).toBe(true);
    await cancelDialog.trigger("click");
    await wrapper.vm.deleteItem();
  });
  it("testing setFocus W/O newVal", async () => {
    await wrapper.vm.setFocus();
    expect(wrapper.vm.setFocus()).toBe(undefined);
  });
});
