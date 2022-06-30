import { 
  bootstrapMockApis,  
  getCheckboxIds,   
  getServiceOfferingNames,   
  getObjectFromArrayByKey, 
  randomAlphaNumeric
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";

describe("Test suite: Summary screen: Unselected Offerings ", () => {
  let serviceOfferingGroups;
  let summary;

  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
    });
    cy.fixture("summaryToolTip").then((data) => {
      summary = data;
    });
    cy.launchATAT();      
  });
    
  it("TC1: Asserts: Other available Categories", () => {
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");   
    cy.verifyPageHeader(" Let’s work on your performance requirements ");
    cy.btnClick(common.continueBtn, " Continue "); 
    cy.verifyPageHeader(
      "Your Performance Requirements"
    ); 
    
    cy.textExists(performanceReqs.otherCategories, "Other available categories");
    cy.textExists(performanceReqs.showMoreLink, " Show more ").click()
      .then(() => {
        cy.findElement("#OtherAvlGroups .h3")
          .each(listing => {
            const listingCount = Cypress.$(listing).length;
            expect(listing).to.have.length(listingCount);
          });
      
        //verify the  Compute card
        cy.textExists(performanceReqs.computeHeading, "Compute ");
        cy.hoverToolTip(
          performanceReqs.computeTooltipBtn,
          performanceReqs.computeTooltipText,
          summary.computeTooltipText
        );
        cy.textExists(performanceReqs.computeLink, " Add requirements ");

        //verify Dev tools card
        cy.textExists(performanceReqs.devHeading, " Developer Tools and Services ");
        cy.hoverToolTip(
          performanceReqs.devTooltipBtn,
          performanceReqs.devTooltipText,
          summary.devTooltipText
        );
        cy.textExists(performanceReqs.devLink, " Add requirements ");

        //verify Application card
        cy.textExists(performanceReqs.appHeading, " Applications ");
        cy.hoverToolTip(
          performanceReqs.appTooltipBtn,
          performanceReqs.appTooltipText,
          summary.appTooltipText
        );
        cy.textExists(performanceReqs.appLink, " Add requirements ");

        //verify MachineLearning Card
        cy.textExists(performanceReqs.mlHeading, " Machine Learning ");
        cy.hoverToolTip(
          performanceReqs.mlTooltipBtn,
          performanceReqs.mlTooltipText,
          summary.mlTooltipText
        );
        cy.textExists(performanceReqs.mlLink, " Add requirements ");

        //verify Networking Card
        cy.textExists(performanceReqs.netHeading, " Networking ");
        cy.hoverToolTip(
          performanceReqs.netTooltipBtn,
          performanceReqs.netTooltipText,
          summary.netTooltipText
        );
        cy.textExists(performanceReqs.netLink, " Add requirements ");
        // Verify Security Card
        cy.textExists(performanceReqs.secHeading, " Security ");
        cy.hoverToolTip(
          performanceReqs.secTooltipBtn,
          performanceReqs.secTooltipText,
          summary.secTooltipText
        );
        cy.textExists(performanceReqs.secLink, " Add requirements ");

        // Verify Database with Storage Card
        cy.textExists(performanceReqs.dbHeading, " Database with Storage ");
        cy.hoverToolTip(
          performanceReqs.dbTooltipBtn,
          performanceReqs.dbTooltipText,
          summary.dbTooltipText
        );
        cy.textExists(performanceReqs.dbLink, " Add requirements ");

        // Verify Edge Computing and Tactical Edge Card
        cy.textExists(performanceReqs.edHeading, " Edge Computing and Tactical Edge ");
        cy.hoverToolTip(
          performanceReqs.edTooltipBtn,
          performanceReqs.edTooltipText,
          summary.edTooltipText
        );
        cy.textExists(performanceReqs.edLink, " Add requirements ");
        
        //verify IOT card
        cy.textExists(performanceReqs.iotHeading, " Internet of Things ");
        cy.hoverToolTip(
          performanceReqs.iotTooltipBtn,
          performanceReqs.iotTooltipText,
          summary.iotTooltipText
        );
        cy.textExists(performanceReqs.iotLink, " Add requirements ");

        //verify General laas,PaaS and SaaS card
        cy.textExists(performanceReqs.genHeading, " General Iaas, PaaS, and SaaS ");
        cy.hoverToolTip(
          performanceReqs.genTooltipBtn,
          performanceReqs.genTooltipText,
          summary.genTooltipText
        );
        cy.textExists(performanceReqs.genLink, " Add requirements ");

        //verify Advisory and Assistance card
        cy.textExists(performanceReqs.adHeading, " Advisory and Assistance ");
        cy.hoverToolTip(
          performanceReqs.adTooltipBtn,
          performanceReqs.adTooltipText,
          summary.adTooltipText
        );
        cy.textExists(performanceReqs.adLink, " Add requirements ");

        //verify Training card
        cy.textExists(performanceReqs.trainHeading, " Training ");
        cy.hoverToolTip(
          performanceReqs.trainTooltipBtn,
          performanceReqs.trainTooltipText,
          summary.trainTooltipText
        );
        cy.textExists(performanceReqs.trainLink, " Add requirements ");
        

        //wrap up button exists
        cy.btnExists(common.continueBtn, " Wrap up this section ");
      });

  });
  
  it("TC2: Add requirements from  Other available Categories", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order "); 
    const periodCheckboxCount = 1
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    const selectedClassLevelsLabels = ["Unclassified / Impact Level 5 (IL5)"];    
    
    cy.selectCheckBoxes([contractDetails.level5]);    
    
    cy.verifyCheckBoxLabels('input[type=checkbox]:checked', selectedClassLevelsLabels);
    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    const perIntroText = "We need some more details for this section." +
      " You can add info now, or come back to make edits at any time." +
      " When you are ready to wrap up this section," +
      " we will move on to government furnished equipment."
    cy.verifyTextMatches(performanceReqs.introPText, perIntroText);
    cy.textExists(performanceReqs.otherCategories, "Other available categories");
    cy.textExists(performanceReqs.devLink, " Add requirements ").click();
      
    const devObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "DEVELOPERTOOLS"
    );    
    
    const labels = getServiceOfferingNames(devObj);
    const checkboxIds = getCheckboxIds(devObj);
    const selectedServiceOffering = [labels[0]]
    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + devObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('#CheckboxGroup input[type=checkbox]',
      devObj.serviceOfferingCypressLabels);
    cy.selectCheckBoxes([checkboxIds[0]]);
    cy.btnClick(common.continueBtn, " Continue ");  
    
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[0]
    );
    //enter the exist in the text box
    const anticipatedReqText = randomAlphaNumeric(5)
    cy.enterTextInTextField(
      performanceReqs.anticipatedTextBox1,
      anticipatedReqText
    );
    cy.durationPeriodExists(performanceReqs.durationNoRadioBtn,
      performanceReqs.duration1ActiveRadioBtn,
      performanceReqs.periodCheckboxLabel1,
      "NO");
    cy.periodCount(periodCheckboxCount, performanceReqs.periodCheckboxRow1);
    cy.selectCheckBoxes([performanceReqs.checkBoxBase]);    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(
      "Your Performance Requirements"
    );
    cy.verifyTextMatches(
      performanceReqs.categoryNameHeader,
      devObj.label);
    cy.verifyListMatches(performanceReqs.serviceOfferingLabels, selectedServiceOffering);
    cy.btnExists(performanceReqs.devBtn, " View/Edit ");
    //Selected Category shouldn't exist in Other available categories.
    cy.notAvailableCategory(devObj.label);
    cy.btnClick(common.continueBtn, " Wrap up this section ");
    cy.verifyPageHeader(
      " Will government equipment be furnished, provided or acquired under this acquisition? "
    );
    
  });

});
