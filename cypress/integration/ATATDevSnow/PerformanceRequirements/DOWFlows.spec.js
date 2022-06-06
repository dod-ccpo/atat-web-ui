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
    let selectedClassifications = [contractDetails.level5, contractDetails.level4];
    cy.selectCheckBoxes(selectedClassifications);
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
    developertoolsObj.serviceOfferingCypressLabels.forEach((label) => {
      serviceOfferingCheckboxLabels.push(label);
    });

    cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);
    
    const serviceOfferingCheckboxLabelsIds = [];
    developertoolsObj.serviceOfferingCypressLabels.forEach((label) => {
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
    applicationsObj.serviceOfferingCypressLabels.forEach((label) => {
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
    networkingObj.serviceOfferingCypressLabels.forEach((label) => {
      serviceOfferingCheckboxLabels.push(label);
    });
    console.log(serviceOfferingCheckboxLabels);
    cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);
    const serviceOfferingCheckboxLabelsIds = [];
    networkingObj.serviceOfferingCypressLabels.forEach((label) => {
      const textForId = getIdText(label);
      const id = getCheckboxId(textForId);
      serviceOfferingCheckboxLabelsIds.push(id);
    });          
      
  });
  

  it.skip("TC4: Test ALL labels and headers", () => {    

    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    serviceOfferingGroups.forEach((category) => {

      const categoryObj = getObjectFromArrayByKey(
        serviceOfferingGroups, "value", category.value 
      );
      cy.deselectAllCheckboxes();
      const categoryCheckBoxId = getCheckboxId(categoryObj.value);    
      cy.selectServiceOfferingGroup([categoryCheckBoxId]);

      cy.verifyPageHeader("What type of " + categoryObj.label + " do you need?");  
      
      const serviceOfferingCheckboxLabels = [];
      if (
        categoryObj.serviceOfferingCypressLabels 
        && categoryObj.serviceOfferingCypressLabels[0] !== "Other"
      ) {
        categoryObj.serviceOfferingCypressLabels.forEach((label) => {
          serviceOfferingCheckboxLabels.push(label);
        });
        console.log(serviceOfferingCheckboxLabels);
        cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);
        
        const serviceOfferingCheckboxIds = [];
        const labels = categoryObj.serviceOfferingMainLabels 
          ? categoryObj.serviceOfferingMainLabels 
          : categoryObj.serviceOfferingCypressLabels;
        
        labels.forEach((label) => {
          const textForId = getIdText(label);
          const id = getCheckboxId(textForId);
          serviceOfferingCheckboxIds.push(id);
        });
        console.log("serviceOfferingCheckboxIds", serviceOfferingCheckboxIds)
        serviceOfferingCheckboxIds.forEach((checkboxId, index) => {
          if (checkboxId.indexOf("Other") === -1) {
            cy.deselectAllCheckboxes();
            cy.selectCheckBoxes([checkboxId]);
            cy.btnClick(common.continueBtn, " Continue ");   
      
            cy.verifyPageHeader(
              "Next, we’ll gather your requirements for " + labels[index]
            );  
            cy.btnClick(common.backBtn, "Back");   
          }
        });
      }
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000); // needed because with 2 back button clicks, needs a pause for scroll into view
      cy.btnClick(common.backBtn, "Back");   

    });

  });  
  
  it.only("TC4: Test Developer Tools checkboxes and headings", () => {    

    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "DEVELOPERTOOLS" 
    );

    if (categoryObj) {
      cy.DOWVerifyCategory(categoryObj)
      if (
        categoryObj.serviceOfferingCypressLabels 
        && categoryObj.serviceOfferingCypressLabels[0] !== "Other"
      ) {
        cy.DOWVerifyServiceOffering(categoryObj);
      }
    
    }
  });




});
