import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import GTCInformation from "./GTCInformation.vue";
import { DefaultProps } from "vue/types/options";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import SlideoutPanel from "@/store/slideoutPanel";
import Attachments from "@/store/attachments";
import FinancialDetails, {
  initialFundingRequestFSForm,
} from "@/store/financialDetails";
import { AttachmentDTO, FundingRequestFSFormDTO } from "@/api/models";

Vue.use(Vuetify);

const mockAttachment: AttachmentDTO = {
  /* eslint-disable camelcase */
  size_bytes: "1",
  file_name: "test.png",
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
  gInvoiceNumber: "A1212-123-123-123123",
};

const mockLoadFundingReturn: FundingRequestFSFormDTO = {
  ...initialFundingRequestFSForm,
  /* eslint-disable camelcase */
  use_g_invoicing: "YES",
  gt_c_number: "A1212-123-123-123123",
  /* eslint-enable */
};

const mockFile = {
  attachmentId: "",
  created: 0,
  file: new File([], "test.png"),
  fileName: "test.png",
  isErrored: false,
  isUploaded: true,
  link: "6",
  progressStatus: 100,
  recordId: "11",
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
    describe("ditcoOrContractingOffice()", () => {
      it("=> 'DITCO'", async () => {
        await AcquisitionPackage.setContractingShop("DITCO");
        expect(wrapper.vm.ditcoOrContractingOffice).toBe("DITCO");
      });

      it("=> 'your Contracting Office'", async () => {
        await AcquisitionPackage.setContractingShop("anything else");
        expect(wrapper.vm.ditcoOrContractingOffice).toBe(
          "your Contracting Office"
        );
      });
    });

    describe("currentData()", () => {
      it("=> { useGInvoicing: '', gInvoiceNumber: '' }", async () => {
        expect(wrapper.vm.currentData).toEqual({
          useGInvoicing: "",
          gInvoiceNumber: "",
        });
      });

      it("=> { useGInvoicing: 'YES', gInvoiceNumber: 'A1212-123-123-123123' }", async () => {
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
      it("=> no invalid files when useGInvoicing === 'YES'", () => {
        wrapper.vm.useGInvoicing = 'YES';
        wrapper.vm.invalidFiles = [];
        expect(JSON.stringify(wrapper.vm.getRulesArray())).toEqual("[]");
      });

      it("=> no invalid files when useGInvoicing === 'NO'", () => {
        wrapper.vm.useGInvoicing = 'NO';
        wrapper.vm.invalidFiles = [];
        expect(JSON.stringify(wrapper.vm.getRulesArray())).toEqual(
          JSON.stringify([
            () => {
              wrapper.vm.$validators.required(wrapper.vm.requiredMessage);
            },
          ])
        );
      });

      it("=> invalid file when useGInvoicing === 'YES'", () => {
        wrapper.vm.useGInvoicing = 'YES';
        wrapper.vm.invalidFiles = [new File([], "filename.png")];
        expect(JSON.stringify(wrapper.vm.getRulesArray())).toEqual("[]");
      });

      it("=> invalid file when useGInvoicing === 'NO'", () => {
        wrapper.vm.useGInvoicing = 'NO';
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
      it("=> undefined (rejected)", async () => {
        jest
          .spyOn(wrapper.vm, "loadFundingRequestData")
          .mockImplementation(() => {
            throw Error;
          });
        try {
          wrapper.vm.onRemoveAttachment(mockFile);
        } catch {
          expect(await wrapper.vm.onRemoveAttachment(mockFile)).toThrow();
        }
        jest.spyOn(wrapper.vm, "loadFundingRequestData").mockRestore();
      });
    });

    describe("onRemoveAttachment(file)", () => {
      it("=> undefined (not rejected)", async () => {
        jest
          .spyOn(wrapper.vm, "loadFundingRequestData")
          .mockImplementation(() => {
            return Promise.resolve();
          });
        jest.spyOn(Attachments, "removeAttachment").mockImplementation(() => {
          return Promise.resolve();
        });
        expect(await wrapper.vm.onRemoveAttachment(mockFile)).toBe(undefined);
        jest.spyOn(wrapper.vm, "loadFundingRequestData").mockRestore();
        jest.spyOn(Attachments, "removeAttachment").mockRestore();
      });
      it("=> undefined (rejected)", async () => {
        jest.spyOn(Attachments, "removeAttachment").mockImplementation(() => {
          throw Error;
        });
        try {
          wrapper.vm.onRemoveAttachment(mockFile);
        } catch {
          jest.spyOn(console, "error").mockImplementation(() => undefined);
          expect(console.error).toHaveBeenCalled();
          expect(await wrapper.vm.onRemoveAttachment(mockFile)).toThrow();
        }
        jest.spyOn(wrapper.vm, "loadFundingRequestData").mockRestore();
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
      // eslint-disable-next-line max-len
      it("=> undefined (not rejected) and .currentData to be set w/ this.loaded?.gt_c_number being undefined", async () => {
        wrapper.vm.loaded["gt_c_number"] = undefined;
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        const result = await wrapper.vm.loadFundingRequestData();
        expect(result).toBe(undefined);
        expect(wrapper.vm.currentData).toEqual({
          ...mockCurrentData,
          gInvoiceNumber: "",
        });
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          3
        );
        wrapper.vm.loaded["gt_c_number"] = mockCurrentData.gInvoiceNumber;
      });
      // eslint-disable-next-line max-len
      it("=> undefined (not rejected) and .currentData to be set w/ this.loaded?.fs_form_7600a_use_g_invoicing being YES", async () => {
        wrapper.vm.loaded["fs_form_7600a_use_g_invoicing"] = "YES";
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        const result = await wrapper.vm.loadFundingRequestData();
        expect(result).toBe(undefined);
        expect(wrapper.vm.currentData).toEqual(mockCurrentData);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          4
        );
      });
      // eslint-disable-next-line max-len
      it("=> undefined (not rejected) and .currentData to be set w/ this.loaded?.fs_form_7600a_attachment being 123", async () => {
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue({
            /* eslint-disable camelcase */
            ...mockLoadFundingReturn,
            fs_form_7600a_attachment: "123",
            use_g_invoicing: undefined,
            fs_form_7600a_use_g_invoicing: undefined,
            /* eslint-enable */
          });
        const result = await wrapper.vm.loadFundingRequestData();
        expect(result).toBe(undefined);
        expect(wrapper.vm.currentData).toEqual({
          ...mockCurrentData,
          useGInvoicing: "NO",
        });
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          5
        );
        wrapper.vm.loaded["fs_form_7600a_attachment"] = undefined;
        wrapper.vm.loaded["use_g_invoicing"] = "YES";
      });
      // eslint-disable-next-line max-len
      it("=> undefined (not rejected) and .currentData to be set w/ everything in this.loaded being undefined", async () => {
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue({
            /* eslint-disable camelcase */
            ...mockLoadFundingReturn,
            use_g_invoicing: undefined,
            fs_form_7600a_use_g_invoicing: undefined,
            /* eslint-enable */
          });
        const result = await wrapper.vm.loadFundingRequestData();
        expect(result).toBe(undefined);
        expect(wrapper.vm.currentData).toEqual(mockCurrentData);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          6
        );
        wrapper.vm.loaded["fs_form_7600a_attachment"] = undefined;
        wrapper.vm.loaded["use_g_invoicing"] = "YES";
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
        expect(wrapper.vm.uploadedFiles).toEqual([mockFile]);
      });

      // eslint-disable-next-line max-len
      it("=> undefined (not rejected) and .uploadedFiles to be set with a file loaded, and file download link being undefined", async () => {
        wrapper.vm.loaded["fs_form_7600a_attachment"] = "123";
        jest.spyOn(Attachments, "getAttachmentsBySysIds").mockResolvedValue([
          {
            ...mockAttachment,
            // eslint-disable-next-line camelcase
            download_link: undefined,
          },
        ]);
        expect(await wrapper.vm.loadAttachments()).toEqual(undefined);
        expect(wrapper.vm.uploadedFiles).toEqual([
          {
            ...mockFile,
            link: "",
          },
        ]);
        wrapper.vm.loaded["fs_form_7600a_attachment"] = undefined;
      });
    });

    describe("loadOnEnter()", () => {
      it("=> undefined (not rejected)", async () => {
        expect(await wrapper.vm.loadOnEnter()).toBe(undefined);

        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          7
        );
      });
    });

    
    describe("onGInvoiceSearchComplete()", () => {
      it("false to true", async () => {
        wrapper.vm.gInvoiceSearchValid = false;
        wrapper.vm.onGInvoiceSearchComplete(true);
        expect(wrapper.vm.gInvoiceSearchValid).toBe(true);
      })

      it("true to false", async () => {
        wrapper.vm.gInvoiceSearchValid = true;
        wrapper.vm.onGInvoiceSearchComplete(false);
        expect(wrapper.vm.gInvoiceSearchValid).toBe(false);
      })
    })

    describe("saveOnLeave()", () => {
      it("=> false (gInvoicing is invalid)", async () => {
        wrapper.vm.gInvoiceSearchValid = false;
        wrapper.vm.loaded["fs_form_7600a_use_g_invoicing"] = "YES";
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = {
          useGInvoicing: "",
          gInvoiceNumber: "",
        };
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        jest
          .spyOn(FinancialDetails, "saveFundingRequestFormAndGInvoicing")
          .mockImplementation(() => Promise.resolve(mockLoadFundingReturn));
        expect(await wrapper.vm.saveOnLeave()).toBe(false);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          7
        );
      });

      it("=> true (not rejected and hasChanged)", async () => {
        wrapper.vm.gInvoiceSearchValid = true;
        wrapper.vm.loaded["fs_form_7600a_use_g_invoicing"] = "YES";
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = {
          useGInvoicing: "",
          gInvoiceNumber: "",
        };
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        jest
          .spyOn(FinancialDetails, "saveFundingRequestFormAndGInvoicing")
          .mockImplementation(() => Promise.resolve(mockLoadFundingReturn));
        expect(await wrapper.vm.saveOnLeave()).toBe(true);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          8
        );
        expect(
          FinancialDetails.saveFundingRequestFormAndGInvoicing
        ).toHaveBeenCalledTimes(1);
      });

      it("=> true (not rejected and not hasChanged)", async () => {
        wrapper.vm.gInvoiceSearchValid = true;
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = mockCurrentData;
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(mockLoadFundingReturn);
        jest
          .spyOn(FinancialDetails, "saveFundingRequestFormAndGInvoicing")
          .mockImplementation(() => Promise.resolve(mockLoadFundingReturn));
        expect(await wrapper.vm.saveOnLeave()).toBe(true);
        expect(FinancialDetails.loadFundingRequestFSForm).toHaveBeenCalledTimes(
          8
        );
        expect(
          FinancialDetails.saveFundingRequestFormAndGInvoicing
        ).toHaveBeenCalledTimes(1);
      });

      it("=> (rejected and hasChanged)", async () => {
        wrapper.vm.gInvoiceSearchValid = true;
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = {
          useGInvoicing: "",
          gInvoiceNumber: "",
        };
        jest
          .spyOn(FinancialDetails, "loadFundingRequestFSForm")
          .mockResolvedValue(undefined as unknown as FundingRequestFSFormDTO);
        jest
          .spyOn(FinancialDetails, "saveFundingRequestFormAndGInvoicing")
          .mockImplementation(() => {
            throw Error;
          });

        try {
          expect(await wrapper.vm.saveOnLeave()).toBe(undefined);
          expect(
            FinancialDetails.loadFundingRequestFSForm
          ).toHaveBeenCalledTimes(9);
        } catch {
          expect(
            FinancialDetails.saveFundingRequestFormAndGInvoicing
          ).toThrow();
        }

        wrapper.vm.loaded = mockLoadFundingReturn;
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
        wrapper.vm.loaded["fs_form_7600a_use_g_invoicing"] = "YES";
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = mockCurrentData;
        expect(await wrapper.vm.hasChanged()).toBe(false);
      });

      it("=> true (fs_form_7600a_use_g_invoicing migration)", async () => {
        wrapper.vm.loaded["fs_form_7600a_use_g_invoicing"] = undefined;
        wrapper.vm.currentData = mockCurrentData;
        wrapper.vm.savedData = mockCurrentData;
        expect(await wrapper.vm.hasChanged()).toBe(true);
      });
    });

    describe("openSlideoutPanel", () => {
      it("=> undefined", async () => {
        expect(wrapper.vm.openSlideoutPanel()).toBe(undefined);
      });
      it("=> '12345'", async () => {
        expect(
          wrapper.vm.openSlideoutPanel({
            ...new Event("click"),
            currentTarget: {
              id: "12345",
            },
          })
        ).toBe(undefined);
        expect(SlideoutPanel.slideoutPanelOpenerId).toBe("12345");
      });
    });
  });
});
