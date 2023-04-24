module.exports = {
  app:"#atat-app",
  title: "title",
  packageNameHeader: "header.v-toolbar div.h3",
  wrap:".v-main__wrap",
  header: "h1.page-header",
  sideNavBar:"#GlobalSideNavBar",
  sideBarList: ".global-side-nav-bar .v-list",
  stepperProgressBarTextPrimary: "._stepper-progress-bar .text-primary",
  stepperProgressBarText: "._stepper-progress-bar .text-base",
  progressBar: ".v-progress-linear__determinate",
  completePercentage:".global-side-nav-bar .completed-check[data-substep-complete-percentage]",  
  footerLinks:".atat-page-footer .links",
  continueBtn:"#ContinueButton",
  backBtn: "#BackButton span span",
  introText: "p.mb-10",
  
  //common id for modal button
  commonOkBtn: "#dialog_ok",
  dialogModal: ".v-dialog",
  
  //toast 
  toastText:".v-snack__content",
  
  //slidepanel
  slidePanel: "._slideout-panel",
  slidePanelCloser: "#PanelCloser",
  slidePanelHeader:"._panel-header",
  panelTitle: "#PanelWrap h2",
  
  // Acquisition Package Details
  stepAcquisitionText: "#Step_AcquisitionPackageDetails >.step-text",
  stepAcquisitionCircle:"#Step_AcquisitionPackageDetails > .step-circle",
  subStepProjectOverviewTxt:"#SubStep_ProjectOverview > .step-text",
  subStepOrganizationTxt: "#SubStep_Organization > .step-text",
  subStepOrganizationLink:"#SubStep_Organization",
  subStepContactInformationTxt: "#SubStep_ContactInformation > .step-text",
  subStepContactInformationLink: "#SubStep_ContactInformation",

  //Evaluation Criteria
  stepEvaluationCriteriaLink: "#Step_EvaluationCriteria",
  stepEvaluationCriteriaText: "#Step_EvaluationCriteria .step-text",
  subStepFairOppLink:"#SubStep_ExceptiontoFairOpportunity",
  stepFairOppText: "#SubStep_ExceptiontoFairOpportunity .step-text",
  stepFairOppTextCircle: "#SubStep_ExceptiontoFairOpportunity .step-circle",  
  subStepEvaluationLink: "#SubStep_CreateEvaluationPlan",
  subStepEvaluationText: "#SubStep_CreateEvaluationPlan .step-text", 

  //Background
  stepBackgroundLink: "#Step_Background",
  stepBackgroundText: "#Step_Background .step-text",
  stepBackgroundCircle: "#Step_Background .step-circle",
  substepCurrentContractLink: "#SubStep_CurrentContract",
  substepCurrentContractText: "#SubStep_CurrentContract .step-text",
  substepCurrentEnvironmentLink: "#SubStep_CurrentEnvironment",
  substepCurrentEnvironmentText: "#SubStep_CurrentEnvironment .step-text",
  stepExceptionToFpLink: "#Step_ExceptiontoFairOpportunity",
  stepExceptionToFpText: "#Step_ExceptiontoFairOpportunity .step-text",
  
  //Contract Details
  stepContractDetailsLink: "#Step_ContractDetails",
  stepContractDetailsText: "#Step_ContractDetails .step-text",
  subStepPopLink: "#SubStep_PeriodofPerformance",
  subStepPopText: "#SubStep_PeriodofPerformance .step-text",
  subStepContractTypeLink: "#SubStep_ContractType", 
  subStepContractTypeText: "#SubStep_ContractType .step-text",
  subStepClassReqsLink: "#SubStep_ClassificationRequirements",  
  subStepClassReqsText: "#SubStep_ClassificationRequirements .step-text",
  
  //Performance Requirements
  stepPerformanceReqLink: "#Step_PerformanceRequirements",
  stepPerformanceReqText:"#Step_PerformanceRequirements .step-text",

  //Government Furnished Euipment
  stepGovFurEquipLink: "#Step_GovernmentFurnishedEquipment",
  stepGovFurEquipText: "#Step_GovernmentFurnishedEquipment .step-text",
  subStepPropDetailsLink: "#SubStep_PropertyDetails",
  subStepPropDetailsText: "#SubStep_PropertyDetails .step-text",
  substepJustificationLink: "#SubStep_Justification",
  substepJustificationText: "#SubStep_Justification  span.step-text",

  //Other Contract Considerations
  stepOCCLink: "#Step_OtherContractConsiderations",
  stepOCCText: "#Step_OtherContractConsiderations .step-text",
  subStepCoILink: "#SubStep_ConflictofInterest",
  subStepCoIText: "#SubStep_ConflictofInterest .step-text",
  subStepPPSLink: "#SubStep_PackagingPackingandShipping",
  subStepPPSText: "#SubStep_PackagingPackingandShipping .step-text",
  subStepTravelLink: "#SubStep_Travel",
  subStepTravelText:"#SubStep_Travel .step-text",
  subStepTrainingLink: "#SubStep_Training",
  subStepTrainingText: "#SubStep_Training .step-text",
  
  // Standards and Compliance
  stepStandCompLink: "#Step_StandardsandCompliance",
  stepStandCompText: "#Step_StandardsandCompliance .step-text", 
  subStepPIILink: "#SubStep_PersonallyIdentifiableInformationPII",
  subStepPIIText: "#SubStep_PersonallyIdentifiableInformationPII .step-text",
  subStepBAALink: "#SubStep_BusinessAssociateAgreementBAA",
  subStepBAAText: "#SubStep_BusinessAssociateAgreementBAA .step-text",
  substepPDOILink: "#SubStep_PublicDisclosureofInformation",
  substepPDOIText: "#SubStep_PublicDisclosureofInformation .step-text",
  substepSection508Link: "#SubStep_Section508Standards",
  substepSection508Text: "#SubStep_Section508Standards .step-text",  

  //Financial Details
  stepFinancialDetailsLink:"#Step_FinancialDetails",
  stepFinancialDetailsText: "#Step_FinancialDetails .step-text",
  stepFinancialDetailsCircle: "#Step_FinancialDetails .step-circle",
  subStepRequirementsCostEstimateText: "#SubStep_RequirementsCostEstimate .step-text",
  subStepFundingPlanLink: "#SubStep_FundingPlan",
  subStepFundingPlanText: "#SubStep_FundingPlan .step-text",
  subStepIFLink: "#SubStep_SeverabilityandIncrementalFunding",
  subStepIFText: "#SubStep_SeverabilityandIncrementalFunding .step-text",

  //Review Required forms
  stepRequiredFormLink: "#Step_ReviewRequiredForms",
  stepRequiredFormText: "#Step_ReviewRequiredForms .step-text",

  somethingElse: "#PackageNameHeader",

  //navigation bar
  navigationBar: "#TopNavBar",
  dashboardTab: "#TopNavButton_Dashboard",
  acquisitionsTab: "#TopNavButton_Acquisitions",
  acquisitionDropdownList: "#TopNavBarMenu_Acquisitions .v-menu__content .v-list",
  myPackage: "#TopNavBarMenuItem_MyPackages",
  myTaskOrder:"#TopNavBarMenuItem_MyTaskOrders",
  portfoliosTab: "#TopNavBarItem_Portfolios",  
  portfolioBtn:"#TopNavButton_Portfolios",
  portalsTab: "#TopNavButton_Portals",

  //portalDropdownIcon:"#TopNavButton_Portals",
  portalsDropdownList:"#TopNavBarMenu_Portals .v-menu__content .v-list",
  userTab: "#TopNavButton_User",
  userDropdownList: "#TopNavBarMenu_User .v-menu__content .v-list", 
  userIntials: "._initials",
  userName: "#TopNavBarMenu_User .font-weight-700",
  userEmail:"#TopNavBarMenu_User .font-size-12",  
  profileMenuitem: "#TopNavBarMenuItem_Profile",
  contactSupportMenuItem: "#TopNavBarMenuItem_ContactSupport",
  submitFeedbackMenuItem: "#TopNavBarMenuItem_SubmitFeedback",
  signOutMenuItem:"#TopNavBarMenuItem_Signout",
}
