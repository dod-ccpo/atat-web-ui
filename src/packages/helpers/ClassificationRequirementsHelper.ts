/* eslint-disable camelcase */
import {ReferenceColumn, SelectedClassificationLevelDTO} from "@/api/models";
import { SingleMultiple, StorageUnit, YesNo } from "types/Global";

/**
 * Builds the current selected classification level list by using the saved list and the default
 * object. For the default object, sets the selected classification_level sys_id
 */
export const buildCurrentSelectedClassLevelList = (
  selectedOptions: string[],
  acquisitionPackageSysId: string,
  savedSelectedClassLevelList: SelectedClassificationLevelDTO[]):
  SelectedClassificationLevelDTO[] => {
  const currentSelectedClassLevelList: SelectedClassificationLevelDTO[] = [];
  for (const classificationLevelSysId of selectedOptions) {
    const selectedClassificationLevel = savedSelectedClassLevelList
      .find(savedClassLevel =>{
        const classLevelId =
          typeof savedClassLevel.classification_level === "object"
            ? savedClassLevel.classification_level.value as string
            : savedClassLevel.classification_level as string;
        return classLevelId === classificationLevelSysId
      });
    if (selectedClassificationLevel) {
      currentSelectedClassLevelList.push(selectedClassificationLevel);
    } else {
      const defaultSelectedClassificationLevel = {
        impact_level: "",
        classification: "",
        classification_level: classificationLevelSysId as unknown as ReferenceColumn,
        acquisition_package: acquisitionPackageSysId as unknown as ReferenceColumn,
        users_per_region: "",
        increase_in_users: "" as YesNo,
        user_growth_estimate_type: "" as SingleMultiple,
        user_growth_estimate_percentage: [""],
        data_egress_monthly_amount: null,
        data_egress_monthly_unit: "" as StorageUnit,
        data_increase: "" as YesNo,
        data_growth_estimate_type: "" as SingleMultiple,
        data_growth_estimate_percentage: [""]
      }
      currentSelectedClassLevelList.push(defaultSelectedClassificationLevel);
    }
  }
  return currentSelectedClassLevelList
}
