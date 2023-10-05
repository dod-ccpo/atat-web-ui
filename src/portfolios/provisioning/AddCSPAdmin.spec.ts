import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, shallowMount, Wrapper } from "@vue/test-utils";
import AddCSPAdmin from "./AddCSPAdmin.vue";
import { DefaultProps } from "vue/types/options";
import validators from "@/plugins/validation";

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
  localVue.use(validators);
  const vuetify = new Vuetify();
  const wrapper: Wrapper<DefaultProps & Vue, Element> = shallowMount(AddCSPAdmin, {
    localVue,
    vuetify,
  });

  it("tests that component renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it ("tests setShowMissingAdminAlert() - true missing IL4 and secret", async () => {
    wrapper.setData({
      impactLevels: ["aws_il2_dev", "aws_il4_dev"],
      impactLevelCompareArray: ["aws_il2_dev", "aws_il4_dev"],
      classificationLevels: ["Unclassified", "Secret"],
      admins: [
        {
          hasUnclassifiedAccess: "YES", 
          hasScrtAccess: "NO", 
          hasTSAccess: "NO",
          impactLevels: ["aws_il2_dev"]
        }
      ],
      hasImpactLevels: true,
    });
    expect(wrapper.vm.needsUAdmin).toBe(true);
    await wrapper.vm.setShowMissingAdminAlert();
    expect(wrapper.vm.showMissingAdminAlert).toBe(true);  
    expect(wrapper.vm.missingEnv).toContain("Unclassified/IL4");
    expect(wrapper.vm.missingEnv).toContain("Secret");
  });

  it ("tests setShowMissingAdminAlert() - true missing Unclassified", async () => {
    wrapper.setData({
      impactLevels: ["aws_il2_dev"],
      impactLevelCompareArray: ["aws_il2_dev"],
      classificationLevels: ["Unclassified"],
      admins: [
        {
          hasUnclassifiedAccess: "NO", 
          hasScrtAccess: "YES", 
          hasTSAccess: "NO",
          impactLevels: []
        }
      ],
      hasImpactLevels: true,
    });
    expect(wrapper.vm.needsUAdmin).toBe(true);
    await wrapper.vm.setShowMissingAdminAlert();
    expect(wrapper.vm.showMissingAdminAlert).toBe(true);  
    expect(wrapper.vm.missingEnv).toContain("Unclassified");
  });

  it ("tests setShowMissingAdminAlert() - true missing Secret and TS", async () => {
    wrapper.setData({
      impactLevels: [],
      impactLevelCompareArray: [],
      classificationLevels: ["Secret", "Top Secret"],
      admins: [
        {
          hasUnclassifiedAccess: "YES", 
          hasScrtAccess: "NO", 
          hasTSAccess: "NO",
          impactLevels: []
        }
      ],
      hasImpactLevels: false,
    });
    expect(wrapper.vm.needsUAdmin).toBe(false);
    expect(wrapper.vm.needsSAdmin).toBe(true);
    expect(wrapper.vm.needsTSAdmin).toBe(true);
    await wrapper.vm.setShowMissingAdminAlert();
    expect(wrapper.vm.showMissingAdminAlert).toBe(true);  
    expect(wrapper.vm.missingEnv).toContain("Secret");
    expect(wrapper.vm.missingEnv).toContain("Top Secret");
  });

  it ("tests setShowMissingAdminAlert() - false", async () => {
    wrapper.setData({
      impactLevels: [],
      impactLevelCompareArray: [],
      classificationLevels: ["Unclassified", "Secret", "Top Secret"],
      admins: [
        {
          hasUnclassifiedAccess: "YES", 
          hasScrtAccess: "YES", 
          hasTSAccess: "YES",
          impactLevels: []
        }
      ],
      hasImpactLevels: false,
    });
    expect(wrapper.vm.needsUAdmin).toBe(true);
    expect(wrapper.vm.needsSAdmin).toBe(true);
    expect(wrapper.vm.needsTSAdmin).toBe(true);
    await wrapper.vm.setShowMissingAdminAlert();
    expect(wrapper.vm.showMissingAdminAlert).toBe(false);  
  });

});