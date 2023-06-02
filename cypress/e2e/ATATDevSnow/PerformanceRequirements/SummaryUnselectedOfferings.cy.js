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

describe.skip("Test suite: Summary screen: Unselected Offerings ",{ tags: '@iso-ignore' },  () => {
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
    cy.homePageClickAcquisitionPackBtn();
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
      
        const otherCategories = [
          {
            headingSelector: performanceReqs.computeHeading,
            headingText: "Compute ",
            tooltipButtonSelector: performanceReqs.computeTooltipBtn,
            tooltipTextSelector: performanceReqs.computeTooltipText,
            tooltipText: summary.computeTooltipText,
            linkSelector: performanceReqs.computeLink,
          },
          {
            headingSelector: performanceReqs.devHeading,
            headingText: " Developer Tools and Services ",
            tooltipButtonSelector: performanceReqs.devTooltipBtn,
            tooltipTextSelector: performanceReqs.devTooltipText,
            tooltipText: summary.devTooltipText,
            linkSelector: performanceReqs.devLink,
          },
          {
            headingSelector: performanceReqs.appHeading,
            headingText: " Applications ",
            tooltipButtonSelector: performanceReqs.appTooltipBtn,
            tooltipTextSelector: performanceReqs.appTooltipText,
            tooltipText: summary.appTooltipText,
            linkSelector: performanceReqs.appLink,
          },
          {
            headingSelector: performanceReqs.mlHeading,
            headingText: " Machine Learning ",
            tooltipButtonSelector: performanceReqs.mlTooltipBtn,
            tooltipTextSelector: performanceReqs.mlTooltipText,
            tooltipText: summary.mlTooltipText,
            linkSelector: performanceReqs.mlLink,
          },
          {
            headingSelector: performanceReqs.netHeading,
            headingText: " Networking ",
            tooltipButtonSelector: performanceReqs.netTooltipBtn,
            tooltipTextSelector: performanceReqs.netTooltipText,
            tooltipText: summary.netTooltipText,
            linkSelector: performanceReqs.netLink,
          },
          {
            headingSelector: performanceReqs.secHeading,
            headingText: " Security ",
            tooltipButtonSelector: performanceReqs.secTooltipBtn,
            tooltipTextSelector: performanceReqs.secTooltipText,
            tooltipText: summary.secTooltipText,
            linkSelector: performanceReqs.secLink,
          },
          {
            headingSelector: performanceReqs.dbHeading,
            headingText: " Database with Storage ",
            tooltipButtonSelector: performanceReqs.dbTooltipBtn,
            tooltipTextSelector: performanceReqs.dbTooltipText,
            tooltipText: summary.dbTooltipText,
            linkSelector: performanceReqs.dbLink,
          },
          {
            headingSelector: performanceReqs.edHeading,
            headingText: " Edge Computing and Tactical Edge ",
            tooltipButtonSelector: performanceReqs.edTooltipBtn,
            tooltipTextSelector: performanceReqs.edTooltipText,
            tooltipText: summary.edTooltipText,
            linkSelector: performanceReqs.edLink,
          },
          {
            headingSelector: performanceReqs.iotHeading,
            headingText: " Internet of Things ",
            tooltipButtonSelector: performanceReqs.iotTooltipBtn,
            tooltipTextSelector: performanceReqs.iotTooltipText,
            tooltipText: summary.iotTooltipText,
            linkSelector: performanceReqs.iotLink,
          },
          {
            headingSelector: performanceReqs.genHeading,
            headingText: " General Iaas, PaaS, and SaaS ",
            tooltipButtonSelector: performanceReqs.genTooltipBtn,
            tooltipTextSelector: performanceReqs.genTooltipText,
            tooltipText: summary.genTooltipText,
            linkSelector: performanceReqs.genLink,
          },
          {
            headingSelector: performanceReqs.adHeading,
            headingText: " Advisory and Assistance ",
            tooltipButtonSelector: performanceReqs.adTooltipBtn,
            tooltipTextSelector: performanceReqs.adTooltipText,
            tooltipText: summary.adTooltipText,
            linkSelector: performanceReqs.adLink,
          },
          {
            headingSelector: performanceReqs.trainHeading,
            headingText: " Training ",
            tooltipButtonSelector: performanceReqs.trainTooltipBtn,
            tooltipTextSelector: performanceReqs.trainTooltipText,
            tooltipText: summary.trainTooltipText,
            linkSelector: performanceReqs.trainLink,
          },
        ]
        
        cy.verifyOtherServiceOfferings(otherCategories);

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
