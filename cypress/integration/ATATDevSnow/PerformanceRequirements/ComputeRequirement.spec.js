import { 
  bootstrapMockApis,   
  randomAlphaNumeric,
  randomNumber,
  getObjectFromArrayByKey  
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReq from "../../../selectors/performanceReqs.sel";

describe.skip("Test suite: Compute Requirements", () => {

  let serviceOfferingGroups;
  
  let categoryObj;
  
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
      categoryObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "COMPUTE"
      );
    });     
    
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("11");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();    

  });

  it("TC1:Edit Location for Instance#1", () => {
    
    let selectedClassifications = [contractDetails.level2, contractDetails.level4];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.selectRadioBtn(performanceReq.envPrepodStage, "Pre-production/Staging");
    cy.findElement(performanceReq.classLevelLabel).scrollIntoView();
    cy.findElement(performanceReq.classIL4RadioBtn)
      .click({ force: true });
    cy.selectCheckBoxes([performanceReq.westCheckbox, performanceReq.centralCheckBox]);
    const selectedRegions = "CONUS West" + "," + " CONUS Central"
    const decriptionText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox1,
      decriptionText
    )
    cy.selectRadioBtn(
      performanceReq.durationYesRadioBtn,
      "YES");
    
    const os = randomAlphaNumeric(11)
    cy.enterTextInTextField(performanceReq.operSysLicenTxtBox, os);

    //Number of vCPUs
    const cpu = randomNumber(2)
    cy.enterTextInTextField(performanceReq.noOfvCPUTxtBox, cpu);

    //Memory    
    const memory = randomNumber(2)
    cy.enterTextInTextField(performanceReq.memoryTextBox, memory);
  
    //Storage Type
    cy.verifyStorageTypeListItems(categoryObj);
    cy.textExists(performanceReq.storageTypeNearline, "Nearline").click({ force: true });
      
    //Storage Amount   
    const storageAmount = randomNumber(2)
    cy.enterTextInTextField(performanceReq.storageAmountTextBox, storageAmount);
  
    cy.selectRadioBtn(performanceReq.basicRadioBtn, "Basic");
    
    //click on Continue button navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Your compute requirements ");
    cy.verifyColumnHeaders(2, "Type", "Pre-production/Staging");
    cy.verifyColumnHeaders(3, "Location", selectedRegions);
    cy.verifyColumnHeaders(4, "Classification", "Unclassified/IL4");
    cy.verifyColumnHeaders(5, "Quantity", "1");
    cy.verifyColumnHeaders(6, "vCPU", cpu);
    cy.verifyColumnHeaders(7, "Memory", memory + " GB");
    cy.verifyColumnHeaders(8, "Storage", storageAmount + " GB");
    cy.verifyColumnHeaders(9, "Performance", "Basic")
    //click on Edit Icon
    cy.findElement(performanceReq.instanceOneEditBtn).click();
    
    //navigates to Let’s gather some details for Compute Instance #1
    cy.verifyPageHeader("Let’s gather some details for Compute Instance #1");
    cy.selectCheckBoxes([performanceReq.eastCheckbox, performanceReq.oconusCheckbox]);
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Your compute requirements ");
    //editted regions is updated in the table
    const updatedRegions = "CONUS West," + " CONUS Central," + " CONUS East," + " OCONUS"
    cy.verifyColumnHeaders(3, "Location", updatedRegions);
  });
  
  it("TC2: Add New Instance Type & Delete", () => {
    const periodCheckboxCount = 1
    let selectedClassifications = [contractDetails.level6];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.selectRadioBtn(performanceReq.envDevTesting, "Dev/Testing");        
    cy.selectCheckBoxes([performanceReq.eastCheckbox, performanceReq.oconusCheckbox]);        
    const decriptionText = randomAlphaNumeric(12)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox1,
      decriptionText
    )
    cy.selectRadioBtn(
      performanceReq.durationYesRadioBtn,
      "YES");    
    
    const os = randomAlphaNumeric(8)
    cy.enterTextInTextField(performanceReq.operSysLicenTxtBox, os);

    //Number of vCPUs
    const cpu = randomNumber(2)
    cy.enterTextInTextField(performanceReq.noOfvCPUTxtBox, cpu);

    //Memory    
    const memory = randomNumber(2)
    cy.enterTextInTextField(performanceReq.memoryTextBox, memory);
  
    //Storage Type
    cy.verifyStorageTypeListItems(categoryObj);
    cy.textExists(performanceReq.storageTypeOffline,"Offline").click({ force: true });
      
    //Storage Amount   
    const storageAmount = randomNumber(3)
    cy.enterTextInTextField(performanceReq.storageAmountTextBox, storageAmount);
  
    cy.selectRadioBtn(performanceReq.basicRadioBtn, "Basic");    
    
    //click on Continue button navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Your compute requirements ");
    cy.verifyColumnHeaders(2, "Type", "Dev/Testing");
    
    //click on Add another instance    
    cy.findElement(performanceReq.addAnotherInstance).click();

    //navigates to Let’s gather some details for Compute Instance #2
    cy.selectRadioBtn(performanceReq.envPrepodStage, "Pre-production/Staging");        
    cy.selectCheckBoxes([performanceReq.centralCheckBox]);
    const decriptionTextInsTwo = randomAlphaNumeric(12)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox1,
      decriptionTextInsTwo
    )
    cy.durationPeriodExists(
      performanceReq.durationNoRadioBtn,
      performanceReq.entireDurationActiveBtn,
      performanceReq.baseCheckbox,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReq.baseCheckbox);
    
    const osInsTwo = randomAlphaNumeric(11)
    cy.enterTextInTextField(performanceReq.operSysLicenTxtBox, osInsTwo);

    //Number of vCPUs
    const cpuInsTwo = randomNumber(3)
    cy.enterTextInTextField(performanceReq.noOfvCPUTxtBox, cpuInsTwo);

    //Memory    
    const memoryInsTwo = randomNumber(3)
    cy.enterTextInTextField(performanceReq.memoryTextBox, memoryInsTwo);
  
    //Storage Type
    cy.verifyStorageTypeListItems(categoryObj);
    cy.textExists(performanceReq.storageTypeOffline, "Offline").click({ force: true });
      
    //Storage Amount   
    const storageAmountInsTwo = randomNumber(3)
    cy.enterTextInTextField(performanceReq.storageAmountTextBox, storageAmountInsTwo);    
    
    //click on Continue button navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Your compute requirements ");
    cy.verifyColumnHeaders(
      2,
      "Type",
      "Dev/Testing" + "Pre-production/Staging" + "Missing info"
    );
    //delete the missing info instance Type
    cy.findElement(performanceReq.instanceTwoDeleteBtn).click()
      .then(() => {
        cy.findElement(performanceReq.dialogModal).should("exist");
        cy.textExists(performanceReq.dialogTitle, ' Delete instance #2? ');
        cy.btnExists(performanceReq.deleteInstBtn, " Delete instance ").click()
          .then(() => {
            cy.findElement(performanceReq.dialogModal).should("not.visible");
            cy.findElement(performanceReq.instanceTwoDeleteBtn).should("not.exist");
          });
        
      });
  });
  
  it("TC3: Complete missing details for Instance#1", () => {
    const periodCount = 1
    let selectedClassifications = [contractDetails.level2,contractDetails.level5];
    cy.selectCheckBoxes(selectedClassifications);
    cy.selectComputeOption(categoryObj, serviceOfferingGroups);
    cy.selectRadioBtn(performanceReq.envProd, "Production");   
    cy.findElement(performanceReq.classIL2RadioBtn)
      .scrollIntoView()
      .click({ force: true });
    cy.selectCheckBoxes([performanceReq.oconusCheckbox]);     
    const operSys = randomAlphaNumeric(5)
    cy.enterTextInTextField(performanceReq.operSysLicenTxtBox, operSys);

    //Number of vCPUs
    const cpuValue = randomNumber(3)
    cy.enterTextInTextField(performanceReq.noOfvCPUTxtBox, cpuValue);

    //Memory    
    const memoryValue = randomNumber(3)
    cy.enterTextInTextField(performanceReq.memoryTextBox, memoryValue);
  
    //Storage Type
    cy.verifyStorageTypeListItems(categoryObj);
    cy.textExists(performanceReq.storageTypeNearline,"Nearline").click({ force: true });
      
    //Storage Amount   
    const storageAmount = randomNumber(3)
    cy.enterTextInTextField(performanceReq.storageAmountTextBox, storageAmount);
  
    cy.selectRadioBtn(performanceReq.basicRadioBtn, "Basic");
    
    
    //click on Continue button navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");   
    cy.verifyPageHeader(" Your compute requirements ");
    cy.verifyColumnHeaders(2, "Type", "Production"+ "Missing info");
    
    //click on Edit Icon
    cy.findElement(performanceReq.instanceOneEditBtn).click();    
    
    //navigates to Let’s gather some details for Compute Instance #1
    cy.verifyPageHeader("Let’s gather some details for Compute Instance #1");
    
    const decriptionTextIns = randomAlphaNumeric(12)
    cy.enterTextInTextField(
      performanceReq.anticipatedTextBox1,
      decriptionTextIns
    )
    cy.durationPeriodExists(
      performanceReq.durationNoRadioBtn,
      performanceReq.entireDurationActiveBtn,
      performanceReq.baseCheckbox,
      "NO");
    cy.periodCount(periodCount, performanceReq.baseCheckbox);
    
    //click on Continue button navigates to next screen
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Your compute requirements ");
    
    //No missing icon next to instance type
    cy.verifyColumnHeaders(
      2,
      "Type",
      "Production" 
    );
  });
});
