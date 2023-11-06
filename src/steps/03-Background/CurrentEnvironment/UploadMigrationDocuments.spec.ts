/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import UploadMigrationDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadMigrationDocuments.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import Attachments from "@/store/attachments";
import { AttachmentDTO, CurrentEnvironmentDTO } from "@/api/models";
import { createStore } from 'vuex';

vi.mock('@/store/acquisitionPackage')
vi.mock('@/store/acquisitionPackage/currentEnvironment')
vi.mock('@/store/attachments')

const uploadingFile = {
  "file": {
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
}

const currEnvironmentDTO: CurrentEnvironmentDTO = {
  current_environment_exists: "",
  has_system_documentation: "",
  has_migration_documentation: "YES",
  env_location: "",
  env_classifications_cloud: [],
  env_classifications_onprem: [],
  env_instances: [],
  current_environment_replicated_optimized: "",
  statement_replicated_optimized: "",
  additional_growth: "",
  anticipated_yearly_additional_capacity: null,
  has_phased_approach: "",
  phased_approach_schedule: "",
  needs_architectural_design_services: "",
  statement_architectural_design: "",
  applications_need_architectural_design: "",
  data_classifications_impact_levels: [],
  external_factors_architectural_design: ""
};
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

describe("Testing UploadMigrationDocuments Component", () => {
  const wrapper: VueWrapper = shallowMount(UploadMigrationDocuments, {
    props: {},
    global: {
      plugins: [mockStore,validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  // describe("Testing Classification Level Page", () => {

  // });

  describe("FUNCTIONS", () => {
    it("hasChanged()", async () => {
      wrapper.setData({
        currentData: { hasMigrationDocumentation: "YES" },
        savedData: { hasMigrationDocumentation: "NO" }
      })
      expect(vm.hasChanged()).toBe(true);
    });
  

    describe("saveOnLeave() =>  ", () => {
      beforeEach(() => {
        vi.spyOn(AcquisitionPackage, "setValidateNow")
          .mockImplementation(Promise.resolve);
      })
      it.skip("validates assigned Objects", async () => {
        vi.spyOn(vm, "hasChanged").mockReturnValue(true);
        vi.spyOn(CurrentEnvironment, "saveCurrentEnvironment")
          .mockReturnValue(Promise.resolve(true))
        const saved = await vm.saveOnLeave();
        expect(saved).toBe(true)
        //validating `Object.assign(this.currEnvDTO, this.currentData);`
        const matchedKeys = Object.keys(vm.$data.currEnvDTO)
          .filter(
            k => Object.keys(vm.currentData).includes(k)
          )
        expect(matchedKeys.length).toBeGreaterThan(0);
      });

      it.skip("mocks an error", async () => {
        const errMessage = 'dummy Error Message'
        vi.spyOn(vm, "hasChanged").mockResolvedValue(true);
        vi.spyOn(CurrentEnvironment, "saveCurrentEnvironment")
          .mockRejectedValue(errMessage)
        await vm.saveOnLeave()
        expect(vm.$data.saveOnLeaveError).toEqual(errMessage)
      })
    })

    describe("onRemoveAttachment(file: uploadingFile) => ", () => {
      it("ensure $data attributes are set as expected ", async () => {
        wrapper.setData({
          currEnvDTO: {
            migration_documentation: ['dummyFile01']
          }
        })
        expect(vm.$data.currEnvDTO.migration_documentation).toHaveLength(1)
        vi.spyOn(Attachments, "removeAttachment").
          mockImplementation(()=>Promise.resolve())
        await vm.onRemoveAttachment(uploadingFile);
        expect(vm.$data.currEnvDTO.migration_documentation).toHaveLength(0)
      });

      it("validates that store method was called", async () => {
        const setCurrentEnvironment =
        vi.spyOn(CurrentEnvironment, "saveCurrentEnvironment").mockImplementation(
          () => Promise.resolve(true)
        )
        await vm.onRemoveAttachment(uploadingFile);
        expect(setCurrentEnvironment).toHaveBeenCalled();
      });
      it("mocks an error ", async () => {
        const errMessage = 'error removing attachment with id ' + uploadingFile.attachmentId
        vi.spyOn(vm, "onRemoveAttachment")
          .mockRejectedValue(errMessage)
        try {
          await vm.onRemoveAttachment()
        } catch (error) {
          expect(error).toBe(errMessage);
        }
      });
    })

    describe("loadAttachments() => ", () => {
      it.skip("ensure $data attributes are set as expected ", async () => {
        wrapper.setData({
          currEnvDTO: {}
        })
        //TODO Mock out the call and return expected data
        // vi.spyOn(Attachments, 'getAttachmentsBySysIds').getResolvedValue({
        //   file_name: 'file',
        //   table_sys_id: 'abc123',
        // })
        await vm.loadAttachments()
        expect(vm.$data.currEnvDTO.migration_documentation).toHaveLength(0)
      });

      it.skip("ensure store methods are called with necessary params", async () => {
        wrapper.setData({
          currEnvDTO: {
            migration_documentation: ['dummyFile01']
          },
          attachmentServiceName: "dummy attachmentServiceName"
        })
        const attachmentDTOArray = [
          { file_name: "fileName001" },
          { file_name: "fileName002" },
          { file_name: "fileName003" },
        ] as AttachmentDTO[]
        vi.spyOn(Attachments,"getAttachmentsBySysIds").mockImplementation(
          async () => {
            return attachmentDTOArray
          }
        )
        await vm.loadAttachments()
        expect(vm.$data.uploadedFiles).toHaveLength(3)
      });
    })

    describe("loadOnEnter() => ", () => {
      it("ensure $data attributes are set as expected as store data is retrieved ", 
        async () => {
          wrapper.setData({
            currEnvDTO: {}
          })
          const getCurrentEnvironment = vi.spyOn(CurrentEnvironment, "getCurrentEnvironment")
            .mockImplementation(async()=>{
              return currEnvironmentDTO as CurrentEnvironmentDTO
            }
            )
          await vm.loadOnEnter();
          expect(vm.$data.currEnvDTO).toEqual(currEnvironmentDTO);
          expect(vm.$data.hasMigrationDocumentation).toEqual(
            currEnvironmentDTO.has_migration_documentation
          )
          expect(vm.$data.savedData.has_migration_documentation).toEqual(
            currEnvironmentDTO.has_migration_documentation
          )
        });
    })


    describe("onUpload(file: uploadingFile) => ", () => {
      describe("ensure $data attributes are set as expected ", () => {
        it("if wrapper.vm.currEnvDTO is empty ", async () => {
          wrapper.setData({
            currEnvDTO: {}
          })
          await vm.onUpload(uploadingFile);
          expect(vm.currEnvDTO.migration_documentation).toHaveLength(1)
        });

        it("if wrapper.vm.currEnvDTO is populated ", async () => {
          wrapper.setData({
            currEnvDTO: {
              migration_documentation: ['']
            }
          })
          await vm.onUpload(uploadingFile);
          const isMigrationDocAdded = vm.currEnvDTO.migration_documentation.some(
            (f: string) => f === uploadingFile.attachmentId
          )
          expect(isMigrationDocAdded).toBe(true);
        });
      })
      it("validates that store method was called ", async () => {
        const setCurrentEnvironment =
          vi.spyOn(CurrentEnvironment, "setCurrentEnvironment").mockImplementation(
            () => Promise.resolve()
          )
        await vm.onUpload(uploadingFile);
        expect(setCurrentEnvironment).toHaveBeenCalled();
      });

      it("mocks an error ", async () => {
        const errMessage = 'error completing file upload with id ' + uploadingFile.attachmentId
        vi.spyOn(CurrentEnvironment, "setCurrentEnvironment")
          .mockRejectedValue(errMessage)
        await vm.onUpload(uploadingFile);
        expect(vm.$data.onUploadError).toEqual(errMessage);
      });
    })
  })

  describe("GETTERS", () => {
    describe("currentData() => validates dataset with   ", () => {
      it.skip("POPULATED value", async () => {
        const hasMigrationDocs = "YES"
        wrapper.setData({ hasMigrationDocumentation: hasMigrationDocs })
        const currentData = vm.currentData;
        expect(currentData.has_migration_documentation).toBe(hasMigrationDocs)
      });
      it.skip("NO value", async () => {
        const hasMigrationDocs = ""
        wrapper.setData({ hasMigrationDocumentation: hasMigrationDocs })
        const currentData = vm.currentData;
        expect(currentData.has_migration_documentation).toBe(hasMigrationDocs)
      });
    })
  })

  describe("WATCHERS", () => {
    it("onValueChange() => sets $data attribs as expected", async () => {
      wrapper.setData({ hasMigrationDocumentation: "YES" })
      vm.hasMigrationDocumentation = "NO";
      await vm.$nextTick();
      expect(vm.$data.uploadedFiles).toHaveLength(0);
      expect(vm.$data.removeAll).toEqual(true);
    });

  })
})
