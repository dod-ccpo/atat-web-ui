/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PortfolioDrawer from "@/portfolios/portfolio/components/shared/PortfolioDrawer.vue";
import PortfolioData from "@/store/portfolio";
import { SelectData } from "types/Global";
import {UserDTO} from "@/api/models";
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
    sysId: "12345",
    createdBy: "test-ctr@ccpo.mil",
    csp: "Azure",
    description:"just testfefseffdsfd",
    members: members,
    provisioned: "2022-09-08 18:12:12",
    agency: "DISA",
    status: "Active",
    title: "test title",
    updated: "2022-09-08 18:12:12",
    taskOrderNumber: "987654",
    environments: [
      {
        "csp": "",
        "csp_name": "",
        "csp_id": "",
        "name": "",
        "portfolio": "",
        "provisioning_failure_cause": "",
        "classification_level": "S",
        // eslint-disable-next-line max-len
        "cloud_distinguisher": "{\n      \"name\": \"IL5\",\n      \"display_name\": \"Azure Commercial\",\n      \"description\": \"Microsoft Azure Commercial cloud meant for use by DoD organizations with IL2 workloads\"\n}",
        "csp_display": "aws_il6_dev",
        "dashboard_link": "http://foobaar.com",
        "environment_status": "PROVISIONED",
        "provisioned": "",
        "provisioned_date": "2023-10-12 20:23:14",
        "provisioning_request_date": "",
        "sys_created_on": "2023-10-12 19:06:18",
        "sys_id": "7e2ad61e47753110ee827d7ba26d43a1"
      },
      {
        "csp": "",
        "csp_name": "",
        "csp_id": "",
        "name": "",
        "portfolio": "",
        "provisioned": "",
        "provisioning_failure_cause": "",
        "classification_level": "U",
        // eslint-disable-next-line max-len
        "cloud_distinguisher": "{\n      \"name\": \"IL5\",\n      \"display_name\": \"Azure Commercial\",\n      \"description\": \"Microsoft Azure Commercial cloud meant for use by DoD organizations with IL2 workloads\"\n}",
        "csp_display": "aws_il5_dev",
        "dashboard_link": "http://foobaar.com",
        "environment_status": "PROCESSING",
        "provisioned_date": "",
        "provisioning_request_date": "",
        "sys_created_on": "2023-10-12 19:06:17",
        "sys_id": "e22ad61e47753110ee827d7ba26d4368"
      }
    ],
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioDrawer, {
      localVue,
      vuetify,
    });
    PortfolioData.setCurrentPortfolioMembers(portfolio);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("showMembersModal()", async()=>{
    const showMembersModal = await wrapper.vm.showMembersModal;
    expect(showMembersModal).toBe(false)
  })

  it("membersInvited()", async () => {
    const loadPortfolioMock = jest.spyOn(wrapper.vm, "loadPortfolio").mockImplementation();
    await wrapper.vm.membersInvited();
    expect (loadPortfolioMock).toHaveBeenCalled;
  });

  it("openMembersModal() - call function ensure $data.showMembersModal===true", async()=>{
    await wrapper.vm.openMembersModal()
    expect(await wrapper.vm.showMembersModal).toBe(true);
  })

  it("onSelectedMemberRoleChanged() - pass params to successfully change roles ", async()=>{
    const newRole = "Manager";
    const idx = 3
    await wrapper.setData({
      portfolio
    })
    const updateMemberRoleMock = jest.spyOn(wrapper.vm, "updateMemberRole").mockImplementation();
    await wrapper.vm.onSelectedMemberRoleChanged(newRole, idx)
    expect (updateMemberRoleMock).toHaveBeenCalled();
  })

  it("onSelectedMemberRoleChanged() - pass params to remove from portfolio ", async()=>{
    const newRole = "Remove";
    const idx = 0
    await wrapper.setData({
      currentUser: {
        sys_id: "123456"
      },
      portfolio, 
      portfolioMembers: [{
        firstName: "FirstName",
        lastName: "LastName",
        email: "firstNameLastName@mail.mil",
        role: "Manager",
        sys_id: "987654"
      }]
    })

    const _portfolio = {
      csp: "Azure",
      description:"just testfefseffdsfd",
      members: [{
        firstName: "FirstName",
        lastName: "LastName",
        email: "firstNameLastName@mail.mil",
        role: "Manager",
        sys_id: "987654"
      }],
      provisioned: "2022-09-08 18:12:12",
      agency: "DISA",
      status: "Active",
      title: "test title",
      updated: "2022-09-08 18:12:12"
    }
    jest.spyOn(PortfolioData, "getPortfolioData").mockImplementation(
      ()=>Promise.resolve( _portfolio ));

    await wrapper.vm.onSelectedMemberRoleChanged(newRole, idx)
    expect (await wrapper.vm.$data.showRemoveMemberDialog).toBe(true);
   
  })

  it("removeMember() - pass params to successfully change roles ", async()=>{
    await wrapper.setData({
      portfolio,
      removeMemberIndex: 0,
    })
    const currentNumberOfMembers = PortfolioData.currentPortfolio.members?.length || 1
    await wrapper.vm.removeMember();
    expect(PortfolioData.currentPortfolio.members?.length).toBe(
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

  it('should open a new window if classification_level is "U" and dashboard_link is set', () => {
    const mockEnv = {
      classification_level: 'U',
      dashboard_link: 'https://example.com'
    };
    window.open = jest.fn();
    wrapper.vm.handleLinkClick(mockEnv);
    expect(window.open).toHaveBeenCalledWith(mockEnv.dashboard_link, '_blank');
  });

  it('should not open a new window if classification_level is not "U"', () => {
    const mockEnv = {
      classification_level: 'S',
      dashboard_link: 'https://example.com'
    };
    window.open = jest.fn();
    wrapper.vm.handleLinkClick(mockEnv);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should not open a new window if dashboard_link is not set', () => {
    const mockEnv = {
      classification_level: 'U',
      dashboard_link: null
    };
    window.open = jest.fn();
    wrapper.vm.handleLinkClick(mockEnv);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should set currentUserIsManager to true if user with role "Manager" is found', async () => {
    const mockUser: UserDTO = {sys_id: '12345'};
    await wrapper.setData({portfolioMembers: [{ sys_id: '12345', role: 'Manager' }]});
    wrapper.vm.currentUserChange(mockUser);
    expect(wrapper.vm.currentUserIsManager).toBe(true);
  });

  it('should not change currentUserIsManager if user without role "Manager" is found', async () => {
    const mockUser: UserDTO = {sys_id: '12345'};
    await wrapper.setData({portfolioMembers: [{ sys_id: '12345', role: 'Viewer' }]});
    wrapper.vm.currentUserChange(mockUser);
    expect(wrapper.vm.currentUserIsManager).toBe(false);
  });

  it('should not change currentUserIsManager if no user is found', async () => {
    const mockUser: UserDTO = {sys_id: '000'};
    await wrapper.setData({portfolioMembers: [{ sys_id: '12345', role: 'Viewer' }]});
    wrapper.vm.currentUserChange(mockUser);
    expect(wrapper.vm.currentUserIsManager).toBe(false);
  });

  describe('notMemberDropdown', () => {
    describe('isReadOnly', () => {
      it('should return the value of portfolioIsArchived', () => {
        expect(wrapper.vm.isReadOnly).toBe(false);
      });
    });

    // eslint-disable-next-line max-len
    it('should return false when currentUserIsViewer is true and member.sys_id matches currentUser.sys_id', async () => {
      await wrapper.setData({
        currentUserIsViewer: true,
        currentUser: {
          sys_id: 1
        },
        portfolio: {
          archived: false
        }
      });
      const mockMember = { sys_id: '1', role: 'Viewer' };
      expect(wrapper.vm.notMemberDropdown(mockMember)).toBe(false);
    });

    it('should return true when member role is "Owner"', () => {
      const mockMember = { sys_id: '2', role: 'Owner' };
      expect(wrapper.vm.notMemberDropdown(mockMember)).toBe(true);
    });

    it('should return false when none of the conditions are met', async () => {
      await wrapper.setData({
        currentUserIsViewer: false,
        currentUser: { sys_id: '1'},
        portfolioIsArchived: false
      });
      const mockMember = { sys_id: '2', role: 'Manager' };
      expect(wrapper.vm.notMemberDropdown(mockMember)).toBe(false);
    });
  });

  describe('cancelRemoveMember', () => {
    beforeEach(() => {
      wrapper.vm.showRemoveMemberDialog = true;
      wrapper.vm.showLeavePortfolioModal = true;
      wrapper.vm.removeMemberIndex = 0;
    });

    it('should set showRemoveMemberDialog to false', () => {
      wrapper.vm.cancelRemoveMember();
      expect(wrapper.vm.showRemoveMemberDialog).toBe(false);
    });

    it('should set showLeavePortfolioModal to false', () => {
      wrapper.vm.cancelRemoveMember();
      expect(wrapper.vm.showLeavePortfolioModal).toBe(false);
    });

    it('should set removeMemberIndex to -1', () => {
      wrapper.vm.cancelRemoveMember();
      expect(wrapper.vm.removeMemberIndex).toBe(-1);
    });
  });

  describe('getCspName', () => {
    it('should return empty string if cloud_distinguisher is not present', () => {
      const env = { cloud_distinguisher: null };
      expect(wrapper.vm.getCspName(env)).toBe('');
    });

    it('should handle JSON parsing and return appropriate string for AZURE and IL2', () => {
      wrapper.vm.portfolio.vendor = "AZURE";
      const env = { cloud_distinguisher: JSON.stringify({ name: "IL2" }) };
      expect(wrapper.vm.getCspName(env)).toBe('Azure Commercial (IL2)');
    });

    it('should handle JSON parsing and return appropriate string for AZURE and non-IL2', () => {
      wrapper.vm.portfolio.vendor = "AZURE";
      const env = { cloud_distinguisher: JSON.stringify({ name: "IL5" }) };
      expect(wrapper.vm.getCspName(env)).toBe('Azure Government (IL5)');
    });

    it('should handle JSON parsing and return appropriate string for GCP', () => {
      wrapper.vm.portfolio.vendor = "GCP";
      const env = { cloud_distinguisher: JSON.stringify({ name: "IL2" }) };
      expect(wrapper.vm.getCspName(env)).toBe('Google IL2 Commercial');
    });

    it('should return empty string for AWS', () => {
      wrapper.vm.portfolio.vendor = "AWS";
      const env = { cloud_distinguisher: JSON.stringify({ name: "IL2" }) };
      expect(wrapper.vm.getCspName(env)).toBe('');
    });

    it('should return empty string for unknown vendor', () => {
      wrapper.vm.portfolio.vendor = "UNKNOWN";
      const env = { cloud_distinguisher: JSON.stringify({ name: "IL2" }) };
      expect(wrapper.vm.getCspName(env)).toBe('');
    });

    it('should handle JSON parse errors', () => {
      const env = { cloud_distinguisher: "This is not valid JSON" };
      const result = wrapper.vm.getCspName(env);
      expect(result.startsWith("Failure parsing cloud_distinguisher")).toBe(true);
    });
  });

  describe('getEnvDateStr', () => {
    // eslint-disable-next-line max-len
    it('should return formatted date if environment_status is not Processing and provisioned_date exists', () => {
      const mockDate = "2023-04-15";
      const env = { environment_status: "STATUS", provisioned_date: mockDate };
      const expectedResult = "April 15, 2023 at 0000";
      expect(wrapper.vm.getEnvDateStr(env)).toBe(expectedResult);
    });

    it('should return an empty string if neither condition is met', () => {
      const env = { environment_status: "SomeOtherStatus" };
      expect(wrapper.vm.getEnvDateStr(env)).toBe("");
    });
  });

  describe('closeTransferOwnerModal', () => {
    beforeEach(() => {
      wrapper.vm.showTransferOwnerDialog = true;
      wrapper.vm.transferOwnershipIndex = 0;
    });

    it('should set showTransferOwnerDialog to false', async () => {
      await wrapper.vm.closeTransferOwnerModal();
      expect(wrapper.vm.showTransferOwnerDialog).toBe(false);
    });

    it('should set transferOwnershipIndex to -1', async () => {
      await wrapper.vm.closeTransferOwnerModal();
      expect(wrapper.vm.transferOwnershipIndex).toBe(-1);
    });
  });

  describe('downgradeManager', () => {
    // eslint-disable-next-line max-len
    it('should handle the downgrade process correctly when portfolio.members is truthy', async () => {
      wrapper.vm.portfolio = { members }; // Set some mock members
      wrapper.vm.downgradeMemberIndex = 0; // Mock an index
      await wrapper.vm.downgradeManager();
      expect(wrapper.vm.modalOKDisabled).toBe(false);
      expect(wrapper.vm.showOKSpinner).toBe(false);
      expect(wrapper.vm.currentUserDowngradedToViewer).toBe(true);
      expect(wrapper.vm.showManagerDowngradeDialog).toBe(false);
    });

    // eslint-disable-next-line max-len
    it('should reset modalOKDisabled and showOKSpinner even if portfolio.members is falsy', async () => {
      wrapper.vm.portfolio = {};
      await wrapper.vm.downgradeManager();
      expect(wrapper.vm.modalOKDisabled).toBe(false);
      expect(wrapper.vm.showOKSpinner).toBe(false);
    });
  });
})

