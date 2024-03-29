import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VueWrapper, shallowMount, mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import ATATFileUpload from "@/components/ATATFileUpload.vue";

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
  const vuetify = createVuetify({
    components,
    directives,
  })
  let wrapper: VueWrapper
  let vm: typeof wrapper.vm.$options
  beforeEach(() => {
    wrapper = mount(ATATFileUpload,{
      props: {
        attachmentServiceName: 'x_g_dis_atat_funding_request_mipr',
        id: 'test',
        validFileFormats: ['xls', 'pdf'],
        maxFileSizeInBytes: 10000000000,
      },
      global: {
        plugins: [vuetify]
      }
    })
    vm =  (wrapper.vm as typeof wrapper.vm.$options)
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("get isFileUploadDisplayed() - supply neceessary data to return true ", async () => {
    wrapper.setProps({
      multiplesAllowed: true
    });
    const _isFileUploadDisplayed = await vm.isFileUploadDisplayed;
    expect(_isFileUploadDisplayed).toBe(true);
  })

  it("get isFileUploadDisplayed() - supply neceessary data to return false ", async () => {
    await wrapper.setProps({
      multiplesAllowed: false,
      validFiles: [validFiles[0]]
    })
    const _isFileUploadDisplayed = await vm.isFileUploadDisplayed;
    expect(_isFileUploadDisplayed).toBe(false);
  })


  it.skip("fileUploadClicked() - process `browse to upload` link event to " +
    "ensure data.isFullSize===true ", async () => {
    wrapper.setData({
      maxNumberOfFiles: 4,
      errorMessages: ["error 01"]
    });
    wrapper.setProps({
      validFiles
    })
    const link = wrapper.find("#BrowseToUpload");
    await link.trigger("mousedown", {
      classList: vi.fn(() => ['_text_link'])
    });

    //ensure this.reset() has been called
    wrapper.vm.$nextTick(() => {
      expect(vm.$data.errorMessages).toHaveLength(0);
      expect(vm.$data.isFullSize).toBe(true);
    })
  })

  //TODO do we need this after the vuetify upgrade?
  it.skip("fileUploadChanged() - remove vuetify's `residue` text when event is called ", 
    async () => {
      wrapper.setData({
        fileUploadControl: {
          files: []
        }
      });
      const vuetifyFileUploadStatus = wrapper.find(".v-file-input__text");
      vuetifyFileUploadStatus.element.innerHTML =
      "`residue` text supplied by vuetify when a file is successfully uploaded"
      vm.fileUploadChanged();
      vm.$nextTick(()=>{
        expect(vuetifyFileUploadStatus.text()).toBe("");
      })
    })

  it("onDragEnter() - process event to ensure that data.isHovering===true && " +
    "reset() is called", async () => {
    const wrapper:VueWrapper = mount(ATATFileUpload,{
      props: {
        attachmentServiceName: 'x_g_dis_atat_funding_request_mipr',
        id: 'test',
        validFileFormats: ['xls', 'pdf'],
        maxFileSizeInBytes: 10000000000
      },
      global: {
        plugins: [vuetify]
      }
    })
    const vm =  (wrapper.vm as typeof wrapper.vm.$options)
    wrapper.setData({
      isFullSize: false,
      errorMessages: ["error 01"],
    });
    const eventDiv = await wrapper.find(
      "#" + vm.$props.id + "EventDiv"
    );
    await eventDiv.trigger("dragenter");
    expect(vm.$data.isHovering).toBe(true);
    //ensure this.reset() has been called
    expect(vm.$data.errorMessages).toHaveLength(0);
    expect(vm.$data.isFullSize).toBe(true);
  });

  it.skip("addDropFile() - process `drop.prevent` event to ensure that " +
    "data.isHovering===false && reset() is called", async () => {
    // class MockDragEvent extends Event {
    //   constructor(type:any, dataTransfer:any) {
    //     super(type);
    //     this.dataTransfer = dataTransfer;
    //   }
    // }
    // render vue get isFileUploadDisabled === false
    await wrapper.setProps({
      multiplesAllowed: false,
      validFiles: [validFiles[0]],
      id: 'helloWorld'
    })
    expect(await vm.isFileUploadDisplayed).toBe(false);


    await wrapper.setData({
      isHovering: true,
    });

    await wrapper.setData({
      isFileUploadDisplayed: true
    })
    const eventDiv = await wrapper.find(
      "#" + vm.$props.id + "EventDiv"
    );
    //await eventDiv.trigger("drop.prevent");
    await vm.addDropFile(eventDiv.element.dispatchEvent(new DragEvent('drop.prevent')))
    //await vm.addDropFile(eventDiv.element.dispatchEvent('drop.prevent'))
    vm.$nextTick(()=>{
      expect(vm.$data.isHovering).toBe(true);
    })
  });
  //TODO this.$refs to be addressed
  it.skip("removeInvalidFiles() - logs file with bad extension to props.invalidFiles", async ()=>{
    fileList[0] = fileWithBadExtension
    await vm.removeInvalidFiles(fileList);
    expect(await vm.$props.invalidFiles[0].file.name).toBe(
      fileList[0].name
    )
  })

  it.skip("removeInvalidFiles() - logs file that is too big to props.invalidFiles", async ()=>{
    await vm.removeInvalidFiles(fileList);
    expect(await vm.$props.invalidFiles[0].file.name).toBe(
      fileList[0].name
    )
  })

  it.skip("removeInvalidFiles() - logs file already uploaded to props.invalidFiles", async ()=>{
    await wrapper.setProps({
      validFiles:validFiles
    })
    fileList[0] = validFile01;
    
    // validFiles.some(vf=> vf.name===fileList[0].name)
    await vm.removeInvalidFiles(fileList);
    expect(await vm.$props.invalidFiles[0].file.name).toBe(
      fileList[0].name
    )
  })
  //TODO Fix $refs
  it.skip("removeInvalidFiles() - number of files that may be added to " + 
    "be added to props.validFiles may not exceed props.maxNumberOfFiles", async ()=>{
    await wrapper.setProps({
      maxNumberOfFiles: 0,
      validFiles: validFiles
    })
    fileList[0] = validFile04;
    const initialLength = vm.$props.validFiles.length;
    await vm.removeInvalidFiles(fileList);
    expect(await vm.$props.validFiles.length).toEqual(
      initialLength + vm.$props.maxNumberOfFiles
    )
  });

  it("uploadFiles() - ", async ()=>{
    await wrapper.setProps({
      validFiles: [validFiles[2]],// getting a file that isUploaded===false
      fileAttachmentService: {
        upload: ()=>{return true}
      }
    });
    
  });


}); 
