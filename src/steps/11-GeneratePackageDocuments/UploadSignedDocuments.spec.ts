/* eslint-disable camelcase */
//In progress testing
/*import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import UploadSignedDocuments from "@/steps/11-GeneratePackageDocuments/UploadSignedDocuments.vue";
import validators from "../../plugins/validation"
import AcquisitionPackage from "@/store/acquisitionPackage";
Vue.use(Vuetify);

const uploadedFiles = [
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

describe("Testing UploadSignedDocuments Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators)

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(UploadSignedDocuments, {
      localVue,
      vuetify,
    });
  });
  
  afterEach(()=>{
    jest.clearAllMocks();
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe(" filesUploaded() => ", () => {
    beforeEach(() => {
      wrapper.setData(uploadedFiles uploadedFiles[0]})

    });
    it("set data attributes", async () => {
      wrapper.setData({isInitialLoad: false});
      await AcquisitionPackage.doSetCurrentUserIsContributor(true);
      wrapper.vm.$data.uploadedFiles[0].fileName = "pleaseWork.pdf";
      console.log("current user is contri", AcquisitionPackage.currentUserIsContributor);
      console.log("is initial load", wrapper.vm.$data.isInitialLoad);
      expect(wrapper.vm.$data.haveFilesChanged).toBe(true);
    });
  })
  


  it("hasChanged() retrieves expected boolean value", async () => {
    await wrapper.setData({
      currentData:{
        capacity: "YES",
      },
      savedData:{
        capacity: "NO"
      }
    })
    const hasChanged: boolean = await wrapper.vm.hasChanged();
    expect(hasChanged).toBe(true);
  });
})
*/
