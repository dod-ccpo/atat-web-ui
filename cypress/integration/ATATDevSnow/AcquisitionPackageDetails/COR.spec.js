import {  bootstrapMockApis,randomNumber,randomString,prefixId,randomAlphaNumeric
} from "../../../helpers";
import co from "../../../selectors/contractOffice.sel";
import common from "../../../selectors/common.sel";
import org from "../../../selectors/org.sel";
import contact from "../../../selectors/contact.sel";
import commonCorAcor from "../../../selectors/commonCorAcor.sel";

describe("Test suite: Acquisition Package: Contact Information: COR ", () => {
    
  let orgAddressType;
  let contactInfo;  
  let pt = "TC-Step-1-COR-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);  

  beforeEach(() => {
    bootstrapMockApis();
    
    cy.fixture("orgAddressType").then((types) => {
      orgAddressType = types;
    });
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
  
  it("TC1: COR: Enter COR Details", () => {
    //Service Agency is not DISA
    cy.agency("Communications");
    cy.enterTextInTextField(org.orgNameTxtBox,  "TestDepartmentof Defense");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDCEC");
    const orgAddress = {
      streetAddress: orgAddressType.StreetAddress,
      unit: orgAddressType.Unit1,
      city: orgAddressType.City,
      state: orgAddressType.State,
      zipCode: orgAddressType.Zipcode,
            
    };
    cy.findElement(org.usaRadioBtn).click({ force: true });
    cy.enterOrganizationAddress(orgAddress);

    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.waitUntilElementIsGone(org.foreignradioBtn);

    //Navigates to Contact information    
    cy.verifyPageHeader(
      "Let’s find out about the primary point of contact for this requirement"
    );    

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN")
    
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
    cy.enterTextInTextField(contact.titleTxtBox, "Specialist");
    cy.enterContactInformation(contactInformation);
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Cze",
      contact.countryListItems,
      contact.phoneInputBox,
      "5124365211");
    //Click on Continue button    
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.waitUntilElementIsGone(contact.emailTxtBox);
    //navigate to COR
    cy.verifyPageHeader(      
      " Let’s gather info about your Contracting Officer’s Representative (COR) "
    );
        
    //manually enter the information
    cy.manuallyEnterContactInformation(
      "COR_",      
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

    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").scrollIntoView().click();    
    const contactHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "COR_");
    cy.waitUntilElementIsGone(contactHeaderTxtSelector);
    cy.verifyPageHeader("Do you have an Alternate Contracting Officer’s Representative (ACOR)?");
  });      
  
  it("TC2: COR: Field Validations", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");   
    
    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );      
    
    cy.findElement(commonCorAcor.contactAffRadioGroupTxt).scrollIntoView();
    //Validation message for COR’s role
    
    cy.findElement(contact.militaryRadioBtn).focus();
    cy.clickSomethingElse(commonCorAcor.contactRoleError)
      .then(() => {
        cy.checkErrorMessage(commonCorAcor.contactRoleError, "Please enter your COR’s role.");
      });
    cy.findElement(contact.militaryRadioBtn).click({ force: true });

    //Validation message for Service Agency
    let selector, errorSelector;
    const prefix = "COR_";
    const branchDropdown = prefixId(commonCorAcor.serviceBranchDropdown, prefix);
    cy.findElement(branchDropdown).focus();
    cy.clickSomethingElse(selector)
      .then(() => {
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
    const pNo = randomNumber(10);
    cy.findElement(phoneSelector).type(pNo);
    cy.clickSomethingElse(branchDropdown).then(() => {
      cy.findElement(phoneSelector).scrollIntoView();
      cy.findElement(phoneErrorSelector).should("not.exist");      
    });   

    //US phone Number is not in standard format
    const phoneNumber = randomNumber(8)
    cy.findElement(phoneSelector).clear().type(phoneNumber)
    cy.clickSomethingElse (phoneErrorSelector)
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
    const validEmail = randomString(5)+"@test.mil"
    cy.findElement(emailSelector).type(validEmail);
    cy.clickSomethingElse(emailSelector).then(() => {
      cy.findElement(emailSelector).scrollIntoView();
      cy.findElement(emailErrorSelector).should("not.exist");      
    });
    // email in standard email format
    const email = randomString(5) + "@test.com"
    cy.findElement(emailSelector).should("be.visible").clear()
      .type(email);
    cy.clickSomethingElse(emailErrorSelector).then(() => {
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

  //Temporarily skipping this tc, this functionality not avilable on UI   
  it.skip("TC3: COR: Selected Contact Information", () => {        
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

  //Temporarily skipping this tc, this functionality not avilable on UI
  it.skip("TC2: COR: Search: No results found.", () => {   
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
});      
