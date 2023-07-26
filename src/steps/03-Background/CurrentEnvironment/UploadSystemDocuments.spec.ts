/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import UploadSystemDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadSystemDocuments.vue";
import validators from "../../../plugins/validation";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { AttachmentDTO, CurrentEnvironmentDTO } from "@/api/models";
import Attachments from "@/store/attachments";
import { uploadingFile } from "../../../../types/Global";
import { AttachmentServiceCallbacks } from "@/services/attachment";


Vue.use(Vuetify);

describe("Testing UploadSystemDocuments Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const mockEnvironment = {
    has_system_documentation:"NO"
  } as CurrentEnvironmentDTO

  const mockAttachment1 = {
    size_bytes: "12mb",
    file_name: "testAttachment",
    average_image_color: "red",
    image_width: "20px",
    table_name: "attachment",
    image_height: "20px",
    download_link: "link",
    content_type: "stuff",
    size_compressed: "100mb",
    compressed: "Yes",
    state: "CA",
    table_sys_id: "1",
    chunk_size_bytes: "321",
    hash: "hash",
  }
  const mockAttachment2 ={
    file_name: "empty attachment",
  } as AttachmentDTO
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(UploadSystemDocuments, {
      vuetify,
      localVue
    });

    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    jest.spyOn(CurrentEnvironment, 'loadCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    jest.spyOn(Attachments, 'getAttachmentsBySysIds').mockImplementation(
      () => Promise.resolve([mockAttachment1,mockAttachment2])
    );
    jest.spyOn(Attachments, 'removeAttachment').mockImplementation(
      () => Promise.resolve()
    );
    jest.spyOn(AttachmentServiceCallbacks, 'registerUploadCallBack').mockImplementation(
      () => Promise.resolve()
    );
  });

  describe("testing UploadSystemDocuments render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });


    describe("FUNCTIONS", () => {
      beforeEach(() =>{
        jest.spyOn(CurrentEnvironment, 'setCurrentEnvironment').mockImplementation(
          () => Promise.resolve()
        );
      })
      it("test hasChanged()", async () => {
        wrapper.setData({
          hasSystemDocumentation:"YES"
        })
        await Vue.nextTick();
        wrapper.vm.$data.savedData = 'test2'
        expect(wrapper.vm.hasChanged()).toBe(true);
      });

      it("test saveOnLeave() return true", async () => {
        wrapper.setData({
          currentData:{
            hasSystemDocumentation:""
          }
        })
        await Vue.nextTick();
        const saveOnLeave = await wrapper.vm.saveOnLeave()
        expect(saveOnLeave).toBeTruthy();
      });


      it("test selectedUploadChange", () => {
        wrapper.vm.$data.selectedUpload = "NO";
        const result = wrapper.vm.$data.removeAll
        wrapper.vm.selectedUploadChange()
        Vue.nextTick(() => {
          expect(result).toBe(true);
        })
      })

      it("test onUpload success", () => {
        const file = {
          attachmentId: '1234',
        } as uploadingFile
        wrapper.setData({
          currEnvDTO:{
            system_documentation:""
          }
        })
        Vue.nextTick()
        wrapper.vm.onUpload(file);
        Vue.nextTick()
        const fileUploaded = wrapper.vm.$data.currEnvDTO.system_documentation.includes("1234")
        expect(fileUploaded).toBe(true);
      })

      it("test onUpload error with setCurrentEnv", () => {
        const file = {
          attachmentId: '1234',
        } as uploadingFile
        console.error = jest.fn();
        jest.spyOn(CurrentEnvironment, 'setCurrentEnvironment').mockImplementation( () => {
          throw new Error("mock error");
        });
        wrapper.vm.onUpload(file);
        Vue.nextTick()
        expect(console.error).toHaveBeenCalledWith("error completing file upload with id 1234");

      })

      it("test onRemoveAttachment success", async () => {
        const file = {
          attachmentId: '1234',
        } as uploadingFile
        wrapper.setData({
          currEnvDto:{
            system_documentation:[file]
          }
        })
        await wrapper.vm.onRemoveAttachment(file);
        await Vue.nextTick()
        const fileUploaded = wrapper.vm.$data.currEnvDTO.system_documentation.includes("1234")
        expect(fileUploaded).toBe(false);
      })

    })

    describe("GETTERS", () => {
      it("test get currentData", async () => {
        wrapper.setData({hasSystemDocumentation: ""})
        await Vue.nextTick();
        const currentData = wrapper.vm.currentData
        expect(currentData).toStrictEqual({"has_system_documentation": ""})
      });
    })
  })
})
