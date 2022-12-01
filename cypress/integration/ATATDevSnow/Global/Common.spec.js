import { bootstrapMockApis, cleanText, capitalizeFirstLetter } from "../../../helpers";
import common from "../../../selectors/common.sel";

describe("Test suite: Common SPA functionality", () => { 
  
  let menus;

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("navigationBarMenu").then((data) => {
      menus = data;
      
      
    });
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
  });
    
  it("TC1: Vertical Stepper", () => {
        
    const expectedMenuOptions = [
      "01 Acquisition Package Details",
      "02 Fair Opportunity Process",
      "03 Background",
      "04 Performance Requirements",
      "05 Contract Details",
      "06 Government Furnished Equipment",
      "07 Other Contract Considerations",
      "08 Evaluation Criteria",
      "09 Classification Requirements",
      "10 Financial Details",
      "11 Review Required Forms",
    ];
    let foundSideMenuItems = 0
    //Verifying the SideNavigation bar
    cy.findElement(common.sideBarList)
      .children().each(($el) => {
        const text = $el.text();
        if (expectedMenuOptions.indexOf(text) > -1) {
          foundSideMenuItems++
        }
      })
    return foundSideMenuItems === expectedMenuOptions.length;
        
  });

  //skipping because progress bar will be updated after completion of Step,need to update.
  it.skip('TC2: Progress Bar for Vertical Stepper', () => {
        
    //Completed Percentage(Steps completed)
    cy.completePercent()
      .then((returnedValue) => {
                
        cy.findElement(common.stepperProgressBarTextPrimary)
          .should("contain", returnedValue + "%");
      })
        
    //Verifying the label of the text 
    cy.textExists(common.stepperProgressBarText, "COMPLETE");
        
    //color of the progressbar completion
    cy.findElement(common.progressBar)
      .should("be.visible")
      .and("have.length", 1)
      .and('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
        
  });

  it("TC3: Menu tabs on the navigation bar", () => {
    
    const expectedEmail = Cypress.env("snowUser");
    const expectedNames = expectedEmail.split('-ctr')[0].split('.');
    const expectedFirstName = expectedNames[0];
    const firstName = capitalizeFirstLetter(expectedFirstName);
    const expectedLastName = expectedNames[1]
    const lastName = capitalizeFirstLetter(expectedLastName);
    let firstNameChar = firstName.charAt(0);
    let firstlastNameChar = lastName.charAt(0);

    const menuText = [];
    const keys = Object.keys(menus)
    keys.forEach((key) => {
      menuText.push(menus[key].menuText);
    });
    menuText.pop();
    cy.findElement(common.userTab).then(($el) => {
      const foundInitials = $el.text();
      const initials = cleanText(foundInitials);
      menuText.push(initials);
      
    });
    // verifying the main Menus
    cy.verifyStringArray(common.navigationBar, menuText);

    //Acquisition submenu
    cy.dropDownClick(common.acquisitionsTab);
    cy.verifyStringArray(common.acquisitionDropdownList, menus.acquisitions.dropdownList);
    
    //Portals submenu
    cy.dropDownClick(common.portalsTab);
    cy.verifyStringArray(common.portalsDropdownList, menus.portals.dropdownList);

    //User submenu
    cy.dropDownClick(common.userTab);
    cy.findElement(common.userEmail).then(($el) => {
      const foundEmail = $el.text();
      const userEmail = cleanText(foundEmail);
      menus.user.dropdownList.unshift(userEmail);
      expect(userEmail).to.deep.eq(expectedEmail);
    });
    cy.findElement(common.userName).then(($el) => {
      const foundName = $el.text();
      const userName = cleanText(foundName);
      menus.user.dropdownList.unshift(userName);
      expect(userName).to.deep.eq(firstName + ' ' + lastName);
    });
    cy.findElement(common.userIntials).then(($el) => {
      const founduserInitals = $el.text();
      const userInitials = cleanText(founduserInitals);
      menus.user.dropdownList.unshift(userInitials);
      expect(userInitials).to.deep.eq(firstNameChar + firstlastNameChar);
    });
  
    cy.verifyStringArray(common.userDropdownList, menus.user.dropdownList);
    
  });  

  it("TC4: Footer Components", () => {

    //Verifying the footer at the bottom
    const footerItems = ["Security Notice", "Privacy", "Accessibility"];
    let foundItems = 0;
    cy.findElement(common.footerLinks)
      .children()
      .each(($el) => {
        const text = $el.text()
        if (footerItems.indexOf(text) > -1) {
          foundItems++
        }
      })
    return foundItems === footerItems.length;
        
  })      
                
});