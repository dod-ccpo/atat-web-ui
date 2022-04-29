import { bootstrapMockApis} from "../../../helpers";
import common from "../../../selectors/common.sel";
import org from "../../../selectors/org.sel";
import contact from "../../../selectors/contact.sel";

describe("Test suite: Acquisition Package: Contact Information ", () => {
    
  let projectDetails;
  let orgAddressType;
  let contactInfo;
    
  beforeEach(() => {
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

    cy.launchATAT();
  });

  it("TC1: Contact Information step is active", () => {
    cy.findElement(common.stepAcquisitionText)
      .should("be.visible")
      .and('have.css', 'color', 'rgb(84, 68, 150)')
    cy.findElement(common.subStepContactInformationLink).click();
    cy.findElement(common.subStepContactInformationTxt)
      .should("be.visible")
      .and('have.css', 'color', 'rgb(84, 68, 150)');
  });

  it("TC2: Asserts: Let’s confirm your contact information", () => {
    cy.fillNewAcquisition(projectDetails.projectTitle3, projectDetails.scope3);
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");

    //Service Agency is not DISA
    cy.serviceOrAgency("Communications");
    cy.enterTextInTextField(org.orgNameTxtBox,  "TestDepartmentof Defense");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDCEC");
    const orgAddress= {
      streetAddress: orgAddressType.StreetAddress,
      unit : orgAddressType.Unit1,            
      city : orgAddressType.City,
      state:   orgAddressType.State,
      zipCode: orgAddressType.Zipcode,
            
    }
    cy.enterOrganizationAddress(orgAddress);

    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();       

    //Navigates to Contact information
    cy.findElement(common.wrap).scrollTo('top', { easing: 'linear' });
    cy.textExists(common.header, "Let’s confirm your contact information");
        
    //list of contactrole
    cy.findElement(contact.contactRoleTxt).then(($contactrole) => {
      expect($contactrole).to.have.text(
        " What role best describes your affiliation with the DoD? "
      );
    });
        
    //Assert radio options
    cy.radioBtn(contact.militaryRadioBtn, "MILITARY").not("[disabled]");
    cy.radioBtn(contact.civilianRadioBtn,"CIVILIAN").not("[disabled]");
    cy.radioBtn(contact.contractorRadioBtn,"CONTRACTOR").not("[disabled]");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");

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
    cy.textExists(contact.emailMessage, " Enter a .mil or .gov email address.");
    cy.textExists(contact.phoneNumberLabel, " Your phone number ");
    const contactInformation = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName,
      emailSelector: contact.emailTxtBox,
      email: contactInfo.email
            
    };
        
    //Enter the Contact Information
    cy.enterContactInformation(contactInformation);
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

  it("TC3: Role is Military", () => {
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information"); 
        
    //select radio button
    cy.contactRoleRadioBtnOption(contact.militaryRadioBtn,"MILITARY");           

    //Click Rank dropdown
    cy.dropDownClick(contact.rankInput);            
    
    //select the value from Rank Dropdown
    cy.findElement(contact.rankAutoCompleteList).first().click({ force: true });

    //enter the ContactInformation
    const contactInformation = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName1,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName1,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName1,
      emailSelector: contact.emailTxtBox,
      email: contactInfo.email1,
            
    };
    cy.enterContactInformation(contactInformation);
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Defense",
      contact.countryListItems,
      contact.phoneInputBox,
      "312-560-1000"); 
        
  });

  it("TC4: Role is Civilian", () => {
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 
    
    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");

    //select the value from salutationDropdownList
    cy.dropDownClick(contact.salutationDropDownIcon);
    cy.findElement(contact.salutationDropdownListItemMrs)
      .should("have.text", "Mrs.").click({ force: true });  
        
    const contactInformation = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName2,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName2,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName2,
      emailSelector: contact.emailTxtBox,
      email: contactInfo.email2,
            
    };
    //Enter contact information
    cy.enterContactInformation(contactInformation);
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
    
  it("TC5: Role is Contractor", () => {
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 
    
    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.contractorRadioBtn, "CONTRACTOR");  
    const contactInformation = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName3,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName3,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName3,
      emailSelector: contact.emailTxtBox,
      email: contactInfo.email3
            
    };
    cy.enterContactInformation(contactInformation);

    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Alb",
      contact.countryListItems,
      contact.phoneInputBox,
      "351245121"); 
  });    
  
});      
