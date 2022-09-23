import { bootstrapMockApis,randomNumber,randomString, prefixId} from "../../../helpers";
import common from "../../../selectors/common.sel";
import contact from "../../../selectors/contact.sel";
import commonCorAcor from "../../../selectors/commonCorAcor.sel";
import acor from "../../../selectors/acor.sel";

describe("Test suite: Acquisition Package: Contact Information: ACOR ", () => {
    
  let contactInfo;
    
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("contactInfo").then((info) => {
      contactInfo = info;
    });

    cy.launchATAT();
  });

  it("TC1: ACOR: Option is Yes: Selected Contact Information", () => {
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //Click on Continue button
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigate to COR
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );        
        
    //Click on Continue button    
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigates to ACOR option to select yes or no
    cy.acorOption(acor.yesRadioBtn, "true");
    cy.checkIfCorOrAcor(common.header, " Let’s gather info about your ACOR ", "Test2");
    cy.selectedContactInformation(
      " Test2 Wentzel ",
      "mail test.wentz@acusage.net ",
      "phone 444-444-4444",
      "pentagon HQ567 - Other Organization Name",
      " To update your ACOR’s contact information," +
        " please  submit a request to our User Engagement Team. ",
      " submit a request to our User Engagement Team. ",
      "Remove ACOR info "
    );
        
    // click on Request Change Contact Information link
    cy.requestChangeContactInformation(
      " submit a request to our User Engagement Team. ",
      " Request change to ACOR’s contact information ",
      " Please let us know what information needs to be updated for this ACOR. ​",
      "Please change the contact info"
    );
    cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not("to.be.disabled").click();
    // remove COR info
    cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, "Remove ACOR info ").click();
    cy.findElement(commonCorAcor.selectedContactCard).and("not.exist");

  });  

  it("TC2: ACOR: Option is true: Manually enter Contact information", () => {
    cy.clickSideStepper(common.subStepContactInformationLink," Contact Information "); 

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //Click on Continue button
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigate to COR
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );        
        
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigates to ACOR option to select yes or no
    cy.acorOption(acor.yesRadioBtn, "true");

    //manually enter the information
    cy.manuallyEnterContactInformation(
      "ACOR_",
      " Manually enter your ACOR’s contact information ",
      " Your ACOR’s Contact Information ",
      " What role best describes your ACOR’s affiliation with the DoD? ",
      "#Radio_Military",
      "MILITARY"
    );
    const contactDetails = {
      firstNameSelector: contact.fNameTxtBox,
      firstName: contactInfo.firstName2,
      mNameSelector: contact.mNameTxtBox,
      mName: contactInfo.middleName2,
      lastNameSelector: contact.lNameTxtBox,
      lastName: contactInfo.lastName1,
      emailSelector:commonCorAcor.emailTxtBox,
      email: contactInfo.email,
      cor: "cor",
      dodText:"D0DCCA"
    };
    cy.enterContactInformation(contactDetails, "ACOR_");
    const phoneInputSelector = prefixId(commonCorAcor.phoneInputBox, "ACOR_");
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Cana",
      contact.countryListItems,
      phoneInputSelector,
      "56987412564");

    //radio butttons        
    cy.radioBtn(commonCorAcor.accessYesRadioBtn, "YES").click({ force: true });

    //Click on Continue button
    cy.btnExists(common.continueBtn,  " Continue ").click();
    
  });

  it("TC3: ACOR: Option is No", () => {
    cy.clickSideStepper(common.subStepContactInformationLink," Contact Information "); 

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //Click on Continue button
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigate to COR
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );        
        
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigates to ACOR option to select yes or no
        
    cy.acorOption(acor.noRadioBtn, "false");

  });  

  it("TC4: ACOR:Field Validations", () => {
    cy.clickSideStepper(common.subStepContactInformationLink," Contact Information "); 

    //Navigates to Contact information
    cy.textExists(common.header, "Let’s confirm your contact information");

    //Click on Continue button
    cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    cy.btnExists(common.continueBtn, " Continue ").click();

    //navigate to COR
    cy.textExists(
      common.header,
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );        
        
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.acorOption(acor.yesRadioBtn, "true");
    //Validation message for search
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.findElement(commonCorAcor.searchContactInput).focus()
      .tab()
      .wait(1000).then(() => {
        cy.checkErrorMessage(
          commonCorAcor.searchError,
          "Please search for or manually enter your ACOR contact information.");
      });
    cy.btnExists(commonCorAcor.contactFormToggle,
      " Manually enter your ACOR’s contact information ")
      .click();
    cy.findElement(commonCorAcor.contactAffRadioGroupTxt).scrollIntoView();
    //Validation message for ACOR’s role
    cy.findElement(contact.militaryRadioBtn).tab().tab()
      .then(() => {
        cy.checkErrorMessage(commonCorAcor.contactRoleError, "Please enter your ACOR’s role.");
      });
    cy.findElement(contact.militaryRadioBtn).click({ force: true });

    //Validation message for Service Agency
    let selector, errorSelector;
    const prefix = "ACOR_";
    const branchDropdown = prefixId(commonCorAcor.serviceBranchDropdown, prefix);

    cy.findElement(branchDropdown).focus()
      .tab().then(() => {
        selector = prefixId(commonCorAcor.serviceBranchError, prefix);
        cy.checkErrorMessage(
          selector,
          "Please select your ACOR’s service branch.");
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
      "Please select your ACOR’s rank."); 
    // FirstName is blank
    selector = prefixId(contact.fNameTxtBox, prefix);
    errorSelector = prefixId(contact.fNameError, prefix);
    cy.verifyRequiredInput(
      selector,
      errorSelector,
      "Please enter your ACOR’s first name."
    );
    //LastName is blank
    selector = prefixId(contact.lNameTxtBox, prefix);
    errorSelector = prefixId(contact.lNameError, prefix);
    cy.verifyRequiredInput(
      selector,
      errorSelector,
      "Please enter your ACOR’s last name."
    );
    //Phone Number field is blank
    const phoneSelector = prefixId(commonCorAcor.phoneInputBox, prefix);
    const phoneErrorSelector = contact.phoneError;
    cy.verifyRequiredInput(
      phoneSelector,
      phoneErrorSelector,
      "Please enter your ACOR’s phone number"
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
      "Please enter your ACOR’s email address."
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
      "Please enter your ACOR’s 6-character DoDAAC."
    );
    
  });
});      
