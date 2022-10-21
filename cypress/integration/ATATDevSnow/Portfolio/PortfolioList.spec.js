import { bootstrapMockApis} from "../../../helpers";
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
    
  });

  it("TC1: Portfolio sorts", () => {
    cy.verifyStringArray(ps.portHeadersTab, menus.portfolios.portfolioTabs);
    cy.findElement(ps.allPortTab).should('have.attr', 'aria-selected', 'true');
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
    
    cy.findElement(ps.filterBtn).should("exist").click().then(() => {
      cy.findElement(ps.filterSlideout).should("be.visible");
      cy.textExists(ps.panelTitle, "Filter your results");      
      cy.verifyRadioGroupLabels(ps.portfolioRoleRadioGroup, filterOptions.role.radioOptions);
      cy.verifyCheckBoxLabels(ps.fundingStatusCheckbox,filterOptions.fundingStatus.checkBoxOptions);
      cy.verifyCheckBoxLabels(ps.cspOptions, filterOptions.csp.checkBoxOptions);
      cy.findElement(ps.radioAll).should("be.checked").then(() => {
        cy.findElement(ps.resetFiltersLink).should("be.disabled");
      });
      cy.findElement(ps.managedRadio).click({ force: true }).then(() => {
        cy.findElement(ps.resetFiltersLink).should("be.enabled").click({ force: true });
        cy.findElement(ps.radioAll).should("be.checked");
      });
      cy.selectCheckBoxes([ps.azureCheckBox]).then(() => {
        cy.findElement(ps.resetFiltersLink).should("be.enabled").click({ force: true });
        cy.findElement(ps.radioAll).should("be.checked");
        cy.findElement(ps.azureCheckBox).should("not.be.checked");
      });

      cy.textExists(ps.applyFiltersLink, "Apply filters").should("be.enabled");
    
    })
  });  

});

