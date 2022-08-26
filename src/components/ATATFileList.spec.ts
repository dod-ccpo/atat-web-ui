import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ATATFileList from "@/components/ATATFileList.vue";
import { createImportSpecifier } from "typescript";
Vue.use(Vuetify);

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
    "attachmentId": "dummyFile01",
    "recordId": "recordID01",
    "isErrored": false,
    "isUploaded": true
  }
]


describe("Testing ATATFileList Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATFileList, {
      localVue,
      vuetify,
      propsData: {
        validFiles,
        multiplesAllowed: false,
        title: 'dummyFile',
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('It renders with uploaded file', ()=> {
    wrapper.vm.setFilesToDisplay()
    const title = wrapper.vm.getFileUploadsDivTitle()
    expect(title).toBe('dummyFile')
    expect(wrapper.vm.uploadingFiles.length).toBeGreaterThan(0)
    expect(wrapper.vm.validFiles.length).toBeGreaterThan(0)
  })

  it("getFileUploadsDivTitle() - supplies data.multiplesAllowed=true to set plural headline",
    async ()=>{
      await wrapper.setProps({
        multiplesAllowed: true,
        title:""
      })
      await wrapper.setData({
        uploadingFiles
      })
      const headline = await wrapper.vm.getFileUploadsDivTitle();
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
      const headline = await wrapper.vm.getFileUploadsDivTitle();
      expect(headline).toBe("Your Upload");
    })

  it("getFileUploadsDivTitle() - supplies data to return empty headline",
    async ()=>{
      await wrapper.setProps({
        multiplesAllowed: false,
        title:""
      });
      const headline = await wrapper.vm.getFileUploadsDivTitle();
      expect(headline).toBe("");
    })

  it ("removeFiles() - provides index of file to remove to see delete event has been emitted",
    async()=>{
      const idx=0;
      await wrapper.setData({
        uploadingFiles
      });
      await wrapper.vm.removeFiles(idx);
      Vue.nextTick(()=>{
        expect(wrapper.emitted("delete")?.flat()[0]).toEqual(
          uploadingFiles[idx]
        );
      });
    })

  it ("@watch validFiles - provides index of file to remove to see delete event has been emitted",
    async()=>{
      await wrapper.setData({
        uploadingFiles: [uploadingFiles[0]]
      });
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
      
      // add a file to validFiles activate @watch
      await wrapper.vm.$props.validFiles.push(validFile)

      Vue.nextTick(()=>{
        expect(wrapper.vm.$data.uploadingFiles[2]).toEqual(validFile);
      });
    })


})
