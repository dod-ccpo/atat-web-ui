import { ClassificationLevelDTO, SystemChoiceDTO } from "@/api/models";
import { Checkbox, SelectData } from "types/Global";
import { 
  buildClassificationCheckboxList, 
  buildClassificationLabel,
  createPeriodCheckboxItems,
  createDateStr,
} from "./index";
import _ from "lodash";
import Periods from "@/store/periods";

describe("testing src/helpers/index.ts", () => {
  test("buildClassificationCheckboxList - transform ClassificationLevelDTO to a Checkbox[]",
    async()=>{
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
      const arr:Checkbox[] = await buildClassificationCheckboxList(
        classlevelDTOResults, "radio", false, false
      )
      expect(arr).toEqual( [
        {
          id: 'IL4radio',
          value: 'class1',
          label: 'Unclassified / Impact Level 4 (IL4)',
          description: ''
        },
        {
          id: 'IL6radio',
          value: 'class3',
          label: 'Secret / Impact Level 6 (IL6)',
          description: ''
        }
      ]);
    })

  test("buildClassificationLabel - transform ClassificationLevelDTO to a Checkbox[]",
    async()=>{
      const classLevel = 
        {
          "sys_id": "1",
          "sys_mod_count": "0",
          "impact_level": "IL6",
          "classification": "S",
        };
      
      const classLabel:string = await buildClassificationLabel(
        classLevel, 'short'
      )
      expect(classLabel).toBe('Secret/IL6');
    })

  it("createPeriodCheckboxItems() - tests that unsorted SNOW data is successfully " +
    "transformed to expected sorted datasource array for period checkbox items", async () => {

    jest.spyOn(Periods, "loadPeriods").mockImplementation(
      () => Promise.resolve (
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
  
});
