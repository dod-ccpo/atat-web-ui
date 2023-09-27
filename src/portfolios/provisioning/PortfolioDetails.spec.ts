/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import PortfolioDetails from "./PortfolioDetails.vue";
import validators from "@/plugins/validation";
import PortfolioStore, { CSPProvisioningData } from "@/store/portfolio";
import OrganizationData from "@/store/organizationData";

const mockCspProvisionData = [
  {
    name: 'Test1',
    classification_level: 'U',
    cloud_distinguisher: "CloudDistinguisher1"
  },
  {
    name: 'Test2',
    classification_level: 'U',
    cloud_distinguisher: "CloudDistinguisher2"
  },
]

describe("Testing PortfolioDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PortfolioDetails, {
      localVue,
      vuetify,
    });
  });
  it("tests that component renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("tests loadOnEnter with more than one unclass CSP", async () => {
    const mockBuildILCheckbox = jest.spyOn(wrapper.vm, 'buildILCheckboxItems').mockImplementation()
    jest.spyOn(OrganizationData, 'getAgencyData').mockImplementation()
    await PortfolioStore.doSetCSPProvisioningData({
      cspData: mockCspProvisionData as CSPProvisioningData[],
      hasCloudDistinguishers: true
    })
    await wrapper.setData({CSPProvisioningData: mockCspProvisionData})
    await wrapper.vm.loadOnEnter()
    expect(mockBuildILCheckbox).toHaveBeenCalled()
  });
  it("tests showCheckBox", async () => {
    await PortfolioStore.doSetPortfolioProvisioning({
      classificationLevels: ["Unclassified"],
    })
    await PortfolioStore.doSetCSPProvisioningData({
      cspData: mockCspProvisionData as CSPProvisioningData[],
      hasCloudDistinguishers: true
    })
    await wrapper.setData({checkBoxItems: mockCspProvisionData})

    expect(wrapper.vm.showCheckbox).toBe(true)
  });
});
