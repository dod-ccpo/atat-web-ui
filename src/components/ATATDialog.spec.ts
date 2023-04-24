import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATDialog from "@/components/ATATDialog.vue";
import { DefaultProps } from "vue/types/options";

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

  describe("METHODS", () => {
    it("onCancel() - sets props.showDialog===true, clicks cancel button " +
      "to test if !props.showDialog", async () => {
      await wrapper.setProps({ showDialog: true });
      wrapper.find('#dialog_cancel').trigger("click");
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.showDialog).toBe(false);
      });
    });

    it("onCancel() - sets props.showDialog===true, clicks cancel button " +
      "to test if `cancelClicked` was emitted", async () => {
      await wrapper.setProps({ showDialog: true });
      wrapper.find('#dialog_cancel').trigger("click");
      Vue.nextTick(() => {
        expect(wrapper.emitted('cancelClicked')).tobeTruthy();
      });
    });

    it("onOK() - sets props.showDialog===true, clicks OK button " +
    "to test if !props.showDialog", async () => {
      await wrapper.setProps({ showDialog: true });
      wrapper.find('#dialog_ok').trigger("click");
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.showDialog).toBe(false);
      });
    });

    it("onOK() - sets props.showDialog===true, clicks OK button " +
    "to test if `ok` was emitted", async () => {
      await wrapper.setProps({ showDialog: true });
      wrapper.find('#dialog_ok').trigger("click");
      Vue.nextTick(() => {
        expect(wrapper.emitted('ok')).tobeTruthy();
      });
    });

    it("getTitle() - sets title to over 60 characters to return truncated " +
        "title with ellipses at the 61st character", async () => {
      // set prop with 70 char title
      await wrapper.setProps({ 
        truncate: true,
        title:  "Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesua"
      });
      
      expect(await wrapper.vm.getTitle).toBe(
        "Nam quis nulla. Integer malesuada. In in enim a arcu imperdi..."
      );
    });

    it("getTitle() - sets title to under 60 characters to return " +
        "non-truncated title", async () => {
      // set prop with 59 char title
      await wrapper.setProps({ 
        title:  "Nam quis nulla. Integer malesuada. In in enim a arcu imperd"
      });
      
      expect(await wrapper.vm.getTitle).toBe(
        "Nam quis nulla. Integer malesuada. In in enim a arcu imperd"
      );
    });

    it ("returnFocus() - provides id to mocked element and expects mocked element " + 
    "to have focus",
    async ()=>{
      document.body.innerHTML = "<a name='mockedLink' id='mockedLink'>Mocked Link</a>";
      jest.spyOn(document,"getElementById");
      await wrapper.vm.returnFocus("mockedLink");
      Vue.nextTick(()=>{
        expect(document.getElementById("mockedLink")).toHaveFocus();
      })
    })
  });
});
