import { 
  bootstrapMockApis,   
  randomAlphaNumeric,
  randomNumber,
  getObjectFromArrayByKey  
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReq from "../../../selectors/performanceReqs.sel";

describe.skip("Test suite: Let’s start by gathering your Compute requirements", () => {

  let serviceOfferingGroups;
  let compute;
  let categoryObj;
  
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
      categoryObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "COMPUTE"
      );
    });
    cy.fixture("compute").then((data) => {
      compute = data;
      
    });
    
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });    
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();    

  });
  
  it("TC1: Multiple Classifications exists", () => {
    const periodCheckboxCount = 1
    let selectedClassifications = [contractDetails.level5, contractDetails.level4];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.selectRadioBtn(performanceReq.envDevTesting, "Dev/Testing");
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 4 (IL4)",
      "Unclassified / Impact Level 5 (IL5)"
    ]
    cy.verifyRadioGroupLabels(
      performanceReq.classLevelRadioGroup,
      selectedClassLevelsLabels
    );
    cy.selectRadioBtn(performanceReq.envDevTesting, "Dev/Testing");
    cy.findElement(performanceReq.classLevelLabel).scrollIntoView();
    cy.textExists(
      performanceReq.classLevelLabel,
      compute.classLevelLabel
    );
    
    cy.hoverToolTip(
      performanceReq.classLevelTooltipBtn,
      performanceReq.classLevelTootipText,
      compute.classLevelTooltipTxt
    );

    cy.findElement(performanceReq.classIL4RadioBtn)
      .click({ force: true });
    cy.verifyRegionCheckBoxesLabels(categoryObj);
    cy.selectCheckBoxes([performanceReq.eastCheckbox, performanceReq.oconusCheckbox]);
    cy.textExists(
      performanceReq.anticipatedTextlabel1,
      compute.descriptionLabelText
    );
    const decriptionText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox1,
      decriptionText
    )
    cy.verifyPerformanceTierRadioLabels(categoryObj);
    cy.durationPeriodExists(
      performanceReq.durationNoRadioBtn,
      performanceReq.entireDurationActiveBtn,
      performanceReq.baseCheckbox,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReq.baseCheckbox);
    cy.textExists(
      performanceReq.formSectionTwoHeader,
      compute.formSectionTwoHeader
    );
    cy.textExists(
      performanceReq.operSysLicenLabel,
      compute.operSysLicenLabel
    );
    cy.hoverToolTip(
      performanceReq.operSysLicenTooltipBtn,
      performanceReq.operSysLicenTootipText,
      compute.osTooltipTxt
    );
    const os = randomAlphaNumeric(10)
    cy.enterTextInTextField(performanceReq.operSysLicenTxtBox, os);

    //Number of vCPUs
    cy.textExists(performanceReq.noOfvCPULabel, " Number of vCPUs ");
    
    cy.hoverToolTip(
      performanceReq.noOfvCPUTooltipBtn,
      performanceReq.noOfvCPUTooltipText,
      compute.cpuTooltipTxt
    );
    const cpu = randomNumber(3)
    cy.enterTextInTextField(performanceReq.noOfvCPUTxtBox, cpu);

    //Memory
    cy.textExists(performanceReq.memoryLabel, " Memory ");
    
    cy.hoverToolTip(
      performanceReq.memoryTooltipBtn,
      performanceReq.memoryTooltipTxt,
      compute.memoryTooltipTxt
    );
    const memory = randomNumber(3)
    cy.enterTextInTextField(performanceReq.memoryTextBox, memory);
  
    //Storage Type
    cy.verifyStorageTypeListItems(categoryObj);
    cy.textExists(performanceReq.storageTypePIOPS,"Provisioned IOPS SSD").click({ force: true });
    //Storage Amount
    cy.textExists(performanceReq.storageAmountLabel, "Storage amount");
    
    cy.hoverToolTip(
      performanceReq.storageAmountTooltipBtn,
      performanceReq.storageAmountTooltipText,
      compute.storageAmountTooltipTxt
    );
    const storageAmount = randomNumber(3)
    cy.enterTextInTextField(performanceReq.storageAmountTextBox, storageAmount);
    cy.verifyPerformanceTierRadioLabels(categoryObj);
    cy.selectRadioBtn(performanceReq.premiumRadioBtn, "Premium");
    
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(' Your compute requirements ');

  });
  
  it("TC2: No Classification Levels selected", () => {
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.verifyTextMatches(performanceReq.subAlertMessage, compute.subtleClassAlert);
    cy.selectRadioBtn(performanceReq.envProd, "Production");
    cy.findElement(performanceReq.classLevelRadioGroup).should("not.exist");
    cy.textExists(performanceReq.contractDetailsLink, compute.contractDetailsLink).click();
    
    //Navigates to Contract details
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    let selectedClassifications = [contractDetails.level2, contractDetails.level4];
    cy.selectCheckBoxes(selectedClassifications);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Your Performance Requirements");
    cy.verifyTextMatches(
      performanceReq.categoryNameHeader,
      categoryObj.label);
    cy.textExists(performanceReq.missingInfo, "Missing info").should("exist");
    cy.btnExists(performanceReq.reviewbtn, " Review ").click();
    
    //Navigates to Your Compute Requirements screen
    cy.verifyPageHeader(" Your compute requirements ");
    cy.findElement(performanceReq.tableWrapper).should("exist");
    cy.findElement(performanceReq.instanceOneEditBtn).should("exist")
      .and("not.disabled").click();
    
    //Navigates to Compute gather details for instance#1
    cy.verifyPageHeader("Let’s gather some details for Compute Instance #1");
    cy.findElement(performanceReq.subAlertMessage).should("not.visible");
  });

  it("TC3: Single Classifications exists", () => {
    
    let selectedClassifications = [contractDetails.level2];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.selectRadioBtn(performanceReq.envPrepodStage, "Pre-production/Staging");
    const selectedClassLevelsLabel = [
      "Unclassified/IL2"
    ]
    
    const text = "In this section, we’ll collect details about each" +
      " compute instance that you need." +
      " If you need multiple, we’ll walk through them one at a time." +
      " You previously specified " +
      selectedClassLevelsLabel +
      " as the classification level" +
      " for all requirements. If you need any instances within a different level," +
      " update your Classification Requirements. Your period of performance is missing," +
      " so we won’t be able to gather all details for your unique requirements at this time. " +
      "To streamline this process, we recommend revisiting the Contract Details section" +
      " before proceeding."
            
    cy.verifyTextMatches(
      common.introText,
      text
    );
    cy.selectRadioBtn(performanceReq.envPrepodStage, "Pre-production/Staging");
    cy.selectCheckBoxes([performanceReq.eastCheckbox, performanceReq.oconusCheckbox]);
    const decriptionText = randomAlphaNumeric(10)
    cy.enterTextInTextField(performanceReq.anticipatedTextBox1, decriptionText)
    cy.selectRadioBtn(
      performanceReq.durationYesRadioBtn,
      "YES");
    const os = randomAlphaNumeric(15)
    cy.enterTextInTextField(performanceReq.operSysLicenTxtBox, os);
    const cpu = randomNumber(2)
    cy.enterTextInTextField(performanceReq.noOfvCPUTxtBox, cpu);
    const memory = randomNumber(2)
    cy.enterTextInTextField(performanceReq.memoryTextBox, memory);
    cy.verifyStorageTypeListItems(categoryObj)
    cy.textExists(performanceReq.storageTypeGP, "General Purpose SSD").click({ force: true });
    //Storage Amount    
    const storageAmount = randomNumber(3)
    cy.enterTextInTextField(performanceReq.storageAmountTextBox, storageAmount);
    cy.selectRadioBtn(performanceReq.standardRadioBtn, "Standard");
    //click on Continue button,Navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Your compute requirements ");
    cy.verifyColumnHeaders(2, "Type", "Pre-production/Staging");
    cy.verifyColumnHeaders(5, "vCPU", cpu);
    cy.findElement(performanceReq.instanceOneEditBtn).should("exist")
      .and("not.disabled");
    
  });

  it("TC4: Navigation: Click on I don't need compute resources button", () => {
  
    let selectedClassifications = [contractDetails.level4, contractDetails.level6];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.btnClick(performanceReq.dontneedBtn, " I don’t need compute resources ");

    //Navigates to  Your Performance Requirements
    cy.verifyPageHeader("Your Performance Requirements");

    //compute exists in unselected categories list
    cy.findElement("#OtherAvlGroups .h3")
      .each(($el) => {
        const text = $el.text()
        cy.log(text)
      })
      .should("contain", "Compute");
    
  });
  
  it("TC5: Navigation: Click on Back button", () => {
  
    let selectedClassifications = [contractDetails.level5, contractDetails.level6];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.btnClick(common.backBtn, "Back");

    //Navigates to  Your Performance Requirements
    cy.verifyPageHeader("Your Performance Requirements");
    cy.verifyTextMatches(
      performanceReq.categoryNameHeader,
      categoryObj.label);
    cy.textExists(performanceReq.missingInfo, "Missing info").should("exist");
    cy.btnExists(performanceReq.reviewbtn, " Review ").click();
    
  });

  it("TC6: Update Classification Levels", () => {
    
    let selectedClassifications = [contractDetails.level6];
    const selectedClassLevelsLabels = ["Secret / Impact Level 6 (IL6)"]
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.textExists(performanceReq.updateCLLink, "update your Classification Requirements")
      .click()
      .then(() => {
        cy.findElement(performanceReq.updateModal).should("be.visible");
        const modalTitle = "What classification level(s) are" +
          " required for your cloud resources and/or services?"
        cy.verifyTextMatches(
          performanceReq.modaltitle,
          modalTitle);
        const modalMessage = "Changes to the selections below will be" +
          " reflected in the overall Classification Requirements section." +
          " If you select more than one, we will ask you to specify a" +
          " level for each performance requirement."
        cy.verifyTextMatches(
          performanceReq.modalMessage,
          modalMessage);
        cy.verifyCheckBoxLabels(
          performanceReq.modalCheckboxes,
          selectedClassLevelsLabels
        );
        cy.findElement(performanceReq.changeLevelBtn).should("be.disabled");
        cy.selectCheckBoxes([performanceReq.level2, performanceReq.level6])
          .then(() => {
            cy.findElement(performanceReq.changeLevelBtn).should("not.be.disabled")
              .click().then(() => {                
                cy.verifyPageHeader(
                  "Let’s start by gathering your " + categoryObj.label + " requirements"
                );    
              })
          });
        const updatedClassLevelLabel= [
          "Unclassified/IL2"
        ]
        const text = "In this section, we’ll collect details about each compute" +
          " instance that you need." +
          " If you need multiple, we’ll walk through them one at a time." +
          " You previously specified " +
          updatedClassLevelLabel +
          " as the classification level" +
          " for all requirements. If you need any instances within a different level," +
          " update your Classification Requirements. Your period of performance is missing," +
          " so we won’t be able to gather all details for your unique requirements at this time. " +
          "To streamline this process, we recommend revisiting the Contract Details section" +
          " before proceeding."
            
        cy.verifyTextMatches(
          common.introText,
          text
        );
      });
  });
});
