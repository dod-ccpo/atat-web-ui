import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import fileUpload from "@/components/ATATFileUpload.vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(Vuetify);
Vue.use(VueAxios, axios);

describe("Testing ATATFileUpload Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  // localVue.use(VueAxios, axios);
  let vuetify: any;
  let wrapper: any;
  let store: any;
  const actions: any = {
    updateWizardStep: jest.fn(),
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    store = new Vuex.Store({
      actions,
    });
    wrapper = mount(fileUpload, {
      store,
      localVue,
      vuetify,
      stubs: [
        "v-virtual-scroll",
        "v-flex",
        "v-sheet",
        "v-card",
        "v-card-text",
        "v-row",
        "v-icon",
        "v-btn",
        "v-list-item",
        "v-list-item-content",
        "v-list-item-title",
      ],
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("computed property -> hasErrors", async () => {
    await wrapper.setData({
      errorMessages: [],
    });
    expect(wrapper.vm.hasErrors).toBe(false);

    await wrapper.setData({
      errorMessages: ["Invalid Data"],
    });
    expect(wrapper.vm.hasErrors).toBe(true);
  });

  it("computed property -> isFileUploaded", async () => {
    await wrapper.setData({
      uploadedFile: [],
    });
    expect(wrapper.vm.isFileUploaded).toBe(false);

    await wrapper.setData({
      uploadedFile: [{ name: "validpdf.pdf" }],
    });
    expect(wrapper.vm.isFileUploaded).toBe(true);
  });

  it("computed property -> showBorderState", async () => {
    await wrapper.setData({
      isFileUploadedSucessfully: true,
    });
    expect(wrapper.vm.showBorderState).toBe("success-file-upload-border");
    // wrapper.vm.isFileUploaded === false;
    await wrapper.setData({
      isFileUploadedSucessfully: false,
      isProgressBarVisible: true,
    });
    expect(wrapper.vm.showBorderState).toBe("primary-file-upload-border");
  });

  it("watch -> errorMessageFromParent", async () => {
    await wrapper.setData({
      errorMessages: ["error message"],
    });
    await wrapper.setProps({
      errorMessageFromParent: "New Error Message",
    });
    expect(wrapper.vm.errorMessages.length).toBe(2);
  });
});
