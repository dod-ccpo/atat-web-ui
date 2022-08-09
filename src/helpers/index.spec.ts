import { ClassificationLevelDTO, SystemChoiceDTO } from "@/api/models";
import { Checkbox, SelectData } from "types/Global";
import { buildClassificationCheckboxList, buildClassificationLabel } from "./index";
import _ from "lodash";

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
});