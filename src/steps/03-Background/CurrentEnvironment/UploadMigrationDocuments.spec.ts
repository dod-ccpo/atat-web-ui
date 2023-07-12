import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import UploadMigrationDocuments
  from "@/steps/03-Background/CurrentEnvironment/UploadMigrationDocuments.vue";
import { AttachmentServiceCallbacks } from "@/services/attachment";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import Attachments from "@/store/attachments";
import { AttachmentDTO, CurrentEnvironmentDTO } from "@/api/models";

Vue.use(Vuetify);

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


describe("Testing UploadMigrationDocuments Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(UploadMigrationDocuments, {
      vuetify,
      localVue
    });
  });

  describe("FUNCTIONS", () => {
    it("hasChanged()", async () => {
      wrapper.setData({
        currentData: { hasMigrationDocumentation: "YES" },
        savedData: { hasMigrationDocumentation: "NO" }
      })
      expect(wrapper.vm.hasChanged()).toBe(true);
    });
  

    describe("saveOnLeave() =>  ", () => {
      beforeEach(() => {
        jest.spyOn(AcquisitionPackage, "setValidateNow")
          .mockImplementation();
      })
      it("validates assigned Objects", async () => {
        jest.spyOn(wrapper.vm, "hasChanged").mockReturnValue(true);
        jest.spyOn(CurrentEnvironment, "saveCurrentEnvironment").mockReturnValue(true)
        await wrapper.vm.saveOnLeave();
        //validating `Object.assign(this.currEnvDTO, this.currentData);`
        const matchedKeys = Object.keys(wrapper.vm.$data.currEnvDTO)
          .filter(
            k => Object.keys(wrapper.vm.currentData).includes(k)
          )
        expect(matchedKeys.length).toBeGreaterThan(0);
      });

      it("mocks an error", async () => {
        const errMessage = 'dummy Error Message'
        jest.spyOn(wrapper.vm, "hasChanged").mockResolvedValue(true);
        jest.spyOn(CurrentEnvironment, "saveCurrentEnvironment")
        .mockRejectedValue(errMessage)
        await wrapper.vm.saveOnLeave()
        expect(wrapper.vm.$data.saveOnLeaveError).toEqual(errMessage)
      })
    })

    describe("onRemoveAttachment(file: uploadingFile) => ", () => {
      it("ensure $data attributes are set as expected ", async () => {
        wrapper.setData({
          currEnvDTO: {
            migration_documentation: ['dummyFile01']
          }
        })
        expect(wrapper.vm.$data.currEnvDTO.migration_documentation).toHaveLength(1)
        jest.spyOn(Attachments, "removeAttachment").
          mockImplementation(()=>Promise.resolve())
        await wrapper.vm.onRemoveAttachment(uploadingFile);
        expect(wrapper.vm.$data.currEnvDTO.migration_documentation).toHaveLength(0)
      });

      it("validates that store method was called", async () => {
        const setCurrentEnvironment =
        jest.spyOn(CurrentEnvironment, "saveCurrentEnvironment").mockImplementation(
          () => Promise.resolve(true)
        )
        await wrapper.vm.onRemoveAttachment(uploadingFile);
        expect(setCurrentEnvironment).toHaveBeenCalled();
      });
      it("mocks an error ", async () => {
        const errMessage = 'error removing attachment with id ' + uploadingFile.attachmentId
        jest.spyOn(wrapper.vm, "onRemoveAttachment")
          .mockRejectedValue(errMessage)
        try {
          await wrapper.vm.onRemoveAttachment()
        } catch (error) {
          expect(error).toBe(errMessage);
        }
      });
    })

    describe("loadAttachments() => ", () => {
      it("ensure $data attributes are set as expected ", async () => {
        wrapper.setData({
          currEnvDTO: {}
        })
        await wrapper.vm.loadAttachments()
        expect(wrapper.vm.$data.currEnvDTO.migration_documentation).toHaveLength(0)
      });

      it("ensure store methods are called with necessary params", async () => {
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
        jest.spyOn(Attachments,"getAttachmentsBySysIds").mockImplementation(
          async () => {
            return attachmentDTOArray
          }
        )
        await wrapper.vm.loadAttachments()
        expect(wrapper.vm.$data.uploadedFiles).toHaveLength(3)
      });
    })

    describe("loadOnEnter() => ", () => {
      it("ensure $data attributes are set as expected as store data is retrieved ", 
        async () => {
          wrapper.setData({
            currEnvDTO: {}
          })
          const getCurrentEnvironment = jest.spyOn(CurrentEnvironment, "getCurrentEnvironment")
            .mockImplementation(async()=>{
              return currEnvironmentDTO as CurrentEnvironmentDTO
            }
          )
          await wrapper.vm.loadOnEnter();
          expect(wrapper.vm.$data.currEnvDTO).toEqual(currEnvironmentDTO);
          expect(wrapper.vm.$data.hasMigrationDocumentation).toEqual(
            currEnvironmentDTO.has_migration_documentation
          )
          expect(wrapper.vm.$data.savedData.has_migration_documentation).toEqual(
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
            await wrapper.vm.onUpload(uploadingFile);
            expect(wrapper.vm.currEnvDTO.migration_documentation).toHaveLength(1)
          });

          it("if wrapper.vm.currEnvDTO is populated ", async () => {
            wrapper.setData({
              currEnvDTO: {
                migration_documentation: ['']
              }
            })
            await wrapper.vm.onUpload(uploadingFile);
            const isMigrationDocAdded = wrapper.vm.currEnvDTO.migration_documentation.some(
              (f: string) => f === uploadingFile.attachmentId
            )
            expect(isMigrationDocAdded).toBe(true);
          });
      })
      it("validates that store method was called ", async () => {
        const setCurrentEnvironment =
          jest.spyOn(CurrentEnvironment, "setCurrentEnvironment").mockImplementation(
            () => Promise.resolve()
          )
        await wrapper.vm.onUpload(uploadingFile);
        expect(setCurrentEnvironment).toHaveBeenCalled();
      });

      it("mocks an error ", async () => {
        const errMessage = 'error completing file upload with id ' + uploadingFile.attachmentId
        jest.spyOn(CurrentEnvironment, "setCurrentEnvironment")
          .mockRejectedValue(errMessage)
        await wrapper.vm.onUpload(uploadingFile);
        expect(wrapper.vm.$data.onUploadError).toEqual(errMessage);
      });
  })
})

describe("GETTERS", () => {
  describe("currentData() => validates dataset with   ", () => {
    it("POPULATED value", async () => {
      let hasMigrationDocs = "YES"
      wrapper.setData({ hasMigrationDocumentation: hasMigrationDocs })
      const currentData = wrapper.vm.currentData;
      expect(currentData.has_migration_documentation).toBe(hasMigrationDocs)
    });
    it("NO value", async () => {
      let hasMigrationDocs = ""
      wrapper.setData({ hasMigrationDocumentation: hasMigrationDocs })
      const currentData = wrapper.vm.currentData;
      expect(currentData.has_migration_documentation).toBe(hasMigrationDocs)
    });
  })
})

describe("WATCHERS", () => {
  it("onValueChange() => sets $data attribs as expected", async () => {
    wrapper.setData({ hasMigrationDocumentation: "YES" })
    wrapper.vm.hasMigrationDocumentation = "NO";
    await Vue.nextTick();
    expect(wrapper.vm.$data.uploadedFiles).toHaveLength(0);
    expect(wrapper.vm.$data.removeAll).toEqual(true);
  });

})
})
