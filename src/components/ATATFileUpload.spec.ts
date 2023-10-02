import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import {
  AttachmentService
} from "@/services/attachment/base";

import ATATFileUpload from "@/components/ATATFileUpload.vue";
import { Verify } from "crypto";
Vue.use(Vuetify);



const validFiles = [
  {
    "file":  {
      "lastModified": new Date("08/24/2022").getMilliseconds(),
      "lastModifiedDate": new Date("08/24/2022"),
      "name": "dummyFileName 01.pdf",
      "size": 73529,
      "type": "application/pdf",
      "webkitRelativePath": ""
    },
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
    "file":  {
      "lastModified": new Date("08/23/2022").getMilliseconds(),
      "lastModifiedDate": new Date("08/23/2022"),
      "name": "dummyFileName 02.pdf",
      "size": 9876554,
      "type": "application/pdf",
      "webkitRelativePath": ""
    },
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
    "file":  {
      "lastModified": new Date("08/21/2022").getMilliseconds(),
      "lastModifiedDate": new Date("08/21/2022"),
      "name": "dummyFileName 03.pdf",
      "size": 765654,
      "type": "application/pdf",
      "webkitRelativePath": ""
    },
    "fileName": "dummyFileName 03.pdf",
    "created": 1623267251691,
    "progressStatus": 100,
    "link": "/api/now/attachment/dummyFile03/file",
    "attachmentId": "dummyFile03",
    "recordId": "recordID03",
    "isErrored": false,
    "isUploaded": false
  },
]

const validFile01 = {
  "lastModified": new Date("08/24/2022").getMilliseconds(),
  "lastModifiedDate": new Date("08/24/2022"),
  "name": "dummyFileName 01.pdf",
  "size": 73529,
  "type": "application/pdf",
  "webkitRelativePath": ""
} as unknown as File

const validFile02 = {
  "lastModified": new Date().getMilliseconds(),
  "lastModifiedDate": new Date(),
  "name": "dummyFileName file02.pdf",
  "size": 73529,
  "type": "application/pdf",
  "webkitRelativePath": ""
} as unknown as File

const validFile03 = {
  "lastModified": new Date().getMilliseconds(),
  "lastModifiedDate": new Date(),
  "name": "dummyFileName file03.pdf",
  "size": 73529,
  "type": "application/pdf",
  "webkitRelativePath": ""
} as unknown as File

const validFile04 = {
  "lastModified": new Date().getMilliseconds(),
  "lastModifiedDate": new Date(),
  "name": "dummyFileName file04.pdf",
  "size": 73529,
  "type": "application/pdf",
  "webkitRelativePath": ""
} as unknown as File

const fileWithBadExtension = {
  "lastModified": new Date().getMilliseconds(),
  "lastModifiedDate": new Date(),
  "name": "filewithbadextension.trr",
  "size": 73529,
  "type": "application/pdf",
  "webkitRelativePath": ""
} as unknown as File

const fileThatIsTooBig = {
  "lastModified": new Date().getMilliseconds(),
  "lastModifiedDate": new Date(),
  "name": "fileThatIsTooBig.pdf",
  "size": 107374182490,
  "type": "application/pdf",
  "webkitRelativePath": ""
} as unknown as File

const fileList = {
  0: validFile01,
  1: validFile02,
  2: validFile03,
  length: 3,
  item: (index: number) => File
};

describe("Testing ATATTextField Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATFileUpload, {
      localVue,
      vuetify,
      propsData: {
        attachmentServiceName: "x_g_dis_atat_funding_request_mipr",
        id: "test",
        validFileFormats: ["xls", "pdf"]
      }
    });
  });
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("get isFileUploadDisplayed() - supply neceessary data to return true ", async () => {
    wrapper.setData({
      multiplesAllowed: true
    });
    const _isFileUploadDisplayed = await wrapper.vm.isFileUploadDisplayed;
    expect(_isFileUploadDisplayed).toBe(true);
  })

  it("get isFileUploadDisplayed() - supply neceessary data to return true ", async () => {
    await wrapper.setProps({
      multiplesAllowed: false,
      validFiles: [validFiles[0]]
    })
    const _isFileUploadDisplayed = await wrapper.vm.isFileUploadDisplayed;
    expect(_isFileUploadDisplayed).toBe(false);
  })


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
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.errorMessages).toHaveLength(0);
      expect(wrapper.vm.$data.isFullSize).toBe(true);
    })
  })

  it("fileUploadChanged() - remove vuetify's `residue` text when event is called ", async () => {
    wrapper.setData({
      fileUploadControl: {
        files: []
      }
    });
    const vuetifyFileUploadStatus = wrapper.find(".v-file-input__text");
    vuetifyFileUploadStatus.element.innerHTML =
      "`residue` text supplied by vuetify when a file is successfully uploaded"
    wrapper.vm.fileUploadChanged();
    Vue.nextTick(()=>{
      expect(vuetifyFileUploadStatus.text()).toBe("");
    })
  })

  it("onDragEnter() - process event to ensure that data.isHovering===true && " +
    "reset() is called", async () => {
    wrapper.setData({
      isFullSize: false,
      errorMessages: ["error 01"]
    });
    const eventDiv = await wrapper.find(
      "#" + wrapper.vm.$props.id + "EventDiv"
    );
    await eventDiv.trigger("dragenter");
    expect(wrapper.vm.$data.isHovering).toBe(true);
    //ensure this.reset() has been called
    expect(wrapper.vm.$data.errorMessages).toHaveLength(0);
    expect(wrapper.vm.$data.isFullSize).toBe(true);
  });

  it("addDropFile() - process `drop.prevent` event to ensure that " +
    "data.isHovering===false && reset() is called", async () => {

    // render vue get isFileUploadDisabled === false
    await wrapper.setProps({
      multiplesAllowed: false,
      validFiles: [validFiles[0]]
    })
    expect(await wrapper.vm.isFileUploadDisplayed).toBe(false);


    await wrapper.setData({
      isHovering: true,
    });
    const eventDiv = await wrapper.find(
      "#" + wrapper.vm.$props.id + "EventDiv"
    );
    await eventDiv.trigger("drop.prevent");
    Vue.nextTick(()=>{
      expect(wrapper.vm.$data.isHovering).toBe(false);
    })
  });

  it("removeInvalidFiles() - logs file with bad extension to props.invalidFiles", async ()=>{
    fileList[0] = fileWithBadExtension
    await wrapper.vm.removeInvalidFiles(fileList);
    expect(await wrapper.vm.$props.invalidFiles[0].file.name).toBe(
      fileList[0].name
    )
  })

  it("removeInvalidFiles() - logs file that is too big to props.invalidFiles", async ()=>{
    fileList[0] = fileThatIsTooBig
    await wrapper.vm.removeInvalidFiles(fileList);
    expect(await wrapper.vm.$props.invalidFiles[0].file.name).toBe(
      fileList[0].name
    )
  })

  it("removeInvalidFiles() - logs file already uploaded to props.invalidFiles", async ()=>{
    await wrapper.setProps({
      validFiles:validFiles
    })
    fileList[0] = validFile01;
    
    // validFiles.some(vf=> vf.name===fileList[0].name)
    await wrapper.vm.removeInvalidFiles(fileList);
    expect(await wrapper.vm.$props.invalidFiles[0].file.name).toBe(
      fileList[0].name
    )
  })

  it("removeInvalidFiles() - number of files that may be added to " + 
    "be added to props.validFiles may not exceed props.maxNumberOfFiles", async ()=>{
    await wrapper.setProps({
      maxNumberOfFiles: 0,
      validFiles: validFiles
    })
    fileList[0] = validFile04;
    const initialLength = wrapper.vm.$props.validFiles.length;
    await wrapper.vm.removeInvalidFiles(fileList);
    expect(await wrapper.vm.$props.validFiles.length).toEqual(
      initialLength + wrapper.vm.$props.maxNumberOfFiles
    )
  });

  it("uploadFiles() - ", async ()=>{
    await wrapper.setProps({
      validFiles: [validFiles[2]],// getting a file that isUploaded===false
      fileAttachmentService: {
        upload: ()=>{return true}
      }
    });
    

    // jest.spyOn(global, "setTimeout").mockImplementation(()=> (0 void) );
    // // jest.spyOn(AttachmentService, "upload").mockImplementation(()=>{
    // //     return true
    // // })
    // await wrapper.vm.uploadFiles;yyyy
  });


}); 
