import { 
  bootstrapMockApis,  
  getCheckboxIds,   
  getServiceOfferingNames,
  getCheckboxId, 
  getObjectFromArrayByKey, 
  randomAlphaNumeric
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";


describe.skip("Test suite: No PoP Workflow Scenarios ", { tags: '@iso-ignore' },  () => {
  let serviceOfferingGroups;   

  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
    });
    
    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order "); 
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
  });
    
  it("TC1: Click on PoP link in GatherRequirement page", () => {    
    
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 5 (IL5)",
      "Secret / Impact Level 6 (IL6)"     
    ];    
    
    cy.selectCheckBoxes([contractDetails.level5,contractDetails.level6]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");         
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  period of performance is  missing. "
    );
    const alertInfo = "You can continue to add cloud resources" +
      " and support packages, but we won't be able to gather details" +
      " about your unique requirements until we have this missing info." +
      " We recommend updating your PoP in the Contract Details" +
      " section before proceeding.";
    cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, alertInfo); 
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const networkObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "NETWORKING" 
    );
    
    const networkCheckBoxId = getCheckboxId(networkObj.value);    
    cy.selectServiceOfferingGroup([networkCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + networkObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',networkObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(networkObj);
    const checkboxIds = getCheckboxIds(networkObj);
    
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );
    const selectedClassBox = ["Unclassified/IL5 instance"]
    cy.selectCheckBoxes([contractDetails.level5])
      .then(() => {
        cy.findElement(performanceReqs.offeringDetailform).scrollIntoView().should("be.visible");
        
      });
    cy.verifyTextMatches(
      performanceReqs.requirmentHeading1,
      "1. Tell us about the "  + selectedClassBox);

    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(10)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.findElement(performanceReqs.baseCheckbox1Disabled).should("exist")
      .and("be.disabled");
    cy.findElement(performanceReqs.alertPeriod1Text).should("be.visible");
    const alertText = "Your period of performance details are missing." +
      " To select specific base or option periods for this requirement," +
      " revisit the Contract Details section"
    cy.verifyTextMatches(performanceReqs.alertPeriod1Text,
      alertText);
      
    cy.textExists(performanceReqs.contractDtailsLink, "revisit the Contract Details section ")
      .click();
    cy.verifyPageHeader("Let’s gather some details about the duration of your task order");
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({force: true});
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click({ force: true });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Will this be a future recurring requirement? ");
    cy.radioBtn(contractDetails.yesRadioOption,  "YES").not("[disabled]").click({force: true});
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader( " Which contract type(s) apply to this acquisition? ");
    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP").should("not.be.checked")
      .check({ force: true });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      " What classification level(s) will be required for your cloud resources and/or services? "
    );
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.btnExists(common.backBtn, "Back to Contract Details");
  });

  it("TC2: Click on PoP link in Performance Requirement page", () => {
  
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 4 (IL4)",      
    ];    
    
    cy.selectCheckBoxes([contractDetails.level4]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");         
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  period of performance is  missing. "
    );
    
    cy.textExists(performanceReqs.contractDetailsLink, "Contract Details section").click();
    cy.verifyPageHeader("Let’s gather some details about the duration of your task order");
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({force: true});
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const trainingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "TRAINING" 
    );
    
    const trainCheckBoxId = getCheckboxId(trainingObj.value);    
    cy.selectServiceOfferingGroup([trainCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + trainingObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',trainingObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(trainingObj);
    const checkboxIds = getCheckboxIds(trainingObj);
    const selectedServiceOffering = [labels[0]]
    cy.selectCheckBoxes([checkboxIds[0]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[0]
    );     

    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric()
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.findElement(performanceReqs.checkBoxBase).should("exist")
      .and("not.be.disabled");
    cy.selectCheckBoxes([performanceReqs.checkBoxBase]);    
    cy.btnClick(common.continueBtn, " Continue "); 
    //navigate to Summary page
    cy.verifyPageHeader(
      "Your Performance Requirements"
    ); 
    cy.findElement(performanceReqs.missingInfo).should("not.exist"); 
    cy.verifyTextMatches(
      performanceReqs.categoryNameHeader,
      trainingObj.label);
    cy.notAvailableCategory(trainingObj.label);
    cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
  });

  it("TC3: Click on PoP link in Summary page", () => {
    
    const selectedClassLevelsLabels = [
      "Unclassified / Impact Level 2 (IL2)",      
    ];    
    
    cy.selectCheckBoxes([contractDetails.level2]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");         
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  period of performance is  missing. "
    );
    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const iotObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "IOT"
    );
    
    const iotCheckBoxId = getCheckboxId(iotObj.value);    
    cy.selectServiceOfferingGroup([iotCheckBoxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + iotObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]',iotObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(iotObj);
    const checkboxIds = getCheckboxIds(iotObj);
    const selectedServiceOffering = [labels[1]]
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );     

    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric()
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.findElement(performanceReqs.baseCheckbox1Disabled).should("exist")
      .and("be.disabled");
    cy.findElement(performanceReqs.alertPeriod1Text).should("be.visible");
    const alertText = "Your period of performance details are missing." +
      " To select specific base or option periods for this requirement," +
      " revisit the Contract Details section"
    cy.verifyTextMatches(performanceReqs.alertPeriod1Text,
      alertText);
      
    cy.textExists(performanceReqs.contractDtailsLink, "revisit the Contract Details section ");
    cy.btnClick(common.continueBtn, " Continue "); 
    //navigate to Summary page
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );   
    cy.textExists(
      performanceReqs.categoryAlertheading,
      "Your  period of performance is  missing. "
    );
    const alertInfo = "We cannot gather some details about your" +
      " unique requirements at this time." +
      " In order to finalize your performance requirements," +
      " you need to tell us about your PoP in the Contract Details section first."
    cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, alertInfo);    
    cy.textExists(performanceReqs.missingInfo, "Missing info").should("exist");
    cy.textExists(performanceReqs.contractDetailsLink, "Contract Details section").click();
    cy.verifyPageHeader("Let’s gather some details about the duration of your task order");
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({force: true});
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.findElement(performanceReqs.categoryAlertheading).should("not.exist");
    cy.verifyTextMatches(
      performanceReqs.categoryNameHeader,
      iotObj.label);
    cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
    cy.notAvailableCategory(iotObj.label);
  });

    

});
