import { bootstrapMockApis, randomNumber, randomString, prefixId,randomAlphaNumeric }
  from "../../../helpers";
import common from "../../../selectors/common.sel";
import co from "../../../selectors/contractOffice.sel";
import contact from "../../../selectors/contact.sel";
import commonCorAcor from "../../../selectors/commonCorAcor.sel";
import acor from "../../../selectors/acor.sel";

describe("Test suite: Acquisition Package: Contact Information: ACOR ", () => {
    
  let contactInfo;  
  let pt = "TC-Step-1-COR-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);  
    
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("contactInfo").then((info) => {
      contactInfo = info;
    });

    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists("#Step_AcquisitionPackageDetails .step-text", " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");    
    cy.fillNewAcquisition(pt, scope);
  });

  //Temporarily skipping this tc, this functionality not avilable on UI 
  it.skip("TC1: ACOR: Option is Yes: Selected Contact Information", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");   
    
    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");

    //navigate to COR
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );        
        
    //Click on Continue button    
    cy.btnExists(common.continueBtn, " Continue ").scrollIntoView().click();

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

  it("TC2: ACOR: Option is true: Enter ACOR information", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");   
    
    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");

    //navigate to COR
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );        
        
    //Click on Continue button    
    cy.btnExists(common.continueBtn, " Continue ").scrollIntoView().click();   
    const contactHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "COR_");
    cy.waitUntilElementIsGone(contactHeaderTxtSelector);

    //navigates to ACOR option to select yes or no
    cy.acorOption(acor.yesRadioBtn, "true");

    //manually enter the information
    cy.manuallyEnterContactInformation(      
      "ACOR_",
      " Your ACOR’s Contact Information ",
      " What role best describes your ACOR’s affiliation with the DoD? ",
      contact.militaryRadioBtn,
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

    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();
    const acorHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "ACOR_");
    cy.waitUntilElementIsGone(acorHeaderTxtSelector);
    cy.verifyPageHeader("Let’s see if you qualify for an exception to fair opportunity");
    
  });

  it("TC3: ACOR: Option is No", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");   
    
    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");

    //navigate to COR
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );        
        
    //Click on Continue button    
    cy.btnExists(common.continueBtn, " Continue ").scrollIntoView().click();   
    const contactHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "COR_");
    cy.waitUntilElementIsGone(contactHeaderTxtSelector);

    //navigates to ACOR option to select yes or no
        
    cy.acorOption(acor.noRadioBtn, "false");

  });  

  it("TC4: ACOR:Field Validations", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");   
    
    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");

    //navigate to COR
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );        
        
    //Click on Continue button    
    cy.btnExists(common.continueBtn, " Continue ").scrollIntoView().click();   
    const contactHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "COR_");
    cy.waitUntilElementIsGone(contactHeaderTxtSelector);

    //navigates to ACOR option to select yes or no
    cy.acorOption(acor.yesRadioBtn, "true");    
    
    cy.findElement(commonCorAcor.contactAffRadioGroupTxt).scrollIntoView();
    //Validation message for ACOR’s role
    cy.findElement(contact.militaryRadioBtn).focus();
    cy.clickSomethingElse(commonCorAcor.contactRoleError)
      .then(() => {
        cy.checkErrorMessage(commonCorAcor.contactRoleError, "Please enter your ACOR’s role.");
      });
    cy.findElement(contact.militaryRadioBtn).click({ force: true });

    //Validation message for Service Agency
    let selector, errorSelector;
    const prefix = "ACOR_";
    const branchDropdown = prefixId(commonCorAcor.serviceBranchDropdown, prefix);

    cy.findElement(branchDropdown).focus()
    cy.clickSomethingElse(selector).then(() => {
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
    const pNo = randomNumber(10);
    cy.findElement(phoneSelector).type(pNo);
    cy.clickSomethingElse(branchDropdown).then(() => {
      cy.findElement(phoneSelector).scrollIntoView();
      cy.findElement(phoneErrorSelector).should("not.exist");      
    }); 
    //US phone Number is not in standard format
    const phoneNumber = randomNumber(8)
    cy.findElement(phoneSelector).clear().type(phoneNumber)
    cy.clickSomethingElse(phoneErrorSelector)
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
    const validEmail = randomString(5)+"@test.mil"
    cy.findElement(emailSelector).type(validEmail);
    cy.clickSomethingElse(emailSelector).then(() => {
      cy.findElement(emailSelector).scrollIntoView();
      cy.findElement(emailErrorSelector).should("not.exist");      
    });
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
