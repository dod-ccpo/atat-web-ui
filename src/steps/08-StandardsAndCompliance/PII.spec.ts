/*eslint-disable camelcase*/
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import PII from "./PII.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";

Vue.use(Vuetify);

const localVue = createLocalVue();
let vuetify: Vuetify;
let wrapper: Wrapper<DefaultProps & Vue, Element>;
localVue.use(validators);


describe("Testing PII Page", () => {
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PII, {
      vuetify,
      localVue,
      propsData: {}
    });
    jest.spyOn(AcquisitionPackage, "loadData").mockResolvedValue({
      pii_present: 'YES'
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe("testing rendered component", () => {

    it("renders successfully", () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("renders the ATATAlert component", () => {
      expect(wrapper.findComponent(ATATAlert).exists()).toBe(true);
    });


    it("renders the ATATExpandableLink component", () => {
      expect(wrapper.findComponent(ATATExpandableLink).exists()).toBe(true);
    });

    it("renders the headline correctly", () => {
      const headline = wrapper.find("h1.page-header");
      expect(headline.text()).toBe(
        "Let’s find out if your project includes Personally Identifiable Information (PII)");
    });

    it("renders the alert content correctly", () => {
      const alertContent = wrapper.find("#PIIAlert");
      expect(alertContent.text()).toContain("What is PII?");
    });
  });

  describe("testing component data", () => {

    it("loads data on component mount", async () => {
      expect(AcquisitionPackage.loadData).toHaveBeenCalled();
    });

    it("sets savedData when storeData is returned", async () => {

      jest.spyOn(AcquisitionPackage, "loadData")
        .mockResolvedValue({ pii_present: "MOCK_DATA" });
  
      await wrapper.vm.loadOnEnter();
      await wrapper.vm.$nextTick();
  
      expect(wrapper.vm.$data.savedData).toEqual({ pii_present: "MOCK_DATA" });
    });

    it("saveOnLeave() ", async () => {
      const saveOnLeave = await wrapper.vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy()
    })

    it("saveOnLeave() - should catch and log error", async () => {
      console.log = jest.fn();
      jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(() => {
        throw new Error("mock error");
      });
      await wrapper.vm.saveOnLeave();
      expect(console.log).toHaveBeenCalledWith(Error("mock error"));
    });

    it("returns true when current data differs from saved data", async () => {
      jest.spyOn(AcquisitionPackage, "loadData")
        .mockResolvedValue({ pii_present: "OLD_DATA" });
      wrapper.setData({
        selectedPIIOption: "NEW_DATA"
      })
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.hasChanged()).toBe(true);
    });
  });
});