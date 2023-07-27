/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import CreateFirstPortfolio from "./CreateFirstPortfolio.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Steps from "@/store/steps";
import PortfolioStore from "@/store/portfolio";
import validators from "@/plugins/validation";
import AppSections from "@/store/appSections";

const mockRoute = {
  params: {
    id: 1,
  },
};
const mockRouter = {
  push: jest.fn(),
};

describe("Testing CreateFirstPortfolio Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CreateFirstPortfolio, {
      localVue,
      vuetify,
      mocks: {
        $route: mockRoute,
        $router: mockRouter,
      },
    });
  });
  it("tests that component renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("startNewAcquisition() =>", () => {
    beforeEach(async () => {
      jest
        .spyOn(AcquisitionPackage, "setIsNewPackage")
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(AcquisitionPackage, "reset")
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(Steps, "setAltBackDestination")
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(PortfolioStore, "setSelectedAcquisitionPackageSysId")
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(AppSections, "changeActiveSection")
        .mockImplementation(() => Promise.resolve());
      await wrapper.vm.startNewAcquisition();
    });

    it("Should call these functions", async () => {
      expect(Steps.setAltBackDestination).toHaveBeenCalled();
      expect(AcquisitionPackage.reset).toHaveBeenCalled();
      expect(AcquisitionPackage.setIsNewPackage).toHaveBeenCalled();
      expect(
        PortfolioStore.setSelectedAcquisitionPackageSysId
      ).toHaveBeenCalled();
    });

    it("Should call $router push", async () => {
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });
    it("Should call and change active section", async () => {
      expect(AppSections.changeActiveSection).toHaveBeenCalledWith(
        AppSections.sectionTitles.AcquisitionPackage
      );
    });
    it("testing @keydown.space to trigger viewAllPackages() ", async () => {
      const anchorLink = wrapper.find("#createAPackageLink");
      anchorLink.trigger('keydown.space'); // trigger viewAllPackages();
      expect(AppSections.changeActiveSection).toHaveBeenCalledWith(
        AppSections.sectionTitles.AcquisitionPackage
      );
    });
  
    it("testing @keydown.enter to trigger viewAllPackages() ", async () => {
      const anchorLink = wrapper.find("#createAPackageLink");
      anchorLink.trigger('keydown.enter'); // trigger viewAllPackages();
      expect(AppSections.changeActiveSection).toHaveBeenCalledWith(
        AppSections.sectionTitles.AcquisitionPackage
      );
    });
  });

  describe("startProvisionWorkFlow() =>", () => {
    beforeEach(async () => {
      jest
        .spyOn(Steps, "setAltBackDestination")
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(AcquisitionPackage, "reset")
        .mockImplementation(() => Promise.resolve());
      jest
        .spyOn(AppSections, "changeActiveSection")
        .mockImplementation(() => Promise.resolve());
      await wrapper.vm.startProvisionWorkflow();
    });

    it("Should call these functions", async () => {
      expect(Steps.setAltBackDestination).toHaveBeenCalledWith(
        AppSections.sectionTitles.CreateFirstPortfolio
      );
      expect(AcquisitionPackage.reset).toHaveBeenCalled();
    });

    it("Should call $router push", async () => {
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });
    it("Should call and change active section", async () => {
      expect(AppSections.changeActiveSection).toHaveBeenCalledWith(
        AppSections.sectionTitles.ProvisionWorkflow
      );
    });
  });
});
