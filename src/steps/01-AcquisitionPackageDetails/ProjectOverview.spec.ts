import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import ProjectOverview from "@/steps/01-AcquisitionPackageDetails/ProjectOverview.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage,{ StoreProperties}
  from "@/store/acquisitionPackage";
// import { off } from "process";
// import { convertSystemChoiceToSelect } from "@/helpers";
import { ProjectOverviewDTO } from "@/api/models";
Vue.use(Vuetify);

describe("Testing index Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  localVue.use(validators);

  const mockProjectOverviewDTO = {
    "scope": "Scope From Store",
    "title": "Title From Store",
    "emergency_declaration": "yes",
    "project_disclaimer": "YES"
  }; 

  const mockProjectOverviewDTOCurrent = {
    "scope": "current scope",
    "title": "current title",
    "emergency_declaration": "yes",
    "project_disclaimer": "YES"
  }; 


  beforeEach(() => {
    
    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      ()=>Promise.resolve(mockProjectOverviewDTO));

    jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      ()=>Promise.resolve());

    vuetify = new Vuetify();
    wrapper = mount(ProjectOverview, {
      localVue,
      vuetify,
    });

  });

  afterEach(()=>{
    jest.clearAllMocks();
    
  })

  it("renders successfully", async () => {
    expect(await wrapper.exists()).toBe(true);
  });

  it("loadOnEnter - returns storeData successfully", async()=>{
    await wrapper.vm.loadOnEnter();  
    expect(await wrapper.vm.$data.currentTitle).toBe("Title From Store");
  })

  it("currentData() - set title to ensure currentData.title is updated", 
    async ()=>{
      const title = "current Title"
      await wrapper.setData({
        currentTitle: title
      })

      const currentData =  await wrapper.vm.currentData;
      expect(currentData.title).toBe(title)
    })

  it("currentData() - set emergencyDeclaration to ensure currentData.emergencyDeclaration " +
    "is updated", 
  async ()=>{
    const emergencyDeclaration = "yes"
    await wrapper.setData({
      emergencyDeclaration
    })
    const currentData =  await wrapper.vm.currentData;
    expect(currentData.emergency_declaration).toBe("yes")
  })

  it("currentData() - set emergencyDeclaration to ensure currentData.emergencyDeclaration " +
      "is updated", 
  async ()=>{
    const emergencyDeclaration = "no"
    await wrapper.setData({
      emergencyDeclaration
    })
    const currentData =  await wrapper.vm.currentData;
    expect(currentData.emergency_declaration).toBe("no")
  })

  it("savedData() - set title to ensure savedData.title " +
  "is updated", 
  async ()=>{
    const title = "Dummy Title"
    AcquisitionPackage.setProjectOverview(
      {
        "scope": "scope goes here",
        "title": title,
        "emergency_declaration": "yes",
        "project_disclaimer": "YES"
      }
    )
    const savedData =  await wrapper.vm.savedData;
    expect(savedData.title).toBe(title)
  })

  it("hasChanges() - compare $data.currentData and $data.savedData to determine " +
  "if there have been user changes to $data.currentData", 
  async ()=>{
    await wrapper.setData(
      {
        currentData:{
          "scope": "currentScope",
          "title": "currentTitle",
          "emergency_declaration": "yes",
          "project_disclaimer": "YES"
        },
        savedData:{
          "scope": "savedScope",
          "title": "savedTitle",
          "emergency_declaration": "yes",
          "project_disclaimer": "YES"
        }
      }
    )
    expect(await wrapper.vm.hasChanged()).toBe(true)
  })

  it("saveOnLeave() - if $data.hasChanged() $store.data === $data.savedData", 
    async ()=>{
      await wrapper.setData(
        {
          currentData: mockProjectOverviewDTO,
          savedData: mockProjectOverviewDTO,
        }
      )

      const saveOnLeave = await wrapper.vm.saveOnLeave();
      expect(saveOnLeave).toBe(true)

      const dataFromStore: ProjectOverviewDTO = await AcquisitionPackage.loadData({
        storeProperty: StoreProperties.ProjectOverview
      });
      expect(dataFromStore.title).toBe(mockProjectOverviewDTO.title);
    })

  it("saveOnLeave() - if !$data.hasChanged() ensure saveOnLeave === false", 
    async ()=>{
      await wrapper.setData(
        {
          currentData: mockProjectOverviewDTOCurrent,
          savedData: mockProjectOverviewDTO,
        }
      )
      const saveOnLeave = await wrapper.vm.saveOnLeave();
      expect(saveOnLeave).toBe(true)
    })
})

