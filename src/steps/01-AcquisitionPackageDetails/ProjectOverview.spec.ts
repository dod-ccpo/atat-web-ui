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
    "emergency_declaration": "yes"
  }; 

  const mockProjectOverviewDTOCurrent = {
    "scope": "current scope",
    "title": "current title",
    "emergency_declaration": "yes"
  }; 


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ProjectOverview, {
      localVue,
      vuetify,
    });

    jest.spyOn(AcquisitionPackage, 'loadData').mockImplementationOnce(
      ()=>Promise.resolve(mockProjectOverviewDTO)
    );
  });

  afterEach(()=>{
    jest.clearAllMocks();
    
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("loadOnEnter - returns storeData successfully", async()=>{
    jest.mock("@/store/acquisitionPackage", () => ({
      initialize: jest.fn(),
      ensureInitialized: jest.fn()
    }));
    await wrapper.vm.loadOnEnter();  
    expect(await wrapper.vm.$data.currentTitle).toBe("Title From Store");
  })

  it("getForm() returns Vue component with validate() function", async() =>{
    const vueComponent = await wrapper.vm.Form;
    console.log(await vueComponent.type);
    expect(await vueComponent.validate()).toBe(false);
  })

  it("validateForm() returns Vue component", async() =>{
    await wrapper.vm.Form;
    const isValidated =  await wrapper.vm.validateForm();
    expect(isValidated).toBe(true);
  })

  it("projectTitle() - set projtitle in the store then successfully retrieve it", 
    async ()=>{
      const title = "dummy Project Title";
      AcquisitionPackage.getTitle = ()=> title;
      await wrapper.vm.onTitleChanged();
      expect(await wrapper.vm.projectTitle).toBe(title);
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
        "emergency_declaration": "yes"
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
          "emergency_declaration": "yes"
        },
        savedData:{
          "scope": "savedScope",
          "title": "savedTitle",
          "emergency_declaration": "yes"
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

});
