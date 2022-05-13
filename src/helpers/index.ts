import { SystemChoiceDTO } from "@/api/models";
import { SelectData } from "types/Global";

export const hasChanges = <TData>(argOne: TData, argTwo: TData): boolean =>
  JSON.stringify(argOne) !== JSON.stringify(argTwo);

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
}) 