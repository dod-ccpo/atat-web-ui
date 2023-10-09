/* eslint-disable camelcase */

import Vuex, { Store } from 'vuex';
import { createLocalVue } from "@vue/test-utils";
import AcquisitionPackage from "@/store/acquisitionPackage";
import  { SummaryStore } from "../summary/index";
import { getModule } from 'vuex-module-decorators';
import validators from "../../plugins/validation";
import { ContactDTO } from "@/api/models";

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

const contactAcorValid: ContactDTO = {
  type: 'ACOR', // Mission Owner, COR, ACOR
  role: 'Military', // Military, Civilian, Contractor
  rank_components: '',
  salutation: '',
  first_name: 'John',
  last_name: 'Smith',
  middle_name: 'T',
  suffix: '',
  title: '',
  phone: '555-555-1234',
  phone_extension: '1234',
  email: 'john.smith.tester@mail.mil',
  grade_civ: '',
  dodaac: '',
  can_access_package: '',
  manually_entered: '',
  acquisition_package: '',
}

const contactAcorMissingFullName: Partial<ContactDTO> = {
  type: 'ACOR', // Mission Owner, COR, ACOR
  role: 'Military', // Military, Civilian, Contractor
  rank_components: '',
  salutation: '',
  middle_name: 'T',
  suffix: '',
  title: '',
  phone: '555-555-1234',
  phone_extension: '1234',
  email: 'john.smith.tester@mail.mil',
  grade_civ: '',
  dodaac: '',
  can_access_package: '',
  manually_entered: '',
  acquisition_package: '',
}

const contactAcorMissingFirstName: Partial<ContactDTO> = {
  type: 'ACOR', // Mission Owner, COR, ACOR
  role: 'Military', // Military, Civilian, Contractor
  rank_components: '',
  salutation: '',
  middle_name: 'T',
  suffix: '',
  title: '',
  first_name: 'John',
  phone: '555-555-1234',
  phone_extension: '1234',
  email: 'john.smith.tester@mail.mil',
  grade_civ: '',
  dodaac: '',
  can_access_package: '',
  manually_entered: '',
  acquisition_package: '',
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

    AcquisitionPackage.reset();
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
})


