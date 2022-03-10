describe("Test suite: Acquisition Package ", () => {
    
    let projectDetails;
    beforeEach(() => {   
        
         cy.fixture("projectOverview").then((details) => {
            projectDetails = details;
        });
        cy.visit(Cypress.env("testUrl"));
        cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
        cy.get('title').should('have.text', 'DISA Sandbox home page - DISA Sandbox');
        cy.frameLoaded("#atat-app");
                
    })
    it("TC1: Acquisition Package Substeps on the Vertical Stepper", () => {
        
        //Verify the text of Acquistion Package details is visible 
        cy.textExists("#Step_AcquisitionPackageDetails >.step-text", " Acquisition Package Details ");

        //Verify the Substeps are  visible
        cy.textExists("#SubStep_ProjectOverview > .step-text", " Project Overview ");
        cy.textExists("#SubStep_Organization > .step-text", " Organization ");
        cy.textExists("#SubStep_ContactInformation > .step-text", " Contact Information ");
            
    })
   
    it("TC2: Acquisition Package step is active", () => {
        cy.iframe("#atat-app")
            .find("#Step_AcquisitionPackageDetails > .step-circle")
            .should("be.visible")
            .and('have.css', 'color', 'rgb(84, 68, 150)')
            .click();
        
    })
    it("TC3: Asserts on Let’s start with basic info about your new acquisition", () => {
           
        // lands on Demo Package
        //header of the view
        cy.textExists("header.v-toolbar div.h3", "Demo Package");
        
        //Sub header
        cy.textExists("div.col h1", "Let’s start with basic info about your new acquisition");
        
        //label of the "Project/Requirement Title" text
        cy.textExists("#ProjectTitle_text_field_label", " Project/Requirement Title ");

         //tooltip
        cy.iframe("#atat-app")
            .find("#TooltipButton_ProjectTitle")
            .should("be.visible")
            .realHover();
        const expectedText = " Provide a short, descriptive title of the work to be performed. This will be used to refer to this project within ATAT and across all acquisition forms. "
        cy.textExists("#TooltipText_ProjectTitle", expectedText);
                
        //Enter the Value
        cy.enterTextInTextField("#ProjectTitle_text_field", projectDetails.projectTitle)
            .click();
        
        //label of the "Projectscope" text
        cy.textExists("#ProjectScope_text_field_label", " What is the scope of your requirement? ");
        
        //Enter What the scope requirement
        cy.enterTextInTextField("#ProjectScope_text_area", projectDetails.scope).click();
        
        //Assert Emergency declaration text          
        cy.iframe("#atat-app")
            .find("#emergency-declaration-support-requirement").then(($emergencytext) => {
                expect($emergencytext).to.have.text("Is this requirement in support of an emergency declaration?radio_button_uncheckedYesradio_button_uncheckedNo")
                
            });
        
        //select radio button
        cy.iframe("#atat-app")
            .find("#Radio_Yes").should("have.value", "yes")
            .click({ force: true });
        
        //buttons that exists on the view
        cy.iframe("#atat-app")
            .find("[type='button']").contains("Back");
       
        cy.iframe("#atat-app")
            .find("[type='button']").contains("Continue");
    })
    it("TC4: Surge Capabilities-Asserts and Validations Tell us more about the scope of your project", () => {
           
        cy.fillNewAcquisition(projectDetails.projectTitle + "001", projectDetails.scope)
        // Navigates to "Tell us more about the scope of your project"
        cy.textExists("div.col-12.col h1", "Tell us more about the scope of your project");
        
        //Label of the view
        cy.textExists("div.text-base-darkest h2", "Surge Capabilities");        
        
        // ContractPricePercentage text
        cy.textExists("p.mt-8.mb-2", " If surge capabilities are required, what percentage of the contractor’s total proposed price will not be exceeded? ");
                
        //Enter the aplha numeric value to validate the error message        
        cy.iframe("#atat-app")
            .find("#ContractPricePercentage_text_field_control")
            .should("be.visible")
            .type(projectDetails.invalidTextContractPercentage).click()
            .find(".v-messages__message")
            .should("contain.text", "Enter a number between 1-50");
        
        //Enter the value more than 50  to validate the error message
        cy.iframe("#atat-app")
            .find("#ContractPricePercentage_text_field_control")
            .should("be.visible")
            .clear()
            .type(projectDetails.invalidNumericContractPercentage)
            .click()
            .find(".v-messages__message")
            .should("contain.text", "Enter a number between 1-50");

        //buttons that exists on the view
        cy.iframe("#atat-app")
            .find("[type='button']").contains("Back");
       
        cy.iframe("#atat-app")
            .find("[type='button']").contains("Continue");
    });
        
})