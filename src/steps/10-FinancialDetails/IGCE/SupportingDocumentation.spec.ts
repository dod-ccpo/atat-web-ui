/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import SupportingDocumentation from "@/steps/10-FinancialDetails/IGCE/SupportingDocumentation.vue";
import validators from "@/plugins/validation";
import Attachments from "@/store/attachments";
import {uploadingFile} from "../../../../types/Global";
import {RequirementsCostEstimateDTO} from "@/api/models";
import IGCE from "@/store/IGCE";
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
      acquisition_package: "",
      has_DOW_and_PoP: "",
      architectural_design_current_environment: {
        option: "",
        estimated_values: []
      },
      architectural_design_performance_requirements: {
        option: "",
        estimated_values: []
      },
      fee_specs: {
        is_charged: "",
        percentage: null
      },
      how_estimates_developed: {
        cost_estimate_description: "",
        previous_cost_estimate_comparison: {
          options: "",
          percentage: null
        },
        tools_used: "",
        other_tools_used: ""
      },
      optimize_replicate: {
        option: "",
        estimated_values: []
      },
      surge_requirements: {
        capabilities: "",
        capacity: null
      },
      training: [],
      travel: {
        option: "",
        estimated_values:""
      }
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
    jest.spyOn(IGCE, "getRequirementsCostEstimate").mockReturnValue(
      Promise.resolve(requirementsCostEstimateDTO)
    )
    wrapper.vm.loadRequirementsCostEstimateData();
    expect(IGCE.getRequirementsCostEstimate()).toHaveBeenCalled();
  });

})
