/* eslint-disable cypress/no-unnecessary-waiting */
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


describe.skip("Test suite: No Classification Levels Workflow Scenarios",
  { tags: '@iso-ignore' }, () => {
    let serviceOfferingGroups; 
    let periodCount=2
    beforeEach(() => {
      bootstrapMockApis();

      cy.fixture("serviceOfferingGroups").then((data) => {
        serviceOfferingGroups = data;
      });
    
      cy.launchATAT();
      cy.homePageClickAcquisitionPackBtn();
      cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
      cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");  
    
      //Enter the Value for Base
      cy.findElement(contractDetails.baseInputTxtBox).type("5");
      cy.dropDownClick(contractDetails.baseDropdownIcon);
      cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });
      //click on Add Option year 
      cy.textExists(
        contractDetails.addOptionLink,
        "Add an option period"
      ).click();
      cy.findElement(contractDetails.optionalTextBox).type("4");   
      cy.dropDownClick(contractDetails.optionDropdownIcon);
      cy.findElement(contractDetails.optionDropdownMonth).click({ force: true });
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader("Do you want to request a PoP start date?");
      cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
      cy.verifyPageHeader(" Let’s work on your performance requirements ");   
      cy.textExists(
        performanceReqs.categoryAlertheading,
        "Your  classification requirements are  missing. ");
    });
    const alertTxt = "You can continue to add cloud resources and" +
      " support packages, but we won't be able to gather details about" +
      " your unique requirements until we have this missing info." +
      " We recommend updating your classification requirements in the" +
      " Contract Details section before proceeding."
  
    
    it("TC1: Click on Contract Details Link in Summary page", () => { 
      let periodCount=2
      cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, alertTxt);
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const securityObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "SECURITY" 
      );
    
      const secCheckBoxId = getCheckboxId(securityObj.value);      
      cy.selectServiceOfferingGroup([secCheckBoxId]);    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + securityObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]', securityObj.serviceOfferingCypressLabels);
    
      const labels = getServiceOfferingNames(securityObj);
      const checkboxIds = getCheckboxIds(securityObj); 
      const selectedServiceOffering = [labels[0], labels[1]]    
      cy.selectCheckBoxes([checkboxIds[0],checkboxIds[1]]);
      cy.btnClick(common.continueBtn, " Continue ");   
      //Navigates directly to Summary page.
      cy.verifyPageHeader(
        "Your Performance Requirements"
      );
      cy.textExists(
        performanceReqs.categoryAlertheading,
        "Your  classification requirements are  missing. "
      );
      const alertInfo = "We cannot gather some details about your unique requirements" +
        " at this time." +
      " In order to finalize your performance requirements, you need to tell us about" +
      " your classification requirements in the Contract Details section first."
      cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, alertInfo); 
      cy.verifyTextMatches(performanceReqs.categoryNameHeader, securityObj.label);
      cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
      cy.textExists(performanceReqs.missingInfo, "Missing info").should("exist");
      cy.btnExists(performanceReqs.reviewbtn, " Review ");
      cy.textExists(performanceReqs.otherCategories, "Other available categories");
      cy.notAvailableCategory(securityObj.label);
      cy.textExists(performanceReqs.contractDetailsLink, "Contract Details section").click();
      cy.verifyPageHeader(
        "What classification level(s) will be required for your cloud resources and/or services?"
      );
      const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];  
      cy.selectCheckBoxes([contractDetails.level5]);      
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader(
        "Your Performance Requirements"
      );
      cy.findElement(performanceReqs.categoryAlertInfoTxt).should("not.exist");
      cy.btnExists(performanceReqs.reviewbtn, " Review ").click();
      cy.verifyPageHeader("What type of " + securityObj.label + " do you need?");             
      cy.verifyCheckBoxLabels(
        'input[type=checkbox]:checked',
        selectedServiceOffering
      );
      cy.btnClick(common.continueBtn, " Continue ");
      //Navigates to Gather Requirements screen for selected Offering checkboxIds[0]
      cy.wait(1000);
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[0]
      ); 
      const anticipatedReqText = randomAlphaNumeric(10)
      cy.enterTextInTextField(
        performanceReqs.anticipatedTextBox1,
        anticipatedReqText
      );
      cy.durationPeriodExists(
        performanceReqs.durationYesRadioBtn,
        performanceReqs.duration1ActiveRadioBtn,
        performanceReqs.periodCheckboxLabel1,
        "YES");      
      cy.btnClick(common.continueBtn, " Continue "); 
      //Navigates to gather screen for next offering selected
      cy.wait(1000)
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[1]
      );
      cy.enterTextInTextField(
        performanceReqs.anticipatedTextBox1,
        anticipatedReqText
      );
      cy.durationPeriodExists(
        performanceReqs.durationNoRadioBtn,
        performanceReqs.duration1ActiveRadioBtn,
        performanceReqs.periodCheckboxLabel1,
        "NO");
      cy.periodCount(periodCount, performanceReqs.periodCheckboxRow1);
      cy.btnClick(common.continueBtn, " Continue "); 
      //navigate to Summary page
      cy.wait(1000);
      cy.verifyPageHeader(
        "Your Performance Requirements"
      ); 
      cy.findElement(performanceReqs.missingInfo).should("not.exist");    
    });

    it("TC2: Click on Contract Details Link in Performance Requirement page", () => {   
      cy.textExists(performanceReqs.contractDetailsLink, "Contract Details section").click();
      const selectedClassLevelsLabels = [
        "Unclassified / Impact Level 5 (IL5)",
        "Secret / Impact Level 6 (IL6)"
      ];
      cy.selectCheckBoxes([contractDetails.level5,contractDetails.level6]);     
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
      cy.btnClick(common.continueBtn, " Continue ");    
      cy.verifyPageHeader(" Let’s work on your performance requirements ");
      cy.findElement(performanceReqs.categoryAlertheading).should("not.exist");    
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
      const selectedServiceOffering = [labels[2]]
      cy.selectCheckBoxes([checkboxIds[2]]);
      cy.btnClick(common.continueBtn, " Continue ");
      //Navigates to the Gather your requirement screen
      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + labels[2]
      );     
    
      cy.selectCheckBoxes([contractDetails.level5])
        .then(() => {
          cy.findElement(performanceReqs.offeringDetailform).scrollIntoView().should("be.visible");
        
        });
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
      cy.periodCount(periodCount, performanceReqs.periodCheckboxRow1);
      cy.selectCheckBoxes([performanceReqs.checkBoxBase]);
      cy.btnClick(common.continueBtn, " Continue "); 
      //navigate to Summary page
      cy.verifyPageHeader(
        "Your Performance Requirements"
      ); 
      cy.verifyTextMatches(
        performanceReqs.categoryNameHeader,
        trainingObj.label);
      cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
    
    });
  
  });
