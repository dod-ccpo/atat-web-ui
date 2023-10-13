
/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ReviewDocumentsFunding from "./ReviewDocumentsFunding.vue";
import { DefaultProps } from "vue/types/options";
import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import {
  AcquisitionPackageDTO,
  AttachmentDTO, FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO,
  FundingRequirementDTO
} from "@/api/models";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import IGCE from "@/store/IGCE";
import Attachments from "@/store/attachments";
import {createDateStr} from "@/helpers";
import {signedDocument} from "../../../../types/Global";

Vue.use(Vuetify);

describe("Testing ReviewDocumentsFunding component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const mockAcqPackage: AcquisitionPackageDTO = {
    acor: "test",
    classification_level: "test",
    contract_award: "test",
    contract_considerations: "test",
    contract_type: "test",
    cor: "test",
    current_contract_and_recurring_information: "test",
    current_environment: "test",
    customer_feedback: "test",
    docgen_job_status: "",
    docusign_envelope_id: "",
    environment_instance: "",
    fair_opportunity: "test",
    funding_plans: "",
    funding_requirement: "test",
    gfe_overview: "",
    is_travel_needed: "",
    number: "",
    organization: "test",
    owner_needs_email_package_ready_to_submit: false,
    period_of_performance: "test",
    periods: "",
    primary_contact: "test",
    project_overview: "test",
    required_services: "",
    sensitive_information: "test",
    status: ""
  };

  const mockFundingReq: FundingRequirementDTO = {
    acquisition_package: "",
    funding_plan: "",
    funding_request: "",
    funds_obligated: "",
    funds_total: "",
    has_funding: "",
    incrementally_funded: "",
    pop_end_date: "",
    pop_start_date: "",
    task_order_number: ""
  };

  const attachments = [
    { file_name: "fileName001" },
    { file_name: "fileName002" },
    { file_name: "fileName003" },
  ] as AttachmentDTO[];

  const signedDocs: signedDocument[] = [{
    itemName:"Requirements Checklist",
    requiresSignature:true,
    alertText:"Requires signature",
    show:true
  }];

  const MIPRForm: FundingRequestMIPRFormDTO = {
    mipr_number: "A12",
    mipr_filename: "Test MIPR",
    mipr_attachment: "Test"
  };

  const FSForm: FundingRequestFSFormDTO = {
    fs_form_7600a_filename: "Test 7600",
    fs_form_7600a_attachment: "123",
    fs_form_7600b_attachment: "234",
    fs_form_7600b_filename: "",
    use_g_invoicing: "",
    order_number: "",
    gt_c_number: ""
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReviewDocumentsFunding, {
      localVue,
      vuetify
    });
  });

  describe("INITIALIZATION", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("GETTERS", () => {
    it("fairOpportunity() getter", () => {
      expect(wrapper.vm.fairOpportunity).toBe("");
      AcquisitionPackage.setFairOpportunity({ exception_to_fair_opportunity: "test" });
      expect(wrapper.vm.fairOpportunity).toBe("test");
    });

    it("incrementallyFunded() getter", () => {
      expect(wrapper.vm.incrementallyFunded).toBe("");
      FinancialDetails.setFundingRequirement({
        ...mockFundingReq,
        incrementally_funded: "test"
      });
      expect(wrapper.vm.incrementallyFunded).toBe("test");
    });
  });

  describe("FUNCTIONS", () => {
    it("update()", async () => {
      await wrapper.vm.update();
    });

    it("createAttachmentObject()", () => {
      const attachment = { file_name: "test_file" };
      const step = "step_value";
      const expectedResult = {
        itemName: attachment.file_name,
        requiresSignature: false,
        show: true,
        description: `Uploaded in step ${step}`
      };

      wrapper.vm.createAttachmentObject(attachment, step);

      expect(wrapper.vm.packageCheckList).toContainEqual(expectedResult);
    });

    it('loadOnEnter()', async () => {
      AcquisitionPackage.getSignedDocumentsList = jest.fn().mockResolvedValue(signedDocs);
      AcquisitionPackage.setDownloadPackageLink = jest.fn().mockReturnValue("downloadLink");
      CurrentEnvironment.getCurrentEnvironment = jest.fn();
      FinancialDetails.loadFundingRequestMIPRForm = jest.fn().mockResolvedValue(MIPRForm);
      FinancialDetails.loadFundingRequestFSForm = jest.fn().mockResolvedValue(FSForm);
      IGCE.getRequirementsCostEstimate = jest.fn();
      Attachments.getAttachmentsByTableSysIds = jest.fn().mockResolvedValue(attachments);
      Attachments.getAttachmentsBySysIds = jest.fn().mockResolvedValue(attachments);
      Attachments.getAttachmentById = jest.fn().mockResolvedValue(attachments);

      await AcquisitionPackage.setAcquisitionPackage({
        ...mockAcqPackage,
        sys_updated_on: "2023-09-22 18:59:06"
      });

      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.lastUpdatedString)
        .toBe(`Last updated ${createDateStr("2023-09-22 18:59:06", true)}`)
    });
  });
});


