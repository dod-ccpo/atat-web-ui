import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioSummaryPageHead from
  "@/portfolios/portfolio/components/shared/PortfolioSummaryPageHead.vue";
import SlideoutPanel from "@/store/slideoutPanel";
import PortfolioData from "@/store/portfolio";
import PortfolioStore from "@/store/portfolio";
import CurrentUserStore from "@/store/user";
import { Environment, PortfolioDetailsDTO, PortfolioDTO } from "types/Global";
Vue.use(Vuetify);

const mockEnvironments = [
  /* eslint-disable */
  {
    classification_level: "U",
    csp: "",
    csp_display: "azure_il4_dev",
    csp_id: "",
    dashboard_link: "https://www.google.com/",
    environment_status: "PROCESSING",
    name: "Test 2 - Unclassified",
    portfolio: "",
    provisioned: "false",
    provisioned_date: "",
    provisioning_failure_cause: "",
    provisioning_request_date: "",
    sys_created_by: "test.user",
    sys_created_on: "2023-09-22 18:58:03",
    sys_id: "",
    sys_mod_count: "2",
    sys_tags: "",
    sys_updated_by: "admin",
    sys_updated_on: "2023-09-22 18:59:06",
  },
  {
    classification_level: "U",
    csp: "",
    csp_display: "azure_il2_dev",
    csp_id: "",
    dashboard_link: "https://www.google.com/",
    environment_status: "PROCESSING",
    name: "Test 2 - Unclassified",
    portfolio: "",
    provisioned: "false",
    provisioned_date: "",
    provisioning_failure_cause: "",
    provisioning_request_date: "",
    sys_created_by: "test.user",
    sys_created_on: "2023-09-22 18:58:03",
    sys_id: "",
    sys_mod_count: "2",
    sys_tags: "",
    sys_updated_by: "admin",
    sys_updated_on: "2023-09-22 18:59:06",
  },
  
] as Environment[]
/* eslint-enable */
describe("Testing Members Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioSummaryPageHead, {
      localVue,
      vuetify,
      propsData: {
        title: "portfoliotest",
        portfolioStatus:"Active"
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test openModal() - check expected results", 
    async () => {
      await wrapper.vm.openModal();
      expect(PortfolioData.showAddMembersModal).toBe(true);
    })

  it("test openModal() - check expected results", 
    async () => {
      const booleanVar = true;
      jest.spyOn(PortfolioData,'setShowAddMembersModal').mockImplementation(
        ()=>{
          return{
            showAddMembersModal: booleanVar
          }
        }
      )
      await wrapper.vm.openModal();
      expect(PortfolioData.showAddMembersModal).toBe(booleanVar);
    })


  // it("test saveTitle() - check expected results ", 
  //   async () => {
  //     const dummyTitle = "dummyTitle";
  //     jest.spyOn(PortfolioData,'getPortfolioData').mockImplementation(
  //       ()=>Promise.resolve(
  //         {
  //           title: dummyTitle
  //         }
  //       ));
      
  //     await wrapper.setProps({
  //       title: dummyTitle
  //     })
  //     await wrapper.vm.saveTitle();
  //     expect(PortfolioData.currentPortfolio.title).toBe(dummyTitle);
  //   })



  it("test openSlideoutPanel()- should toggle the value of showDrawer to true",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    const eObject = {
      currentTarget: 'test', 
      preventDefault: jest.fn(),
      cancelBubble: false,
    }
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(false)
    wrapper.vm.openSlideoutPanel(eObject)
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(true))
  })

  it("test openSlideoutPanel()- should toggle the value of showDrawer to false",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    wrapper.setData({showDrawer:true})
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(true)
    wrapper.vm.openSlideoutPanel()
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(false))
  })

  it("test openSlideoutPanel()- should toggle the value of showDrawer to false",async ()=> {
    jest.spyOn(SlideoutPanel,'openSlideoutPanel').mockImplementation()
    wrapper.setData({showDrawer:true})
    const memberModal = wrapper.vm.showDrawer
    expect(memberModal).toBe(true)
    wrapper.vm.openSlideoutPanel()
    wrapper.vm.$nextTick(()=> expect(memberModal).toBe(false))
  })

  // it("movetoinput", async()=> {
  //   // stub in necessary header text field textbox 
  //   const id = "PortfolioTitleInput";
  //   const input = document.createElement("input");
  //   input.setAttribute("type", "text");
  //   input.setAttribute("id", id);
  //   document.body.appendChild(input);

  //   await wrapper.vm.moveToInput();
  //   expect(document.activeElement?.id).toBe(id);
  // })

  it("test handleMoreMenuClick() => moveToInput", async () => {
    const moveToInputSpy = jest.spyOn(wrapper.vm, 'moveToInput').mockImplementation()
    await wrapper.vm.handleMoreMenuClick('moveToInput')
    expect(moveToInputSpy).toHaveBeenCalled()
  })

  it("test handleMoreMenuClick() => openModal", async () => {
    const openModalSpy = jest.spyOn(wrapper.vm, 'openModal').mockImplementation()
    await wrapper.vm.handleMoreMenuClick('openModal')
    expect(openModalSpy).toHaveBeenCalled()
  })

  it("test handleMoreMenuClick() => openArchivePortfolioModal", async () => {
    const openArchivePortfolioModalSpy = jest.spyOn(
      wrapper.vm, 
      'openArchivePortfolioModal'
    ).mockImplementation()

    await wrapper.vm.handleMoreMenuClick('openArchivePortfolioModal')
    expect(openArchivePortfolioModalSpy).toHaveBeenCalled()
  })
  
  it("test handleMoreMenuClick() => leaveThisPortfolio", async () => {
    await wrapper.vm.handleMoreMenuClick('leaveThisPortfolio')
    expect(wrapper.emitted("leavePortfolio")).toBeTruthy()
  })

  it("test moreMenuItemActions data", async () => {
    expect(wrapper.vm.$data.moreMenuItemActions).toStrictEqual({
      openArchivePortfolioModal: "openArchivePortfolioModal",
      moveToInput: "moveToInput",
      openModal: "openModal",
      leaveThisPortfolio: "leaveThisPortfolio"
    })
  })

  it("test getMoreMenuItems () => MeatballMenuItems[] as Owner", async () => {
    const items =  wrapper.vm.getMoreMenuItems;
    expect(items).toStrictEqual([
      {
        id: "InviteMembers_MenuItem",
        title: "Invite members to portfolio",
        action: 'openModal'
      },
      {
        id: "RenamePortfolio_MenuItem",
        title: "Rename portfolio",
        action: "moveToInput"
      },
      {
        id: "ArchivePortfolio_MenuItem",
        title: "Archive portfolio",
        action: "openArchivePortfolioModal"
      }
    ])
  })

  it("test getMoreMenuItems () => MeatballMenuItems[] as Manager", async () => {
    /* eslint-disable camelcase */
    const mockUser = {sys_id: '1234'} 
    const mockPortfolio = { portfolio: {current_user_is_manager: true}}; 
    /* eslint-enable camelcase */
    CurrentUserStore.setCurrentUser(mockUser);
    await PortfolioStore.setCurrentPortfolioFromCard(mockPortfolio as PortfolioDetailsDTO);
    const items =  wrapper.vm.getMoreMenuItems;
    expect(items).toStrictEqual([
      {
        id: "LeavePortfolio_MenuItem",
        title: "Leave this portfolio",
        action: 'leaveThisPortfolio'
      },
      {
        id: "InviteMembers_MenuItem",
        title: "Invite members to portfolio",
        action: 'openModal'
      },
      {
        id: "RenamePortfolio_MenuItem",
        title: "Rename portfolio",
        action: "moveToInput"
      }
    ])
  })


  it("test loadOnEnter", async () => {
    await wrapper.setProps({environmentLinks: mockEnvironments})
    await wrapper.vm.loadOnEnter()
    expect(wrapper.vm.$data.cspLoginText).toBe("LOGIN TO YOUR CSP PORTALS")
  })
})
