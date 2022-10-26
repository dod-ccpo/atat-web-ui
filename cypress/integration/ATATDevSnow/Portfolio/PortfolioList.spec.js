/* eslint-disable cypress/no-unnecessary-waiting */
import { bootstrapMockApis,cleanText} from "../../../helpers";
import common from "../../../selectors/common.sel";
import ps from "../../../selectors/portfolioSummary.sel"

describe("Test suite: List of Portfolios", () => {
  
  let menus;
  let filterOptions;

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("navigationBarMenu").then((data) => {
      menus = data;
    });
    cy.fixture("portfolioFilterOptions").then((data) => {
      filterOptions = data;
    });

    cy.launchATAT();
    cy.textExists(common.portfolioBtn, "Portfolios").click();
    cy.textExists(ps.summaryHeader, "Portfolios"); 
    cy.tabStatus(ps.allPortTab, "true");
    cy.wait(2000);
    
  });

  it("TC1: Portfolio sorts", () => {

    cy.verifyStringArray(ps.portHeadersTab, menus.portfolios.portfolioTabs);    
    cy.findElement(ps.searchWrapper).should("exist");
    cy.dropDownClick(ps.portSortDowndrop).then(() => {
      cy.findElement(ps.portSortListItems).should("be.visible");
      const sortDropdownItems = [
        "Portfolio name A-Z",
        "Recently modified"
      ]
      cy.verifyStringArray(ps.portSortListItems, sortDropdownItems)
    });
    
  }); 

  it("TC2: Filter Options- Reset filters", () => {
    
    cy.clickFilterIcon();
    cy.verifyRadioGroupLabels(ps.portfolioRoleRadioGroup, filterOptions.role.radioOptions);
    cy.verifyCheckBoxLabels(ps.fundingStatusCheckbox,filterOptions.fundingStatus.checkBoxOptions);
    cy.verifyCheckBoxLabels(ps.cspOptions, filterOptions.csp.checkBoxOptions);
      
    cy.findElement(ps.managedRadio).click({ force: true }).then(() => {
      cy.findElement(ps.resetFiltersLink).should("be.enabled").click({ force: true });
      cy.findElement(ps.radioAll).should("be.checked");
    });

    cy.selectCheckBoxes([ps.fundingRiskCheckbox]).then(() => {
      cy.findElement(ps.resetFiltersLink).should("be.enabled").click({ force: true });
      cy.findElement(ps.radioAll).should("be.checked");
      cy.findElement(ps.fundingRiskCheckbox).should("not.be.checked");
    });

    cy.selectCheckBoxes([ps.azureCheckBox]).then(() => {
      cy.findElement(ps.resetFiltersLink).should("be.enabled").click({ force: true });
      cy.findElement(ps.radioAll).should("be.checked");
      cy.findElement(ps.azureCheckBox).should("not.be.checked");
    });

    cy.textExists(ps.applyFiltersLink, "Apply filters").should("be.enabled");    
    
  });  

  it("TC3: No Search results found", () => {

    //search without filters selected
    const searchText = "“foo”";    
    cy.noPortfolioSearchResult("foo", searchText);
    cy.textExists(ps.clearSearchBtn, "Clear search").click().then(() => {
      cy.findElement(ps.noSearchResultHeader).should("not.exist");
      cy.findElement(ps.searchInput).should('be.empty');
    });

    //search with filters selected
    cy.clickFilterIcon();
    cy.selectCheckBoxes([ps.azureCheckBox]);
    cy.textExists(ps.applyFiltersLink, "Apply filters").should("be.enabled").click()
      .then(() => {
        cy.findElement(ps.azureFilterChip).should("exist");        
      });
    cy.noPortfolioSearchResult("foo", searchText);
    cy.textExists(ps.withFilterString, "with selected filters");
  });  

  it("TC4: Processing tab", () => {    
    
    cy.tabStatus(ps.processTab, "false").click().then(() => {
      cy.tabStatus(ps.processTab, "true");
    });
      
    cy.wait(1000);
    cy.findElement(ps.portfolioStatusChip).each((card) => {
      const cardText = Cypress.$(card).text();
      const actualCard = cleanText(cardText);
      cy.log(actualCard);
    }).should("contain", "PROCESSING");    

    cy.clickFilterIcon();
    cy.selectCheckBoxes([ps.fundingRiskCheckbox]);
    cy.textExists(ps.applyFiltersLink, "Apply filters").should("be.enabled").click()
      .then(() => {
        cy.findElement(ps.fundATRiskChip).should("exist"); 
        cy.textExists(ps.noSearchResultHeader, "No results"); 
        cy.textExists(ps.withFilterString, "with selected filters");
      });

  });
  

  it("TC5: Active tab", () => {    
    
    cy.tabStatus(ps.activeTab, "false").click().then(() => {
      cy.tabStatus(ps.activeTab, "true");
    });;
    cy.wait(1000);
    cy.findElement(ps.portfolioStatusChip).each((card) => {
      const cardText = Cypress.$(card).text();
      const actualCard = cleanText(cardText);
      cy.log(actualCard);
    })
      .should("not.contain", "Processing");
    
  });
  
  it("TC6: Filter options for CSP", () => {

    cy.clickFilterIcon();
    cy.selectCheckBoxes([ps.awsCheckbox]);
    cy.textExists(ps.applyFiltersLink, "Apply filters").should("be.enabled").click()
      .then(() => {
        cy.findElement(ps.awsFilterChip).should("exist");
        cy.findElement(ps.summaryCardWrapper).each((card) => {
          const cardText = Cypress.$(card).text();
          const actualCard = cleanText(cardText);
          console.log(actualCard)
          cy.findElement(ps.cspOption).should("exist").invoke('attr', 'data-csp')
            .and('equal', "Amazon Web Services");
          
        });              
          
      });
  });
});