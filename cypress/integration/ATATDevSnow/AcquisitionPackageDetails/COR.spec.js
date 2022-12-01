import { bootstrapMockApis,randomNumber,randomString, prefixId} from "../../../helpers";
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

    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
  });

      
  it("TC1: COR: Selected Contact Information", () => {        
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.contractorRadioBtn, "CONTRACTOR");
    
    //Salutation dropdown
    cy.dropDownClick(contact.salutationDropDownIcon); 
    cy.textExists(contact.salutationDropdownListItemMr, 'Mr.').click({ force: true });
        
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
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
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
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
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
    cy.textExists(contact.salutationDropdownListItemMr, 'Mr.').click({ force: true });
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
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigate to COR
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );
        
    //manually enter the information
    cy.manuallyEnterContactInformation(
      "COR_",
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
    cy.enterContactInformation(contactDetails, "COR_");
    const phoneInputSelector = prefixId(commonCorAcor.phoneInputBox, "COR_");
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Cro",
      contact.countryListItems,
      phoneInputSelector,
      "521136541"
    );

    //radio butttons        
    cy.radioBtn(commonCorAcor.accessYesRadioBtn, "YES").click({ force: true });

    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();
  });      
  
  it("TC4: COR: Field Validations", () => {
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.contractorRadioBtn, "CONTRACTOR");
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigate to COR
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );
    //Validation message for search
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.findElement(commonCorAcor.searchContactInput).focus()
      .tab()
      .wait(1000).then(() => {
        cy.checkErrorMessage(
          commonCorAcor.searchError,
          "Please search for or manually enter your COR contact information."
        );
      });
    cy.btnExists(commonCorAcor.contactFormToggle, " Manually enter your COR’s contact information ")
      .click();
    cy.findElement(commonCorAcor.contactAffRadioGroupTxt).scrollIntoView();
    //Validation message for COR’s role
    cy.findElement(contact.militaryRadioBtn).tab().tab()
      .then(() => {
        cy.checkErrorMessage(commonCorAcor.contactRoleError, "Please enter your COR’s role.");
      });
    cy.findElement(contact.militaryRadioBtn).click({ force: true });

    //Validation message for Service Agency
    let selector, errorSelector;
    const prefix = "COR_";
    const branchDropdown = prefixId(commonCorAcor.serviceBranchDropdown, prefix);
    cy.findElement(branchDropdown).focus()
      .tab().then(() => {
        selector = prefixId(commonCorAcor.serviceBranchError, prefix);
        cy.checkErrorMessage(selector, "Please select your COR’s service branch.");
      })
    cy.findElement(branchDropdown).click({ force: true });
    selector = prefixId(commonCorAcor.serviceBranchDropdownList, prefix);
    cy.findElement(selector).first().click();
    //Validation message for Rank

    selector = prefixId(commonCorAcor.rankInput, prefix);
    errorSelector = prefixId(commonCorAcor.rankError, prefix);
    cy.verifyRequiredDropdown(
      selector,
      errorSelector,
      "Please select your COR’s rank."
    );
    // FirstName is blank
    selector = prefixId(contact.fNameTxtBox, prefix);
    errorSelector = prefixId(contact.fNameError, prefix);
    cy.verifyRequiredInput(
      selector,
      errorSelector,
      "Please enter your COR’s first name."
    );
    //LastName is blank
    selector = prefixId(contact.lNameTxtBox, prefix);
    errorSelector = prefixId(contact.lNameError, prefix);
    cy.verifyRequiredInput(
      selector,
      errorSelector,
      "Please enter your COR’s last name."
    );
    //Phone Number field is blank
    const phoneSelector = prefixId(commonCorAcor.phoneInputBox, prefix);
    const phoneErrorSelector = contact.phoneError;
    cy.verifyRequiredInput(
      phoneSelector,
      phoneErrorSelector,
      "Please enter your COR’s phone number"
    );
    //US phone Number is not in standard format
    const phoneNumber = randomNumber(8)
    cy.findElement(phoneSelector).type(phoneNumber)
      .blur({ force: true })
      .then(() => {
        cy.checkErrorMessage(
          phoneErrorSelector,
          "Please enter a number using the format for  United States (e.g., 999-999-9999).");
      });
    //email address is blank
    const emailSelector = prefixId(commonCorAcor.emailTxtBox, prefix);
    const emailErrorSelector = prefixId(commonCorAcor.emailError, prefix);
    cy.verifyRequiredInput(
      emailSelector,
      emailErrorSelector,
      "Please enter your COR’s email address."
    );
    // email in standard email format
    const email = randomString(5) + "@test.com"
    cy.findElement(emailSelector).should("be.visible").clear()
      .type(email).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          emailErrorSelector,
          "Please use your .mil or .gov email address."
        );
      });
    //DoDAAC field is blank 
    const dodaacSelector = prefixId(commonCorAcor.dodaacTxtBox, prefix);
    const dodaacErrorSelector = prefixId(commonCorAcor.dodaacError, prefix);
    cy.verifyRequiredInput(
      dodaacSelector,
      dodaacErrorSelector,
      "Please enter your COR’s 6-character DoDAAC."
    );
  });
});      
