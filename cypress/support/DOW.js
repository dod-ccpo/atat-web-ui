import {    
  getCheckboxId,  
  getServiceOfferingNames,
  getCheckboxIds
} from "../helpers";
import common from '../selectors/common.sel';
import 'cypress-iframe';

//This command is to verify the checkbox label and header for the ServiceOffering Page
Cypress.Commands.add("verifyServiceOfferingHeader", (categoryObj) => {
  const categoryCheckBoxId = getCheckboxId(categoryObj.value);    
  cy.selectServiceOfferingGroup([categoryCheckBoxId]);

  cy.verifyPageHeader("What type of " + categoryObj.label + " do you need?");  
  
});

////This command is to verify the checkbox label on ServiceOffering Page and navigation
Cypress.Commands.add("verifyServiceOfferingsForCategory", (categoryObj) => {
  const serviceOfferingCheckboxLabels = [];
  categoryObj.serviceOfferingCypressLabels.forEach((label) => {
    serviceOfferingCheckboxLabels.push(label);
  });

  cy.verifyCheckBoxLabels('input[type=checkbox]', serviceOfferingCheckboxLabels);  

  const serviceOfferingNames = getServiceOfferingNames(categoryObj);
  
  const serviceOfferingCheckboxIds = getCheckboxIds(categoryObj);
  
  serviceOfferingCheckboxIds.forEach((checkboxId, index) => {
    if (checkboxId.indexOf("Other") === -1) {
      cy.deselectAllCheckboxes();
      cy.selectCheckBoxes([checkboxId]);
      cy.btnClick(common.continueBtn, " Continue ");   

      cy.verifyPageHeader(
        "Next, we’ll gather your requirements for " + serviceOfferingNames[index]
      ); 
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000); // needed because with 2 back button clicks, needs a pause for scroll into view
      cy.btnClick(common.backBtn, "Back");
    }
  });  
});

