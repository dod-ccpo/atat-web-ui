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
    (data: SystemChoiceDTO[]): SelectData[] => data.map(choice => {
      const {value} = choice;
      return {
        text: choice.label,
        value
      }
    });

export const buildClassificationCheckboxList
    = (data: ClassificationLevelDTO[], idSuffix: string, descriptionNeeded:boolean): Checkbox[] => {
      const arr: Checkbox[] = [];
      idSuffix = idSuffix || "";
      data.forEach((classLevel) => {
        if (classLevel.classification
        && classLevel.sys_id
        ) {
          const label = buildClassificationLabel(classLevel, "long");
          const description = buildClassificationDescription(classLevel)
          const classificationCheckbox: Checkbox = {
            id: classLevel.impact_level + idSuffix || classLevel.classification,
            value: classLevel.sys_id,
            label: label,
            description: descriptionNeeded === true? description : "",
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
      if (classLevel.classification === "TS") {
        return "Top Secret"
      }
      if (type === "long") {
        return classificationString + " / " + ILString;
      }
      return classificationString + "/" + IL;
    }

export const buildClassificationDescription
    = (classLevel: ClassificationLevelDTO): string => {
      switch (classLevel.impact_level) {
      case "IL2":
        return `Accommodates DoD information that has been approved for public 
        release (Low Confidentiality and Moderate Integrity)`
      case "IL4":
        return `Accommodates DoD Controlled Unclassified Information (CUI)`
      case "IL5":
        return `Accommodates DoD CUI and National Security Systems`
      case "IL6":
        return `Accommodates DoD Classified Information up to SECRET`
      default:
        return ""
      }
    }

//strips whitespace, and special characters
export const sanitizeOfferingName = (offeringName: string): string => {
  return offeringName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{\\}[\]\\/]/gi, "_")
    .replace(/ /g, "_").replace(/_$/, '');
}

// formats a number to currency string with commas and 2 decimal places
export const toCurrencyString = (num: number, decimals?: boolean): string => {
  const d = decimals === false ? 0 : 2;
  if (!isNaN(num)) {
    return num.toLocaleString(
      undefined, {minimumFractionDigits: d, maximumFractionDigits: d}
    );
  }
  return "";
}

// converts a formatted currency string back to a number
export const currencyStringToNumber = (str: string): number => {
  return str ? parseFloat(str.replaceAll(",", "")) : 0;
}


export const getCurrencyString = (value: number, decimals?: boolean): string => {
  return "$" + toCurrencyString(value, decimals);
}

export const roundDecimal = (value: number, decimals: number): number => {
  decimals = decimals || 0;
  value = value || 0;
  return parseFloat(value.toFixed(decimals));
}

export const getLegendAmount = (total: number, indexValue: number): string => {
  const amount = Math.round(total * indexValue / 100);
  return getCurrencyString(amount, false);
}

export const roundTo100 = (numberArr: number[], withTenths?: boolean): number[] => {
  const output = [];
  let acc = 0;
  for(let i = 0; i < numberArr.length; i++) {
    let roundedCur
    if(withTenths){
      roundedCur = Math.round(10 * numberArr[i])/10
    } else {
      roundedCur = Math.round(numberArr[i]);
    }

    const currentAcc = acc;
    if (acc == 0) {
      output.push(roundedCur);
      acc += numberArr[i];
      continue;
    }
    acc += numberArr[i];
    if(withTenths) {
      output.push(Math.round(10 * acc)/10 - Math.round(10 * currentAcc)/10);
    } else {
      output.push(Math.round(acc) - Math.round(currentAcc));
    }
  }

  return output;
}
