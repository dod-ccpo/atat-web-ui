describe("Test suite: Acquisition Package ", () => {
    
    let projectDetails;
    let orgAddressType;
    let contactInfo;

    beforeEach(() => {
        
        cy.fixture("projectOverview").then((details) => {
            projectDetails = details;
        });
        cy.fixture("orgAddressType").then((types) => {
            orgAddressType = types;
        });
        cy.fixture("contactInfo").then((info) => {
            contactInfo = info;
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
        cy.radioBtn("#Radio_MilitaryAddress", "MIL").not("[disabled]");
        cy.radioBtn("#Radio_ForeignAddress", "FOR").not("[disabled]");

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
        cy.textExists("#RequestAgencyAdded", " Request to have your agency added ").click();
        cy.textExists("#modalDialogTitle", " Request to add your agency ").should("exist");
        cy.textExists("#AgencyOrgName_text_field_label", " Agency/Organization Name ");
        
    });    

    it("TC9: Asserts on Let’s confirm your contact information", () => {
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");

        //Service Agency is not DISA
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField("#OrgName_text_field", "TestDepartmentof Defense");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDCEC");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();       

        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");
        
        //list of contactrole
        cy.iframe("#atat-app")
            .find("#ContactRole_radio_group_control legend").then(($contactrole) => {
                expect($contactrole).to.have.text(" What role best describes your affiliation with the DoD? ");
            });
        
        //select radio button
        cy.contactRoleRadioBtnOption("#Radio_Civilian","CIV");

        //Salutation dropdown
        cy.dropDownClick("#Salutation_dropdown_field_control .v-input__append-inner > .v-icon");
        const salutationDropdownList = "Mr.Mrs.MissMs.Dr."
        cy.iframe("#atat-app")
            .find("#Salutation_dropdown_field_control .v-list-item").then(($el) => {
                console.log($el.text());
                expect(Cypress.$($el).text()).to.eq(salutationDropdownList);
            });
        
         //select the salutationfrom dropdown
        cy.iframe("#atat-app").find("#Salutation_DropdownListItem_Mr")
            .should("have.text", "Mr.").click({ force: true });
        
        // Assert ContactInformation Labels
        cy.textExists("#FirstName_text_field_label", " First name ");     
        cy.textExists("#LastName_text_field_label", " Last name ");        
        cy.textExists("#MiddleName_text_field_label", " Middle name  Optional ");  
        cy.textExists("#ContactEmail_text_field_label", " Your email ");
        cy.textExists("#ContactEmail_text_field_control .help-text.mt-2", " Enter a .mil or .gov email address. ");
        cy.textExists("#ContactPhone_text_field_label", " Your phone number ");
        
         //Enter the Contact Information
        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName,
            "#MiddleName_text_field",
            contactInfo.middleName,
            "#LastName_text_field",
            contactInfo.lastName,
            "#ContactEmail_text_field",
            contactInfo.email,
            "#ContactPhone_text_field",
            contactInfo.phoneNumber
        );
    });

    it("TC10: Contact Information: Role is Military", () => {
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");

        //Service Agency is not DISA
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField("#OrgName_text_field", "TestDepartmentof Defense");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDCEC");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();

        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information"); 
        
        //select radio button
        cy.contactRoleRadioBtnOption("#Radio_Military","MIL");           

        //Click Rank dropdown
        cy.dropDownClick("#Rank");            
    
        //select the value from Rank Dropdown
        cy.iframe('#atat-app').find("#Rank_AutoComplete_Wrapper .v-list-item__title").first().click({ force: true });

        //enter the ContactInformation
        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName1,
            "#MiddleName_text_field",
            contactInfo.middleName1,
            "#LastName_text_field",
            contactInfo.lastName1,
            "#ContactEmail_text_field",
            contactInfo.email1,
            "#ContactPhone_text_field",
            contactInfo.phoneNumber1);
        
    });

    it("TC11: Contact Information: Role is Civilian", () => {
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");   
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField("#OrgName_text_field", "TestDepartmentof Defense");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDCEC");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();
    
        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption("#Radio_Civilian","CIV");

        //select the value from salutationDropdownList
        cy.dropDownClick("#Salutation_dropdown_field_control .v-input__append-inner > .v-icon");
        cy.iframe("#atat-app").find("#Salutation_DropdownListItem_Mrs")
            .should("have.text", "Mrs.").click({ force: true });      
        
         //Enter contact information
        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName2,
            "#MiddleName_text_field",
            contactInfo.middleName2,
            "#LastName_text_field",
            contactInfo.lastName2,
            "#ContactEmail_text_field",
            contactInfo.email2,
            "#ContactPhone_text_field",
            contactInfo.phoneNumber2
        );
        
        //Select the Grade 
        cy.textExists("#ContactGrade_AutoComplete_Wrapper .mb-2.d-block", " Grade  Optional ");
        cy.dropDownClick("#ContactGrade_AutoComplete_Wrapper .v-input__icon.v-input__icon--append");
        cy.autoCompleteSelection("#ContactGrade_AutoComplete_Wrapper", "GS-05", "#ContactGrade_AutoComplete_Wrapper .v-list-item__title");
    
    });
    
    it("TC12: Contact Information: Role is Contractor", () => {
        cy.clickSideStepper("#SubStep_ContactInformation", " Contact Information "); 
    
        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption("#Radio_Contractor","CTR")
    
        //Salutation dropdown
        cy.dropDownClick("#Salutation_dropdown_field_control .v-input__append-inner > .v-icon"); 
        const salutationDropdownList = "Mr.Mrs.MissMs.Dr."
        cy.iframe("#atat-app").find("#Salutation_dropdown_field_control .v-list-item").then(($el) => {
            console.log($el.text())
            expect(Cypress.$($el).text()).to.eq(salutationDropdownList);
        });

        //select the value from salutationDropdownList
        cy.iframe("#atat-app").find("#Salutation_DropdownListItem_Mr ")
            .should('have.text', 'Mr.').click({ force: true });
        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName3,
            "#MiddleName_text_field",
            contactInfo.middleName3,
            "#LastName_text_field",
            contactInfo.lastName3,
            "#ContactEmail_text_field",
            contactInfo.email3,
            "#ContactPhone_text_field",
            contactInfo.phoneNumber3
        );
    });
    
    it("TC13: COR: Selected Contact Information", () => {
        
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
        cy.textExists("h1.page-header", " Next, we’ll gather information about your organization ");
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField("#OrgName_text_field", "TestDepartmentof Defense");
        cy.enterTextInTextField("#DoDAAC_text_field", "DoDCEC");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();

        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption("#Radio_Contractor","CTR")
    
        //Salutation dropdown
        cy.dropDownClick("#Salutation_dropdown_field_control .v-input__append-inner > .v-icon"); 
        const salutationDropdownList = "Mr.Mrs.MissMs.Dr."
        cy.iframe("#atat-app").find("#Salutation_dropdown_field_control .v-list-item").then(($el) => {
            console.log($el.text())
            expect(Cypress.$($el).text()).to.eq(salutationDropdownList);
        });

        cy.iframe("#atat-app").find("#Salutation_DropdownListItem_Mr ")
            .should('have.text', 'Mr.').click({ force: true });
        
        // Enter the Contact Information
        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName,
            "#MiddleName_text_field",
            contactInfo.middleName,
            "#LastName_text_field",
            contactInfo.lastName,
            "#ContactEmail_text_field",
            contactInfo.email,
            "#ContactPhone_text_field",
            contactInfo.phoneNumber);
        
        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();
        
        //navigate to COR
        cy.checkIfCorOrAcor("h1.page-header", " Let’s gather info about your Contracting Officer’s Representative (COR) ", "adam");

        //Verify the selected contact info
        cy.selectedContactInformation(
            " Adam Adamson ",
            "mail adam.adamson-civ@mail.mil ",
            "phone 333-333-3333",
            "pentagon HQ1234 - Corresponding Organization Name",
            " To make any changes to your COR’s contact information, please send a request to our User Engagement Team. ",
            " Request changes to COR’s contact information ",
            "Remove COR info "
        );
        // click on Request Change Contact Information link
        cy.requestChangeContactInformation(
            " Request changes to COR’s contact information ",
            " Request change to COR's contact information ",
            " Please let us know what information needs to be updated for this COR. ​",
            "Please change the contact info"
        );
        cy.btnExists("#dialog_cancel", "Cancel ").not("to.be.disabled").click();
        // remove COR info
        cy.btnExists("#RemoveSelectedContactInfo", "Remove COR info ").click();
        cy.iframe("#atat-app").find('#SelectedContactCard')
            .and("not.exist");
    });

    it("TC14: COR: Search: No results found.", () => {   
        cy.clickSideStepper("#SubStep_ContactInformation", " Contact Information ");

        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");        
        
        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();
        
        //navigate to COR
        cy.checkIfCorOrAcor(
            "h1.page-header",
            " Let’s gather info about your Contracting Officer’s Representative (COR) ",
            "test",
            " Manually enter my COR’s contact information ");

    });    

    it("TC15: COR: Manually enter Contact information", () => {
        cy.clickSideStepper("#SubStep_ContactInformation", " Contact Information "); 

        //Navigates to Contact information
        cy.textExists("h1.page-header", "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption("#Radio_Contractor","CTR")
    
        //Salutation dropdown
        cy.dropDownClick("#Salutation_dropdown_field_control .v-input__append-inner > .v-icon");
        const salutationDropdownList = "Mr.Mrs.MissMs.Dr."
        cy.iframe("#atat-app").find("#Salutation_dropdown_field_control .v-list-item").then(($el) => {
            console.log($el.text())
            expect(Cypress.$($el).text()).to.eq(salutationDropdownList);
        });

        cy.iframe("#atat-app").find("#Salutation_DropdownListItem_Mr ")
            .should('have.text', 'Mr.').click({ force: true });
        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName,
            "#MiddleName_text_field",
            contactInfo.middleName,
            "#LastName_text_field",
            contactInfo.lastName,
            "#ContactEmail_text_field",
            contactInfo.email,
            "#ContactPhone_text_field",
            contactInfo.phoneNumber
        );
        
        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();

        //navigate to COR
        cy.textExists("h1.page-header", " Let’s gather info about your Contracting Officer’s Representative (COR) ");
        
        //manually enter the information
        cy.manuallyEnterContactInformation(
            " Manually enter your COR’s contact information ",
            " Your COR’s Contact Information ",
            " What role best describes your COR’s affiliation with the DoD? ",
            "#Radio_Military",
            "MIL"
        );

        cy.enterContactInformation(
            "#FirstName_text_field",
            contactInfo.firstName2,
            "#MiddleName_text_field",
            contactInfo.middleName1,
            "#LastName_text_field",
            contactInfo.lastName1,
            "#EmailAddress_text_field",
            contactInfo.email,
            "#PhoneNumber_text_field",
            contactInfo.phoneNumber,
            "cor",
            "D0DCCA"
        );

        //radio butttons        
        cy.radioBtn("#Radio_AccessToEditYes", "yes").click({ force: true });

        //Click on Continue button
        cy.btnExists("#ContinueButton", " Continue ").click();
    });       


});      
