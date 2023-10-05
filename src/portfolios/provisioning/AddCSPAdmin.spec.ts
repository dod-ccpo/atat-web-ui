import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, shallowMount, Wrapper } from "@vue/test-utils";
import AddCSPAdmin from "./AddCSPAdmin.vue";
import { DefaultProps } from "vue/types/options";
import PortfolioStore from "@/store/portfolio";
import { PortfolioProvisioning } from "types/Global";

const data: PortfolioProvisioning = {
  classificationLevels: ["Unclassified"],
  admins: [{hasUnclassifiedAccess: "YES", hasScrtAccess: "NO", hasTSAccess: "NO"}],
  selectedILs: ["aws_il2_dev", "aws_il4_dev"],
  taskOrderNumber: "22222222"
}

Vue.use(Vuetify);

describe("Testing AddCSPAdmin component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AddCSPAdmin, {
      localVue,
      vuetify,
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Tests methods...", () => {

    it ("tests setShowMissingAdminAlert()", async () => {
      PortfolioStore.CSPHasImpactLevels = true;

      // await PortfolioStore.setPortfolioProvisioning(data);
      // await PortfolioStore.doSetPortfolioProvisioning(data);
 
      // jest.spyOn(PortfolioStore, "getPortfolioProvisioningObj")
      //   .mockImplementation(() => Promise.resolve(data));

      await wrapper.vm.loadOnEnter();
      wrapper.setData({
        impactLevelCompareArray: ["aws_il2_dev"],
        classificationLevels: ["Unclassified"],
        admins: [{hasUnclassifiedAccess: "YES", hasScrtAccess: "NO", hasTSAccess: "NO"}],
        hasImpactLevels: true,
        needsUAdmin: true,
        needsSAdmin: false,
        needsTSAdmin: false,
      })
 
      await wrapper.vm.setShowMissingAdminAlert();
      expect(wrapper.vm.showMissingAdminAlert).toBe(true);    
   
    });
  });

});