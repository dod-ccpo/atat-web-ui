import common from '../selectors/common.sel';
import 'cypress-iframe';

Cypress.Commands.add("dialogModalExist", (dialogModalSelector,modalTitleSelector,modalTitle) => {
  cy.findElement(dialogModalSelector)
    .should("exist");
  cy.textExists(modalTitleSelector,modalTitle);     
});

Cypress.Commands.add("slideoutPanel",
  (selector, panelHeaderSelector, modalHeader, panelTitleSelector, modalTitle) => 
  {
    cy.findElement(selector)
      .should("exist"); 
    cy.textExists(panelHeaderSelector,modalHeader);  
    cy.findElement(panelTitleSelector).should("contain",modalTitle)
    cy.findElement(common.slidePanelCloser).click()
      .then(() => {
        cy.findElement(selector)
          .should("not.visible")
      })
  
  });

Cypress.Commands.add("dialogModalNotExist", (toastText) => {
  cy.findElement(common.dialogModal)
    .should("not.visible");      
  cy.textExists(common.toastText,toastText)
});

Cypress.Commands.add('editInputField', (selector, textValue,editText,editTextValue) => {
  cy.findElement(selector).should("have.value", textValue)
    .clear().type(editText).focus().blur().should("have.value", editTextValue);
});

Cypress.Commands.add('verifyHasText', (selector) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(selector).wait(500).then(($el) => {
    const textValue = $el.text();
    cy.log("ActualValue: ",textValue)
    expect(textValue).to.exist
  })
});

Cypress.Commands.add('selectMenu',
  (selector, menuListSelector, menuListText, menuSelector, menuText) => {
    cy.dropDownClick(selector);
    cy.verifyStringArray(menuListSelector, menuListText);
    cy.textExists(menuSelector, menuText).click();
  });

Cypress.Commands.add('clickRoleDropdown', (selector,roleSelector) => {
  cy.dropDownClick(selector);
  cy.findElement(roleSelector).click();
  
});

Cypress.Commands.add('clickBtnOnModal', (btnSelector,btnText,toastText) => {
  cy.textExists(btnSelector, btnText).click().then(() => {
    cy.dialogModalNotExist(toastText);
  });
  
});

