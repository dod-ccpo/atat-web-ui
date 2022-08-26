import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ATATFileListItem from "@/components/ATATFileListItem.vue";
Vue.use(Vuetify);

const validFiles = {
  "file": "[object File1]",
  "fileName": "dummyFileName 01.pdf",
  "created": 1659355539053,
  "progressStatus": 100,
  "link": "/api/now/attachment/dummyFile01/file",
  "attachmentId": "dummyFile01",
  "recordId": "recordID01",
  "isErrored": false,
  "isUploaded": true
}


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
        uploadingFileObj:validFiles,
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('It renders with uploaded file', ()=> {
    expect(wrapper.vm.uploadingFileObj).toBe(validFiles)
  })

})
