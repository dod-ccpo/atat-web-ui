import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import GTCInformation from "./GTCInformation.vue";
import { DefaultProps } from "vue/types/options";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import FinancialDetails, {
  initialFundingRequestFSForm,
} from "@/store/financialDetails";
import Attachments from "@/store/attachments";
import { AttachmentDTO, FundingRequestFSFormDTO } from "@/api/models";

Vue.use(Vuetify);

const mockAttachment: AttachmentDTO = {
  /* eslint-disable camelcase */
  size_bytes: "1",
  file_name: "filename.png",
  average_image_color: "2",
  image_width: "3",
  table_name: "4",
  image_height: "5",
  download_link: "6",
  content_type: "7",
  size_compressed: "8",
  compressed: "9",
  state: "10",
  table_sys_id: "11",
  chunk_size_bytes: "12",
  hash: "13",
  /* eslint-enable */
};

const mockCurrentData = {
  useGInvoicing: "YES",
  gInvoiceNumber: "O1212-123-123-123123",
};

const mockLoadFundingReturn: FundingRequestFSFormDTO = {
  ...initialFundingRequestFSForm,
  /* eslint-disable camelcase */
  use_g_invoicing: "YES",
  gt_c_number: "O1212-123-123-123123",
  /* eslint-enable */
};

describe("Testing GTC Information component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);

  const vuetify: Vuetify = new Vuetify();
  const wrapper: Wrapper<DefaultProps & Vue, Element> = mount(GTCInformation, {
    localVue,
    vuetify,
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Testing GETTERS", () => {
    describe("currentData()", () => {
      it("=> { useGInvoicing: '', orderNumber: '' }", async () => {
        expect(wrapper.vm.currentData).toEqual({
          useGInvoicing: "",
          orderNumber: "",
        });
      });

      it("=> { useGInvoicing: 'YES', orderNumber: 'O1212-123-123-123123' }", async () => {
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        await wrapper.vm.loadFundingRequestData();
        expect(wrapper.vm.currentData).toEqual(mockCurrentData);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          1
        );
      });
    });

    describe("confirmRemoveFileMessage()", () => {
      it("=> 'This file...'", async () => {
        expect(wrapper.vm.confirmRemoveFileMessage).toBe(
          // eslint-disable-next-line max-len
          "This file will be permanently removed from your acquisition package. This action cannot be undone."
        );
      });

      it("=> '\"[file name]\"...'", async () => {
        wrapper.vm.uploadedFiles = [
          {
            fileName: "filename.png",
          },
        ];
        expect(wrapper.vm.confirmRemoveFileMessage).toBe(
          // eslint-disable-next-line max-len
          '"filename.png" will be permanently removed from your acquisition package. This action cannot be undone.'
        );
      });
    });
  });

  describe("Testing FUNCTIONS", () => {
    describe("getRulesArray()", () => {
      it("=> no invalid files", () => {
        wrapper.vm.invalidFiles = [];
        expect(JSON.stringify(wrapper.vm.getRulesArray())).toEqual(
          JSON.stringify([
            () => {
              wrapper.vm.$validators.required(wrapper.vm.requiredMessage);
            },
          ])
        );
      });

      it("=> invalid file", () => {
        wrapper.vm.invalidFiles = [new File([], "filename.png")];
        expect(JSON.stringify(wrapper.vm.getRulesArray())).toEqual(
          "[null,null]"
        );
      });
    });

    describe("onRemoveAttachment(undefined)", () => {
      it("=> undefined (not rejected)", async () => {
        expect(await wrapper.vm.onRemoveAttachment()).toBe(undefined);
      });
    });

    describe("loadFundingRequestData()", () => {
      it("=> undefined (not rejected) and .currentData to be set", async () => {
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        const result = await wrapper.vm.loadFundingRequestData();
        expect(result).toBe(undefined);
        expect(wrapper.vm.currentData).toEqual(mockCurrentData);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          2
        );
      });
    });

    describe("loadAttachments()", () => {
      it("=> undefined (not rejected)", async () => {
        expect(await wrapper.vm.loadAttachments()).toEqual(undefined);
      });

      it("=> undefined (not rejected) and .uploadedFiles to be set", async () => {
        jest
          .spyOn(Attachments, "getAttachmentsBySysIds")
          .mockResolvedValue([mockAttachment]);
        expect(await wrapper.vm.loadAttachments()).toEqual(undefined);
        expect(wrapper.vm.uploadedFiles).toEqual([
          {
            attachmentId: "",
            created: 0,
            file: new File([], ""),
            fileName: "filename.png",
            isErrored: false,
            isUploaded: true,
            link: "6",
            progressStatus: 100,
            recordId: "11",
          },
        ]);
      });
    });

    describe("loadOnEnter()", () => {
      it("=> undefined (not rejected)", async () => {
        expect(await wrapper.vm.loadOnEnter()).toBe(undefined);

        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          3
        );
      });
    });

    describe("saveOnLeave()", () => {
      it("=> true (not rejected and hasChanged)", async () => {
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = {
          useGInvoicing: "",
          gInvoiceNumber: "",
        };
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        jest
          .spyOn(FinancialDetails, "saveFundingRequestFormBAndOrderNumber")
          .mockImplementation(() => Promise.resolve(mockLoadFundingReturn));
        expect(await wrapper.vm.saveOnLeave()).toBe(true);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          4
        );
        expect(
          FinancialDetails.saveFundingRequestFormBAndOrderNumber
        ).toHaveBeenCalledTimes(1);
      });

      it("=> true (not rejected and not hasChanged)", async () => {
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = mockCurrentData;
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        jest
          .spyOn(FinancialDetails, "saveFundingRequestFormBAndOrderNumber")
          .mockImplementation(() => Promise.resolve(mockLoadFundingReturn));
        expect(await wrapper.vm.saveOnLeave()).toBe(true);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          4
        );
        expect(
          FinancialDetails.saveFundingRequestFormBAndOrderNumber
        ).toHaveBeenCalledTimes(1);
      });
    });

    describe("hasChanged()", () => {
      it("=> true", async () => {
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = {
          useGInvoicing: "",
          gInvoiceNumber: "",
        };
        expect(await wrapper.vm.hasChanged()).toBe(true);
      });

      it("=> false", async () => {
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = mockCurrentData;
        expect(await wrapper.vm.hasChanged()).toBe(false);
      });
    });
  });
});
