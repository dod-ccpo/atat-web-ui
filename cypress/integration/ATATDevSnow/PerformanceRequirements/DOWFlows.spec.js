import { 
  bootstrapMockApis, 
  getCheckboxId, 
  getIdText,
  getObjectFromArrayByKey 
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";

describe("Test suite: DOW Workflows for each option", () => {

  let serviceOfferingGroups;

  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("serviceOfferingGroups").then((data) => {
      serviceOfferingGroups = data;
    });   

    cy.launchATAT();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(" Let’s gather some details about the duration of your task order ");
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({force: true});
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader("Do you want to request a PoP start date?");
    cy.textExists(common.subStepClassReqsLink, " Classification Requirements ").click();
    cy.selectCheckBoxes([contractDetails.level5, contractDetails.level4]);
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.verifyPageHeader(" Let’s work on your performance requirements ");

  });

      
  it("TC1: Developer Tools and Services", () => {    

    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });
    
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const developertoolsObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "DEVELOPERTOOLS" 
    );
    
    const devCheckBoxId = getCheckboxId(developertoolsObj.value);    
    cy.selectServiceOfferingGroup([devCheckBoxId]);
    cy.verifyPageHeader("What type of " + developertoolsObj.label + " do you need?");  
    
    const serviceOfferingCheckboxLabels = [];
    developertoolsObj.serviceOfferings.forEach((label) => {
      serviceOfferingCheckboxLabels.push(label);
    });
    console.log(serviceOfferingCheckboxLabels);
    cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);
    
    const serviceOfferingCheckboxLabelsIds = [];
    developertoolsObj.serviceOfferings.forEach((label) => {
      const textForId = getIdText(label);
      const id = getCheckboxId(textForId);
      serviceOfferingCheckboxLabelsIds.push(id);
    });
    
    cy.selectCheckBoxes([serviceOfferingCheckboxLabelsIds[2], serviceOfferingCheckboxLabelsIds[4]]);
    cy.btnClick(common.continueBtn, " Continue ");   
    console.log(serviceOfferingCheckboxLabelsIds[2].label)

    cy.verifyPageHeader(
      "Next, we’ll gather your requirements for " + serviceOfferingCheckboxLabels[2]
    );  
  });

  it("TC2: Applications", () => {  

    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });
    console.log(expectedLabels)
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);

    const applicationsObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "APPLICATIONS" 
    );    
    const appCheckBoxId = getCheckboxId(applicationsObj.value);    
    cy.selectServiceOfferingGroup([appCheckBoxId]);     

    cy.verifyPageHeader("What type of " + applicationsObj.label + " do you need?"); 
    
    const serviceOfferingCheckboxLabels = [];
    applicationsObj.serviceOfferings.forEach((label) => {
      serviceOfferingCheckboxLabels.push(label);
    });
    console.log(serviceOfferingCheckboxLabels);
    cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);
            
      
  });
  it("TC3: Networking", () => {  

    const expectedLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      expectedLabels.push(obj.label);
    });
    console.log(expectedLabels)
    cy.verifyCheckBoxLabels('input[type=checkbox]', expectedLabels);
    const networkingObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "NETWORKING" 
    );
        
    const networkCheckboxId = getCheckboxId(networkingObj.value);    
    cy.selectServiceOfferingGroup([networkCheckboxId]);     

    cy.verifyPageHeader("What type of " + networkingObj.label + " do you need?"); 
    
    const serviceOfferingCheckboxLabels = [];
    networkingObj.serviceOfferings.forEach((label) => {
      serviceOfferingCheckboxLabels.push(label);
    });
    console.log(serviceOfferingCheckboxLabels);
    cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);
    const serviceOfferingCheckboxLabelsIds = [];
    networkingObj.serviceOfferings.forEach((label) => {
      const textForId = getIdText(label);
      const id = getCheckboxId(textForId);
      serviceOfferingCheckboxLabelsIds.push(id);
    });          
      
  });
  
});
