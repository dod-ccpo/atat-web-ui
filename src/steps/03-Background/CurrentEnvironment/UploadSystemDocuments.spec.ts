/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import UploadSystemDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadSystemDocuments.vue";
import validators from "../../../plugins/validation";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { AttachmentDTO, CurrentEnvironmentDTO } from "@/api/models";
import Attachments from "@/store/attachments";
import { uploadingFile } from "../../../../types/Global";
import { AttachmentServiceCallbacks } from "@/services/attachment";
import { createStore } from 'vuex';

vi.mock('@/store/acquisitionPackage/currentEnvironment')


describe("Testing UploadSystemDocuments Component", () => {

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
  
  const actions = {
    getAttachmentsBySysIds: vi.fn().mockResolvedValue({
      file_name: 'file',
      table_sys_id: 'abc123',
    })
  }
  
  const mockStore = createStore({
    modules: {
      Attachments: {
        namespaced: true,
        actions
      }
    }
  })
  
  const wrapper: VueWrapper = shallowMount(UploadSystemDocuments, {
    props: {},
    global: {
      plugins: [mockStore,validators]
    }
  })

  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  
  beforeEach(() => {
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    vi.spyOn(CurrentEnvironment, 'loadCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    vi.spyOn(Attachments, 'getAttachmentsBySysIds').mockImplementation(
      () => Promise.resolve([mockAttachment1,mockAttachment2])
    );
    vi.spyOn(Attachments, 'removeAttachment').mockImplementation(
      () => Promise.resolve()
    );
    vi.spyOn(AttachmentServiceCallbacks, 'registerUploadCallBack').mockImplementation(
      () => Promise.resolve()
    );
  });

  describe("testing UploadSystemDocuments render", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });


    describe("FUNCTIONS", () => {
      beforeEach(() =>{
        vi.spyOn(CurrentEnvironment, 'setCurrentEnvironment').mockImplementation(
          () => Promise.resolve()
        );
      })
      it("test hasChanged()", async () => {
        wrapper.setData({
          hasSystemDocumentation:"YES"
        })
        await vm.$nextTick();
        vm.$data.savedData = 'test2'
        expect(vm.hasChanged()).toBe(true);
      });

      it("test saveOnLeave() return true", async () => {
        wrapper.setData({
          currentData:{
            hasSystemDocumentation:""
          }
        })
        await vm.$nextTick();
        const saveOnLeave = await vm.saveOnLeave()
        expect(saveOnLeave).toBeTruthy();
      });


      it("test selectedUploadChange", () => {
        
        wrapper.setData({hasSystemDocumentation: 'NO'})
        vm.selectedUploadChange()
        const result = vm.$data.removeAll
        expect(result).toBe(true);
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
        vm.$nextTick()
        vm.onUpload(file);
        vm.$nextTick()
        const fileUploaded = vm.$data.currEnvDTO.system_documentation.includes("1234")
        expect(fileUploaded).toBe(true);
      })

      it("test onUpload error with setCurrentEnv", () => {
        const file = {
          attachmentId: '1234',
        } as uploadingFile
        console.error = vi.fn();
        vi.spyOn(CurrentEnvironment, 'setCurrentEnvironment').mockImplementation( () => {
          throw new Error("mock error");
        });
        vm.onUpload(file);
        vm.$nextTick()
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
        await vm.onRemoveAttachment(file);
        await vm.$nextTick()
        const fileUploaded = vm.$data.currEnvDTO.system_documentation.includes("1234")
        expect(fileUploaded).toBe(false);
      })

    })

    describe("GETTERS", () => {
      it("test get currentData", async () => {
        wrapper.setData({hasSystemDocumentation: ""})
        await vm.$nextTick();
        const currentData = vm.currentData
        expect(currentData).toStrictEqual({"has_system_documentation": ""})
      });
    })
  })
})
