module.exports = {
 
  contractNoLabel: "#ContractNumber_text_field_label",
  contractNoTxtBox: "#ContractNumber_text_field",
  contractNoTxtError: "#ContractNumber_text_field_control .field-error",
  taskDeliveryOrderNoLabel: "#TaskDeliveryOrderNumber_text_field_label",
  taskDeliveryOrderNoTxtBox: "#TaskDeliveryOrderNumber_text_field",

  // Do you have a current contract for this effort?
  activeRadioOption:"#currentContractOptions_radio_group_control .v-item--active",
  currentContractOptionsTxt: ".copy-max-width p",
  ccYesRadioOption:"#Radio_YesCurrentContract",
  ccNoRadioOption: "#Radio_NoCurrentContract",
  radioOptionError: "#currentContractOptions_radio_group_control .field-error",

  //Let’s gather some details about your previous or current contract
  incumbentLabel: "#IncumbentContractorName_text_field_label",
  incumbentTxtBox: "#IncumbentContractorName_text_field",
  incumbentError:"#IncumbentContractorName_text_field_control .field-error",
  expirationDatePickerLabel: "#ExpirationDatePickerLabel",
  expirationDatePickerError:"#ExpirationDatePickerContainer.atat-date-picker .field-error",
  expirationDatePickerInputbox: "#ExpirationDatePickerTextField",
  expirationDatePickerIcon: "#ExpirationDatePickerButtonIcon",
  expirationDatePicker:"#ExpirationDatePicker",   
  navigateNextMonth: "#ExpirationDatePicker button[aria-label='Next month']",
  selectDate:".v-date-picker-table button:not(.v-btn--disabled)",

  //Let's gather some details about your previous or current contract
  contractOverviewTitle:"h2.mb-5",
  taskOrderNumberTxtBox:"#TaskOrderNumber_text_field",
  fullRadioOption:"#Radio_FULLOPEN",
  sbSetAsideRadioOption:"#Radio_SBSETASIDE",
  otherThanRadioOption:"#Radio_OTHERTHANFULL",
  competitiveStatusOptionError:"3CompetitiveStatusOptions_radio_group_control .field-error",
  startDateTextField:"#StartDatePickerTextField",
  startDatePickerBtnIcon:"#StartDatePickerButtonIcon",
  startDatePreviousMonth:"#StartDatePicker button[aria-label='Previous month']",
  startDatepicker:"#StartDatePicker",
  largeRadioOption:"#Radio_LARGE",
  smallRadioOption:"#Radio_SMALL",
  smallBARadioOption:"#Radio_SMALLBA",
  hubRadioOption:"#Radio_HUBZONE",
  sdvobRadioOption:"#Radio_SDVOSB",
  wosbRadioOption:"#Radio_WOSB",

  //Your ProcurementHistory
  procurementHistoryTable:"#ProcurementHistoryDataTable",

    //Current Environments
  existYesRadioOption:"#ExistingEnvOptions_radio_group_control #Radio_Yes",
  noExistingContractBtn: "#NoExistingContract",
  ceRadioButtonOptionError: "#ExistingEnvOptions_radio_group_control .field-error",
  ceActiveRadioOption:"#ExistingEnvOptions_radio_group_control .v-item--active",

  //Procurement history
  addInstanceNoDataBtn: "#AddInstanceNoData",
  
  // ExistingEnvOptions
  existingEnvYesRadioBtn:"#ExistingEnvOptions_radio_group_control #Radio_Yes",
  existingEnvNoRadioBtn: "#ExistingEnvOptions_radio_group_control #Radio_No",
  
  //where is your current environment located?
  envLocationButtonsgroup: "#EnvLocationButtons_radio_group_control",
  cceRadiobutton: "#Radio_CloudComputingEnvironment",
  opRadioButton: "#Radio_OnPremises",
  hceRadioButton: "#Radio_HybridCloudEnvironment",
  
  //What classification level(s) are your instances deployed in?
  topSecret:"#Checkbox_TS"
}
