import { bootstrapMockApis, randomAlphaNumeric } from "../../../helpers";
import common from "../../../selectors/common.sel";
import ps from "../../../selectors/portfolioSummary.sel"

describe("Test suite: Portfolio summary", () => { 
  
  let menus;
  const title = "“Mock Title”";

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("navigationBarMenu").then((data) => {
      menus = data;          
    });

    cy.launchATAT();
    cy.textExists(common.portfolioBtn, "Portfolios").click();
    const portfolioName = "Mock Title"
    cy.findElement(ps.headerPortofilioTextfield).should("have.value", portfolioName);
  });
    
  it("TC1: Funding Tracker", () => {    
    cy.findElement(ps.fundingTrackerTab).should('have.attr', 'aria-selected', 'true'); 
    cy.selectMenu(
      ps.moreMenubtn,
      ps.moreMenuList,
      menus.portfolios.submenu,
      ps.renamePortMenu,
      "Rename portfolio"
    ).then(() => {
      const titleValue = "Mock Title"
      const editTitleText = "Edit MockTitle"
      cy.editInputField(
        ps.headerPortofilioTextfield,
        titleValue,
        editTitleText,
        editTitleText
      );
    });
    cy.textExists(ps.portfoliodetailsTitle, "Portfolio Details");    
    cy.verifyHasText(ps.availableFunds);
    cy.textExists(ps.totalPortFundsTitle, "Total Portfolio Funds");
    cy.verifyHasText(ps.totalPortfolioFunds);
    cy.verifyHasText(ps.popDates);
    cy.textExists(ps.fundingstatusHeader, "Funding Status");
    const alertText = "NOTE: All financial data depicted are estimates to assist with tracking" +
      " cloud spend. Login to your CSP console to get detailed cost analysis and breakdowns." +
      " Learn more"
    cy.verifyTextMatches(ps.financialAlert, alertText);
    
  });

  it("TC2: Invite members to portfolio from sub menu", () => {    
    cy.selectMenu(
      ps.moreMenubtn,
      ps.moreMenuList,
      menus.portfolios.submenu,
      ps.inviteMemMenu,
      "Invite members to portfolio"
    ).then(() => {
      
      cy.dialogModalExist(
        ps.addMemModal,
        ps.addMemTitle,
        " Invite people to" + " " + title
      );
      cy.textExists(ps.emailLabel, "Email Addresses");
      const email = randomAlphaNumeric(3) + "." + randomAlphaNumeric(4) + "-ctr@mail.mil"
      cy.findElement(ps.emailInputbox).type(email);
      cy.dropDownClick(ps.modalRoleDropdownIcon);
      cy.verifyStringArray(ps.roleDropdownList, menus.portfolios.roles);
      cy.findElement(ps.roleDropdownViewer).click();
      cy.textExists(common.commonOkBtn, "Invite").click().then(() => {
        cy.dialogModalNotExist("1 member added");
      });
      // verify of email is already a portfolio Member
      cy.dropDownClick(ps.moreMenubtn); 
      cy.textExists(ps.inviteMemMenu, "Invite members to portfolio").click()
      cy.findElement(ps.emailInputbox).type(email).focus().blur({ force: true }).then(() => {
        cy.checkErrorMessage(ps.emailinputBoxError, email + " is already a portfolio member.");
      }); 
    })
  });  

});