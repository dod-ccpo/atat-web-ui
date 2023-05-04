import { 
  AgencyDTO, 
  ClassificationLevelDTO, 
  EvalPlanAssessmentAreaDTO, 
  EvalPlanDifferentiatorDTO, 
  PeriodDTO, 
  ReferenceColumn, 
  SystemChoiceDTO 
} from "@/api/models";
import { Checkbox, RadioButton, SelectData, User } from "types/Global";
import _ from "lodash";
import Periods from "@/store/periods";
import { Statuses } from "@/store/acquisitionPackage";
import ATATCharts from "@/store/charts";
import { differenceInDays, differenceInMonths, parseISO } from "date-fns";
import DescriptionOfWork from "@/store/descriptionOfWork";

export const hasChanges = <TData>(argOne: TData, argTwo: TData): boolean =>
  !_.isEqual(argOne, argTwo);

export const getIdText = (string: string): string => {
  return string.replace(/[^A-Z0-9]/ig, "");
}

export const toTitleCase = (string: string): string => {
  return _.startCase(_.toLower(string));
}

export const convertAgencyRecordToSelect =
    (data: AgencyDTO[]): SelectData[] => data.map(choice => {
      const { 
        label, 
        sys_id // eslint-disable-line camelcase 
      } = choice;
      return {
        text: label,
        value: sys_id // eslint-disable-line camelcase
      }
    });
export const convertSystemChoiceToSelect =
    (data: SystemChoiceDTO[]): SelectData[] => data.map(choice => {
      const {value} = choice;
      return {
        text: choice.label,
        value
      }
    });


export const convertEvalPlanDifferentiatorToCheckbox = 
  (data: EvalPlanDifferentiatorDTO[]): Checkbox[] => data.map(item => {
    return {
      id: item.name,
      label: item.description,
      value: item.sys_id as string
    }
  });

export const convertEvalPlanAssessmentAreaToCheckbox = 
  (data: EvalPlanAssessmentAreaDTO[]): Checkbox[] => data.map(item => {
    return {
      id: item.name,
      label: item.description,
      value: item.sys_id as string
    }
  });

export const buildClassificationCheckboxList = (
  data: ClassificationLevelDTO[], 
  idSuffix: string, 
  descriptionNeeded: boolean,
  includeTS: boolean,
  labelLength?: string,
): Checkbox[] => {
  idSuffix = idSuffix || "";
  includeTS = includeTS || false;
  const labelType = !labelLength || labelLength === "long" ? "long" : labelLength;
  const arr: Checkbox[] = [];

  data.forEach((classLevel) => {
    if (classLevel.classification
    && classLevel.sys_id
    ) {
      let classificationLevelSysId = classLevel.sys_id;
      if (classLevel.classification_level) {
        classificationLevelSysId =
        typeof classLevel.classification_level === "object"
          ? (classLevel.classification_level as ReferenceColumn).value as string
          : classLevel.classification_level as string;  
      }

      const label = buildClassificationLabel(classLevel, labelType);
      const description = buildClassificationDescription(classLevel)
      const classificationCheckbox: Checkbox = {
        id: classLevel.impact_level + idSuffix || classLevel.classification,
        value: classificationLevelSysId,
        label: label,
        description: descriptionNeeded === true? description : "",
      }
      arr.push(classificationCheckbox)
    }
  });
  return arr.sort((a, b) => (a.id > b.id) ? 1 : -1)
};

export const buildClassificationLabel
    = (classLevel: ClassificationLevelDTO, type: string | null, spaceBetween = false): string => {
      type = type || "long";
      const classificationString = classLevel.classification === "U"
        ? "Unclassified"
        : "Secret";

      if (classLevel.classification === "TS") {
        return "Top Secret"
      }

      const IL = classLevel.impact_level;
      const ILNo = IL.charAt(IL.length - 1) || "";
      const ILString = "Impact Level " + ILNo + " (" + IL + ")";
     
      if (type === "long") {
        return classificationString + " / " + ILString;
      }
      if(spaceBetween){
        return classificationString + " / " + IL;

      }
      return classificationString + "/" + IL;
    }


export const buildClassificationDescription
    = (classLevel: ClassificationLevelDTO): string => {
      switch (classLevel.impact_level) {
      case "IL2":
        return "Accommodates DoD information approved for public "
         + "release (Low Confidentiality and Moderate Integrity)"
      case "IL4":
        return "Accommodates DoD Controlled Unclassified Information (CUI)"
      case "IL5":
        return "Accommodates DoD CUI and National Security Systems"
      case "IL6":
        return ""
      default:
        return ""
      }
    }

/**
 * 
 * @param classLevelSysId - Classification Level Sys Id
 * @returns the number of existing instances (both Xaas and Cloud Support) that have
 *          the classLevelSysId
 */
export const getDOWOfferingsWithClassLevelTotal = (
  classLevelSysId: string
): number => {
  const dowStringified  = JSON.stringify(DescriptionOfWork.DOWObject);
  const re = new RegExp(classLevelSysId, 'g');
  return dowStringified.match(re)?.length || 0;
};

//strips whitespace, and special characters
export const sanitizeOfferingName = (offeringName: string): string => {
  return offeringName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{\\}[\]\\/]/gi, "_")
    .replace(/ /g, "_").replace(/_$/, '');
}

// formats a number to currency string with commas and 2 decimal places
export const toCurrencyString = (num: number, decimals?: boolean): string => {
  const d = decimals === false ? 0 : 2;
  if (!isNaN(num)) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: d, 
      maximumFractionDigits: d, 
    }).format(num);
  }
  return "";
}

// converts a formatted currency string back to a number
export const currencyStringToNumber = (str: string): number | null => {
  if (str && typeof str === "string") {
    str = str.charAt(0) === "$" ? str.substring(1) : str;
    return str ? parseFloat(str.replaceAll(",", "")) : 0;  
  }
  return null;
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

export function generateRandomKey(): string {
  const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
  return String(randomNumber);
}

export function getUserInitials(member:User): string {
  const firstI = member.firstName?.charAt(0);
  const lastI = member.lastName?.charAt(0);
  const initials = firstI && lastI ? firstI + lastI : "XX";
  return initials.toUpperCase();
}

export function getStatusChipBgColor(status: string): string {
  switch (status.toLowerCase()) {
  case Statuses.Active.value.toLowerCase():
  case Statuses.OnTrack.value.toLowerCase():
  case Statuses.OnTrack.label.toLowerCase():
  case Statuses.TaskOrderAwarded.value.toLowerCase():
  case Statuses.TaskOrderAwarded.label.toLowerCase():
    return "bg-success";
  case Statuses.Processing.value.toLowerCase():
  case Statuses.Upcoming.value.toLowerCase():
  case Statuses.Draft.value.toLowerCase():
  case Statuses.WaitingForSignatures.value.toLowerCase():
  case Statuses.WaitingForSignatures.label.toLowerCase():
  case Statuses.OptionExercised.value.toLowerCase():
  case Statuses.OptionExercised.label.toLowerCase():
  case Statuses.OptionPending.value.toLowerCase():
  case Statuses.OptionPending.label.toLowerCase():
    return "bg-info-dark";
  case Statuses.AtRisk.value.toLowerCase():
  case Statuses.AtRisk.label.toLowerCase():
  case Statuses.WaitingForTaskOrder.value.toLowerCase():
  case Statuses.WaitingForTaskOrder.label.toLowerCase():
  case Statuses.ExpiringSoon.value.toLowerCase():
  case Statuses.ExpiringSoon.label.toLowerCase():
  case Statuses.ExpiringPop.value.toLowerCase():
  case Statuses.ExpiringPop.label.toLowerCase():
  case Statuses.FundingAtRisk.value.toLowerCase():
  case Statuses.FundingAtRisk.label.toLowerCase():
    return "bg-warning";
  case Statuses.Deleted.value.toLowerCase():
  case Statuses.Delinquent.value.toLowerCase():
  case Statuses.Expired.value.toLowerCase():
    return "bg-error";
  case Statuses.Archived.value.toLowerCase():
    return "bg-base-dark";
  default:
    return "";
  }
}

const monthAbbreviations = ATATCharts.monthAbbreviations;
const monthsNotAbbreviated = ATATCharts.monthsNotAbbreviated;

export function createDateStr(dateStr: string, period: boolean, hours?: boolean): string {
  hours = hours ? hours : false;
  const parsedDate = parseISO(dateStr, { additionalDigits: 1 });
  const date = hours? new Date(parsedDate) : new Date(parsedDate.setHours(0, 0, 0, 0));
  const m = monthAbbreviations[date.getMonth()];
  const y = date.getFullYear();
  const d = date.getUTCDate();
  const noPeriodMonth = monthsNotAbbreviated.indexOf(m) !== -1;
  const p = period && !noPeriodMonth ? "." : "";
  let formattedDate = m + p + " " + d + ", " + y;
  if (hours) {
    let h = (date.getHours()).toString();
    h = h.length === 1 ? "0" + h : h;
    let m = (date.getMinutes()).toString();
    m = m.length === 1 ? "0" + m : m;
    formattedDate += " " + h + m;
  }
  return formattedDate;

}

export function differenceInDaysOrMonths(
  start:string, end:string, daysCutoff?: number
): Record<string, string> {
  daysCutoff = daysCutoff || 60;
  const formattedStartDate = createDateStr(start, true);
  const formattedEndDate = createDateStr(end, true);
  const difInDays = differenceInDays(new Date(end), new Date().setHours(0,0,0,0));
  const difInMonths = differenceInMonths(new Date(end), new Date().setHours(0,0,0,0));

  const useDays = difInDays <= daysCutoff;
  const numberOfTimeUnits = useDays ? difInDays : difInMonths;
  let unitOfTime = useDays ? "day" : "month";

  if (numberOfTimeUnits !== 1) {
    unitOfTime = unitOfTime + "s";
  }

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    expiration: `${numberOfTimeUnits} ${unitOfTime} to expiration`
  }
}

export function scrollToMainTop(): void {
  const mainWrap = document.querySelector(".v-main__wrap");
  if (mainWrap) {
    mainWrap.scrollTo({top: 0, behavior: "smooth"});
  }
}

export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: "smooth"
    });    
  }
}

export function getStatusLabelFromValue(value: string): string {
  const statusKey = _.startCase(value.replaceAll("_", " ").toLowerCase()).replaceAll(" ", "");
  return Statuses[statusKey] ? Statuses[statusKey].label : "";
}

export function setItemToPlural(numberOfItems: number, noun: string): string {
  return numberOfItems >1 ? noun + "s" : noun;
}

export function capitalizeEachWord(str: string, delimiter?: string): string{
  delimiter = delimiter || " ";
  const splitString = str.split(delimiter);
  for (let i = 0; i < splitString.length; i++) {
    splitString[i] = splitString[i][0].toUpperCase() + splitString[i].substring(1).toLowerCase();
  }
  return splitString.join(" ");
}

export function convertEstimateData(sysIdArray: Record<string, string>[]): string {
  let records = "";
  sysIdArray.forEach(
    (record) =>{ 
      const val = typeof Object.values(record)[0] === "string" 
        ? Object.values(record)[0]?.replaceAll(",","")
        : Object.values(record)[0];
         
      records = "\"" + Object.keys(record) +"\":" + val  + "," + records;
    }
  )
  //remove trailing commaa
  return "{" + records.substring(0,records.length - 1) + "}";
}

/**
 * @param arr 
 * @param conjunction 'and | or' 
 * @returns comma separated list with conjunction
 *    eg. ['apple'] => "apple"
 *    eg. (['apple', 'orange']) => "apple and orange"
 *    eg. (['apple', 'orange', 'pear'], 'or') => "apple, orange or pear"
 */
export function convertStringArrayToCommaList(arr: string[], conjunction?: string): string {
  conjunction = conjunction || 'and';
  let commaList = arr[0] || "";
  if (arr.length > 1){
    commaList = arr.slice(0, -1).join(", ") + " "  + conjunction + " " + arr.slice(-1);
  }
  return commaList;
}

export function getYesNoRadioOptions(groupId: string): RadioButton[] {
  return [
    {
      id: groupId + "Yes",
      label: "Yes",
      value: "YES"
    },
    {
      id: groupId + "No",
      label: "No",
      value: "NO"
    },
  ];
}