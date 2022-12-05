import { 
  AgencyDTO, 
  ClassificationLevelDTO, 
  EvalPlanAssessmentAreaDTO, 
  EvalPlanDifferentiatorDTO, 
  PeriodDTO, 
  SystemChoiceDTO 
} from "@/api/models";
import { Checkbox, SelectData, User } from "types/Global";
import _ from "lodash";
import Periods from "@/store/periods";
import { Statuses } from "@/store/acquisitionPackage";
import ATATCharts from "@/store/charts";
import { differenceInDays, differenceInMonths, parseISO } from "date-fns";

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

  if (!includeTS) {
    data = data.filter(obj => obj.classification !== "TS");
  }

  data.forEach((classLevel) => {
    if (classLevel.classification
    && classLevel.sys_id
    ) {
      const label = buildClassificationLabel(classLevel, labelType);
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
    = (classLevel: ClassificationLevelDTO, type: string | null, spaceBetween = false): string => {
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
  str = str.charAt(0) === "$" ? str.substring(1) : str;
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

export function createDateStr(dateStr: string, period: boolean): string {
  const parsedDate = parseISO(dateStr, { additionalDigits: 1 });
  const date = new Date(parsedDate.setHours(0, 0, 0, 0));
  const m = monthAbbreviations[date.getMonth()];
  const y = date.getFullYear();
  const d = date.getUTCDate();
  const neverPeriodMonths = ["March", "April", "May", "June", "July"];
  const noPeriodMonth = neverPeriodMonths.indexOf(m) !== -1;
  const p = period && !noPeriodMonth ? "." : "";
  return m + p + " " + d + ", " + y;
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
