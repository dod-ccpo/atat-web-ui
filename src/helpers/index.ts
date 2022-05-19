import { SystemChoiceDTO } from "@/api/models";
import { SelectData } from "types/Global";
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
}) 