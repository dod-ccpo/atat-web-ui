import {bootstrapMockApis} from "../../helpers";

describe("Test suite: Common SPA functionality", () => { 
    const isTestingLocally = Cypress.env("isTestingLocally");
    
    beforeEach(() => {
      

        bootstrapMockApis();
       
        if (Cypress.env("localTestUrl")){
            cy.visit(Cypress.env("localTestUrl"));    
        } else {
            cy.visit(Cypress.env("testUrl"));    
            cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
            cy.get('title').should('have.text', 'DISA Sandbox home page - DISA Sandbox');
        }
       
        cy.frameLoaded("#atat-app");        
        
    })
    
    it("TC1: Vertical Stepper", () => {
        
        const expectedMenuOptions = [
            "01 Acquisition Package Details",
            "02 Fair Opportunity Process",
            "03 Background",
            "04 Exception to Fair Opportunity",
            "05 Contract Details",
            "06 Government Furnished Equipment",
            "07 Financial Details",
            "08 Public Disclosure of Information",
            "09 Statutory Compliance",
            "10 Supply Chain Risk Management",
            "11 Government Furnished Equipment",
            "12 Section 508",
            "13 Review Required Forms",
        ];
        let foundSideMenuItems = 0
        //Verifying the SideNavigation bar
        cy.iframe("#atat-app").find(".global-side-nav-bar .v-list")
            .children().each(($el) => {
                const text = $el.text();
                if (expectedMenuOptions.indexOf(text) > -1) {
                    foundSideMenuItems++
                }
            })
        return foundSideMenuItems === expectedMenuOptions.length;
        
    });

    it('TC2: Progress Bar for Vertical Stepper', () => {
        
        //Completed Percentage(Steps completed)
        cy.completePercent()
            .then((returned_value) => {
                
                cy.iframe('#atat-app')
                    .find("._stepper-progress-bar .text-primary").should("contain", returned_value + "%");
            })
        
        //Verifying the label of the text 
        cy.textExists("._stepper-progress-bar .text-base", "COMPLETE");
        
        //color of the progressbar completion
        cy.iframe('#atat-app')
            .find(".v-progress-linear__determinate")
            .should("be.visible")
            .and("have.length", 1)
            .and('have.css', 'color', 'rgba(0, 0, 0, 0.87)');
        
    });

    it("TC3: Menu tabs on the rightcorner", () => {
        const expectedMenuItems = ["Dashboard", "MyPackages", "Resources", "Portals", "UserTab"]
        let foundMenuItems = 0
        
        //Verifying the Menu tabs at the top right corner
        cy.get("ul.navbar-nav").children().each(($el) => {
            const text = $el.text()
            if (expectedMenuItems.indexOf(text) > -1) {
                foundMenuItems++
            }
        })
        return foundMenuItems === expectedMenuItems.length;
        
    });

    it("TC4: Portal Dropdown", () => {
        //Portal dropdown
        cy.get("#Portals").should("exist").click({ force: true });          
        const expectedValues = ["Global Service Desk", " Mission Partner Portal"]
        let foundValues = 0
        cy.get("#Portals").children().each(($el) => {
            const text = $el.text()
            if (expectedValues.indexOf(text) > -1) {
                foundValues++
            }
        })
        return foundValues === expectedValues.length;
        
    });                                      
    
    it("TC5: User Tab", () => {
        if (!isTestingLocally){
        //Verifying the Usertab tab at the top right corner
        cy.get(".sub-avatar").then(($loginUserName) => {
            
            const username = $loginUserName.text(); 
            var email =Cypress.env("snowUser");                       
            var names = email.split('-ctr')[0].split('.');
            var firstName = names[0];
            let firstNameChar = firstName.charAt(0);
            var lastName = names[1];
            let firstlastNameChar = lastName.charAt(0);
            expect(username).to.deep.eq(firstNameChar.toUpperCase() + firstlastNameChar.toUpperCase());
            
        })} else {
            cy.log('Test not necessary on localhost')
        }
    })

    it('Testcase5:Footer Components', () => {

        //Verifying the footer at the bottom
        const footerItems = ["Security Notice", "Privacy", "Accessibility"];
        let foundItems = 0;
        cy.iframe('#atat-app')
            .find('.links')
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