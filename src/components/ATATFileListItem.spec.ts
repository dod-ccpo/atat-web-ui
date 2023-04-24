import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ATATFileListItem from "@/components/ATATFileListItem.vue";
import { idText } from "typescript";
Vue.use(Vuetify);

const uploadedFileObj = {
  "file": "[object File1]",
  "fileName": "dummyFileName 01.pdf",
  "created": 1659355539053,
  "progressStatus": 100,
  "link": "/api/now/attachment/dummyFile01/file",
  "attachmentId": "dummyFile01",
  "recordId": "recordID01",
  "isErrored": false,
  "isUploaded": true
};

const uploadingFileObj = {
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
  "progressStatus": 12,
  "link": "/api/now/attachment/dummyFile01/file",
  "attachmentId": "dummyFile01",
  "recordId": "recordID01",
  "isErrored": false,
  "isUploaded": true
};


describe("Testing ATATFileList Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATFileListItem, {
      localVue,
      vuetify,
      propsData: {
        uploadingFileObj: uploadedFileObj
      }
    });
  });

  it("renders successfully", async () => {
    expect(await wrapper.exists()).toBe(true);
  });

  it ('isLoading() returns expected value', async()=>{
    await wrapper.setProps((
      uploadingFileObj
    ))
    const isLoading = await wrapper.vm.isLoading;
    expect(isLoading).toBe(false);
  })

  it("@watch isFileErrored() - manually trigger uploadingFileObj.isErrored to ensure " +
      "removeFiles event was successfully emitted", async ()=> {
    const idx = 14;
    await wrapper.setProps({
      index: idx, 
      uploadingFileObj:{
        isErrored: true
      }
    });
    Vue.nextTick(()=>{
      expect(wrapper.emitted("removeFiles")?.flat()[0]).toBe(idx);
    });
  })

  it("getExtension() - supply filename with extension to return last 13 chars prepended " +
      "with `...`", async()=>{
    const fileName = "thisisalongnameforadummyFile.pdf";
    const ext = await wrapper.vm.getExtension(fileName);
    expect(ext).toBe("...dummyFile.pdf");
  })

  it("getTruncatedFileName() - supplies long filename to ensure that" +
  " that ... is added at the same place keeping all long file names the same width", async()=>{
    const fileName = "thisisalongnameforarepeatedforthisisalongnamefordummyFile.pdf";
    const ext = await wrapper.vm.getTruncatedFileName(fileName);
    expect(ext).toBe("thisisalongnameforarepeatedforthisisalongname...dummyFile.pdf");
  })

})
