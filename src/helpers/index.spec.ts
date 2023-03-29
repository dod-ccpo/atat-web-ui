/* eslint-disable camelcase */
import { ClassificationLevelDTO, SystemChoiceDTO, AgencyDTO } from "@/api/models";
import { Checkbox } from "types/Global";
import {
  buildClassificationCheckboxList,
  buildClassificationDescription,
  buildClassificationLabel,
  createPeriodCheckboxItems,
  createDateStr,
  differenceInDaysOrMonths,
  getCurrencyString,
  roundDecimal,
  toCurrencyString,
  toTitleCase,
} from "./index";
import _ from "lodash";
import Periods from "@/store/periods";
import { convertAgencyRecordToSelect, convertSystemChoiceToSelect} from "@/helpers"
import { add, formatISO } from "date-fns";

describe("testing src/helpers/index.ts", () => {
  const classlevelDTOResults = [
    {
      "sys_id": "class1",
      "sys_mod_count": "0",
      "impact_level": "IL4",
      "classification": "U",
    },
    {
      "sys_id": "class2",
      "sys_mod_count": "0",
      "impact_level": "",
      "classification": "TS",
    },
    {
      "sys_id": "class3",
      "sys_mod_count": "0",
      "impact_level": "IL6",
      "classification": "S",
    },
  ]
  // it("buildClassificationCheckboxList() - transform (No Description) ClassificationLevelDTO "
  // + "to a Checkbox[]",
  // async () => {
  //   const props = { idSuffix: "radio", descriptionNeeded: false, includeTS: false}
  //   const arr = buildClassificationCheckboxList(
  //     classlevelDTOResults, props.idSuffix, props.descriptionNeeded, props.includeTS
  //   )
  //   expect(arr).toEqual([
  //     {
  //       id: 'IL4radio',
  //       value: 'class1',
  //       label: 'Unclassified / Impact Level 4 (IL4)',
  //       description: ''
  //     },
  //     {
  //       id: 'IL6radio',
  //       value: 'class3',
  //       label: 'Secret / Impact Level 6 (IL6)',
  //       description: ''
  //     }
  //   ]);
  // })
  // it("buildClassificationCheckboxList() - transform ClassificationLevelDTO to a Checkbox[]",
  //   async () => {
  //     const props = { idSuffix: "radio", descriptionNeeded: true, includeTS: false}
  //     const arr: Checkbox[] = await buildClassificationCheckboxList(
  //       classlevelDTOResults, props.idSuffix, props.descriptionNeeded, props.includeTS
  //     )
  //     expect(arr).toEqual([
  //       {
  //         id: 'IL4radio',
  //         value: 'class1',
  //         label: 'Unclassified / Impact Level 4 (IL4)',
  //         description: buildClassificationDescription(classlevelDTOResults[0])
  //       },
  //       {
  //         id: 'IL6radio',
  //         value: 'class3',
  //         label: 'Secret / Impact Level 6 (IL6)',
  //         description: buildClassificationDescription(classlevelDTOResults[2])
  //       }
  //     ]);
  //   })
  it.each([
    { 
      classLevel:  { classification: "", impact_level: "IL2" }, 
      description: "Accommodates DoD information approved for public "
       + "release (Low Confidentiality and Moderate Integrity)"
    },
    {
      classLevel:  { classification: "", impact_level: "IL4" },
      description: "Accommodates DoD Controlled Unclassified Information (CUI)"
    },
    {
      classLevel:   { classification: "", impact_level: "IL5" },
      description: "Accommodates DoD CUI and National Security Systems"
    },
    {
      classLevel:  { classification: "", impact_level: "IL6" },
      description: ""
    },
    {
      classLevel: "",
      description: ""
    },
  ])("buildClassificationDescription() - return description based on impact level", 
    async (input) => {
      expect(buildClassificationDescription(input.classLevel as ClassificationLevelDTO))
        .toBe(input.description)
    })
  it("toTitleCase() - returns capitalized first letter in word", async () => {
    const title = "testing title"
    const convertedTitle = toTitleCase(title)
    expect(convertedTitle).toEqual("Testing Title")
  })
  it("convertAgencyRecordToSelect() - transform Agency records to Select input", async () => {
    const agencyRecords: AgencyDTO[] = [
      {
        label: "Test Agency (TA)",
        title: "TEST AGENCY",
        sys_id: "123asd5763",
        acronym: "TA",
        // eslint-disable-next-line camelcase
        css_id: 999999999
      }
    ]
    const agencySelectList = convertAgencyRecordToSelect(agencyRecords)
    expect(agencySelectList).toEqual([
      { text: agencyRecords[0].label, value: agencyRecords[0].sys_id}
    ])
  })
  it("convertSystemChoiceToSelect() - transform choice records to Select input", async () => {
    const choiceRecords: SystemChoiceDTO[] = [
      {
        name: "Test Choice (TC)",
        label: "TEST CHOICE",
        value: "TC",
        sequence: 1, 
      }
    ]
    const choiceSelectList = convertSystemChoiceToSelect(choiceRecords)
    expect(choiceSelectList).toEqual([
      { text: choiceRecords[0].label, value: choiceRecords[0].value}
    ])
  })

  it("buildClassificationLabel - transform Secret ClassificationLevelDTO to a Checkbox[]",
    async () => {
      const classLevel = {
        "sys_id": "1",
        "sys_mod_count": "0",
        "impact_level": "IL6",
        "classification": "S",
      }
      const labelName =`Secret/${classLevel.impact_level}`
      const classLabel = await buildClassificationLabel(classLevel, "short")
      expect(classLabel).toBe(labelName);
    }
  )
  it("buildClassificationLabel - transform Top Secret ClassificationLevelDTO to a Checkbox[]",
    async () => {
      const classLevel = {
        "sys_id": "2",
        "sys_mod_count": "0",
        "impact_level": "IL6",
        "classification": "TS",
      }
      const classLabel = await buildClassificationLabel(classLevel, "short")
      expect(classLabel).toBe("Top Secret");
    }
  )

  it("createPeriodCheckboxItems() - tests that unsorted SNOW data is successfully " +
    "transformed to expected sorted datasource array for period checkbox items", async () => {

    jest.spyOn(Periods, "loadPeriods").mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "OPTION",
            "option_order": "2",
            "sys_id": "period_02"
          },
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1",
            "sys_id": "period_01"
          },
        ]
      ));
    const periodCheckboxes: Checkbox[] = await createPeriodCheckboxItems();
    console.log("periodCheckboxes", periodCheckboxes);
    expect(periodCheckboxes).toEqual([
      {
        "id": "BASE",
        "label": "Base period",
        "value": "period_01"
      },
      {
        "id": "OPTION1",
        "label": "Option period 1",
        "value": "period_02"
      }
    ])
  }); 
  
  it("Test createDateStr", async () => {
    const value = await createDateStr('2022-12-31', true);
    expect(value).toBe("Dec. 31, 2022");
  })
  
  // TODO add logic for different length months 30/31/28/29 - or change test
  // it("differenceInDaysOrMonths() - creates string of days or months remaining", async () => {
  //   let endDate = formatISO(add(new Date().setHours(0,0,0,0), {months: 1}));
  //   console.log(endDate);
  //   let dateInfo = differenceInDaysOrMonths("2022-01-01", endDate);
  //   expect(dateInfo.expiration).toBe("30 days to expiration");

  //   endDate = formatISO(add(new Date().setHours(0,0,0,0), {months: 4, days: 15}));
  //   dateInfo = differenceInDaysOrMonths("2022-01-01", endDate);
  //   expect(dateInfo.expiration).toBe("4 months to expiration");

  //   endDate = formatISO(add(new Date().setHours(0,0,0,0), {days: 1, hours: 12}));
  //   dateInfo = differenceInDaysOrMonths("2022-01-01", endDate);
  //   expect(dateInfo.expiration).toBe("1 day to expiration");
  // });    

  it.each([
    { amount: 294.399, isDecimal: true },
    { amount: 3694, isDecimal: false },
  ])("getCurrencyString() - convert number into currency string", async (input) => {
    const currencyString = `$${toCurrencyString(input.amount, input.isDecimal)}`
    expect(getCurrencyString(input.amount, input.isDecimal)).toEqual(currencyString)
  })

  it.each([
    { amount: 393.3439, decimalPlaces: 3 },
    { amount: 4958.3439, decimalPlaces: 2 },
  ])("roundDecimal() - return rounded float number", async (input) => {
    const roundedNumber = parseFloat(input.amount.toFixed(input.decimalPlaces))
    expect(roundDecimal(input.amount, input.decimalPlaces)).toBe(roundedNumber)
  })
});
