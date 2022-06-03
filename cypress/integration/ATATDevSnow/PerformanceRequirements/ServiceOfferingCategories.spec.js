import { 
  bootstrapMockApis, 
  cleanText,
  getCheckboxId, 
  getIdText,
  getObjectFromArrayByKey 
} from "../../../helpers";
import common from "../../../selectors/common.sel"
import performanceReqs from "../../../selectors/performanceReqs.sel";


describe("Test suite: Performance Requirements", () => {
  let serviceOfferingGroups;

  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
    });

    cy.launchATAT();
  });
    
  it("TC1: Performance Requirements on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
    cy.activeStep(common.stepPerformanceReqText);
      
  });
  
  it("TC2: Asserts: Let’s work on your performance requirements", () => {
    cy.clickSideStepper(common.stepPerformanceReqText, " Performance Requirements ");
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
    console.log(expectedLabels)
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
    
    const serviceOfferingCheckboxLabels = [];
    applicationsObj.serviceOfferings.forEach((label) => {
      serviceOfferingCheckboxLabels.push(label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);

    const serviceOfferingCheckboxLabelsIds = [];
    applicationsObj.serviceOfferings.forEach((label) => {
      const textForId = getIdText(label);
      const id = getCheckboxId(textForId);
      serviceOfferingCheckboxLabelsIds.push(id);
    });
    
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
