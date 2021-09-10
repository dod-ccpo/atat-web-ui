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
        "fileInput",
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

  it("method > openFileDialog ", async () => {
    const openFileDialogButton = await wrapper.find("#open-file-dialog");
    openFileDialogButton.trigger("click");

    expect(wrapper.find({ ref: "fileInput" }).exists()).toBe(true);
  });

  it("method > addUploadedFile", async () => {
    const event = {
      target: {
        files: [
          {
            name: "pdfFile.pdf",
            lastModified: 1623265616555,
            lastModifiedDate: new Date(),
            size: 4567893,
            type: "application/pdf",
          },
        ],
      },
    };
    const addUploadedFileSpy = jest.spyOn(wrapper.vm, "addUploadedFile");
    // https://zaengle.com/blog/mocking-file-upload-in-vue-with-jest
    const fileInput = await wrapper.find("#file-input-button");
    fileInput.trigger("change");
    await wrapper.vm.addUploadedFile(event, event.target.files);
    expect(addUploadedFileSpy).toHaveBeenCalledWith(event, event.target.files);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(true);
  });
});
