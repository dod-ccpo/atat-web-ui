import common from '../selectors/common.sel';
import 'cypress-iframe';
import ps from "../selectors/portfolioSummary.sel";
import { cleanText } from "../helpers";

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
    .clear().type(editText).focus().click().should("have.value", editTextValue);
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

Cypress.Commands.add('getRowCount', () => {
  cy.findElement('.row-item').then(($el) => {
    const length = $el.length;
    cy.log("length:", length)
    cy.findElement('table tbody tr').should('have.length', length);
  });
    
});

Cypress.Commands.add('columnRowsExists', (selector,expectedValues) => {
  cy.findElement(selector).then(($els) => {
    const foundText = Cypress.$.makeArray($els).map((el) => el.innerText);
    return foundText;
  })   
    .should('deep.equal', expectedValues);  
  cy.log("expectedValues:",expectedValues)
});

Cypress.Commands.add('clickPortfolioMenu', (card) => { 
  cy.findElement(card.headingSelector).should("contain", card.cardHeaderText).then(() => {      
    cy.findElement(card.cardMenuSelector).click();   
    cy.verifyStringArray(card.menuListSelector, card.menuListText);
    cy.textExists(card.menuSelector, card.selectedMenuText).click()
    
  })
  
});

Cypress.Commands.add('portfolioTabStatus', (tabSelector,boolean) => {    
      
  cy.findElement(tabSelector).click()
    .should('have.attr', 'aria-selected', boolean);
});

Cypress.Commands.add('verifyPortfolioCardDetails',
  (portfolioCardSelector, expectedOptions, length) => {
    cy.findElement(portfolioCardSelector).then(($els) => {
      const foundText = Cypress.$.makeArray($els).map((el) => el.innerText)
      const foundTextArray = cleanText(foundText[0]).split(/\r?\n/);
      console.log("Actual:", foundTextArray)
      return foundTextArray;
    })
      .should('deep.equal', expectedOptions)
      .and("have.length", length);  

  });

Cypress.Commands.add('searchPortfolio', (searchItem,portfolioName) => {
  cy.findElement(ps.searchInput).should("exist").type(searchItem);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(ps.searchBtn).should("exist").wait(1000).click();
  cy.findElement(ps.portfolioCards).should("contain", portfolioName); 
});

Cypress.Commands.add('noPortfolioSearchResult', (searchItem,searchText) => {
  cy.findElement(ps.searchInput).should("exist").type(searchItem);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(ps.searchBtn).should("exist").wait(1000).click();
  cy.textExists(ps.noSearchResultHeader, "No results"); 
  cy.textExists(ps.searchString,  "for"+" "+searchText )
});

Cypress.Commands.add('clickFilterIcon', () => {
  cy.findElement(ps.filterBtn).should("exist").click().then(() => {
    cy.findElement(ps.filterSlideout).should("be.visible");
    cy.textExists(ps.panelTitle, "Filter your results");
    cy.findElement(ps.radioAll).should("be.checked").then(() => {
      cy.findElement(ps.resetFiltersLink).should("be.disabled");
    });
  });
});


Cypress.Commands.add('tabStatus', (tabSelector,boolean) => {    
      
  cy.findElement(tabSelector)
    .should('have.attr', 'aria-selected', boolean);
});
Cypress.Commands.add('clickRoleDropdown', (selector,roleSelector) => {
  cy.dropDownClick(selector);
  cy.findElement(roleSelector).click();
  
});

Cypress.Commands.add('clickPortfolioDrawer', (card,portfolioName) => {
  cy.clickPortfolioMenu(card);    
  cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName);
  cy.findElement(ps.infoBtn).click().then(() => {
    cy.findElement(ps.slideoutPanel).should("be.visible");
    cy.textExists(ps.aboutPortHeader, "About Portfolio");
  });
})