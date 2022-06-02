import { bootstrapMockApis,cleanText}from "../../../helpers";
import common from "../../../selectors/common.sel"
import performanceReqs from "../../../selectors/performanceReqs.sel";


describe("Test suite: Performace Requirements", () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
  });
    
  it("TC1: Performace Requirements on the Vertical Stepper is active", () => {
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
    const expectedLabels = [
      "Compute",
      "Developer Tools and Services",
      "Applications",
      "Advanced Technology and Algorithmic Techniques (Machine Learning)",
      "Networking",
      "Security",
      "Database with Storage",
      "Edge Computing and Tactical Edge (TE)",
      "Internet of Things (IoT)",
      "General Iaas, PaaS, and SaaS Including third party marketplace and any other XaaS" +
      " resources not covered in the categories above",
      "None of these apply to my acquisition.",
      "Advisory and Assistance",
      "Training",
      "None of these apply to my acquisition.",
      
    ]
    cy.verifyCheckBoxLabel('input[type=checkbox]', expectedLabels);
    cy.selectCheckBoxes(performanceReqs.appCheckBox,performanceReqs.networkCheckBox);
    
    cy.btnClick(common.continueBtn, " Continue ");   
    
    
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
