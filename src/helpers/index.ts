import { ClassificationLevelDTO, PeriodDTO, SystemChoiceDTO } from "@/api/models";
import { Checkbox, SelectData } from "types/Global";
import _ from "lodash";
import Periods from "@/store/periods";

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

export const buildClassificationCheckboxList = (
  data: ClassificationLevelDTO[], 
  idSuffix: string, 
  descriptionNeeded: boolean,
  includeTS: boolean,
): Checkbox[] => {
  includeTS = includeTS || false;
  const arr: Checkbox[] = [];
  idSuffix = idSuffix || "";

  if (!includeTS) {
    data = data.filter(obj => obj.classification !== "TS");
  }

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
    = (classLevel: ClassificationLevelDTO, type: string): string => {
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


export const createPeriodCheckboxItems = async (): Promise<Checkbox[]> => {
  const periods: PeriodDTO[] = await Periods.loadPeriods();
  // ensure sort order is correct
  if (periods && periods.length > 0) {

    periods.sort((a, b) => a.option_order > b.option_order ? 1 : -1);
    
    const arr: Checkbox[] = [];
    periods.forEach((period, i) => {
      const label = i === 0 ? "Base period" : `Option period ${i}`;
      const id = i === 0 ? "BASE" : `OPTION${i}`;
      const option: Checkbox = {
        id,
        label,
        value: period.sys_id || "",
      };
      arr.push(option);
    })
    return arr;
  }
  return [
    {
      id: "BaseDisabled",
      label: "Base period",
      value: "",
    }
  ];
}

interface ATATWindow extends Window {
  msCrypto: Crypto;
}

declare let window: ATATWindow;

export function generateUid(): string {
  const array = new Uint32Array(4);
  const crypto = window.crypto || window.msCrypto;
  const values = crypto
    ? crypto.getRandomValues(array).map((value) => value)
    : [""];

  return values.join("-").toString();
}