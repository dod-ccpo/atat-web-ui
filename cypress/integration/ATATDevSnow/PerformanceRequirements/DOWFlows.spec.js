import { 
  bootstrapMockApis,   
  getObjectFromArrayByKey 
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contractDetails from "../../../selectors/contractDetails.sel";

describe.skip("Test suite: DOW Workflows for each Category option", { tags: '@iso-ignore' }, () => {

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
    cy.dropDownClick(contractDetails.baseDropdownIcon);
    cy.findElement(contractDetails.baseDropdownMonth).click({ force: true });
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

      
  it("TC1: Developer Tools checkboxes and headings", () => {

    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "DEVELOPERTOOLS"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj)
      if (
        categoryObj.serviceOfferingCypressLabels
        && categoryObj.serviceOfferingCypressLabels[0] !== "Other"
      ) {
        cy.verifyServiceOfferingsForCategory(categoryObj);        
      }
    
    }
  });

  it("TC2: Applications checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "APPLICATIONS"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }
  });
  
  it("TC3: Networking checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "NETWORKING"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj)
      if (
        categoryObj.serviceOfferingCypressLabels
        && categoryObj.serviceOfferingCypressLabels[0] !== "Other"
      ) {
        cy.verifyServiceOfferingsForCategory(categoryObj);
      }
    
    }
  });
  it("TC4: Security checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "SECURITY"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });

  it("TC5: Machine Learning checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "MACHINELEARNING"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });

  it("TC6: Database with Storage checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "DATABASE"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });

  it("TC7: Edge Computing and Tactical Edge(TE) checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "EDGECOMPUTING"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });

  it("TC8: Internet of Things (IoT) checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "IOT"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });
  
  it("TC9: Advisory and Assistance checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "ADVISORY"
    );

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });

  it("TC10: Training checkboxes and headings", () => {
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels('input[type=checkbox]', categoryLabels);

    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups, "value", "TRAINING"
    );    

    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);      
      cy.verifyServiceOfferingsForCategory(categoryObj);    
    }

  });

});
