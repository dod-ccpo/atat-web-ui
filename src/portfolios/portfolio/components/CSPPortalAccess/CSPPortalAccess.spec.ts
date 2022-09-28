import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CSPPortalAccess from "@/portfolios/portfolio/components/CSPPortalAccess/CSPPortalAccess.vue";
import validators from "@/plugins/validation";
Vue.use(Vuetify);

describe("Testing CSPPortalAccess Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  beforeEach( async () => {
    vuetify = new Vuetify();
    wrapper = mount(CSPPortalAccess, {
      localVue,
      vuetify,
      propsData:{
        portfolioCSP: "Azure"
      },
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test openCSPModal", async () => {
    const modal = wrapper.vm.$data.showCSPModal;
    expect(modal).toBe(false);

    wrapper.vm.openCSPModal();
    Vue.nextTick(() => {
      expect(modal).toBe(true);
    })
  });

  it("testing validateEmail()- with invalid email domain",async ()=>{
    wrapper.setData({
      adminEmail: "test@wrong.domain"
    })
    const result =await wrapper.vm.validateEmail()
    expect(result).toBe(false);
  })
  it("testing validateEmail()- with invalid email domain",async ()=>{
    wrapper.setData({
      adminEmail: "testemailk"
    })
    const result =await wrapper.vm.validateEmail()
    expect(result).toBe(false);
  })

  it("testing validateEmail()- with missing '@' symbol",async ()=>{
    wrapper.setData({
      adminEmail: "testwrong.gov"
    })
    const result =await wrapper.vm.validateEmail()
    expect(result).toBe(false);
  })

  it("testing validateEmail()- with missing email",async ()=>{
    wrapper.setData({
      adminEmail: ""
    })
    const result =await wrapper.vm.validateEmail()
    expect(result).toBe(false);
  })

  it("testing validateEmail()- correct email ",async ()=>{
    wrapper.setData({
      adminEmail: "Correctemail@test.mil"
    })
    const result =await wrapper.vm.validateEmail()
    expect(result).toBe(true);
  })

  it("testing openLearnMoreDrawer() ",async ()=>{
    const result =await wrapper.vm.$data.modalDrawerIsOpen
    expect(result).toBe(false);

    wrapper.vm.openLearnMoreDrawer()
    Vue.nextTick(() => {
      expect(result).toBe(true);
    })
  })

  it("testing okDisabled()- correct email ",async ()=>{
    wrapper.setData({
      emailIsValid: true,
      formIsValid: true,
      dodID: true,
    })
    expect(wrapper.exists()).toBe(true);
  })

  it("addCSPMember() - adds CSP member from modal form",async ()=>{
    wrapper.setData({
      adminEmail: "foo@bar.mil",
      dodId: "1234567890",
      tableData: [],
      emailIsValid: true,

    })
    wrapper.vm.addCSPMember();
    Vue.nextTick(() => {
      expect(wrapper.vm.$data.tableData.length).toBe(1);
      expect(wrapper.vm.$data.adminEmail).toBe("");
      expect(wrapper.vm.$data.dodID).toBe("");
      expect(wrapper.vm.$data.emailIsValid).toBeFalsy();
    });
  });

  
})
