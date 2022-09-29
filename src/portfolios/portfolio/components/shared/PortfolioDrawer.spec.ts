import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioDrawer from "@/portfolios/portfolio/components/shared/PortfolioDrawer.vue";
import PortfolioData, { PortFolioStatusTypes } from "@/store/portfolio";
import { SelectData, User } from "types/Global";
Vue.use(Vuetify);

describe("Testing Portfolio Drawer component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 
  const members = [
    {
      firstName: "FirstName",
      lastName: "LastName",
      email: "firstNameLastName@mail.mil",
      role: "Manager"
    },
    {
      firstName: "",
      lastName: "",
      email: "email@mil.com",
      role: "Viewer"
    },
    {
      firstName: "Maria",
      lastName: "Missionowner",
      email: "Maria.Missionowner@mil.com",
      role: "Manager"
    },
    {
      firstName: "Sam",
      lastName: "Something",
      email: "Sam.Something@mail.mil",
      role: "Viewer"
    }
  ]

  const portfolio = {
    createdBy: "test-ctr@ccpo.mil",
    csp: "Azure",
    description:"just testfefseffdsfd",
    members: members,
    provisioned: "2022-09-08 18:12:12",
    serviceAgency:"DISA",
    status: "Active",
    title: "test title",
    updated: "2022-09-08 18:12:12"
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioDrawer, {
      localVue,
      vuetify,
    });
    PortfolioData.setPortfolioData(portfolio)
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("saveDescription() - sets $data.portfolio to $store.portfolio ", async ()=> {
    await wrapper.setData({
      portfolio
    })
    await wrapper.vm.saveDescription(portfolio);
    expect(PortfolioData.portfolio).toEqual(portfolio);
  })

  it("displayName() - enter member with full name to return full name ",async () => {
    const name = await wrapper.vm.displayName(members[0])
    expect(name).toBe(members[0].firstName + " " + members[0].lastName);
  })

  it("displayName() - enter member with no name to return email ",async () => {
    const name = await wrapper.vm.displayName(members[1])
    expect(name).toBe(members[1].email);
  })

  it("membersInvited()", async () => {
    const _portfolio = {
      csp: "Azure",
      description:"just testfefseffdsfd",
      members: [],
      provisioned: "2022-09-08 18:12:12",
      serviceAgency:"DISA",
      status: "Active",
      title: "test title",
      updated: "2022-09-08 18:12:12"
    }
    jest.spyOn(PortfolioData, "getPortfolioData").mockImplementation(
      ()=>Promise.resolve( _portfolio ));
    await wrapper.vm.membersInvited();
    expect(wrapper.vm.$data.portfolio).toEqual(_portfolio);

  });

  it("openMembersModal() - call functionensure $data.showMembersModal===true", async()=>{
    await wrapper.vm.openMembersModal()
    expect(wrapper.vm.$data.showMembersModal).toBe(true);
  })

  it("onSelectedMemberRoleChanged() - pass params to successfully change roles ", async()=>{
    const newRole = "Manager";
    const idx = 3
    await wrapper.setData({
      portfolio
    })
    await wrapper.vm.onSelectedMemberRoleChanged(newRole, idx)
    expect(await wrapper.vm.$data.portfolio.members[3].role).toEqual(newRole);
  })

  it("onSelectedMemberRoleChanged() - pass params to successfully change roles ", async()=>{
    const newRole = "Remove";
    const idx = 3
    await wrapper.setData({
      portfolio
    })
    await wrapper.vm.onSelectedMemberRoleChanged(newRole, idx)
    expect (await wrapper.vm.$data.showDeleteMemberDialog).toBe(true);
   
  })

  it("deleteMember() - pass params to successfully change roles ", async()=>{
    await wrapper.setData({
      portfolio
    })
    const currentNumberOfMembers = PortfolioData.portfolio.members?.length || 1
    await wrapper.vm.deleteMember();
    expect(await PortfolioData.portfolio.members?.length).toBe(
      currentNumberOfMembers - 1
    )
  })

  it(`getMemberMenuItems() - changes menu item from "Remove from portfolio" to
    "Leave this portfolio" for current user`, async() => {
    await wrapper.setData({
      currentUser: {
        email: "foo@mail.mil"
      }
    });
    const member = { email: "foo@mail.mil" }
    const menuItems: SelectData[] = wrapper.vm.getMemberMenuItems(member);
    const removeIdx = menuItems.findIndex(obj => obj.value === "Remove");
    const removeMenuItem = menuItems[removeIdx];
    expect(removeMenuItem.text).toBe("Leave this portfolio");
  });

  describe("getTag function with different inputs",()=> {

    it("Test getTag(processing)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolioStatus = PortFolioStatusTypes.Active;
      const result = wrapper.vm.getBgColor()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag(expiring pop)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolioStatus = PortFolioStatusTypes.AtRisk;
      const result = wrapper.vm.getBgColor()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag(expired)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolioStatus =  PortFolioStatusTypes.Delinquent;
      const result = wrapper.vm.getBgColor()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag(archived)- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolioStatus = PortFolioStatusTypes.Archived
      const result = wrapper.vm.getBgColor()
      expect(result.length).toBeGreaterThan(0)
    })
    it("Test getTag()- showed return tags based on Portfolio.status",()=>{
      wrapper.vm.$data.portfolioStatus = ""
      const result = wrapper.vm.getBgColor()
      expect(result.length).toBe(0)
    })
  })
  describe("formatDate()",()=> {
    it("should return the date provided in mmm. dd, yyyy, hhmm ", ()=>{
      const result = wrapper.vm.formatDate("2022-09-08 18:12:12")
      expect(result).toBe("Sep. 8, 2022, 1812")
    })
  })

})

