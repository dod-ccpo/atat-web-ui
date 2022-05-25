import { SystemChoiceDTO } from "@/api/models";
import { Checkbox, SelectData } from "types/Global";
import _ from "lodash";

export const hasChanges = <TData>(argOne: TData, argTwo: TData): boolean =>
  !_.isEqual(argOne, argTwo);

export const getIdText = (string: string): string => {
  return string.replace(/[^A-Z0-9]/ig, "");
}

export const convertSystemChoiceToSelect = 
(data:SystemChoiceDTO[]): SelectData[] => data.map(choice=> {
  const {value} = choice;
  return {
    text: choice.label,
    value
  }
});

export const buildClassificationCheckboxList = (data: string[]): Checkbox[] => {
  const arr: Checkbox[] = [];
  // data.forEach((val)=>{
  //   let classification: Checkbox = {
  //     id:'',
  //     value: '',
  //     label: '',
  //   }
  //   classification.id = val.sys_id || '';
  //   switch (val.impact_level) {
  //   case 'IL4':
  //     classification.value = val.impact_level;
  //     classification.label = 'Unclassified / Impact Level 4 (IL4)'
  //     break;
  //   case 'IL2':
  //     classification.value = val.impact_level;
  //     classification.label = 'Unclassified / Impact Level 2 (IL2)'
  //     break;
  //   case 'IL5':
  //     classification.value = val.impact_level;
  //     classification.label = 'Unclassified / Impact Level 5 (IL5)'
  //     break;
  //   case 'IL6':
  //     classification.value = val.impact_level;
  //     classification.label = 'Secret / Impact Level 6 (IL6)'
  //     break;
  //   default:
  //     return
  //   }
  //   arr.push(classification)
  // })
  return arr.sort((a, b) => (a.value > b.value) ? 1 : -1)

}

