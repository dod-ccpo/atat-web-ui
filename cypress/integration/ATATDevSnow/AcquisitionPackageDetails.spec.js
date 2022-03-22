describe("Test suite: Acquisition Package ", () => {
    
    let projectDetails;
    let orgAddressType;
    beforeEach(() => {
        
        cy.fixture("projectOverview").then((details) => {
            projectDetails = details;
        });
        cy.fixture("orgAddressType").then((types) => {
            orgAddressType = types;
    });
        cy.visit(Cypress.env("testUrl"));
        cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
        cy.get('title').should('have.text', 'DISA Sandbox home page - DISA Sandbox');
        cy.frameLoaded("#atat-app");
                
    });

    it("TC1: Acquisition Package Substeps on the Vertical Stepper", () => {
        
        //Verify the text of Acquistion Package details is visible 
        cy.textExists("#Step_AcquisitionPackageDetails >.step-text", " Acquisition Package Details ");

        //Verify the Substeps are  visible
        cy.textExists("#SubStep_ProjectOverview > .step-text", " Project Overview ");
        cy.textExists("#SubStep_Organization > .step-text", " Organization ");
        cy.textExists("#SubStep_ContactInformation > .step-text", " Contact Information ");
            
    });
    
    it("TC2: Acquisition Package step is active", () => {
        cy.iframe("#atat-app")
            .find("#Step_AcquisitionPackageDetails > .step-circle")
            .should("be.visible")
            .and('have.css', 'color', 'rgb(84, 68, 150)')
            .click();
    });

    it("TC3: Asserts on Let’s start with basic info about your new acquisition", () => {

        // lands on New Acquistion Package
        //header of the view
        cy.textExists("header.v-toolbar div.h3", "New Acquisition");
        
        //Sub header
        cy.textExists("h1.page-header", "Let’s start with basic info about your new acquisition");
        
        //label of the "Project/Requirement Title" text
        cy.textExists("#ProjectTitle_text_field_label", " Project/Requirement Title ");

        //tooltip
        const expectedText = " Provide a short, descriptive title of the work to be performed. This will be used to refer to this project within ATAT and across all acquisition forms. "
        cy.hoverToolTip("#TooltipButton_ProjectTitle", "#TooltipText_ProjectTitle", expectedText);
        
        //Enter the Value
        cy.enterTextInTextField("#ProjectTitle_text_field", projectDetails.projectTitle).blur({ force: true })
            .then(($el) => {
                cy.log($el.val());
                const enteredText = $el.val();
                if (enteredText === "") {
                    cy.textExists("header.v-toolbar div.h3", "New Acquisition");
                } else {
                    cy.textExists("header.v-toolbar div.h3", enteredText);
                };
            });
        
        //label of the "Projectscope" text
        cy.textExists("#ProjectScope_text_field_label", " What is the scope of your requirement? ");
        
        //Enter What the scope requirement
        cy.enterTextInTextField("#ProjectScope_text_area", projectDetails.scope).click();
        
        //Assert Emergency declaration text          
        cy.iframe("#atat-app")
            .find("#emergency-declaration-support-requirement_radio_group_control legend").then(($emergencytext) => {
                expect($emergencytext).to.have.text(" Is this requirement in support of an emergency declaration? ");
            });
        
        //Assert radio button
        cy.radioBtn("#Radio_No", "no").not("[disabled]");
        
        //select radio button
        cy.radioBtn("#Radio_Yes", "yes").not("[disabled]");        
        
        //buttons that exists on the view
        cy.btnExists("#ContinueButton", " Continue ");
        cy.btnExists("#BackButton span span", "Back");
    });

    it("TC4: Surge Capabilities-Asserts and Validations Tell us more about the scope of your project", () => {

        cy.fillNewAcquisition(projectDetails.projectTitle + "001", projectDetails.scope)
        // Navigates to "Tell us more about the scope of your project"
        cy.textExists("h1.page-header", "Tell us more about the scope of your project");
        
        //Label of the view
        cy.textExists("div.text-base-darkest h2", "Surge Capabilities");
        
        // ContractPricePercentage text
        cy.textExists("p.mt-8.mb-2", " If surge capabilities are required, what percentage of the contractor’s total proposed price will not be exceeded? ");
        
        //Enter the aplha numeric value to validate the error message 
        cy.fillSurgeCapabilities(projectDetails.invalidTextContractPercentage);   
        
        //Enter the value more than 50  to validate the error message
        cy.fillSurgeCapabilities(projectDetails.invalidTextContractPercentage);    
        
        //Enter the value more than 50  to validate the error message
        cy.fillSurgeCapabilities(projectDetails.invalidLessNumericContractPercentage);

        //buttons that exists on the view
        cy.btnExists("#ContinueButton", " Continue ");
        cy.btnExists("#BackButton span span", "Back");
        
        //Enter the Valid Percentage
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage,"continue");
    });

    it("TC5: Organization: Asserts: Next,we'll gather information about your organization", () => {
    
        cy.fillNewAcquisition(projectDetails.projectTitle1, projectDetails.scope1);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        
        // Navigates to "Organization"
        cy.textExists("header.v-toolbar div.h3", projectDetails.projectTitle1);

        //header 
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");

        //text Label
        cy.textExists("#ServiceOrAgency_AutoComplete_Wrapper label", " What service or agency do you work for? ");

        //Select the Value from Service or agency dropdown
        cy.serviceOrAgency("Defense");

        //section One
        cy.textExists("#Section1 h2.form-section-heading", "1. Tell us more about your organization");
        cy.textExists("#OrgName_text_field_label", " Organization name ");
        cy.enterTextInTextField("#OrgName_text_field", "TestDepartmentof Defense");
        cy.textExists("#DoDAAC_text_field_label", " DoD Activity Address Code (DoDAAC) ");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDDD");

        //section Two
        cy.textExists("#Section2 h2.form-section-heading", "2. What is your organization’s address?");

        //Assert radio group text  
        const addressType = ["U.S.address", "Military", "Foreign address"];
        let foundRadioOptions = 0;
        cy.iframe("#atat-app")
            .find("#AddressType_radio_group_control")
            .children()
            .each(($addressTypetext) => {
                const text = $addressTypetext;
                if (addressType.indexOf(text) > -1) {
                    foundRadioOptions++
                };
                return foundRadioOptions === addressType.length;
            });
        
        //radio buttons        
        cy.radioBtn("#Radio_USAddress", "USA").not("[disabled]");
        cy.radioBtn("#Radio_MilitaryAddress", "MIL").and("be.disabled");
        cy.radioBtn("#Radio_ForeignAddress", "FOR").and("be.disabled");

        //Assert Organization's address labels
        cy.textExists("#StreetAddress_text_field_label", " Street address ");
        cy.textExists("#UnitSuite_text_field_label", " Unit, suite, etc.  Optional ");
        cy.textExists("#City_text_field_label", " City ");
        cy.textExists("#State_AutoComplete_Wrapper label", " State ");
        cy.textExists("#ZIP_text_field_label", " ZIP code ");

        //enter the text in the text fields
        cy.enterOrganizationAddress(orgAddressType.StreetAddress, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Assert buttons
        cy.btnExists("#ContinueButton", " Continue ");
        cy.btnExists("#BackButton span span", "Back");

    });  

    it("TC6: Organization: Service Agency selected is DISA", () => {
        
        cy.fillNewAcquisition(projectDetails.projectTitle2, projectDetails.scope2);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");

        // Navigates to "Organization"
        cy.textExists("header.v-toolbar div.h3", projectDetails.projectTitle2);
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");

        // Serviceagency is DISA
        cy.serviceOrAgency("Defense Information Systems");
        cy.textExists("#DisaOrg_AutoComplete_Wrapper .mb-2.d-block", " DISA Organization ");
        cy.autoCompleteSelection("#DisaOrg", "Assistan", "#DisaOrg_AutoComplete_Wrapper .v-list-item__title");
        cy.textExists("#DoDAAC_text_field_label", " DoD Activity Address Code (DoDAAC) ");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDDD");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress1, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();

        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");
    
    });

    it("TC7: Organization: Service Agency selected is  not DISA", () => {
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");

        //Service Agency is not DISA
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField("#OrgName_text_field", "TestDepartmentof Defense");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDCEC");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress2, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);
        
        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();
        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");

    });

    it("TC8: Organization: Request to add your agency", () => {
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        // Navigates to "Organization"
        cy.textExists("header.v-toolbar div.h3", projectDetails.projectTitle3);
        cy.textExists("a.text-link.mb-10.d-inline-block", " Request to have your agency added ").click();
        cy.textExists("#modalDialogTitle", " Request to add your agency ").should("exist");
        cy.textExists("#AgencyOrgName_text_field_label", " Agency/Organization Name ");
        
    });    
        
});