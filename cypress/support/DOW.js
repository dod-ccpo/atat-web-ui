import {    
  getCheckboxId, 
  getIdText,
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
  
  const serviceOfferingCheckboxIds = [];
  const labels = categoryObj.serviceOfferingMainLabels 
    ? categoryObj.serviceOfferingMainLabels 
    : categoryObj.serviceOfferingCypressLabels;
  
  labels.forEach((label) => {
    const textForId = getIdText(label);
    const id = getCheckboxId(textForId);
    serviceOfferingCheckboxIds.push(id);
  });

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
});