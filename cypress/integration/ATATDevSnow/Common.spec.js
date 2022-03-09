describe("Test suite: Common SPA functionality", () => {
    
         
    beforeEach(() => {

        cy.visit(Cypress.env("testUrl"));
        cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
        cy.get("title").should("have.text", "DISA Sandbox home page - DISA Sandbox");
        cy.frameLoaded("#atat-app");
        
        
    })
    
    it("Testcase1: Vertical Stepper", () => {
        
        const expectedMenuOptions = [
            "01 Acquisition Package Details",
            "02 Existing Contract / Background",
            "03 Order Type",
            "04 Exception to Fair Opportunity",
            "05 Evaluation Criteria",
            "06 Classification Requirements",
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
      
    })
          
    
        
       
});
