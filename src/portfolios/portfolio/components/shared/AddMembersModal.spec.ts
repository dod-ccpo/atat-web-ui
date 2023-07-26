import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AddMembersModal from "@/portfolios/portfolio/components/shared/AddMembersModal.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import PortfolioData from "@/store/portfolio";
import api from "@/api";

Vue.use(Vuetify);

describe("Testing AddMembersModal", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  const portfolio = {
    sysId: "12345",
    createdBy: "test-ctr@ccpo.mil",
    csp: "Azure",
    description:"just testfefseffdsfd",
    members: [],
    provisioned: "2022-09-08 18:12:12",
    agency: "DISA",
    status: "Active",
    title: "test title",
    updated: "2022-09-08 18:12:12",
    taskOrderNumber: "987654"
  }

  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(AddMembersModal, {
      localVue,
      vuetify,
    });
    await PortfolioData.setPortfolioData(portfolio);
    await wrapper.setData({
      existingMemberEmails: []
    })
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("renders successfully", async () => {
    AcquisitionPackage.setProjectTitle("testing");
    expect(wrapper.exists()).toBe(true);
  });

  it("resets some data when modal opened", async () => {
    wrapper.setProps({showModal: true})
    expect(wrapper.vm.$data.validEmailList.length).toEqual(0);
    expect(wrapper.vm.$data.enteredEmails.length).toEqual(0);  
  });

  it("sets PorfolioData.setShowAddMembersModal to false when modal closes", async () => {
    wrapper.setProps({showModal: false})
    expect(PortfolioData.showAddMembersModal).toEqual(false);
  });

  it.only("ensure 3 functions are called", async () => {
    jest.spyOn(api.portfolioTable, "update").mockImplementation();
    const doSetPortfolioDataMock = 
      jest.spyOn(PortfolioData, "doSetPortfolioData").mockImplementation(
        async () => Promise.resolve()
      );
    const doSetCurrentUserRoleMock = 
      jest.spyOn(PortfolioData, "doSetCurrentUserRole").mockImplementation();
    await PortfolioData.setPortfolioData({
      sysId: "2134242",
    })
    expect (doSetPortfolioDataMock).toHaveBeenCalled();
    expect (doSetCurrentUserRoleMock).toHaveBeenCalled();
  });

  it("sets PorfolioData.title='' to ensure $data.projectTitle is set correctly", async () => {
    const noTitle = "";
    await PortfolioData.setPortfolioData({
      title: noTitle
    })
    await wrapper.vm.showModalChange(true);
    expect(await wrapper.vm.$data.projectTitle).toBe(
      "New Acquisition"
    );
  });

  it("validates email address - missing domain and @ symbol", async () => {
    wrapper.vm.$data.enteredEmails = [{ email: "", isValid: false }];
    const isValid = await wrapper.vm.validateEmail("foo", 0);
    expect(isValid).toBeFalsy();
    expect(wrapper.vm.$data.invalidEmailMessage)
      .toContain("Please use a standard domain format");
  });

  it("validates email address - missing domain", async () => {
    wrapper.vm.$data.enteredEmails = [{ email: "", isValid: false }];
    const isValid = await wrapper.vm.validateEmail("foobar@mail", 0);
    expect(isValid).toBeFalsy();
    expect(wrapper.vm.$data.invalidEmailMessage).toContain("that ends with “.mil” or “.gov”");
  });
  
  it("validates email address - missing @ symbol", async () => {
    wrapper.vm.$data.enteredEmails = [{ email: "", isValid: false }];
    const isValid = await wrapper.vm.validateEmail("foobar.mil", 0);
    expect(isValid).toBeFalsy();
    expect(wrapper.vm.$data.invalidEmailMessage).toContain("Please include an ‘@’ symbol");
  });

  it("validates email address - not .mil or .gov", async () => {
    const isValid = await wrapper.vm.validateEmail("foo@bar.com");
    expect(isValid).toBeFalsy();
  });

  it("validates email address - existing member email entered", async () => {
    wrapper.vm.$data.enteredEmails = [{ email: "", isValid: false }];
    const isValid = await wrapper.vm.validateEmail("foo@bar.mil", 0);
    expect(isValid).toBeTruthy();
    const emailIsValidUpdated = wrapper.vm.$data.enteredEmails[0].isValid;
    expect(emailIsValidUpdated).toBeTruthy();
  });

  it("validates email address - correcting invalid email", async () => {
    wrapper.vm.$data.enteredEmails = [{ email: "", isValid: false }];
    const isValid = await wrapper.vm.validateEmail("foo@bar.mil", 0);
    expect(isValid).toBeTruthy();
    const emailIsValidUpdated = wrapper.vm.$data.enteredEmails[0].isValid;
    expect(emailIsValidUpdated).toBeTruthy();
  });

  it("validates email address - multiple invalid entries", async () => {
    wrapper.vm.$data.enteredEmails = [
      { email: "foo@bar", isValid: false },
      { email: "bar@foo", isValid: false },
    ];
    const isValid = await wrapper.vm.validateEmail("still@bad.email", 0);
    expect(isValid).toBeFalsy();
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.invalidEmailCount).toEqual(2);
    });
  });

  it("removes email address", async () => {
    wrapper.vm.$data.enteredEmails = [
      { key: "remove-me", email: "", isValid: false },
      { key: "keep-me", email: "", isValid: false }
    ];
    wrapper.vm.removeEmailFromList("remove-me");
    expect(wrapper.vm.$data.enteredEmails.length).toEqual(1);
  });

  it("sets width of input", async () => {
    wrapper.setProps({showModal: true})
    Vue.nextTick(async () => {
      wrapper.vm.$data.enteredEmails = [{ email: "foo@mail.mil", key: "123" }];
      const inputWidthFakerDiv = await wrapper.find("#inputWidthFaker");
      wrapper.vm.$data.inputWidthFaker = inputWidthFakerDiv;
      Vue.nextTick(() => {
        wrapper.vm.setInputWidths();
      });
    });
  });

  it("edits email address", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [
        { key: "123", email: "foo@mail.mil", isValid: true },
      ],
      validEmailList: ["foo@mail.mil"]
    });

    const emailInput = await wrapper.find("input[data-email-key='123']");

    await emailInput.trigger("click");
    expect(wrapper.vm.$data.pillboxFocused).toBeTruthy();
  });

  it("blurs email address", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [
        { key: "123", email: "foo@mail.mil", isValid: true },
      ],
    })

    const emailInput = await wrapper.find("input[data-email-key='123']");
    Vue.nextTick(async () => {
      await emailInput.trigger("blur");
      expect(wrapper.vm.$data.pillboxFocused).toBeFalsy();  
    })
  });

  it("blurs email address - add valid email to this.validEmailList", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [
        { key: "123", email: "baz@mail.mil", isValid: true },
      ],
      duplicatedEmail: "",
      validEmailList: [],
      existingMemberEmails: [],
    });

    const emailInput = await wrapper.find("input[data-email-key='123']");
    await emailInput.trigger("blur");
    expect(wrapper.vm.$data.pillboxFocused).toBeFalsy();
    expect(wrapper.vm.$data.validEmailList.length).toEqual(1);
  });

  it("blurs email address - removes email record if blurring and no text entered", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [{ key: "123", email: "" }],
    });

    const emailInput = await wrapper.find("input[data-email-key='123']");
    await emailInput.trigger("blur");
    expect(wrapper.vm.$data.enteredEmails.length).toBe(0);
  });

  it("delete email address by clicking pill X", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [
        { key: "123", email: "foo@mail.mil", isValid: true, isExisting: false },
      ],
    });
    const emailInput = await wrapper.find("input[data-email-key='123']");
    await emailInput.trigger("blur");
    Vue.nextTick(async () => {
      const emailDeleteButton = await wrapper.find("#RemoveEmail123");
      await emailDeleteButton.trigger("click");
      expect(wrapper.vm.$data.enteredEmails.length).toBe(0);
    });
  });


  it("removes all invalid and existing emails", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [
        { key: "123", email: "foo@mail", isValid: false, isExisting: false },
        { key: "456", email: "foo@mail.mil", isValid: true, isExisting: true },
      ],
      existingMemberEmails: ["foo@mail.mil"],
    });

    wrapper.vm.removeInvalidEmails();
    Vue.nextTick(async () => {
      expect(wrapper.vm.$data.enteredEmails.length).toBe(0);       
    });
  });

  it("-- addEmail() -- creates an input to enter email address", async () => {
    await wrapper.setProps({showModal: true})
    await wrapper.setData({
      enteredEmails: [],
    });
  
    const pillboxWrapper = await wrapper.find("#PillboxWrapper");
    await pillboxWrapper.trigger("click");
    expect(wrapper.vm.$data.pillboxFocused).toBeTruthy();
  });

});
