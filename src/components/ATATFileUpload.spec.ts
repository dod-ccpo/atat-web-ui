import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
// import {
//   AttachmentService,
//   AttachmentServiceFactory,
// } from "@/services/attachment";

import ATATFileUpload from "@/components/ATATFileUpload.vue";
Vue.use(Vuetify);

const validFiles = [
  { 
    "file": "[object File]", 
    "fileName": "dummyFileName 01.pdf", 
    "created": 1659355539053, 
    "progressStatus": 100, 
    "link": "/api/now/attachment/dummyFile01/file", 
    "attachmentId": "dummyFile01", 
    "recordId": "recordID01", 
    "isErrored": false, 
    "isUploaded": true 
  }, 
  { 
    "file": "[object File]", 
    "fileName": "dummyFileName 02.pdf", 
    "created": 1623267251691, 
    "progressStatus": 100, 
    "link": "/api/now/attachment/dummyFile02/file", 
    "attachmentId": "dummyFile02", 
    "recordId": "recordID02", 
    "isErrored": false, 
    "isUploaded": true 
  },
  { 
    "file": "[object File]", 
    "fileName": "dummyFileName 03.pdf", 
    "created": 1623267251691, 
    "progressStatus": 100, 
    "link": "/api/now/attachment/dummyFile03/file", 
    "attachmentId": "dummyFile03", 
    "recordId": "recordID03", 
    "isErrored": false, 
    "isUploaded": true 
  }
]

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATFileUpload, {
      localVue,
      vuetify,
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });


  it("fileUploadClicked() - process `browse to upload` link event to " + 
     "ensure data.isFullSize===true ", async () => {
    wrapper.setData({
      maxNumberOfFiles: 4,
      errorMessages: ["error 01"]
    });
    wrapper.setProps({
      validFiles
    })
    const link = await wrapper.find("#BrowseToUpload");
    await link.trigger("mousedown", {
      classList: jest.fn(() => ['_text_link'])
    });

    //ensure this.reset() has been called
    Vue.nextTick(()=>{
      expect(wrapper.vm.$data.errorMessages).toHaveLength(0);
      expect(wrapper.vm.$data.isFullSize).toBe(true);
    })
  })

  it("fileUploadClicked() - process `browse to upload` link event to " + 
  "ensure data.isFullSize===true ", async () => {
    wrapper.setData({
      maxNumberOfFiles: 4,
      errorMessages: ["error 01"]
    });
    wrapper.setProps({
      validFilesy
      
    })
    console.log('from test 02')
    const div = await wrapper.find("div.content")
    await div.trigger("mousedown");

    //ensure this.reset() has been called
    Vue.nextTick(()=>{
      expect(wrapper.vm.$data.errorMessages).toHaveLength(0);
      expect(wrapper.vm.$data.isFullSize).toBe(true);
    })
  })

  // it("fileUploadChanged() - process event target ", async () => {
  //   wrapper.setData({
  //     maxNumberOfFiles: 4
  //   });
  //   wrapper.setProps({
  //     validFiles
  //   })
  //   const link = await wrapper.find("#BrowseToUpload");
  //   await link.trigger("mousedown", {
  //     classList: jest.fn(() => ['_text_link'])
  //   });
  //   expect(await wrapper.vm.reset()).toHaveBeenCalled();
  //   expect(await wrapper.vm.$data.isFullSize).toBe(true);
  // })
});
