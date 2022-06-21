import { ClassificationLevelDTO, SystemChoiceDTO } from "@/api/models";
import { Checkbox, SelectData } from "types/Global";
import _ from "lodash";

export const hasChanges = <TData>(argOne: TData, argTwo: TData): boolean =>
  !_.isEqual(argOne, argTwo);

export const getIdText = (string: string): string => {
  return string.replace(/[^A-Z0-9]/ig, "");
}

export const toTitleCase = (string: string): string => {
  return _.startCase(_.toLower(string));
}

export const convertSystemChoiceToSelect = 
(data:SystemChoiceDTO[]): SelectData[] => data.map(choice=> {
  const {value} = choice;
  return {
    text: choice.label,
    value
  }
});

export const buildClassificationCheckboxList 
  = (data: ClassificationLevelDTO[], idSuffix: string): Checkbox[] => {
    const arr: Checkbox[] = [];
    idSuffix = idSuffix || "";
    data.forEach((classLevel) => {
      if (classLevel.impact_level 
        && classLevel.classification
        && classLevel.sys_id
      ) {
        const label = buildClassificationLabel(classLevel, "long");
        const classificationCheckbox: Checkbox = {
          id: classLevel.impact_level + idSuffix,
          value: classLevel.sys_id,
          label: label,
        }
        arr.push(classificationCheckbox)
      }
    });
    return arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
  };

export const buildClassificationLabel 
  = (classLevel: ClassificationLevelDTO, type: string,): string => {
    type = type || "long";
    const classificationString = classLevel.classification === "U" 
      ? "Unclassified" 
      : "Secret";
    const IL = classLevel.impact_level;
    const ILNo = IL.charAt(IL.length - 1);
    const ILString = "Impact Level " + ILNo + " (" + IL + ")";

    if (type === "long") {
      return classificationString + " / " + ILString;
    }
    return classificationString + "/" + IL;
  }

//strips whitespace, and special characters
export const sanitizeOfferingName = (offeringName: string): string => {
  return offeringName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{\\}[\]\\/]/gi, "_")
    .replace(/ /g, "_").replace(/_$/, '');
}

// formats a number to currency string with commas and 2 decimal places
export const toCurrencyString = (num: number): string => {
  if (!isNaN(num)) {
    return num.toLocaleString(
      undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );
  }
  return "";
}

// converts a formatted currency string back to a number
export const currencyStringToNumber = (str: string): number => {
  return str ? parseFloat(str.replaceAll(",","")) : 0;
}

