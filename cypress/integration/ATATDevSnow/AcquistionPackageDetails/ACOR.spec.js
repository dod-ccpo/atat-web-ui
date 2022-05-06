import { bootstrapMockApis,randomNumber,randomString} from "../../../helpers";
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
    cy.enterContactInformation(contactDetails);
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Cana",
      contact.countryListItems,
      commonCorAcor.phoneInputBox,
      "56987412564");

    //radio butttons        
    cy.radioBtn(commonCorAcor.accessYesRadioBtn, "true").click({ force: true });

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
    //Validation message for  COR’s role
    cy.findElement(contact.militaryRadioBtn).tab().tab()
      .then(() => {
        cy.checkErrorMessage(commonCorAcor.contactRoleError, "Please enter your ACOR’s role.");
      });
    cy.findElement(contact.militaryRadioBtn).click({ force: true });
    //Validation message for Service Agency
    cy.findElement(commonCorAcor.serviceBranchDropdown).focus()
      .tab().then(() => {
        cy.checkErrorMessage(
          commonCorAcor.serviceBranchError,
          "Please select your ACOR’s service branch.");
      })
        
    cy.findElement(commonCorAcor.serviceBranchDropdown).click({ force: true });
    cy.findElement(commonCorAcor.serviceBranchDropdownList).first().click();
    //Validation message for Rank
    cy.verifyRequiredDropdown(
      commonCorAcor.rankInput,
      commonCorAcor.rankError,
      "Please select your ACOR’s rank."); 
    // FirstName is blank
    cy.verifyRequiredInput(
      contact.fNameTxtBox,
      contact.fNameError,
      "Please enter your ACOR’s first name.");
    //LastName is blank
    cy.verifyRequiredInput(
      contact.lNameTxtBox,
      contact.lNameError,
      "Please enter your ACOR’s last name.");
    //Phone Number field is blank
    cy.findElement(contact.lNameTxtBox).tab().tab().tab().tab().then(() => {
      cy.checkErrorMessage(
        contact.phoneError,
        "Please enter your ACOR’s phone number");
    });
    //US phone Number is not in standard format
    const phoneNumber = randomNumber(8)
    cy.findElement(contact.lNameTxtBox).tab().tab().tab().type(phoneNumber)
      .focus().blur({ force: true })
      .then(() => {
        cy.checkErrorMessage(
          contact.phoneError,
          "Please enter a number using the format for  United States (e.g., 999-999-9999)."
        );
      });
    //email address is blank
    cy.verifyRequiredInput(
      commonCorAcor.emailTxtBox,
      commonCorAcor.emailError,
      "Please enter your ACOR’s email address.");
    //email in standard email format
    const email = randomString(5)+"@test.com"
    cy.findElement(commonCorAcor.emailTxtBox).should("be.visible").clear()
      .type(email).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          commonCorAcor.emailError,
          "Please use your .mil or .gov email address.");
      });
    //DoDAAC field is blank 
    cy.verifyRequiredInput(
      commonCorAcor.dodaacTxtBox,
      commonCorAcor.dodaacError,
      "Please enter your ACOR’s 6-character DoDAAC.");
    
  });
});      
