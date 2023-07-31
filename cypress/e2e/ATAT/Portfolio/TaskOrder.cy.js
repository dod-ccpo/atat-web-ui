/* eslint-disable cypress/no-unnecessary-waiting */
import { bootstrapMockApis,currencyToNumber,numberWithCommas } from "../../../helpers";
import common from "../../../selectors/common.sel";
import ps from "../../../selectors/portfolioSummary.sel"

describe("Test suite: View all task orders", () => {
  
  let card;
  let menus;  
  const portfolioName = "Air Force Portfolio";
  const taskOrderNumber = 1000000005000;
  let totalSum = 0;  

  beforeEach(() => {
    cy.fixture("navigationBarMenu").then((data) => {
      menus = data 
      card = {
        headingSelector: ps.portfolioCards,
        cardHeaderText: portfolioName,
        cardMenuSelector: ps.portfolioCardOne,
        menuListSelector: ps.card0MenuListItem,
        menuListText: menus.portfolios.activePortfolioCardSubmenu,
        menuSelector: ps.toOne,
        selectedMenuText: "View task orders",
        
      };
      
    });    
    bootstrapMockApis();
    cy.launchATAT(false);
    cy.textExists(common.portfolioBtn, "Portfolios").click();
    cy.searchPortfolio("Air", portfolioName); 
    cy.wait(1000);
    
  });

  it("TC1: Asserts: Task order details page", () => {  
    cy.clickPortfolioMenu(card);
    cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName); 
    cy.tabStatus(ps.taskOrderTab, "true");
    cy.textExists(ps.allTO, "All task orders"); 
    cy.verifyTaskOrderCardDetails();
    cy.viewTaskOrderDetails(menus.portfolios.taskorderMenu, taskOrderNumber);

    const obFundsToolTip = "Total of all obligations" +
      " (i.e. funded CLINs) in the base period and exercised option periods." +
      " This may represent 100% of your total task order value, or a portion of it.";     
    cy.hoverToolTip(ps.tooltipBtnOFC, ps.tooltipTextOFC, obFundsToolTip);
    
    const totalTOValueTooltipText = "Total of all exercised CLINs in the base period" +
      " and exercised option periods.";
    cy.hoverToolTip(ps.tooltipBtnTOV, ps.tooltipTextTOV, totalTOValueTooltipText);

    const totalLCATooltipText = "Total value of all CLINs in all periods," +
      " both exercised and options. This is the full amount of money requested in the task order," +
      " but it does not have to be spent."
    cy.hoverToolTip(ps.tooltipBtnLCA, ps.tooltipTextLCA, totalLCATooltipText);

    const totalFSTooltipText = "Total amount of the task order that has been spent and invoiced;" +
      " your expended obligations. Spend data is provided by your CSP," +
      " as of the last monthly invoice."
    cy.hoverToolTip(ps.tooltipBtnTFS, ps.tooltipTextTFS, totalFSTooltipText);

    cy.textExists(ps.inactiveToggle, "Show inactive CLINs").click();    

    //Total Obligatedfunds card is equal to table Total obligated funds value
    cy.verifyCardsValueMatchesWithTotalValue(ps.totalObligatedFundsCard, ps.grandTotalObValue);  

    //Total life cycle amount card is equal to table Total CLINS value
    cy.verifyCardsValueMatchesWithTotalValue(ps.totalLifeCycleAmount, ps.grandTotalCLINSValue);

    //Total funds spent card is equal to table Total funds spent value    
    cy.verifyCardsValueMatchesWithTotalValue(ps.totalFundsSpent, ps.grandTotalFundsSpentValue);

    //Total Task order value card is equal to table Total clin value with out option pending 
    let optionPendingTotal=0;      
    let totalTaskOrder;
    let totalTOValue;
    cy.findElement(ps.optionPendingCLINsValue).each(($ele) => {
      const toNumber = currencyToNumber($ele.text());
      cy.log("toNumber:", toNumber);
      optionPendingTotal += toNumber;
      cy.log("optionPendingTotal:", optionPendingTotal);
      cy.findElement(ps.grandTotalCLINSValue).scrollIntoView()
        .then(($el) => {
          const totalValueString = currencyToNumber($el.text());
          cy.log("TotalValueString:", totalValueString);
          totalTaskOrder = totalValueString - optionPendingTotal;
          totalTOValue = numberWithCommas(totalTaskOrder)
          cy.log("totalTaskOrder:", totalTOValue)
        });
      cy.findElement(ps.totalTOValueCard)
        .then(($el) => {
          const totalCardValueString = currencyToNumber($el.text());
          cy.log("totalCardValueString:", totalCardValueString)
          const cardTotalValue = numberWithCommas(totalCardValueString)
          expect(cardTotalValue).to.equal(totalTOValue);
        });
    });
    
    //CLIN Table exists with the following columns
    const expectedRowHeaders = [
      "CLIN",
      "Status",
      "Period of performance",
      "Total CLIN value",
      "Obligated funds",
      "Total funds spent (%)"
    ];
    cy.columnRowsExists(ps.headerRow, expectedRowHeaders);

    cy.verifyColumns(1, "CLIN", true); 
    cy.textExists(ps.taskOrderHistoryHeader, 'Task Order').click().then(() => {
      cy.verifyHasText(ps.toLinkOne).should("contain",taskOrderNumber)
    });
    
  });

  it("TC2: Verify Task Order Status", () => {  
    cy.clickPortfolioMenu(card);
    cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName); 
    cy.tabStatus(ps.taskOrderTab, "true");    
    cy.viewTaskOrderDetails(menus.portfolios.taskorderMenu, taskOrderNumber);

    //TaskOrder status that appear on this view
    cy.verifyTaskOrderStatus(false);  
    
  });

  it("TC3: Click on Inactive toggle: Verify Total Sum of All CLINS", () => {  
    cy.clickPortfolioMenu(card);
    cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName); 
    cy.tabStatus(ps.taskOrderTab, "true");    
    cy.viewTaskOrderDetails(menus.portfolios.taskorderMenu, taskOrderNumber);
    cy.textExists(ps.inactiveToggle, "Show inactive CLINs").click();        
    
    //Sum of total clins value is equal to Total clin value
    cy.verifyTotalValueMatches(4, false, totalSum, ps.grandHiddenTotalObValue);    
    
    //sum of obligated funds value
    cy.verifyTotalValueMatches(5, false, totalSum, ps.grandhiddenTotalCLINSValue)
    
    // sum of total funds spent
    cy.verifyTotalValueMatches(6, false, totalSum, ps.grandTotalFundsSpentValue)

  });
  
});
