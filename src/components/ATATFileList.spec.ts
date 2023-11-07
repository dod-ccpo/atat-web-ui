import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount } from "@vue/test-utils";
import ATATFileList from "@/components/ATATFileList.vue";

const validFiles = [
  {
    "file": "[object File1]",
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
    "file": "[object File1]",
    "fileName": "dummyFileName 02.pdf",
    "created": 1659355539053,
    "progressStatus": 100,
    "link": "/api/now/attachment/dummyFile02/file",
    "attachmentId": "dummyFile02",
    "recordId": "recordID02",
    "isErrored": false,
    "isUploaded": true
  },
]

const uploadingFiles = [
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
      "lastModified": new Date("08/24/2022").getMilliseconds(),
      "lastModifiedDate": new Date("08/24/2022"),
      "name": "dummyFileName 02.pdf",
      "size": 73529,
      "type": "application/pdf",
      "webkitRelativePath": ""
    },
    "fileName": "dummyFileName 02.pdf",
    "created": 1659355539053,
    "progressStatus": 100,
    "link": "/api/now/attachment/dummyFile02/file",
    "attachmentId": "dummyFile02",
    "recordId": "recordID01",
    "isErrored": false,
    "isUploaded": true
  }
]


describe("Testing ATATFileList Component", () => {
  
  let wrapper:VueWrapper
  let vm:any
  
  beforeEach(() => {
    wrapper = shallowMount(ATATFileList, {
      props: {
        validFiles,
        multiplesAllowed: false,
        title: 'dummyFile'
      },
      global: {
        plugins: []
      }
    })
    vm =  (wrapper.vm as typeof wrapper.vm.$options)
  })
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('It renders with uploaded file', ()=> {
    //type vm: = typeof wrapper.vm.$options._component.methods
    //(wrapper.vm as typeof wrapper.vm.$options._component.methods).setFilesToDisplay()
    vm.setFilesToDisplay()
    //(wrapper.vm as vm).setFilesToDisplay()
    const title = vm.getFileUploadsDivTitle()
    expect(title).toBe('dummyFile')
    // expect(wrapper.vm.uploadingFiles.length).toBeGreaterThan(0)
    // expect(wrapper.vm.validFiles.length).toBeGreaterThan(0)
  })

  it("getFileUploadsDivTitle() - supplies data.multiplesAllowed=true to set plural headline",
    async ()=>{
      await wrapper.setProps({
        multiplesAllowed: true,
        title:""
      })
      await wrapper.setData({
        uploadingFiles: uploadingFiles//: {...uploadingFiles}
      })
      const headline = await vm.getFileUploadsDivTitle();
      expect(headline).toBe("Your Uploads");
    })

  it("getFileUploadsDivTitle() - supplies data.multiplesAllowed=true to set singular headline",
    async ()=>{
      await wrapper.setProps({
        multiplesAllowed: true,
        title:""
      })
      await wrapper.setData({
        uploadingFiles: uploadingFiles[0]
      })
      const headline = await vm.getFileUploadsDivTitle();
      expect(headline).toBe("Your Upload");
    })

  it("getFileUploadsDivTitle() - supplies data to return empty headline",
    async ()=>{
      await wrapper.setProps({
        multiplesAllowed: false,
        title:""
      });
      const headline = await vm.getFileUploadsDivTitle();
      expect(headline).toBe("");
    })
  
  it("removeFiles() - provides index of file to remove to see delete event has been emitted",
    async()=>{
      const idx=0;
      await wrapper.setData({
        uploadingFiles: uploadingFiles
      });
      const file = uploadingFiles[idx]
      await vm.removeFiles(idx);
      //vm.$nextTick(()=>{
      expect(wrapper.emitted("delete")?.flat()[idx]).toEqual(
        file
      );
      //});
    })
  
  it("onCancelClicked() - sets holdIdxForRemoval and showDialog", () => {
    
    
    wrapper.setData({
      holdIdxForRemoval: 'test',
      showDialog: 'test'
    })

    vm.onCancelClicked();
    expect(vm.holdIdxForRemoval).toBe(undefined);
    expect(vm.showDialog).toBe(false);
  })

  it("onRemoveClicked() - sets showDialog when holdIdxForRemoval is undefined", () => {
    vm.holdIdxForRemoval = undefined;
    vm.showDialog = 'test';
    vm.onRemoveClicked();
    expect(vm.holdIdxForRemoval).toBe(undefined);
    expect(vm.showDialog).toBe(false);
  })

  // eslint-disable-next-line max-len
  it("onRemoveClicked() - sets showDialog when holdIdxForRemoval is defined, and removes the file", () => {
    vm.holdIdxForRemoval = 'test';
    vm.showDialog = 'test';
    vi.spyOn(vm, 'removeFiles').mockImplementation(() => undefined);
    vm.onRemoveClicked();
    expect(vm.holdIdxForRemoval).toBe('test');
    expect(vm.showDialog).toBe(false);
  })
  
  it(
    "@watch validFiles - provides index of file to remove to see delete event has been emitted",
    async()=>{
      const validFile = {
        "file":  {
          "lastModified": new Date("08/24/2022").getMilliseconds(),
          "lastModifiedDate": new Date("08/24/2022"),
          "name": "dummyFileName 003.pdf",
          "size": 73529,
          "type": "application/pdf",
          "webkitRelativePath": ""
        },
        "fileName": "dummyFileName 003.pdf",
        "created": 16593555,
        "progressStatus": 100,
        "link": "/api/now/attachment/dummyFile03/file",
        "attachmentId": "dummyFile03",
        "recordId": "recordID03",
        "isErrored": false,
        "isUploaded": true
      }
      await wrapper.setData({uploadingFiles: []})
      await wrapper.setData({validFiles: []})
     
      // add a file to validFiles activate @watch
      await vm.validFiles.push(validFile)

      //await vm.setFilesToDisplay()
      await vm.$nextTick(() => {
        expect(vm.validFiles[1]).toStrictEqual(validFile);
      });
      
    })


})
