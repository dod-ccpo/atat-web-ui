/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, shallowMount, Wrapper} from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SupportingDocumentation from "@/steps/10-FinancialDetails/IGCE/SupportingDocumentation.vue";
import validators from "@/plugins/validation";
import Attachments from "@/store/attachments";
import {uploadingFile} from "../../../../types/Global";
import FinancialDetails from "@/store/financialDetails";
import {RequirementsCostEstimateDTO} from "@/api/models";
import {AttachmentServiceCallbacks} from "@/services/attachment";
Vue.use(Vuetify);

describe("Testing SupportingDocumentation Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let requirementsCostEstimateDTO: RequirementsCostEstimateDTO;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(SupportingDocumentation, {
      localVue,
      vuetify,
    });
    requirementsCostEstimateDTO = {
      surge_capabilities: "Test SC",
      estimatedTaskOrderValue: "",
      feePercentage: "",
      feeCharged: "",
      surge_capacity: ""
    }
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("'Test onRemoveAttachment()- should make proper call outs to handle attachment " +
    "removal request", async () => {
    jest.spyOn(Attachments, "removeAttachment").mockReturnValue(
      Promise.resolve()
    )
    jest.spyOn(wrapper.vm, "loadRequirementsCostEstimateData").mockReturnValue(
      Promise.resolve()
    )
    const uploadFile: uploadingFile = {
      attachmentId: "",
      isErrored: false,
      isUploaded: false,
      link: "",
      progressStatus: 0,
      recordId: "",
      file: new File([], "testFile")
    }
    wrapper.vm.onRemoveAttachment(uploadFile);
    expect(Attachments.removeAttachment).toHaveBeenCalled();
  });

  it("'Test loadRequirementsCostEstimateData()- should make proper call outs to load " +
    "requirements cost estimate data", async () => {
    jest.spyOn(FinancialDetails, "loadRequirementsCostEstimate").mockReturnValue(
      Promise.resolve(requirementsCostEstimateDTO)
    )
    wrapper.vm.loadRequirementsCostEstimateData();
    expect(FinancialDetails.loadRequirementsCostEstimate).toHaveBeenCalled();
  });

})
