import { 
  bootstrapMockApis, 
  getCheckboxIds,   
  getServiceOfferingNames,
  getCheckboxId, 
  getObjectFromArrayByKey 
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";


describe.skip("Test suite: No PoP and Classification Levels exists workflows ", 
  { tags: '@iso-ignore' }, 
  () => {
    let serviceOfferingGroups;
    const prAlertInfoMessage = "You can continue to add cloud resources" +
      " and support packages, but we won't be able to gather details" +
      " about your unique requirements until we have this missing info." +
      " We recommend revisiting the Contract Details section before proceeding.";
    let summaryAlertInfo = "We cannot gather some details about your unique" +
      " requirements at this time. In order to finalize your" +
      " performance requirements, you need to tell us about your" +
      " PoP and classification requirements in the Contract Details section first."
    beforeEach(() => {
      bootstrapMockApis();

      cy.fixture("serviceOfferingGroups").then((data) => {
        serviceOfferingGroups = data;
      });
      cy.launchATAT();
      cy.homePageClickAcquisitionPackBtn();
      cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
      cy.verifyPageHeader(" Let’s work on your performance requirements ");         
      cy.textExists(
        performanceReqs.categoryAlertheading,
        "Your  period of performance and classification requirements are  missing. "
      );
      cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, prAlertInfoMessage); 
      cy.textExists(performanceReqs.contractDetailsLink, "revisiting the Contract Details section");
    });  
  
    it("TC1: Navigation to summary without PoP and Classification levels ", () => {
    
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const edgeObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "EDGECOMPUTING" 
      );
      const labels = getServiceOfferingNames(edgeObj);
      const edgeCheckBoxId = getCheckboxId(edgeObj.value);
      const selectedServiceOfferings = [labels[0], labels[1]]  
      cy.selectServiceOfferingGroup([edgeCheckBoxId]);    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + edgeObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]',edgeObj.serviceOfferingCypressLabels);    
      const checkboxIds = getCheckboxIds(edgeObj);
    
      cy.selectCheckBoxes([checkboxIds[0],checkboxIds[1]]);
      cy.btnClick(common.continueBtn, " Continue ");   
      //Navigates directly to Summary page.
      cy.verifyPageHeader(
        "Your Performance Requirements"
      );
    
      cy.textExists(
        performanceReqs.categoryAlertheading,
        "Your  period of performance and classification requirements are  missing. "
      );
      cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, summaryAlertInfo);
      cy.verifyTextMatches(performanceReqs.categoryNameHeader, edgeObj.label);
      cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOfferings);
      cy.textExists(performanceReqs.missingInfo, "Missing info").should("exist");
      cy.btnExists(performanceReqs.reviewbtn, " Review ");
      cy.textExists(performanceReqs.otherCategories, "Other available categories");
      cy.notAvailableCategory(edgeObj.label);
      cy.textExists(performanceReqs.contractDetailsLink, "Contract Details section").click();
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
      const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];  
      cy.selectCheckBoxes([contractDetails.level5]);      
      cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
      cy.btnClick(common.continueBtn, " Continue ");
      cy.verifyPageHeader(
        "Your Performance Requirements"
      );
      cy.findElement(performanceReqs.categoryAlertheading).should("not.exist");

    });

    it("TC2: Navigate to next Step6 in the middle of Workflow ", () => {
    
      const expectedLabels = [];
      serviceOfferingGroups.forEach((obj) => {
        expectedLabels.push(obj.label);
      });    
      cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

      const adObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", "ADVISORY" 
      );
      const adCheckBoxId = getCheckboxId(adObj.value);    
      cy.selectServiceOfferingGroup([adCheckBoxId]);    
      //Navigates to the next page
      cy.verifyPageHeader("What type of " + adObj.label + " do you need?");             
      cy.verifyCheckBoxLabels('input[type=checkbox]',adObj.serviceOfferingCypressLabels);    
      cy.clickSideStepper(common.stepGovFurEquipLink, " Government Furnished Equipment ");
      cy.verifyPageHeader(
        " Will government equipment be furnished, provided or acquired under this acquisition? "
      );
      cy.btnClick(common.backBtn, "Back");   
      //Navigates directly to Summary page.
      cy.verifyPageHeader(
        "Your Performance Requirements"
      );    
      cy.textExists(
        performanceReqs.categoryAlertheading,
        "Your  period of performance and classification requirements are  missing. "
      );
      cy.verifyTextMatches(performanceReqs.categoryAlertInfoTxt, summaryAlertInfo);
      cy.verifyTextMatches(performanceReqs.categoryNameHeader, adObj.label);
      cy.findElement(performanceReqs.serviceOfferingLabels).should("not.to.be.visible");
      cy.textExists(performanceReqs.missingInfo, "Missing info").should("exist");
      cy.btnExists(performanceReqs.reviewbtn, " Review ");
      cy.textExists(performanceReqs.otherCategories, "Other available categories");
      cy.notAvailableCategory(adObj.label);
      cy.findElement(common.footerLinks).scrollIntoView();    
      cy.btnClick(common.backBtn, "Back to Contract Details");
      cy.verifyPageHeader("Let’s gather some details about the duration of your task order");
    
    });  
  
  });
