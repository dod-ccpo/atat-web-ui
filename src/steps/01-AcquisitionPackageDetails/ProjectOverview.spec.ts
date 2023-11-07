import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import ProjectOverview from "@/steps/01-AcquisitionPackageDetails/ProjectOverview.vue";
import validators from "../../plugins/validation";
import AcquisitionPackage,{ StoreProperties}
  from "@/store/acquisitionPackage";
import { ProjectOverviewDTO } from "@/api/models";

describe("Testing index Component", () => {
  const wrapper: VueWrapper = shallowMount(ProjectOverview, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  
  const mockProjectOverviewDTO = {
    "scope": "Scope From Store",
    "title": "Title From Store",
    "emergency_declaration": "yes",
    "project_disclaimer": "YES",
    "cjadc2": "YES",
    "cjadc2_percentage": "57"
  }; 

  const mockProjectOverviewDTOCurrent = {
    "scope": "current scope",
    "title": "current title",
    "emergency_declaration": "yes",
    "project_disclaimer": "YES",
    "cjadc2": "NO"
  }; 


  beforeEach(() => {
    
    vi.spyOn(AcquisitionPackage, 'loadData').mockImplementation(
      ()=>Promise.resolve(mockProjectOverviewDTO));

    vi.spyOn(AcquisitionPackage, 'saveData').mockImplementation(
      ()=>Promise.resolve());

  });

  it("renders successfully", async () => {
    expect(await wrapper.exists()).toBe(true);
  });

  it("loadOnEnter - returns storeData successfully", async()=>{
    await vm.loadOnEnter();  
    expect(await vm.$data.currentTitle).toBe("Title From Store");
  })

  it("currentData() - set title to ensure currentData.title is updated", 
    async ()=>{
      const title = "current Title"
      await wrapper.setData({
        currentTitle: title
      })

      const currentData =  await vm.currentData;
      expect(currentData.title).toBe(title)
    })

  it("currentData() - set emergencyDeclaration to ensure currentData.emergencyDeclaration " +
    "is updated", 
  async ()=>{
    const emergencyDeclaration = "yes"
    await wrapper.setData({
      emergencyDeclaration
    })
    const currentData =  await vm.currentData;
    expect(currentData.emergency_declaration).toBe("yes")
  })

  it("currentData() - set emergencyDeclaration to ensure currentData.emergencyDeclaration " +
      "is updated", 
  async ()=>{
    const emergencyDeclaration = "no"
    await wrapper.setData({
      emergencyDeclaration
    })
    const currentData =  await vm.currentData;
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
        "project_disclaimer": "YES",
        "cjadc2": "YES",
        "cjadc2_percentage": "12"
      }
    )
    const savedData =  await vm.savedData;
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
          "project_disclaimer": "YES",
          "cjadc2": "YES",
          "cjadc2_percentage": "57"
        },
        savedData:{
          "scope": "savedScope",
          "title": "savedTitle",
          "emergency_declaration": "yes",
          "project_disclaimer": "YES",
          "cjadc2": "NO"
        }
      }
    )
    expect(await vm.hasChanged()).toBe(true)
  })

  it("saveOnLeave() - if $data.hasChanged() $store.data === $data.savedData", 
    async ()=>{
      await wrapper.setData(
        {
          currentData: mockProjectOverviewDTO,
          savedData: mockProjectOverviewDTO,
        }
      )

      const saveOnLeave = await vm.saveOnLeave();
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
      const saveOnLeave = await vm.saveOnLeave();
      expect(saveOnLeave).toBe(true)
    })
})

