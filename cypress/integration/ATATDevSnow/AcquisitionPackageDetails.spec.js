import { bootstrapMockApis } from "../../helpers";
import projectOverview from "../../selectors/projectOverview.sel";
import common from "../../selectors/common.sel";
import financialDetails from "../../selectors/financialDetails.sel";
import org from "../../selectors/org.sel";
import contact from "../../selectors/contact.sel";
import commonCorAcor from "../../selectors/commonCorAcor.sel";
import acor from "../../selectors/acor.sel";

describe("Test suite: Acquisition Package ", () => {
    
    let projectDetails;
    let orgAddressType;
    let contactInfo;
    
    beforeEach(() => {
        const isTestingLocally = Cypress.env("isTestingLocally") === "true";
        const runTestsInIframe = Cypress.env("isTestingInIframe") === "true";

        bootstrapMockApis();

        cy.fixture("projectOverview").then((details) => {
            projectDetails = details;
        });
        cy.fixture("orgAddressType").then((types) => {
            orgAddressType = types;
        });
        cy.fixture("contactInfo").then((info) => {
            contactInfo = info;
        });

        if (isTestingLocally){
            cy.visit(Cypress.env("localTestURL"));    
            if (runTestsInIframe) {
                cy.visit(Cypress.env("localTestURLInIframe"));    
                cy.frameLoaded(common.app);        
            } else {
                cy.visit(Cypress.env("localTestURL"));    
            }

        } else {
            cy.visit(Cypress.env("testURL"));    
            cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
            cy.get(common.title).should('have.text', 'DISA Sandbox home page - DISA Sandbox');
            cy.frameLoaded(common.app);
        }
    });

    it("TC1: Acquisition Package Substeps on the Vertical Stepper", () => {
        
        //Verify the text of Acquistion Package details is visible 
        cy.textExists("#Step_AcquisitionPackageDetails .step-text", " Acquisition Package Details ");

        //Verify the Substeps are  visible
        cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");
        cy.textExists(common.subStepOrganizationTxt, " Organization ");
        cy.textExists(common.subStepContactInformationTxt, " Contact Information ");
            
    });
    
    it("TC2: Acquisition Package step is active", () => {
        cy.findElement(common.stepAcquisitionCircle)
            .should("be.visible")
            .and('have.css', 'color', 'rgb(84, 68, 150)')
            .click();
    });

    it("TC3: Asserts on Let’s start with basic info about your new acquisition", () => {

        // lands on New Acquistion Package
        //header of the view
        cy.textExists(common.packageNameHeader, "New Acquisition");
        
        //Sub header
        cy.textExists(common.header, " Let’s start with basic info about your new acquisition ");
        
        //label of the "Project/Requirement Title" text
        cy.textExists(projectOverview.projectTitleLabel, " Project/Requirement Title ");

        //tooltip
        const expectedText = " Provide a short, descriptive title of the work to be performed. This will be used to refer to this project within ATAT and across all acquisition forms. "
        cy.hoverToolTip(projectOverview.toolTipBtn, projectOverview.toolTipTxt, expectedText);
        
        //Enter the Value
        cy.enterTextInTextField(projectOverview.projectTitleTxtBox, projectDetails.projectTitle).blur({ force: true })
            .then(($el) => {
                cy.log($el.val());
                const enteredText = $el.val();
                if (enteredText === "") {
                    cy.textExists(common.packageNameHeader, "New Acquisition");
                } else {
                    cy.textExists(common.packageNameHeader, enteredText);
                };
            });
        
        //label of the "Projectscope" text
        cy.textExists(projectOverview.scopeLabel, " What is the scope of your requirement? ");
        
        //Enter What the scope requirement
        cy.enterTextInTextField(projectOverview.scopeTxtBox, projectDetails.scope).click();
        
        //Assert Emergency declaration text          
        cy.findElement(projectOverview.emergencyDeclaration).then(($emergencytext) => {
                expect($emergencytext).to.have.text(" Is this requirement in support of an emergency declaration? ");
            });
        
        //Assert radio button
        cy.radioBtn(projectOverview.radioBtnNo, "no").not("[disabled]");
        
        //select radio button
        cy.radioBtn(projectOverview.radioBtnYes, "yes").not("[disabled]").click({ force: true });        
        
        //buttons that exists on the view
        cy.btnExists(common.continueBtn, " Continue ");
        cy.btnExists(projectOverview.cancelBtn, " Cancel ");
    });

    it("TC4: Organization: Asserts: Next,we'll gather information about your organization", () => {
    
        cy.fillNewAcquisition(projectDetails.projectTitle1, projectDetails.scope1);
        
        // Navigates to "Organization"
        cy.textExists(common.packageNameHeader, projectDetails.projectTitle1);

        //header 
        cy.textExists(common.header, " Next, we’ll gather information about your organization ");

        //text Label
        cy.textExists(org.serviceAgencyLabel, " What service or agency do you work for? ");

        //Select the Value from Service or agency dropdown
        cy.serviceOrAgency("Defense");

        //section One
        cy.textExists(org.sectionOneHeaderText, "1. Tell us more about your organization");
        cy.textExists(org.orgNameTxtLabel, " Organization name ");
        cy.enterTextInTextField(org.orgNameTxtBox, "TestDepartmentof Defense");
        cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
        cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDD");

        //section Two
        cy.textExists(org.sectionTwoHeaderText, "2. What is your organization’s address?");

        //Assert radio group text  
        const addressType = ["U.S.address", "Military", "Foreign address"];
        let foundRadioOptions = 0;
        cy.findElement(org.addressTypeRadioGroup)
            .children()
            .each(($addressTypetext) => {
                const text = $addressTypetext;
                if (addressType.indexOf(text) > -1) {
                    foundRadioOptions++
                };
                return foundRadioOptions === addressType.length;
            });
        
        //radio buttons        
        cy.radioBtn(org.usaRadioBtn, "US").not("[disabled]");
        cy.radioBtn(org.militaryradioBtn, "MILITARY").not("[disabled]");
        cy.radioBtn(org.foreignradioBtn, "FOREIGN").not("[disabled]");

        //Assert Organization's address labels
        cy.textExists(org.streetLabel, " Street address ");
        cy.textExists(org.unitLabel, " Unit, suite, etc.  Optional ");
        cy.textExists(org.cityLabel, " City ");
        cy.textExists(org.stateLabel,  " State ");
        cy.textExists(org.zipCodeLabel, " ZIP code ");

        //enter the text in the text fields
        cy.enterOrganizationAddress(orgAddressType.StreetAddress, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Assert buttons
        cy.btnExists(common.continueBtn, " Continue ");
        cy.btnExists(common.backBtn, "Back");

    });  

    it("TC5: Organization: Service Agency selected is DISA", () => {
        
        cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 

        // Navigates to "Organization"
        cy.textExists(common.header, " Next, we’ll gather information about your organization ");

        // Serviceagency is DISA
        cy.serviceOrAgency("Defense Information Systems");
        cy.textExists(org.disaDropDownLabel," DISA Organization ");
        cy.autoCompleteSelection(org.disaOrgInput, "Assistan",org.disaAutoComplete);
        cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
        cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDD");
        cy.enterOrganizationAddress(orgAddressType.StreetAddress1, orgAddressType.Unit, orgAddressType.City, orgAddressType.State, orgAddressType.Zipcode);

        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");
    
    });

    it("TC6: Organization: Service Agency selected is  not DISA", () => {
        cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 
        cy.textExists(common.header, " Next, we’ll gather information about your organization ");

        //Service Agency is not DISA
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField(org.orgNameTxtBox, "TestDepartmentof Defense");
        cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDCEC");
        cy.enterOrganizationAddress(
            orgAddressType.StreetAddress2,
            orgAddressType.Unit,
            orgAddressType.City,
            orgAddressType.State,
            orgAddressType.Zipcode
        );
        
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();
        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

    });

    it("TC7: Organization: Request to add your agency", () => {
        cy.clickSideStepper(common.subStepOrganizationLink, " Organization ");
        // Navigates to "Organization"
        cy.textExists(org.requestAgencyLink,  " Request to have your agency added ").click();
        cy.textExists(org.requestModalTitle, " Request to add your agency ").should("exist");
        cy.textExists(org.agencyOrgNameTxtLabel, " Agency/Organization Name ");
        
    });    

    it("TC8: Asserts on Let’s confirm your contact information", () => {
        cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
        cy.textExists(common.header, " Next, we’ll gather information about your organization ");

        //Service Agency is not DISA
        cy.serviceOrAgency("Communications");
        cy.enterTextInTextField(org.orgNameTxtBox,  "TestDepartmentof Defense");
        cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDCEC");
        cy.enterOrganizationAddress(
            orgAddressType.StreetAddress,
            orgAddressType.Unit,
            orgAddressType.City,
            orgAddressType.State,
            orgAddressType.Zipcode
        );

        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();       

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");
        
        //list of contactrole
        cy.findElement(contact.contactRoleTxt).then(($contactrole) => {
                expect($contactrole).to.have.text(" What role best describes your affiliation with the DoD? ");
            });
        
        //Assert radio options
        cy.radioBtn(contact.militaryRadioBtn, "MIL").not("[disabled]");
        cy.radioBtn(contact.civilianRadioBtn,"CIV").not("[disabled]");
        cy.radioBtn(contact.contractorRadioBtn,"CTR").not("[disabled]");

        //select radio button
        cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIV");

        //Salutation dropdown
        cy.dropDownClick(contact.salutationDropDownIcon);
        const salutationDropdownList = "Mr.Mrs.MissMs.Dr."
        cy.findElement(contact.salutationDropDownList).then(($el) => {
                console.log($el.text());
                expect(Cypress.$($el).text()).to.eq(salutationDropdownList);
            });
        
         //select the salutationfrom dropdown
        cy.findElement(contact.salutationDropdownListItemMr)
            .should("have.text", "Mr.").click({ force: true });
        
        // Assert ContactInformation Labels
        cy.textExists(contact.fNameLabel, " First name ");     
        cy.textExists(contact.lNameLabel, " Last name ");        
        cy.textExists(contact.mNameLabel, " Middle name  Optional ");  
        cy.textExists(contact.emailLabel, " Your email ");
        cy.textExists(contact.emailMessage, " Enter a .mil or .gov email address. ");
        cy.textExists(contact.phoneNumberLabel, " Your phone number ");
        
         //Enter the Contact Information
        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName,
            contact.mNameTxtBox,
            contactInfo.middleName,
            contact.lNameTxtBox,
            contactInfo.lastName,
            contact.emailTxtBox,
            contactInfo.email
        );
        //select the country and enter phonenumber
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "united",
            contact.countryListItems,
            contact.phoneInputBox,
            "5327845362"
        );
    });

    it("TC9: Contact Information: Role is Military", () => {
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information"); 
        
        //select radio button
        cy.contactRoleRadioBtnOption(contact.militaryRadioBtn,"MIL");           

        //Click Rank dropdown
        cy.dropDownClick(contact.rankInput);            
    
        //select the value from Rank Dropdown
        cy.findElement(contact.rankAutoCompleteList).first().click({ force: true });

        //enter the ContactInformation
        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName1,
            contact.mNameTxtBox,
            contactInfo.middleName1,
            contact.lNameTxtBox,
            contactInfo.lastName1,
            contact.emailTxtBox,
            contactInfo.email1,
        );
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "Defense",
            contact.countryListItems,
            contact.phoneInputBox,
            "312-560-1000"); 
        
    });

    it("TC10: Contact Information: Role is Civilian", () => {
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 
    
        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIV");

        //select the value from salutationDropdownList
        cy.dropDownClick(contact.salutationDropDownIcon);
        cy.findElement(contact.salutationDropdownListItemMrs)
            .should("have.text", "Mrs.").click({ force: true });      
        
         //Enter contact information
        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName2,
            contact.mNameTxtBox,
            contactInfo.middleName2,
            contact.lNameTxtBox,
            contactInfo.lastName2,
            contact.emailTxtBox,
            contactInfo.email2,            
        );
        //select the country and enter phoneNumber
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "ita",
            contact.countryListItems,
            contact.phoneInputBox,
            "32349808871"); 
        //Select the Grade 
        cy.textExists(contact.gradeLabel, " Grade  Optional ");
        cy.dropDownClick(contact.gradeDropDownIcon);
        cy.autoCompleteSelection(contact.gradeInput, "GS-05",contact.gradeDropDownList );
    
    });
    
    it("TC11: Contact Information: Role is Contractor", () => {
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 
    
        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption(contact.contractorRadioBtn, "CTR");    
        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName3,
            contact.mNameTxtBox,
            contactInfo.middleName3,
            contact.lNameTxtBox,
            contactInfo.lastName3,
            contact.emailTxtBox,
            contactInfo.email3,
        );

        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "Alb",
            contact.countryListItems,
            contact.phoneInputBox,
            "351245121"); 
    });
    
    it("TC12: COR: Selected Contact Information", () => {        
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption(contact.contractorRadioBtn, "CTR");
    
        //Salutation dropdown
        cy.dropDownClick(contact.salutationDropDownIcon); 
        cy.findElement(contact.salutationDropdownListItemMr)
            .should('have.text', 'Mr.').click({ force: true });
        
        // Enter the Contact Information
        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName,
            contact.mNameTxtBox,
            contactInfo.middleName,
            contact.lNameTxtBox,
            contactInfo.lastName,
            contact.emailTxtBox,
            contactInfo.email,
            );
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "Cze",
            contact.countryListItems,
            contact.phoneInputBox,
            "5124365211");
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();
        
        //navigate to COR
        cy.checkIfCorOrAcor(common.header, " Let’s gather info about your Contracting Officer’s Representative (COR) ", "adam");

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
        cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not("to.be.disabled").click();
        // remove COR info
        cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, "Remove COR info ").click();
        cy.findElement(commonCorAcor.selectedContactCard)
            .and("not.exist");
    });

    it("TC13: COR: Search: No results found.", () => {   
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");        
        
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();
        
        //navigate to COR
        cy.checkIfCorOrAcor(
            common.header,
            " Let’s gather info about your Contracting Officer’s Representative (COR) ",
            "test",
            " Manually enter my COR’s contact information ");

    });    

    it("TC14: COR: Manually enter Contact information", () => {
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //select radio button
        cy.contactRoleRadioBtnOption(contact.contractorRadioBtn,"CTR")
    
        //Salutation dropdown
        cy.dropDownClick(contact.salutationDropDownIcon);
        cy.findElement(contact.salutationDropdownListItemMr)
            .should('have.text', 'Mr.').click({ force: true });
        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName,
            contact.mNameTxtBox,
            contactInfo.middleName,
            contact.lNameTxtBox,
            contactInfo.lastName,
            contact.emailTxtBox,
            contactInfo.email            
        );
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "Cze",
            contact.countryListItems,
            contact.phoneInputBox,
            "5124365211");
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigate to COR
        cy.textExists(common.header, " Let’s gather info about your Contracting Officer’s Representative (COR) ");
        
        //manually enter the information
        cy.manuallyEnterContactInformation(
            " Manually enter your COR’s contact information ",
            " Your COR’s Contact Information ",
            " What role best describes your COR’s affiliation with the DoD? ",
            contact.militaryRadioBtn,
            "MIL"
        );

        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName2,
            contact.mNameTxtBox,
            contactInfo.middleName1,
            contact.lNameTxtBox,
            contactInfo.lastName1,
            commonCorAcor.emailTxtBox,
            contactInfo.email,            
            "cor",
            "D0DCCA"
        );
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "Cro",
            contact.countryListItems,
            commonCorAcor.phoneInputBox,
            "521136541"
        );

        //radio butttons        
        cy.radioBtn(commonCorAcor.accessYesRadioBtn, "yes").click({ force: true });

        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();
    });       

    it("TC15: ACOR: Option is Yes: Selected Contact Information", () => {
        cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigate to COR
        cy.textExists(common.header, " Let’s gather info about your Contracting Officer’s Representative (COR) ");        
        
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigates to ACOR option to select yes or no
        cy.acorOption(acor.yesRadioBtn, "true");
        cy.checkIfCorOrAcor(common.header, " Let’s gather info about your ACOR ", "Selia");
        cy.selectedContactInformation(
            " Selia Wentzel ",
            "mail sel.wentz@acusage.net ",
            "phone 444-444-4444",
            "pentagon HQ567 - Other Organization Name",
            " To make any changes to your ACOR’s contact information, please send a request to our User Engagement Team. ",
            " Request changes to ACOR’s contact information ",
            "Remove ACOR info "
        );
        
        // click on Request Change Contact Information link
        cy.requestChangeContactInformation(
            " Request changes to ACOR’s contact information ",
            " Request change to ACOR's contact information ",
            " Please let us know what information needs to be updated for this ACOR. ​",
            "Please change the contact info"
        );
        cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not("to.be.disabled").click();
        // remove COR info
        cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, "Remove ACOR info ").click();
        cy.findElement(commonCorAcor.selectedContactCard).and("not.exist");

    });  

    it("TC16: ACOR: Option is Yes: Manually enter Contact information", () => {
        cy.clickSideStepper(common.subStepContactInformationLink," Contact Information "); 

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigate to COR
        cy.textExists(common.header, " Let’s gather info about your Contracting Officer’s Representative (COR) ");        
        
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigates to ACOR option to select yes or no
        cy.acorOption(acor.yesRadioBtn, "true");

        //manually enter the information
        cy.manuallyEnterContactInformation(
            " Manually enter your ACOR’s contact information ",
            " Your ACOR’s Contact Information ",
            " What role best describes your ACOR’s affiliation with the DoD? ",
            "#Radio_Military",
            "MIL"
        );

        cy.enterContactInformation(
            contact.fNameTxtBox,
            contactInfo.firstName,
            contact.mNameTxtBox,
            contactInfo.middleName1,
            contact.lNameTxtBox,
            contactInfo.lastName1,
            commonCorAcor.emailTxtBox,
            contactInfo.email,            
            "cor",
            "D0DCCA"
        );
        cy.enterPhoneNumber(
            contact.phoneControlIcon,
            contact.phoneDropdown,
            "Cana",
            contact.countryListItems,
            commonCorAcor.phoneInputBox,
            "56987412564");

        //radio butttons        
        cy.radioBtn(commonCorAcor.accessYesRadioBtn, "yes").click({ force: true });

        //Click on Continue button
        cy.btnExists(common.continueBtn,  " Continue ").click();
        

    });
    it("TC17: ACOR: Option is No", () => {
        cy.clickSideStepper(common.subStepContactInformationLink," Contact Information "); 

        //Navigates to Contact information
        cy.textExists(common.header, "Let’s confirm your contact information");

        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigate to COR
        cy.textExists(common.header, " Let’s gather info about your Contracting Officer’s Representative (COR) ");        
        
        //Click on Continue button
        cy.btnExists(common.continueBtn, " Continue ").click();

        //navigates to ACOR option to select yes or no
        
        cy.acorOption(acor.noRadioBtn, "false");

    });  

});      
