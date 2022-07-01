import {    
  getCheckboxId,  
  getServiceOfferingNames,
  getCheckboxIds,
  cleanText
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

//This command is to verify the OtherCategories HeaderLabel on Summary Page 
Cypress.Commands.add("verifyOtherServiceOfferings", (categories) => {
  categories.forEach((cat) => {
    cy.textExists(cat.headingSelector, cat.headingText);
    cy.hoverToolTip(
      cat.tooltipButtonSelector,
      cat.tooltipTextSelector,
      cat.tooltipText
    );
    cy.textExists(cat.linkSelector, " Add requirements ");  
  })
})

//This command is to verify the selected Categories and Offerings in the summary page
Cypress.Commands.add("verifySelectedDetails", (selector, expectedValues) => {
  cy.findElement(selector).then((e) => {
    if (selector === "#SelectedGroups h3") {
      const text = e.text();
      const foundCategories = text.split("  ")
      const foundCategoriesArr = foundCategories.map((c) => {
        return cleanText(c);

      })
      expect(foundCategoriesArr).deep.equal(expectedValues)
    
    } else if (selector === "#SelectedGroups ._selectedOfferings") {
      let foundOfferings = []
      cy.findElement(selector).then((e) => {
        foundOfferings.push(cleanText(e.text()));
        expect(foundOfferings).deep.equal(expectedValues)
      })
    }
        
  });
});