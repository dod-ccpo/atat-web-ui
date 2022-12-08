/* eslint-disable camelcase */
import {ReferenceColumn, SelectedClassificationLevelDTO} from "@/api/models";

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
      .find(savedClassLevel =>
        savedClassLevel.classification_level.value === classificationLevelSysId);
    if (selectedClassificationLevel) {
      currentSelectedClassLevelList.push(selectedClassificationLevel);
    } else {
      const defaultSelectedClassificationLevel = {
        impact_level: "",
        classification: "",
        classification_level: classificationLevelSysId as unknown as ReferenceColumn,
        acquisition_package: acquisitionPackageSysId as unknown as ReferenceColumn,
        users_per_region: undefined,
        increase_in_users: "" as const,
        user_growth_estimate_type: undefined,
        user_growth_estimate_percentage: [],
        data_egress_monthly_amount: null,
        data_egress_monthly_unit: "" as const,
        data_increase: "" as const,
        data_growth_estimate_type: undefined,
        data_growth_estimate_percentage: []
      }
      currentSelectedClassLevelList.push(defaultSelectedClassificationLevel);
    }
  }
  return currentSelectedClassLevelList
}
