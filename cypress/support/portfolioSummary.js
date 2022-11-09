import common from '../selectors/common.sel';
import 'cypress-iframe';
import ps from "../selectors/portfolioSummary.sel";
import { cleanText,currencyToNumber,numberWithCommas,numberWithoutPercentSign  } from "../helpers";
import al from "../selectors/acquisitionList.sel";

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

Cypress.Commands.add('noSearchResult', (search) => {
  cy.findElement(search.searchInput).should("exist").type(search.searchItem);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(search.searchBtn).should("exist").wait(1000).click();
  cy.textExists(search.noSearchResultHeader, "No results"); 
  cy.textExists(search.searchString,  "for"+" "+search.searchText )
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

Cypress.Commands.add('clickPortfolioDrawer', (card, portfolioName) => {
  cy.clickPortfolioMenu(card);
  cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName);
  cy.findElement(ps.infoBtn).click().then(() => {
    cy.findElement(ps.slideoutPanel).should("be.visible");
    cy.textExists(ps.aboutPortHeader, "About Portfolio");
  });
});

Cypress.Commands.add('verifyAcquisitionCardDetails', () => {
  cy.findElement(al.package0).then(() => {
    cy.verifyHasText(al.packagecardName);
    cy.findElement(al.statusChip0).then(($el) => {
      const status = $el.text();
      const actualStatus = cleanText(status);
      cy.log(status);
      if (actualStatus === "Draft") {
        cy.verifyHasText(al.percent0);        
      } else if (actualStatus == "Waiting for Task Order") {
        cy.findElement(al.percent0).should("not.exist");
      } else if (actualStatus == "Task Order Awarded") {        
        cy.findElement(al.taskorderNo0).should("be.visible");
        cy.verifyHasText(al.modified0).should("contain","Awarded");
      }else if (actualStatus === "Waiting for Signatures") {
        cy.verifyHasText(al.percent0).should("contain",100);
      }
    });     
    cy.verifyHasText(al.createdBy0);
    cy.verifyHasText(al.modified0);
  });
});

Cypress.Commands.add('searchList', (search) => {
  cy.findElement(search.searchSelector).should("exist").type(search.searchItem);
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(search.searchBtn).should("exist").wait(1000).click();
  cy.findElement(search.searchResultSelector).should("contain", search.searchResultListName); 
});

Cypress.Commands.add("verifyAwardedTaskOrderCardDetails", () => {
  cy.findElement(al.package0).then(() => {
    cy.verifyHasText(al.packagecardName);
    cy.verifyHasText(al.statusChip0);
    cy.verifyHasText(al.percent0);
    cy.verifyHasText(al.createdBy0);
    cy.verifyHasText(al.modified0);
  });
});

Cypress.Commands.add("verifyTaskOrderCardDetails", () => {
  cy.findElement("._task-order-container ").then(() => {
    cy.verifyHasText(ps.toLinkOne);
    cy.verifyHasText(".v-chip--label");
    cy.verifyHasText(ps.popOne);
    cy.verifyHasText(ps.obligatedFundOne);
    cy.verifyHasText(ps.totalValueOne);
    cy.verifyHasText(ps.totalLFundsSpent);
  });
});

Cypress.Commands.add("viewTaskOrderDetails", (taskorderMenu,toNumber) => {
  cy.findElement("#MeatballMenu0Button_0").click({ force: true }).then(() => {
    cy.verifyStringArray("#MeatballMenu0_0 .v-list", taskorderMenu);      
  });
  cy.textExists(ps.viewTODetailsLink0, "View task order details").click().then(() => {
    cy.findElement(ps.taskOrderDetails).should("exist");
    cy.verifyHasText(ps.taskorderlink).should("contain", "Task Order");
    cy.verifyHasText(ps.taskorderNumber).should("contain",toNumber);
  });
});

Cypress.Commands.add("verifyColumns", (columnIndex,headerText, excludeInactive) => {
  cy.findElement(".v-data-table-header  th:nth-child(" + columnIndex + ") span")
    .invoke('text')
    .as('foundHeaderText');  

  cy.get('@foundHeaderText').then(foundHeaderText => {
    expect(headerText).equal(foundHeaderText)   
  })
  const extraSelector = excludeInactive ? ":not(.d-none)" : "";
  cy.findElement("tbody tr.row-item" + extraSelector + " td:nth-child(" + columnIndex + ")")
    .each(($el) => {
      const value = $el.text();
      cy.log(value);
      expect(value).to.exist;
    }); 
  
});

Cypress.Commands.add("verifyTaskOrderStatus", (excludeInactive) => {
  const extraSelector = excludeInactive ? ":not(.d-none)" : "";
  cy.findElement("tbody tr.row-item" + extraSelector + " td:nth-child(2)").each(($el,rowIndex) => {
    const status = $el.text();
    const actualStatus = cleanText(status);
    cy.log(status);
    if (actualStatus === "Delinquent") {
      cy.findElement(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(6) ._overspent")
        .scrollIntoView();
      cy.verifyHasText(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(6) ._overspent")
        .should("be.visible").and("have.text", "Overspent");
      cy.verifyHasText(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(6) ._funds-spent-percent")
        .invoke('text').then(($el) => {
          const percentageNumber = numberWithoutPercentSign($el);           
          cy.log("percentageNumber :", percentageNumber);
          cy.wrap(percentageNumber).should("be.gte", 100);          
        });
    } else if (actualStatus == "Funding At-Risk") {
      cy.verifyHasText(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(6) ._funds-spent-percent")
        .invoke('text').then(($el) => {
          const percentageNumber = numberWithoutPercentSign($el);           
          cy.log("percentageNumber :", percentageNumber);         
          cy.wrap(percentageNumber).should("be.gte", 75).and("be.lt",100);

        });
        
    } else if (actualStatus === "Expired"||actualStatus === "Option Pending") {
      cy.findElement(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(3) ._expiration")
        .should("not.exist");
    }
    else if (actualStatus == "At-Risk") {
      cy.verifyHasText(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(3) ._expiration")        
        .then(($el) => {
          const expirationString = $el.text();
          const expirationDays = expirationString.split(" ")[0];
          cy.log("expirationDays :", expirationDays);
          const days = parseFloat(expirationDays);
          cy.wrap(days).should("be.lt",90);          
          
        });
    }
    else {
      cy.findElement(
        "tbody tr.row-item:nth-child(" + (rowIndex + 1) + ") td:nth-child(3) ._expiration")
        .should("exist");
    }
  });
});

Cypress.Commands.add("verifyTotalValueMatches", (columnIndex,excludeInactive,totalSum,selector) => {
  const extraSelector = excludeInactive ? ":not(.d-none)" : "";
  cy.findElement("tbody tr.row-item" + extraSelector + " td:nth-child(" + columnIndex + ")")
    .each(($ele) => {
      const toNumber = currencyToNumber($ele.text());         
      totalSum += toNumber
      cy.log("Sum of each row value in table:",numberWithCommas(totalSum));
    })
  cy.findElement(selector).scrollIntoView()   
    .then(($el) => {
      const totalValueString = currencyToNumber($el.text());  
      const totalValue = numberWithCommas(totalValueString)
      cy.log("TotalValue:",numberWithCommas(totalValue));
      expect(totalValue).to.equal(numberWithCommas(totalSum));
    });    
    
});  

Cypress.Commands.add("verifyCardsValueMatchesWithTotalValue", (cardSelector,cellSelector) => {
  let cardTotalValue;
  let tableTotalValue;  

  cy.findElement(cardSelector)    
    .then(($el) => {
      const totalCardValueString = currencyToNumber($el.text());    
      cardTotalValue = numberWithCommas(totalCardValueString)
      cy.log("TotalCardValue:", cardTotalValue);       
      cy.findElement(cellSelector).scrollIntoView()    
        .then(($el) => {
          const totalValueString = currencyToNumber($el.text()); 
          tableTotalValue = numberWithCommas(totalValueString)
          cy.log("TotalValue:",tableTotalValue);
          expect(cardTotalValue).to.equal(tableTotalValue);
        });
    });
  
});