module.exports = {

  contractNoLabel: "#ContractNumber_text_field_label",
  contractNoTxtBox: "#ContractNumber_text_field",
  contractNoTxtError: "#ContractNumber_text_field_control .field-error",
  taskDeliveryOrderNoLabel: "#TaskDeliveryOrderNumber_text_field_label",
  taskDeliveryOrderNoTxtBox: "#TaskDeliveryOrderNumber_text_field",

  // Do you have a current contract for this effort?
  activeRadioOption: "#currentContractOptions_radio_group_control .v-item--active",
  currentContractOptionsTxt: ".copy-max-width p",
  ccYesRadioOption: "#Radio_YesCurrentContract",
  ccNoRadioOption: "#Radio_NoCurrentContract",
  radioOptionError: "#currentContractOptions_radio_group_control .field-error",

  //Let’s gather some details about your previous or current contract
  incumbentLabel: "#IncumbentContractorName_text_field_label",
  incumbentTxtBox: "#IncumbentContractorName_text_field",
  incumbentError: "#IncumbentContractorName_text_field_control .field-error",
  expirationDatePickerLabel: "#ExpirationDatePickerLabel",
  expirationDatePickerError: "#ExpirationDatePickerContainer.atat-date-picker .field-error",
  expirationDatePickerInputbox: "#ExpirationDatePickerTextField",
  expirationDatePickerIcon: "#ExpirationDatePickerButtonIcon",
  expirationDatePicker: "#ExpirationDatePicker",
  navigateNextMonth: "#ExpirationDatePicker button[aria-label='Next month']",
  selectDate: ".v-date-picker-table button:not(.v-btn--disabled)",
  expirationSelectDate: "#ExpirationDatePicker > .v-picker__body"+
  " > :nth-child(1) >.v-date-picker-table button:not(.v-btn--disabled)",
  tNoTooltipBtn: "#TooltipButton_TaskDeliveryOrderNumber",
  tNoTooltipText: "#TooltipText_TaskDeliveryOrderNumber",
  expirationTooltipBtn: "#TooltipButton_Expiration",
  expirationTooltipText: "#TooltipText_Expiration",

  //Let's gather some details about your previous or current contract
  contractOverviewTitle: "h2.mb-5",
  contractNoTooltipBtn: "#TooltipButton_ContractNumber",
  contractNoTootipText: "#TooltipText_ContractNumber",
  taskOrderNumberTxtBox: "#TaskOrderNumber_text_field",
  taskOrderNumberToolTipBtn: "#TooltipButton_TaskOrderNumber",
  taskOrderNumberTooltipText: "#TooltipText_TaskOrderNumber",
  fullRadioOption: "#Radio_FULLOPEN",
  sbSetAsideRadioOption: "#Radio_SBSETASIDE",
  otherThanRadioOption: "#Radio_OTHERTHANFULL",
  competitionRadioGroup: "#CompetitiveStatusOptions_radio_group_control input[type=radio]",
  competitiveStatusOptionError: "#CompetitiveStatusOptions_radio_group_control .field-error",
  competitionActiveRadio: "#CompetitiveStatusOptions_radio_group_control .v-item--active",
  startDateTextField: "#StartDatePickerTextField",
  startDatePickerBtnIcon: "#StartDatePickerButtonIcon",
  startDatePreviousMonth: "#StartDatePicker button[aria-label='Previous month']",
  startDatepicker: "#StartDatePicker",
  popValidationError: "#PoPValidation .field-error",
  businessSizeRadioOption: "#businessSizeOptions_radio_group_control input[type=radio]",
  businessSizeActiveRadioOption: "#businessSizeOptions_radio_group_control .v-item--active",
  businessSizeRadioOptionerror: "#businessSizeOptions_radio_group_control .field-error",
  largeRadioOption: "#Radio_LARGE",
  smallRadioOption: "#Radio_SMALL",
  smallBARadioOption: "#Radio_SMALLBA",
  hubRadioOption: "#Radio_HUBZONE",
  sdvobRadioOption: "#Radio_SDVOSB",
  wosbRadioOption: "#Radio_WOSB",

  //Your ProcurementHistory
  procurementHistoryTable: "#ProcurementHistoryDataTable",
  deleteO: "#DeleteButton_0",
  delete1: "#DeleteButton_1",
  edit0: "#EditButton_0",
  addInstance: "#AddInstance",
  deleteInstanceModal: "#DeleteInstanceModal",
  deleteInstanceTitle: "#DeleteInstanceModalTitle",
  deleteModalBtn: "#DeleteInstanceModal #dialog_ok",
  deletemodalMessage: "#DeleteInstanceModalMessage",

  //Current Environments
  existYesRadioOption: "#ExistingEnvOptions_radio_group_control #Radio_Yes",
  existNoRadioOption: "#ExistingEnvOptions_radio_group_control #Radio_No",
  noExistingContractBtn: "#NoExistingContract",
  ceRadioButtonOptionError: "#ExistingEnvOptions_radio_group_control .field-error",
  ceActiveRadioOption: "#ExistingEnvOptions_radio_group_control .v-item--active",

  //Procurement history
  addInstanceNoDataBtn: "#AddInstanceNoData",

  // ExistingEnvOptions
  existingEnvYesRadioBtn: "#ExistingEnvOptions_radio_group_control #Radio_Yes",
  existingEnvNoRadioBtn: "#ExistingEnvOptions_radio_group_control #Radio_No",

  //where is your current environment located?
  envLocationButtonsgroup: "#EnvLocationButtons_radio_group_control",
  cceRadiobutton: "#Radio_CloudComputingEnvironment",
  opRadioButton: "#Radio_OnPremises",
  hceRadioButton: "#Radio_HybridCloudEnvironment",

  //What classification level(s) are your instances deployed in?
  topSecret: "#Checkbox_TS",


  // new ones ............
  //Do you have system diagrams, charts, or other relevant information for your current environment?
  //Page#1:
  recurringPageText: "p.mb-8",
  introPText: "#IntroP",
  existingEnvNoRadioGroup: "#ExistingEnvOptions_radio_group_control input[type=radio]",
  errorMessage: ".field-error.ml-2",

  //Page#2
  systemDocsNoRadioBtn: "#Radio_NoSystemDocs",
  systemDocsYesRadioBtn: "#Radio_YesSystemDocs",
  fileUploadSection: "#FundingPlanEventDiv",
  uploadFileSysDiagram: "input[type='file']",
  yourUploadSection: ".file-loading-div.pa-6.v-card",
  fileLinkFile1: "#File00",
  fileLinkFile2: "#File01",
  dragandDropText: "#FundingPlanEventDiv h2",
  browsetoUploadText: "#FundingPlanEventDiv #BrowseToUpload",
  supportFileText: "#FundingPlanEventDiv span",
  removeFile1: "#RemoveFile00",
  removeFile2: "#RemoveFile01",
  fileUploadErrorMessage: ".file-upload-validation-messages .ml-2",

  //page#4
  envLocationRadioGroup: "#EnvLocationButtons_radio_group_control input[type=radio]",
  cloudComputingRadio: "#Radio_CloudComputingEnvironment",
  onPremiseRadio: "#Radio_OnPremises",
  hybridRadio: "#Radio_HybridCloudEnvironment",

  //page#5
  classificationText: "#ClassificationLevelP",
  classificationMessage: "#SelectMessage",
  unClassificationText: "#DeployedP",
  unClassificationMessage: "#SelectMessage2",

  unClassCloudCheckbox: "#Checkbox_UnclassifiedCloud",
  scCloudCheckbox: "#Checkbox_SecretCloud",
  tsCloudCheckbox: "#Checkbox_TopSecretCloud",
  unClassCloudCheckboxes: "#ClassificationLevelCheckboxes input[type=checkbox]",
  checkedunClassCloudCheckboxes: "#ClassificationLevelCheckboxes input[type=checkbox]:checked",

  unClassPremCheckbox: "#Checkbox_UnclassifiedPrem",
  scPremCheckbox: "#Checkbox_SecretPrem",
  tsPremCheckbox: "#Checkbox_TopSecretPrem",
  level2Checkbox: "#Checkbox_IL2",
  level4Checkbox: "#Checkbox_IL4",
  level5Checkbox: "#Checkbox_IL5",
  CloudClassificationCheckboxes: "#CloudClassificationCheckboxes input[type=checkbox]",
  checkedCloudClassificationCheckboxes: "#CloudClassificationCheckboxes"+
  " input[type=checkbox]:checked",

  //onpremise:
  onPremiseClassificationCheckboxes: "#OnPremClassificationCheckboxes input[type=checkbox]",
  publicReleaseCheckbox: "#Checkbox_PublicRelease",
  cUICheckbox: "#Checkbox_CUI",
  nationalSecurityCheckbox: "#Checkbox_NationalSecuritySystems",

  //Page#6 : Let’s start gathering details about each instance in your environment 
  //Section#1
  page6TitleText: "p.mb-10",
  page6Subtitles: "h2.mb-4",
  regionDeployedCheckboxes: "#RegionsDeployed ",
  section1Question1: "#RegionsDeployed span",
  section1Question2OnPrem: "#ClassificationLevelOptions_radio_group_control legend",
  section1Question3: "#EnvironmentLocation_radio_group_control legend",
  instanceRadioGroup: "#EnvironmentLocation_radio_group_control input[type=radio]",

  cloudRadiobox: "#Radio_Cloud",
  onPremRadiobox: "#Radio_OnPremises",

  conusEastCheckbox: "#Checkbox_CONUSEast",
  conusCentralCheckbox: "#Checkbox_CONUSCentral",
  conusWestCheckbox: "#Checkbox_CONUSWest0",
  africomCheckbox: "#Checkbox_AFRICOM",
  centcomCheckbox: "#Checkbox_CENTCOM",
  eucomCheckbox: "#Checkbox_EUCOM",
  indopacomCheckbox: "#Checkbox_INDOPACOM",
  southcomCheckbox: "#Checkbox_SOUTHCOM",

  section1Question2: "#ClassificationLevelOptions_radio_group_control legend",
  regionUsersCheckboxes: "#RegionsUsers ",
  regionDeployedAllCheckboxes: "#RegionsDeployed input[type=checkbox]",
  checkedregionDeployedCheckboxes: "#RegionsDeployed input[type=checkbox]:checked",

  IL2Radiobox: "#Radio_IL2",
  IL4Radiobox: "#Radio_IL4",
  IL5Radiobox: "#Radio_IL5",
  IL6Radiobox: "#Radio_IL6",
  tsRadiobox: "#Radio_TS",
  classificationRadioGroup: "#ClassificationLevelOptions_radio_group_control input[type=radio]",

  //Section#2
  section2Question1: "#CurrentUsage legend",
  regionUsersAllCheckboxes: "#RegionsUsers input[type=checkbox]",
  checkedregionUsersCheckboxes: "#RegionsUsers input[type=checkbox]:checked",
  section2Question2: "#SpikeCauseGroupLabel .mr-2",
  section2Question3: "#RegionsUsers span",
  section2Message: "#RegionsUsers p",
  spikesCheckboxes: "#SpikeCauses input[type=checkbox]",
  highUsageEventTextboxLable: "#HighUsageEventDescription_text_field_label",
  highUsagePeriodTextboxLable: "#HighUsagePeriodDescription_text_field_label",
  eventBasedCheckbox: "#Checkbox_EventBased",
  certainPeriodCheckbox: "#Checkbox_CertainPeriods",
  highUsageEventTextbox: "#HighUsageEventDescription_text_field",
  highUsagePeriodTextbox: "#HighUsagePeriodDescription_text_field",

  regularUsageRadiobox: "#Radio_RegularUsage",
  irrregularUsageRadiobox: "#Radio_IrregularUsage",
  currentUsageRadioGroup: "#CurrentUsageDescription_radio_group_control input[type=radio]",

  conusEastTextbox: "#RegionsUsers_TextField0_text_field",
  conusCentralTextbox: "#RegionsUsers_TextField1_text_field",
  conusWestTextbox: "#RegionsUsers_TextField2_text_field",
  africomTextbox: "#RegionsUsers_TextField3_text_field",
  centcomTextbox: "#RegionsUsers_TextField4_text_field",
  eucomTextbox: "#RegionsUsers_TextField5_text_field",
  indopacomTextbox: "#RegionsUsers_TextField6_text_field",
  southcomTextbox: "#RegionsUsers_TextField7_text_field",
  //Section#3
  licenseTextboxLable: "#Licensing_text_field_label",
  licenseTextbox: "#Licensing_text_field",
  numofVCPTextboxLable: "#NumberOfVCPUs_text_field_label",
  numofVCPTextbox: "#NumberOfVCPUs_text_field",
  processorSpeedTextboxLable: "#ProcessorSpeed_text_field_label",
  processorSpeedTextbox: "#ProcessorSpeed_text_field",
  operatingSysTextboxLable: "#OperatingSystem_text_field_label",
  operatingSysTextbox: "#OperatingSystem_text_field",
  memoryTextboxLable: "#Memory_text_field_label",
  memoryTextbox: "#Memory_text_field",
  storageTypeLable: "#StorageType_dropdown_field_label",
  storageTypeDropdown: "#StorageType_dropdown_field_control .v-input__control"+
  " .v-input__append-inner",

  blockStorageOption: "#StorageType_DropdownListItem_Blockstorage",
  objectTypeStorageOption: "#StorageType_DropdownListItem_Objectstorage",
  fileStorageOption: "#StorageType_DropdownListItem_Filestorage",
  archiveStorageOption: "#StorageType_DropdownListItem_Archivestorage",
  storageSubtitle: " .v-list-item__subtitle",

  storageSizeLable: "#StorageAmount_text_field_label",
  storageAmountTextbox: "#StorageAmount_text_field",
  storageSizeField: "#StorageAmount_text_field_control ",
  byteSizeDropdown: "#StorageAmount_dropdown_field_control",
  gigabyteOption: "#StorageAmount_DropdownListItem_GigabyteGB",
  terabyteOption: "#StorageAmount_DropdownListItem_TerabyteTB",
  petayteOption: "#StorageAmount_DropdownListItem_PetabytePB",

  performanceTiertitle: "#PerformanceTierOptions_radio_group_control .mb-3 legend",
  performanceTierRadioGroup: "#PerformanceTierOptions_radio_group_control input[type=radio]",
  generalPurposeRadiobox: "#Radio_GeneralPurpose",
  computeOptimRadiobox: "#Radio_ComputeOptimized",
  memoryOptimizedRadiobox: "#Radio_MemoryOptimized",
  storageOptimRadiobox: "#Radio_StorageOptimized",

  instancesTextboxLable: "#NumberOfInstances_text_field_label",
  instancesTextbox: "#NumberOfInstances_text_field",
  dataegressTextboxLable: "#MonthlyDataEgress_text_field_label",
  dataegressTextbox: "#MonthlyDataEgress_text_field",

  //Section#4
  section4Message: "#PricingDetails legend",
  currentPaymentRadioGroup: "#CurrentPaymentArrangement_radio_group_control input[type=radio]",
  reservedRadiobox: "#Radio_Reserved",
  payAsYouGoRadiobox: "#Radio_PayAsYouGo",
  reservedExpirationDatePicker: "#ExpirationDateDatePickerButtonIcon",
  datePicker: "#ExpirationDateDatePicker",
  reservedNavigateNextMonth: "#ExpirationDateDatePicker button[aria-label='Next month']",

  //Section#5
  section5Question: "#AdditionalInfo_text_field_label span",
  section5Note: "#AdditionalInfo_text_field_control .mb-2",
  additionalInfoTextbox: "#AdditionalInfo_text_area",

  //error messages in page#6:
  classandImpactErrorMessage: "#ClassificationLevelOptions_radio_group_control .field-error.ml-2",
  currentUsageErrorMessage: "#CurrentUsage .field-error.ml-2",
  spikesCausesErrorMessage: "#SpikeCauses .field-error.ml-2",
  highUsageEventErrorMessage: "#HighUsageEventDescription_text_field_control .field-error.ml-2",
  highUsagePeriodErrorMessage: "#HighUsagePeriodDescription_text_field_control .field-error.ml-2",
  regionsErrorMessage: "#RegionsUsers .field-error.ml-2",

  licensingErrorMessage: "#Licensing_text_field_control .field-error.ml-2",
  noofVCPErrorMessage: "#NumberOfVCPUs_text_field_control .field-error.ml-2",
  processorSpeedErrorMessage: "#ProcessorSpeed_text_field_control .field-error.ml-2",
  operatingSysErrorMessage: "#OperatingSystem_text_field_control .field-error.ml-2",
  memoryErrorMessage: "#Memory_text_field_control .field-error.ml-2",
  storageTypeErrorMessage: "#StorageType_dropdown_field_control .field-error.ml-2",
  storageSizeErrorMessage: "#StorageAmount_text_field_control .field-error.ml-2",

  performanceTierErrorMessage: "#PerformanceTierOptions_radio_group_control .field-error.ml-2",
  monthlyDataErrorMessage: "#MonthlyDataEgress_text_field_control .field-error.ml-2",
  pricingModelErrorMessage: "#CurrentPaymentArrangement_radio_group_control .field-error.ml-2",
  expirationDateErrorMessage: "#ExpirationDateDatePickerContainer .field-error.ml-2",

  // page#7
  page7Title: "#app-content .mb-3",
  summaryEnvironmentType: "#EnvironmentType",
  summaryClassificationText: "#ClassificationText",
  currentEnvHistoryTable: "#app-content colgroup",
  summaryCETableHeader: ".v-data-table tr th",
  summaryCETableData: ".v-data-table tr td",

  //Background Summary
  backgroundSummaryTitleText: "p.mb-10",
  procurementHistoryHeaderText: "#ProcurementHistory_Heading",
  procurementHistoryDescription: "#ProcurementHistory_Description",
  procurementHistoryCompleteBtn: "#ProcurementHistory_CompleteButton",

  currentEnvironmentHeaderText: "#CurrentEnvironment_Heading",
  currentEnvironmentDescription: "#CurrentEnvironment_Description",
  currentEnvironmentCompleteBtn: "#CurrentEnvironment_CompleteButton",
  currentEnvironmentReviewBtn: "#CurrentEnvironment_MissingInfoButton",


}