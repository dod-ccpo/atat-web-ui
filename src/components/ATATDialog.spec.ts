import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATDialog from "@/components/ATATDialog.vue";
import {DefaultProps} from "vue/types/options";


Vue.use(Vuetify);

describe("Testing ATATDialog Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    jest.useFakeTimers();
    wrapper = mount(ATATDialog, {
      localVue,
      vuetify,
      propsData: {
        title: '',
      }
    });
  });
  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  })

  describe("PROPS", () => {
    it("optional", async () => {
      await wrapper.setProps({
        title: `Bacon ipsum dolor amet ball tip minim shoulder
        buffalo t-bone eu.Strip steak nostrud pancetta ullamcotongue irure`
      });
      expect(wrapper.find(".modalDialogTitle")).toBeDefined();
    });
  });

  describe("METHODS", () => {
    it("fires off cancel event", async () => {
      await wrapper.setProps({showDialog: true});
      jest.advanceTimersByTime(2500);
      expect(wrapper.find('#dialog_cancel')).toBeDefined();

      const cancelBtn = wrapper.find('#dialog_cancel');
      cancelBtn.trigger('click');
      expect(wrapper.vm.onCancel).toBeDefined();
    });

    it("fires off onOk event", async () => {
      await wrapper.setProps({showDialog: true});
      expect(wrapper.find('#dialog_ok')).toBeDefined();

      const okBtn = wrapper.find('#dialog_ok');
      okBtn.trigger('click');
      expect(wrapper.vm.onOK).toBeDefined();
    });
  });
});
