/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper } from "@vue/test-utils";
import GeneratePackageDocumentsFunding from "./GeneratePackageDocumentsFunding.vue";
import { DefaultProps } from "vue/types/options";
import AcquisitionPackage from "@/store/acquisitionPackage";
import GeneratingDocumentsFunding from "./components/GeneratingDocumentsFunding.vue";
import ReviewDocumentsFunding from "./components/ReviewDocumentsFunding.vue";

Vue.use(Vuetify);

describe("Testing GeneratePackageDocumentsFunding component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(GeneratePackageDocumentsFunding, {
      localVue,
      vuetify,
    });
  });

  describe("INITIALIZATION", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("FUNCTIONS", () => {
    it('isDitco() - returns true if contracting_shop is "DITCO"', () => {
      expect(wrapper.vm.isDitco).toBe(false);
    });

    it('watchIsGenerating() - calls the right methods when isGenerating changes', async () => {
      const displayGeneratingDocumentsComponentMock =
        jest.spyOn(wrapper.vm, 'displayGeneratingDocumentsComponent');
      const displayReviewComponentMock = jest.spyOn(wrapper.vm, 'displayReviewComponent');

      wrapper.vm.isGenerating = true;
      await wrapper.vm.$nextTick();
      expect(displayGeneratingDocumentsComponentMock).toHaveBeenCalled();
      expect(displayReviewComponentMock).not.toHaveBeenCalled();

      jest.resetAllMocks();

      wrapper.vm.isGenerating = false;
      await wrapper.vm.$nextTick();
      expect(displayGeneratingDocumentsComponentMock).not.toHaveBeenCalled();
      expect(displayReviewComponentMock).toHaveBeenCalled();
    });

    it('toggleNavigationElements sets hidden property of elements', () => {
      document.body.innerHTML = `
        <div id="stepperNavigation"></div>
        <footer></footer>
      `;
      wrapper.vm.toggleNavigationElements(true);
      expect(document.getElementById('stepperNavigation')!.hidden).toBe(true);
      expect(document.getElementsByTagName('footer')[0].hidden).toBe(true);

      wrapper.vm.toggleNavigationElements(false);
      expect(document.getElementById('stepperNavigation')!.hidden).toBe(false);
      expect(document.getElementsByTagName('footer')[0].hidden).toBe(false);
    });

    it('displayGeneratingDocumentsComponent() - sets the correct component and state', async () => {
      const saveDocGenStatusMock = jest.spyOn(AcquisitionPackage, 'saveDocGenStatus');
      await wrapper.vm.displayGeneratingDocumentsComponent();

      expect(saveDocGenStatusMock).toHaveBeenCalledWith('IN_PROGRESS');
      expect(wrapper.vm.isErrored).toBe(false);
      expect(wrapper.vm.isGenerating).toBe(true);
      expect(wrapper.vm.packageDocComponent).toBe(GeneratingDocumentsFunding);
    });

    it('getStatus() - checks the document generation status at intervals', async () => {
      jest.useFakeTimers();
      const getDocJobStatusMock = jest.spyOn(wrapper.vm, 'getDocJobStatus');
      const setIntervalMock = jest.spyOn(window, 'setInterval');

      await wrapper.vm.getStatus();
      expect(setIntervalMock).toHaveBeenCalledTimes(1);

      jest.runOnlyPendingTimers();
      expect(getDocJobStatusMock).toHaveBeenCalled();
    });

    it('displayReviewComponent() - sets the correct component and state', () => {
      wrapper.vm.docJobStatus = "SUCCESS";
      wrapper.vm.displayReviewComponent();

      expect(wrapper.vm.isGenerating).toBe(false);
      expect(wrapper.vm.packageDocComponent).toBe(ReviewDocumentsFunding);
      expect(wrapper.vm.isErrored).toBe(false);
    });

    it('getDocJobStatus() - retrieves the document job status', async () => {
      const getDocGenStatusMock = jest.spyOn(AcquisitionPackage, 'getDocGenStatus')
        .mockImplementation(() => Promise.resolve('SUCCESS'));
      await wrapper.vm.getDocJobStatus();

      expect(getDocGenStatusMock).toHaveBeenCalled();
      expect(wrapper.vm.docJobStatus).toBe('SUCCESS');
    });

    it('determineComponent() - decides the correct component based on docJobStatus', async () => {
      wrapper.vm.getDocJobStatus = jest.fn();
      wrapper.vm.displayGeneratingDocumentsComponent = jest.fn();
      wrapper.vm.displayReviewComponent = jest.fn();
      wrapper.vm.docJobStatus = "NOT_STARTED";

      await wrapper.vm.determineComponent();
      expect(wrapper.vm.getDocJobStatus).toHaveBeenCalled();
      expect(wrapper.vm.displayGeneratingDocumentsComponent).toHaveBeenCalled();
      expect(wrapper.vm.displayReviewComponent).not.toHaveBeenCalled();
      jest.resetAllMocks();

      wrapper.vm.docJobStatus = "SUCCESS";
      await wrapper.vm.determineComponent();
      expect(wrapper.vm.getDocJobStatus).toHaveBeenCalled();
      expect(wrapper.vm.displayGeneratingDocumentsComponent).not.toHaveBeenCalled();
      expect(wrapper.vm.displayReviewComponent).toHaveBeenCalled();
    });

    it('saveOnLeave() - sets isGenerating to false and validates', async () => {
      const setValidateNowMock = jest.spyOn(AcquisitionPackage, 'setValidateNow');
      const result = await wrapper.vm.saveOnLeave();

      expect(wrapper.vm.isGenerating).toBe(false);
      expect(setValidateNowMock).toHaveBeenCalledWith(true);
      expect(result).toBe(true);
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllTimers();
    });
  });
});