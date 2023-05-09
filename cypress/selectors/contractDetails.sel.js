module.exports = {
  // Let’s gather some details about the duration of your task order
  popLearnMoreLink: "#PopLearnMore",
  popText: "p.mb-10",
  popLengthLabelText: "div.mb-4._semibold",
  mainWrap: ".v-main__wrap",
  baseRow: "#BaseRow",
  baseLabelText: "#BaseRow .duration",
  baseInputTxtBox: "#BaseDuration_text_field",
  baseDropdownIcon:
    "#BaseDropdown_dropdown_field_control .v-input__control .v-input__append-inner",
  baseDropdownDefault:
    "#BaseDropdown_dropdown_field_control .v-select__selections",
  baseDropdownList: "#BaseDropdown_dropdown_field_control  .v-list",
  baseDropdownYear: "#BaseDropdown_DropdownListItem_Year",
  baseDropdownMonth: "#BaseDropdown_DropdownListItem_Months",
  baseDropdownWeek: "#BaseDropdown_DropdownListItem_Weeks",
  baseDropdownDays: "#BaseDropdown_DropdownListItem_Days",
  basebutton: "#BaseButtons",
  baseDuplicateButton: "#BaseCopy",
  baseDeleteButton: "#BaseDelete",
  addOptionLink: "#AddOptionPeriodButton",
  optionRow: "#Option1Row",
  optionalTextBox: "#Option1Duration_text_field",
  optionDropdownIcon:
    "#Option1Dropdown_dropdown_field_control .v-input__control" +
    " .v-input__append-inner",
  optionOneDropdownDefault:
    "#Option1Dropdown_dropdown_field_control .v-select__selections",
  optionDropdownList:
    "#Option1Dropdown_dropdown_dropdown_field_control .v-list",
  optionDropdownYear: "#Option1Dropdown_DropdownListItem_Year",
  optionDropdownMonth: "#Option1Dropdown_DropdownListItem_Months",
  optionDropdownWeek: "#Option1Dropdown_DropdownListItem_Weeks",
  optioneDropdownDays: "#Option1Dropdown_DropdownListItem_Days",
  optionOneDropdownSelected:
    "#Option1Dropdown_dropdown_field_control .v-select__selection--comma",
  errorMessageText: ".field-error.ml-2",
  optionDeleteButton: "#Option1Delete",
  sourceItem: "#Option2Row",
  targetItem: "#BaseRow",
  optionalTwoTextBox: "#Option2Duration_text_field",

  //Do you want to request a PoP start date?
  popStartDateYesRadioOption: "#Radio_YesStartDate",
  popStartDateNoRadioOption: "#Radio_NoStartDate",
  requestedStartDate: "p.mb-2",
  requestedStartDropdownIcon:
    "#RequestDateOption_dropdown_field_control" +
    " .v-input__control .v-input__append-inner",
  requestedStartDropdownList:
    "#RequestDateOption_dropdown_field_control .v-list",
  requestedStartDateNosoonerthan:
    "#RequestDateOption_DropdownListItem_Nosoonerthan",
  requestedStartDateNotlaterthan:
    "#RequestDateOption_DropdownListItem_Notlaterthan",
  warningTextMessage: "#RequestDateAlert .mb-0",
  requestDatePicker: "#RequestDatePickerDatePickerTextField",
  requestDatePickerError: "#RequestDatePickerDatePickerContainer .field-error",
  calendarIcon: "#RequestDatePickerDatePickerButtonIcon",
  datePicker: "#RequestDatePickerDatePicker",
  navigateCalendar: ".v-date-picker-header i",
  navigateNextMonth: "button[aria-label='Next month']",
  selectDate: ".v-date-picker-table button:not(.v-btn--disabled)",
  popStartRadioError: "#PoPStartDate_radio_group_control .field-error",

  //will this be a future recurring requirement?
  recurringReqText: "p.mb-10",
  yesRadioOption: "#Radio_YesRecurring",
  noRadioOption: "#Radio_NoRecurring",
  activeRadioOption: "#RecurringOptions_radio_group_control .v-item--active",
  popRadioGroup: "#PoPStartDate_radio_group_control",
  futureRecurringRadioError:
    "#RecurringOptions_radio_group_control .field-error",

  //which Contract type applies to this acquistion?
  introPText: "#IntroP",
  farLink: "._text-link",
  selectMessageText: "#SelectMessage",
  selectedContractTypeOption:
    "#ContractTypesCheckboxes input[type=checkbox]:checked",
  ffpCheckBox: "#Checkbox_FFPCheckbox",
  tmCheckBox: "#Checkbox_TMCheckbox",
  tmTextFieldLabel: "#JustificationForTM_text_field_label",
  tmTextFieldInputBox: "#JustificationForTM_text_area",
  tmLearnMoreLink: "#JustificationLearnMore",

  //What classification level(s) will be required for your cloud resources and /or services?
  selectMess: "#SelectMessage",
  classCheckBoxes: "#ClassificationLevelCheckboxes input[type=checkbox]",
  checkedClassCheckBoxes:
    "#ClassificationLevelCheckboxes input[type=checkbox]:checked",
  level2: "#Checkbox_IL2",
  level4: "#Checkbox_IL4",
  level5: "#Checkbox_IL5",
  level6: "#Checkbox_IL6",
  ts: "#Checkbox_TS",
  modalLevel2: "#Checkbox_IL2Modal",
  modalLevel4: "#Checkbox_IL4Modal",
  modalLevel5: "#Checkbox_IL5Modal",
  modalLevel6: "#Checkbox_IL6Modal",
  errorClassCheckBox: "#ClassificationLevelCheckboxes .field-error",
  alertMessage: "#ClassificationRequirementsAlert p",
  activeCheckBox: "#ClassificationLevelCheckboxes .v-input--is-label-active",

  //Security Requirements page
  secretCheckbox: "#SecurityRequirements input[type=checkbox]",
  secretCheckedbox: "#SecurityRequirements input[type=checkbox]:checked",
  secretLabel: ":nth-child(1) > #MessageNote span",
  tsLabel: ":nth-child(3) > #MessageNote span",
  tsCheckbox: ":nth-child(2) #SecurityRequirements input[type=checkbox]",
  secretErrorCheckbox:
    "#SecurityRequirements input[type=checkbox] .field-error",

  //Cross Domain
  cdsRadiogroup: "#needsCDSGroup_radio_group_control",
  cdsYesOption: "#Radio_YesCdsSolution",
  cdsNoOption: "#Radio_NoCdsSolution",
  cdsLabel: "#cdsSolutionLabel",
  cds: "#cdsSolutions",
  cdsCheckbox: "#cdsSolutions input[type=checkbox]",
  unclastoSecrCB: "#Checkbox_UtoS",
  tsToUnclass: "#Checkbox_TStoUS",
  tsToS: "#Checkbox_TStoS",
  cdsUtoSTxtbox: "#cdsSolutions #cdsSolutions_TextField0_text_field",
  cdsTxtbox: "#cdsSolutions #cdsSolutions_TextField1_text_field",
  cdsTStoSTxtbox: "#cdsSolutions #cdsSolutions_TextField5_text_field",
  cdsCheckedbox: "#cdsSolutions input[type=checkbox]:checked",
  projectedFSField: "#projectedFileStreamType_text_field",
  anticipatedTxtbox: "#AnticipatedNeedUsage_01_text_area",
  entiredDurationNo: "#EntireDuration_01_radio_group_control #Radio_No",
  entiredDurationYes: "#EntireDuration_01_radio_group_control #Radio_Yes",
};
