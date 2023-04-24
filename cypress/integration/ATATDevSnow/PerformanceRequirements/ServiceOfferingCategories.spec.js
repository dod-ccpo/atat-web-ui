import { 
  bootstrapMockApis, 
  cleanText,
  getCheckboxIds,   
  getServiceOfferingNames,
  getCheckboxId, 
  getObjectFromArrayByKey 
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";
import performanceReqs from "../../../selectors/performanceReqs.sel";


describe.skip("Test suite: Performance Requirements: Categories",{ tags: '@iso-ignore' },  () => {
  let serviceOfferingGroups;

  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
    });

    cy.launchATAT();
    cy.homePageClickAcquisitionPackBtn();
  });
    
  it("TC1: Performance Requirements on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
    cy.activeStep(common.stepPerformanceReqText);
      
  });
  
  it("TC2: Asserts: Let’s work on your performance requirements", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    let selectedClassifications = [contractDetails.level5, contractDetails.level4];
    cy.selectCheckBoxes(selectedClassifications);
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");
    const expectedintroText = "Through JWCC, you have the ability to procure" +
      " many offerings for Anything as a Service (XaaS) and Cloud Support Packages." +
      " Specify any categories that may apply to your acquisition below, and we’ll" +
      " walk through each selection to get more details next. Learn more about categories."
    cy.findElement(performanceReqs.introPText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedintroText);
    });
    cy.textExists(performanceReqs.learnMoreLink, " Learn more about categories. ");
    cy.textExists(
      performanceReqs.xaasLabelText,
      "What type of XaaS resources, tools and services do you need?"
    );
    cy.textExists(
      performanceReqs.cloudSupportLabelText,
      " What type(s) of cloud support packages do you need? "
    );

    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const applicationsObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "APPLICATIONS" 
    );
    const networkingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "NETWORKING" 
    );
    const appCheckBoxId = getCheckboxId(applicationsObj.value);
    const networkCheckboxId = getCheckboxId(networkingObj.value);
    
    cy.selectServiceOfferingGroup([appCheckBoxId, networkCheckboxId]);    
    //Navigates to the next page
    cy.verifyPageHeader("What type of " + applicationsObj.label + " do you need?");             
    cy.verifyCheckBoxLabels('input[type=checkbox]', applicationsObj.serviceOfferingCypressLabels);
    
    const labels = getServiceOfferingNames(applicationsObj);
    const checkboxIds = getCheckboxIds(applicationsObj);
    
    cy.selectCheckBoxes([checkboxIds[1]]);
    cy.btnClick(common.continueBtn, " Continue ");   
    //Navigates to the Gather your requirement screen
    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + labels[1]
    );     
    
  });

  
  it("TC3: Validations", () => {
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
    cy.verifyPageHeader(" Let’s work on your performance requirements ");   
    cy.verifyRequiredCheckbox(
      performanceReqs.appCheckBox,
      performanceReqs.xassCheckbBoxError,
      "Please select at least one option."
    );
    cy.verifyRequiredCheckbox(
      performanceReqs.trainingCheckBox,
      performanceReqs.cloudSupportCheckboxError,
      "Please select at least one option."
    );
    
  });
});
