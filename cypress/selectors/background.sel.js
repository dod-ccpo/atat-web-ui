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
  topSecret:"#Checkbox_TS",


  // new ones ............
  recurringPageText:  "p.mb-8",
  introPText: "#IntroP",
  systemDocsNoRadioBtn:"#Radio_NoSystemDocs",
  systemDocsYesRadioBtn: "#Radio_YesSystemDocs",

  cloudComputingRadio : "#Radio_CloudComputingEnvironment",
  onPremiseRadio : "#Radio_OnPremises",
  hybridRadio : "#Radio_HybridCloudEnvironment",
  uploadFileSysDiagram : "input[type='file']",

  //page#5
  classificationText : "#ClassificationLevelP",
  classificationMessage : "#SelectMessage",

  unClassificationText : "#DeployedP",
  unClassificationMessage : "#SelectMessage2",

  unClassCloudCheckbox: "#Checkbox_UnclassifiedCloud",
  scCloudCheckbox: "#Checkbox_SecretCloud",
  tsCloudCheckbox:   "#Checkbox_TopSecretCloud",
  checkedunClassCloudCheckboxes:
  "#ClassificationLevelCheckboxes input[type=checkbox]:checked",

  unClassPremCheckbox: "#Checkbox_UnclassifiedPrem",
  scPremCheckbox: "#Checkbox_SecretPrem",
  tsPremCheckbox:   "#Checkbox_TopSecretPrem",

  
  level2Checkbox: "#Checkbox_IL2",
  level4Checkbox: "#Checkbox_IL4",
  level5Checkbox: "#Checkbox_IL5",
  checkedCloudClassificationCheckboxes:
  "#CloudClassificationCheckboxes input[type=checkbox]:checked",

  //onpremise:
  publicReleaseCheckbox: "#Checkbox_PublicRelease",
  cUICheckbox: "#Checkbox_CUI",
  nationalSecurityCheckbox: "#Checkbox_NationalSecuritySystems",

  //Page#6 : Let’s start gathering details about each instance in your environment  
  regionDeployedCheckboxes : "#RegionsDeployed ",
  regionUsersCheckboxes : "#RegionsUsers ",
  checkedregionDeployedCheckboxes:
  "#RegionsDeployed input[type=checkbox]:checked",
  checkedregionUsersCheckboxes:
  "#RegionsUsers input[type=checkbox]:checked",

 cloudRadiobox: "#Radio_Cloud",
 onPremRadiobox: "#Radio_OnPremises",

  conusEastCheckbox: "#Checkbox_CONUSEast",
  conusCentralCheckbox: "#Checkbox_CONUSCentral",
  conusWestCheckbox: "#Checkbox_CONUSWest",
  africomCheckbox: "#Checkbox_AFRICOM",
  centcomCheckbox: "#Checkbox_CENTCOM",
  eucomCheckbox: "#Checkbox_EUCOM",
  indopacomCheckbox: "#Checkbox_INDOPACOM",
  southcomCheckbox: "#Checkbox_SOUTHCOM",

  IL2Radiobox: "#Radio_IL2",
  IL4Radiobox: "#Radio_IL4",
  IL5Radiobox: "#Radio_IL5",
  IL6Radiobox: "#Radio_IL6",
  tsRadiobox: "#Radio_TS",

  regularUsageRadiobox: "#Radio_RegularUsage",
  irrregularUsageRadiobox: "#Radio_IrregularUsage",

  eventBasedCheckbox: "#Checkbox_EventBased",
  certainPeriodCheckbox: "#Checkbox_CertainPeriods",
  highUsageTextbox: "#HighUsageEventDescription_text_field",
  highUsagePeriodTextbox: "#HighUsagePeriodDescription_text_field",

  conusEastTextbox: "#RegionsUsers_TextField0_text_field",
  conusCentralTextbox: "#RegionsUsers_TextField1_text_field",
  conusWestTextbox: "#RegionsUsers_TextField2_text_field",
  africomTextbox: "#RegionsUsers_TextField3_text_field",
  centcomTextbox: "#RegionsUsers_TextField4_text_field",
  eucomTextbox: "#RegionsUsers_TextField5_text_field",
  indopacomTextbox: "#RegionsUsers_TextField6_text_field",
  southcomTextbox: "#RegionsUsers_TextField7_text_field",

  licenseTextbox: "#Licensing_text_field",
  numofVCPTextbox: "#NumberOfVCPUs_text_field",
  processorSpeedTextbox: "#ProcessorSpeed_text_field",
  operatingSysTextbox: "#OperatingSystem_text_field",
  memoryTextbox: "#Memory_text_field",
  storageTypeDropdown: "#StorageType_dropdown_field_control .v-input__control .v-input__append-inner",

  blockStorageOption: "#StorageType_DropdownListItem_Blockstorage",
  objectTypeStorageOption: "#StorageType_DropdownListItem_Objectstorage",
  fileStorageOption: "#StorageType_DropdownListItem_Filestorage",
  archiveStorageOption: "#StorageType_DropdownListItem_Archivestorage",
  storageAmountTextbox: "#StorageAmount_text_field",

  generalPurposeRadiobox: "#Radio_GeneralPurpose",
  computeOptimRadiobox: "#Radio_ComputeOptimized",
  memoryOptimizedRadiobox: "#Radio_MemoryOptimized",
  storageOptimRadiobox: "#Radio_StorageOptimized",

  instancesTextbox: "#NumberOfInstances_text_field",
  dataegressTextbox: "#MonthlyDataEgress_text_field",

  //Section#4
  reservedRadiobox: "#Radio_Reserved",
  payAsYouGoRadiobox: "#Radio_PayAsYouGo",
  expirationDatePicker: "#ExpirationDateDatePickerButtonIcon",
  datePicker: "#ExpirationDateDatePicker",

 //Section#5
 additionalInfoTextbox: "#AdditionalInfo_text_area",

 // page#7
 summaryEnvironmentType: "#EnvironmentType",
 summaryClassificationText: "#ClassificationText",
summaryCETableHeader: ".v-data-table tr th",
 summaryCETableData: ".v-data-table tr td",


}
