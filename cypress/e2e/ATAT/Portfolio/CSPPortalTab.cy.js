import { bootstrapMockApis, randomString,randomNumber} from "../../../helpers";
import common from "../../../selectors/common.sel";
import ps from "../../../selectors/portfolioSummary.sel"

describe("Test suite: Portfolios CSP Portaltab", () => {

  const fName = randomString(4);
  const lName = randomString(4);
  const email = (fName + "." + lName + "@example.mil").toLowerCase();
  const dodID = randomNumber(10);

  let card;
  let menus;  
  const portfolioName = "Army Portfolio";

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("navigationBarMenu").then((data) => {
      menus = data 
      card = {
        headingSelector: ps.portfolioCards,
        cardHeaderText: portfolioName,
        cardMenuSelector: ps.portfolioCardOne,
        menuListSelector: ps.card0MenuListItem,
        menuListText: menus.portfolios.activePortfolioCardSubmenu,
        menuSelector: ps.ftOne,
        selectedMenuText: "View funding tracker",
        
      };
      
    });    
    
    cy.launchATAT(false);
    cy.textExists(common.portfolioBtn, "Portfolios").click();
    cy.searchPortfolio("army", portfolioName); 
  });

  it("TC1:Asserts: CSP Portal Access view", () => {
    cy.clickPortfolioMenu(card);
    cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName); 
    cy.tabStatus(ps.cspPortalAccessTab,"false").click();

    const csp = "Azure"
    cy.textExists(ps.cspTitle, "Accessing your " + csp + " " + "Portal:");
    const cspDes = "To login to your cloud resources, you must have an " + csp + " account." +
      " As a portfolio manager, you can add administrators to grant full access to your CSP" +
      " portal." +
      " Administrators will be able to manage all user access and permissions directly within "
      + csp + "." +
      " Learn more about accessing your CSP portal"
    cy.verifyTextMatches(ps.cspDescription, cspDes);
    cy.textExists(ps.learnMorkLink, "Learn more about accessing your CSP portal");
    cy.textExists(ps.cspAdminLogLabel, "CSP administrator log").click();
    const expectedRowHeaders = ["Administrator email", "Status", "Added by", "Processed on"]
    cy.columnRowsExists(ps.headerRow, expectedRowHeaders);
    cy.getRowCount();
    cy.textExists(ps.tablepageText, "Showing 1-3 of 3");
    cy.textExists(ps.tablePagination, 1);
    cy.textExists(ps.addCSPAdminBtn, "Add a CSP Administrator").click().then(() => {
      cy.dialogModalExist(
        ps.addCSPModal,
        ps.addCSPModalTitle,
        "Add a CSP Administrator"
      );
      cy.textExists(ps.modallearnlink, "Learn more about CSP administrators").click().then(() => {
        cy.textExists(ps.modalSlideOut, "Learn more about CSP administrators");
        cy.findElement(ps.modalSlideoutCloser).click();
        cy.findElement(ps.modalSlideOut).should("not.visible");
      });
      cy.textExists(ps.adminEmailAddressLabel, "Administrator’s email address");
      cy.textExists(ps.adminEmailAddressHelpText, "Must use a .mil or .gov email address.");
      cy.textExists(ps.adminDoDIDLabel, "Administrator’s DoD ID");
      const dodIDTootipTxt = "This 10-digit number is printed on the" +
        " back of your administrator's Common Access Card (CAC)." +
        " You may also ask your administrator to log into" +
        " DoD ID Card Office Online and locate it under “My Profile.”"
      cy.hoverToolTip(
        ps.adminDoDToolTipBtn,
        ps.adminDoDToolTipText,
        dodIDTootipTxt
      );
      cy.textExists(ps.modalCancelBtn, "Cancel").click();
      cy.findElement(ps.addCSPModal).should("not.be.visible");
    });
    
  });

  it("TC2: Add a CSP Administrator", () => {
    cy.clickPortfolioMenu(card);
    cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName); 
    cy.tabStatus(ps.cspPortalAccessTab,"false").click();
    cy.getRowCount();
    cy.textExists(ps.addCSPAdminBtn, "Add a CSP Administrator").click().then(() => {
      cy.dialogModalExist(
        ps.addCSPModal,
        ps.addCSPModalTitle,
        "Add a CSP Administrator"
      );
      cy.enterTextInTextField(ps.adminEmailAddressTextBox, email);
      cy.enterTextInTextField(ps.adminDoDIDTextbox, dodID);
      cy.textExists(ps.modalAddAdminBtn, "Add administrator").should('not.be.disabled')
        .click();
      cy.getRowCount();
      const expectedValues = [email, "Processing", "Maria Missionowner", ""]
      cy.columnRowsExists(ps.firstRow, expectedValues)
      
    });
  });

  it("TC3:Validations : Add a CSP Administrator Modal", () => {
    cy.clickPortfolioMenu(card);
    cy.findElement(ps.headerPortfolioTextfield).should("have.value", portfolioName); 
    cy.tabStatus(ps.cspPortalAccessTab,"false").click();
    cy.textExists(ps.addCSPAdminBtn, "Add a CSP Administrator").click()
    cy.verifyRequiredInput(
      ps.adminEmailAddressTextBox,
      ps.emailinputBoxError,
      "Please enter your administrator’s email address."
    );
    cy.verifyRequiredInput(
      ps.adminDoDIDTextbox,
      ps.adminDoDIDError,
      "Please enter your administrator’s 10-digit DOD ID"
    );
      
    cy.textExists(ps.modalAddAdminBtn, "Add administrator").should("be.disabled");
    //Validation if email is not in standard domain format
    cy.enterTextInTextField(
      ps.adminEmailAddressTextBox, fName + "." + lName + "example.mail"
    ).tab().then(() => {
      cy.checkErrorMessage(
        ps.emailinputBoxError,
        "Please use a standard domain format, like “@domain.mil”."
      );
    })
    //Validation if email is not .mil or gov
    const invalidEmail= (fName + "." + lName + "@example.com").toLowerCase();
    cy.enterTextInTextField(
      ps.adminEmailAddressTextBox, invalidEmail
    ).tab().then(() => {
      cy.checkErrorMessage(
        ps.emailinputBoxError,
        "Please use a .mil or .gov email address."
      );
    });
    //DoDID is lessthan 10 characters
    const invalidID=randomNumber(8)
    cy.enterTextInTextField(
      ps.adminDoDIDTextbox, invalidID
    ).tab().then(() => {
      cy.checkErrorMessage(
        ps.adminDoDIDError,
        "The DOD ID must be 10 digits"
      );
    });
      
  });
});

