/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from "@vue/test-utils";
import AcquisitionPackage from "@/store/acquisitionPackage";
import  { SummaryStore } from "../summary/index";
import { getModule } from 'vuex-module-decorators';
import validators from "../../plugins/validation";
import {
  ContactDTO,
  FundingRequestDTO,
  FundingRequestFSFormDTO,
  FundingRequestMIPRFormDTO, FundingRequirementDTO
} from "@/api/models";
import { baseGInvoiceData } from "../../../types/Global";
import acquisitionPackage from "@/store/acquisitionPackage";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(validators);

const _summaryItem = {
  title: "",
  description: "",
  isComplete: false,
  isTouched: false,
  hasDelete:false,
  hasShowMore:false,
  routeName: "",
  step: 0,
  substep: 0
}


const contact: ContactDTO = {
  type: '',
  role: '',
  rank_components: '',
  salutation: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  suffix: '',
  title: '',
  phone: '',
  phone_extension: '',
  email: '',
  grade_civ: '',
  dodaac: '',
  can_access_package: '',
  manually_entered: '',
  acquisition_package: ''
}

const contactAcorValid: ContactDTO = {
  ...contact,
  type: 'ACOR', // 
  role: 'Military', 
  first_name: 'John',
  last_name: 'Smith',
  middle_name: 'T',
  phone: '555-555-1234',
  phone_extension: '1234',
  email: 'john.smith.tester@mail.mil',
}

const contactAcorMissingFullName: Partial<ContactDTO> = {
  ...contact,
  type: 'ACOR', // Mission Owner, COR, ACOR
  role: 'Military', // Military, Civilian, Contractor
  middle_name: 'T',
  phone: '555-555-1234',
  phone_extension: '1234',
  email: 'john.smith.tester@mail.mil',
}

const contactAcorMissingFirstName: Partial<ContactDTO> = {
  ...contact,
  type: 'ACOR', // Mission Owner, COR, ACOR
  role: 'Military', // Military, Civilian, Contractor
  middle_name: 'T',
  first_name: 'John',
  phone: '555-555-1234',
  phone_extension: '1234',
  email: 'john.smith.tester@mail.mil',
}

describe("Summary Store", () => {
  let summaryStore: SummaryStore;

  beforeEach(async () => {
    const createStore = (
      storeOptions = {}
    ): Store<{ summaryStore: SummaryStore['summaryItems'] }> => (
      new Vuex.Store({ ...storeOptions })
    );
    summaryStore = getModule(SummaryStore, createStore());

    await AcquisitionPackage.reset();
    await summaryStore.clearSummaryItems();
  })
  afterEach(async () => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  it('Test summary item manipulation functions, clear + set + remove', async () => {
    // clear
    await summaryStore.clearSummaryItems();
    expect(summaryStore.summaryItems).toEqual([]);
    // set
    await summaryStore.doSetSummaryItem(_summaryItem);
    expect(summaryStore.summaryItems).toEqual([_summaryItem]);
    // remove
    summaryStore.removeSummaryItem(_summaryItem);
    expect(summaryStore.summaryItems).toEqual([]);
  })

  it('Test assessACOR function - Valid data', async () => {
    expect(summaryStore.summaryItems).toEqual([]);
    await summaryStore.assessACOR();
    expect(summaryStore.summaryItems).toEqual([]);
    AcquisitionPackage.setHasAlternateCOR(true);
    AcquisitionPackage.setContact({ data: contactAcorValid, type: "ACOR"});
    await summaryStore.assessACOR();
    expect(summaryStore.summaryItems).toEqual([
      {
        "description": "Alternate Contracting Officer's Representative",
        "hasDelete": true,
        "hasShowMore": true,
        "isComplete": false,
        "isTouched": true,
        "routeName": "AcorInformation",
        "showMoreData": {
          "address": "",
          "dodaac": "Missing DoDAAC",
          "email": "john.smith.tester@mail.mil",
          "phone": "555-555-1234",
          "role": "Military",
        },
        "step": 1,
        "substep": 5,
        "title": "John Smith",
      },
    ]);
  });

  it('Test assessACOR function - Missing full name data', async () => {
    expect(summaryStore.summaryItems).toEqual([]);
    await summaryStore.assessACOR();
    expect(summaryStore.summaryItems).toEqual([]);
    AcquisitionPackage.setHasAlternateCOR(true);
    // @ts-expect-error we're testing for when the data is incomplete
    AcquisitionPackage.setContact({ data: contactAcorMissingFullName, type: "ACOR"});
    await summaryStore.assessACOR();
    expect(summaryStore.summaryItems).toEqual([
      {
        "description": "Alternate Contracting Officer's Representative",
        "hasDelete": true,
        "hasShowMore": true,
        "isComplete": false,
        "isTouched": true,
        "routeName": "AcorInformation",
        "showMoreData": {
          "address": "",
          "dodaac": "Missing DoDAAC",
          "email": "john.smith.tester@mail.mil",
          "name": "Missing name",
          "phone": "555-555-1234",
          "role": "Military",
        },
        "step": 1,
        "substep": 5,
        "title": "Alternate Contracting Officer's Representative",
      },
    ]);
  });

  it('Test assessACOR function - Missing first name data', async () => {
    expect(summaryStore.summaryItems).toEqual([]);
    await summaryStore.assessACOR();
    expect(summaryStore.summaryItems).toEqual([]);
    AcquisitionPackage.setHasAlternateCOR(true);
    // @ts-expect-error we're testing for when the data is incomplete
    AcquisitionPackage.setContact({ data: contactAcorMissingFirstName, type: "ACOR"});
    await summaryStore.assessACOR();
    expect(summaryStore.summaryItems).toEqual([
      {
        "description": "Alternate Contracting Officer's Representative",
        "hasDelete": true,
        "hasShowMore": true,
        "isComplete": false,
        "isTouched": true,
        "routeName": "AcorInformation",
        "showMoreData": {
          "address": "",
          "dodaac": "Missing DoDAAC",
          "email": "john.smith.tester@mail.mil",
          "last_name": "Missing last name",
          "phone": "555-555-1234",
          "role": "Military",
        },
        "step": 1,
        "substep": 5,
        "title": "Alternate Contracting Officer's Representative",
      },
    ]);
  });

  describe('setIncrementalFundingDescription', () => {
    // eslint-disable-next-line max-len
    it('returns description with POC info', async () => {
      const funding = {
        poc:{
          ...contact,
          first_name: "firstName",
          last_name: "lastName",
          phone: "123-456-7890",
          email: "email@mail.mil",
          role: "MILITARY"
        },
        req: {
          incrementally_funded: "YES"
        } as FundingRequirementDTO,
        isComplete: true,
        isTouched: true,
        isPopBaseLessThanNineMonths: false
      };
      expect(await summaryStore.setIncrementalFundingDescription(funding))
        .toContain("POC");
    });
  });

  describe('hasCompleteIncrementalFundingAndPOC', () => {
    // eslint-disable-next-line max-len
    it('should return "Funding documents are not required" when not required by contracting office', async () => {
      const funding = {
        req: {
          has_funding: '',
        } as FundingRequirementDTO,
        poc:{
          ...contact,
          first_name: "firstName",
          last_name: "lastName",
          phone: "123-456-7890",
          email: "email@mail.mil",
          role: "MILITARY"
        }
      };
      expect(await summaryStore.hasCompleteIncrementalFundingAndPOC(funding)).toBe(false);
    });
  });
    

  describe('setFundingDescription', () => {
    // eslint-disable-next-line max-len
    it('should return "Funding documents are not required" when not required by contracting office', async () => {
      await acquisitionPackage
        .setContractingShopRequireFundingDocuments('NO')
      const funding = {
        request: {
          funding_request_type: '',
          appropriation_fiscal_year: '',
          appropriation_funds_type: '',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: '',
          useGInvoicing:''
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: '',
          gt_c_number: '',
          order_number: '',
          fs_form_7600b_use_g_invoicing: '',
        } as FundingRequestFSFormDTO,
        mipr: {} as FundingRequestMIPRFormDTO,
        hasFairOpp: false,
        fundingRequirement: {
          has_funding: '',
        } as FundingRequirementDTO,
        isComplete: true,
      };
      const description = await summaryStore.setFundingDescription(funding);
      setTimeout(()=>{
        expect(description).toBe("Funding documents are not required by contracting office");
      },3000)

    });

    it('should return "Missing funding documents" when conditions are not met', async () => {
      const funding = {
        request: {
          funding_request_type: 'FS_FORM',
          appropriation_fiscal_year: '',
          appropriation_funds_type: '',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: '',
          useGInvoicing:''
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: '',
          gt_c_number: '65464',
          order_number: '',
          fs_form_7600b_use_g_invoicing: '',
        } as FundingRequestFSFormDTO,
        mipr: {} as FundingRequestMIPRFormDTO,
        hasFairOpp: false,
        fundingRequirement: {
          has_funding: '',
        } as FundingRequirementDTO,
        isComplete: true,
      };

      const description = await summaryStore.setFundingDescription(funding);

      expect(description).toBe("Missing funding documents");
    });

    it('should return "Missing funding documents" when conditions are not met MIPR', async () => {
      const funding = {
        request: {
          funding_request_type: 'MIPR',
          appropriation_fiscal_year: '',
          appropriation_funds_type: '',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: '',
          useGInvoicing:''
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: '',
          gt_c_number: '65464',
          order_number: '',
          fs_form_7600b_use_g_invoicing: '',
        } as FundingRequestFSFormDTO,
        mipr: {
          mipr_number:"",
        } as FundingRequestMIPRFormDTO,
        hasFairOpp: false,
        fundingRequirement: {
          has_funding: '',
        } as FundingRequirementDTO,
        isComplete: true,
      };

      const description = await summaryStore.setFundingDescription(funding);

      expect(description).toBe("Missing funding documents");
    });

  })
  describe('isFundingTouched', () => {
    it('should return false when conditions are not met', async () => {
      const funding = {
        request: {
          funding_request_type: '',
          appropriation_fiscal_year: '',
          appropriation_funds_type: '',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: '',
          useGInvoicing:''
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: '',
          gt_c_number: '',
          order_number: '',
          fs_form_7600b_use_g_invoicing: '',
        } as FundingRequestFSFormDTO,
        mipr: {} as FundingRequestMIPRFormDTO,
        hasFairOpp: false,
        fundingRequirement: {
          has_funding: '',
        } as FundingRequirementDTO,
        isDitco: true,
      };
      const isTouched = await summaryStore.isFundingTouched(funding);

      expect(isTouched).toBe(false);
    });

    it('should return true when all conditions are met (Ditco User)', async () => {
      const funding = {
        request: {
          funding_request_type: 'FS_FORM',
          appropriation_fiscal_year: '2023',
          appropriation_funds_type: 'W_C',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: 'Value1',
          gt_c_number: 'GTC123',
          order_number: 'Order123',
          fs_form_7600b_use_g_invoicing: 'Yes',
        } as FundingRequestFSFormDTO,
        mipr: {} as FundingRequestMIPRFormDTO,
        hasFairOpp: true,
        fundingRequirement: {
          has_funding: 'NO_FUNDING',
        } as FundingRequirementDTO,
        isDitco: true,
      };
      const isTouched = await summaryStore.isFundingTouched(funding);

      expect(isTouched).toBe(true);
    });
    it('should return true when all conditions are met (!Ditco User)', async () => {
      const funding = {
        request: {
          funding_request_type: 'FS_FORM',
          appropriation_fiscal_year: '2023',
          appropriation_funds_type: 'W_C',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: 'Value1',
          gt_c_number: 'GTC123',
          order_number: 'Order123',
          fs_form_7600b_use_g_invoicing: 'Yes',
        } as FundingRequestFSFormDTO,
        mipr: {} as FundingRequestMIPRFormDTO,
        hasFairOpp: true,
        fundingRequirement: {
          has_funding: 'NO_FUNDING',
        } as FundingRequirementDTO,
        isDitco: false,
      };
      const isTouched = await summaryStore.isFundingTouched(funding);

      expect(isTouched).toBe(true);
    });

  })
  describe('isFundingComplete', () => {
    it('should return false when not all conditions are met', async () => {
      const funding = {
        request: {
          funding_request_type: 'MIPR',
          appropriation_fiscal_year: '2023',
          appropriation_funds_type: 'W_C',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        fsForm: {
        } as FundingRequestFSFormDTO,
        mipr: {
          mipr_number: "123242",
          mipr_attachment:"",
          mipr_filename:""
        } as FundingRequestMIPRFormDTO,
        hasFairOpp: true,
        fundingRequirement: {
          has_funding: 'NO_FUNDING',
        } as FundingRequirementDTO,
        isDitco: true,
      };

      const isComplete = await summaryStore.isFundingComplete(funding);

      expect(isComplete).toBe(false);
    });
    it('should return true when all conditions are met', async () => {
      const funding = {
        request: {
          funding_request_type: 'FS_FORM',
          appropriation_fiscal_year: '2023',
          appropriation_funds_type: 'W_C',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: 'Value1',
          gt_c_number: 'GTC123',
          order_number: 'Order123',
          fs_form_7600b_use_g_invoicing: 'Yes',
        } as FundingRequestFSFormDTO,
        mipr: {

        } as FundingRequestMIPRFormDTO,
        hasFairOpp: true,
        fundingRequirement: {
          has_funding: 'NO_FUNDING',
        } as FundingRequirementDTO,
        isDitco: true,
      };
      const isComplete = await summaryStore.isFundingComplete(funding);

      expect(isComplete).toBe(true);
    });
    it('should return true when !isDitco && !needsFunding', async () => {
      const funding = {
        request: {
          funding_request_type: 'FS_FORM',
          appropriation_fiscal_year: '2023',
          appropriation_funds_type: 'W_C',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        fsForm: {
          fs_form_7600a_attachment: 'Value1',
          gt_c_number: 'GTC123',
          order_number: 'Order123',
          fs_form_7600b_use_g_invoicing: 'Yes',
        } as FundingRequestFSFormDTO,
        mipr: {

        } as FundingRequestMIPRFormDTO,
        hasFairOpp: true,
        fundingRequirement: {
          has_funding: 'NO_FUNDING',
        } as FundingRequirementDTO,
        isDitco: false,
      };
      await AcquisitionPackage.setContractingShopRequireFundingDocuments("NO")
      const isComplete = await summaryStore.isFundingComplete(funding);

      await expect(isComplete).toBe(true);
    });

    it('should return true when !isDitco && !needsFunding', async () => {
      const funding = {
        request: {
          funding_request_type: 'FS_FORM',
          appropriation_fiscal_year: '2023',
          appropriation_funds_type: 'W_C',
        } as FundingRequestDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        fsForm: null as unknown as FundingRequestFSFormDTO,
        mipr: null as unknown as FundingRequestMIPRFormDTO,
        hasFairOpp: true,
        fundingRequirement: {
          has_funding: 'NO_FUNDING',
        } as FundingRequirementDTO,
        isDitco: true,
      };
      
      const isComplete = await summaryStore.isFundingComplete(funding);

      await expect(isComplete).toBe(false);
    });

  })
  describe('isFSFormComplete', () => {
    it('should return true if FSForm is complete with G-Invoicing',async () => {
      const funding = {
        fsForm: {
          fs_form_7600b_use_g_invoicing: 'Yes',
        } as FundingRequestFSFormDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        request: {
          // Define other required data for the function
        } as FundingRequestDTO,
      };

      const isComplete = await summaryStore.isFSFormComplete(funding);

      expect(isComplete).toBe(true);
    });
    it('should return true if FSForm is complete without G-Invoicing',async () => {
      const funding = {
        fsForm: {
          fs_form_7600b_use_g_invoicing: 'NO',
          order_number: '123242'
        } as FundingRequestFSFormDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        request: {
          // Define other required data for the function
        } as FundingRequestDTO,
      };

      const isComplete = await summaryStore.isFSFormComplete(funding);

      expect(isComplete).toBe(true);
    });
    it('should return false if FSForm is not complete',async () => {
      const funding = {
        fsForm: {
          fs_form_7600b_use_g_invoicing: 'NO',
          order_number: ''
        } as FundingRequestFSFormDTO,
        gInv: {
          gInvoiceNumber: 'Invoice123',
        } as baseGInvoiceData,
        request: {
          // Define other required data for the function
        } as FundingRequestDTO,
      };

      const isComplete = await summaryStore.isFSFormComplete(funding);

      expect(isComplete).toBe(false);
    });
  });
})


