import { bootstrapMockApis} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contact from "../../../selectors/contact.sel";
import commonCorAcor from "../../../selectors/commonCorAcor.sel";


describe("Test suite: Acquisition Package: Contact Information: COR ", () => {
    
  let contactInfo;
    
  beforeEach(() => {

    bootstrapMockApis();
    
    cy.fixture("contactInfo").then((info) => {
      contactInfo = info;
    });

    cy.launchATAT();
  });

      
  it("TC1: COR: Selected Contact Information", () => {        
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.contractorRadioBtn, "CONTRACTOR");
    
    //Salutation dropdown
    cy.dropDownClick(contact.salutationDropDownIcon); 
    cy.findElement(contact.salutationDropdownListItemMr)
      .should('have.text', 'Mr.').click({ force: true });
        
    // Enter the Contact Information
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
    cy.enterContactInformation(contactInformation);
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
    cy.checkIfCorOrAcor(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) ",
      "adam");

    //Verify the selected contact info
    cy.selectedContactInformation(
      " Test0 Adamson ",
      "mail test.adamson-civ@mail.mil ",
      "phone 333-333-3333",
      "pentagon HQ1234 - Corresponding Organization Name",
      " To update your COR’s contact information," +
        " please  submit a request to our User Engagement Team. ",
      " submit a request to our User Engagement Team. ",
      "Remove COR info "
    );
    // click on Request Change Contact Information link
    cy.requestChangeContactInformation(
      " submit a request to our User Engagement Team. ",
      " Request change to COR’s contact information ",
      " Please let us know what information needs to be updated for this COR. ​",
      "Please change the contact info"
    );
    cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not("to.be.disabled").click();
    // remove COR info
    cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, "Remove COR info ").click();
    cy.findElement(commonCorAcor.selectedContactCard)
      .and("not.exist");
  });

  it("TC2: COR: Search: No results found.", () => {   
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

  it("TC3: COR: Manually enter Contact information", () => {
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.contractorRadioBtn,"CONTRACTOR")
    
    //Salutation dropdown
    cy.dropDownClick(contact.salutationDropDownIcon);
    cy.findElement(contact.salutationDropdownListItemMr)
      .should('have.text', 'Mr.').click({ force: true });
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
    cy.enterContactInformation(contactInformation);
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
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );
        
    //manually enter the information
    cy.manuallyEnterContactInformation(
      " Manually enter your COR’s contact information ",
      " Your COR’s Contact Information ",
      " What role best describes your COR’s affiliation with the DoD? ",
      contact.militaryRadioBtn,
      "MILITARY"
    );
    const contactDetails = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName2,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName1,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName1,
      emailSelector: commonCorAcor.emailTxtBox,
      email: contactInfo.email,
      cor: "cor",
      dodText:"D0DCCA"
    };
    cy.enterContactInformation(contactDetails);
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Cro",
      contact.countryListItems,
      commonCorAcor.phoneInputBox,
      "521136541"
    );

    //radio butttons        
    cy.radioBtn(commonCorAcor.accessYesRadioBtn, "true").click({ force: true });

    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();
  });      

});      
