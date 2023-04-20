import {
  bootstrapMockApis,
  randomNumber,
  randomString,
  randomAlphaNumeric,
  prefixId,
} from "../../../helpers";
import co from "../../../selectors/contractOffice.sel";
import common from "../../../selectors/common.sel";
import org from "../../../selectors/org.sel";
import contact from "../../../selectors/contact.sel";
import commonCorAcor from "../../../selectors/commonCorAcor.sel";

describe("Test suite: Acquisition Package: Contact Information ", () => {    
  
  let orgAddressType;
  let contactInfo;  
  let pt = "TC-Step-1-ContactInfo-" + randomAlphaNumeric(5);
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

  it("TC1: Asserts: Let's find out about the primary poc for this requirement",() => {    

    //Service Agency is not DISA
    cy.agency("Communications");
    cy.enterTextInTextField(org.orgNameTxtBox,  "TestDepartmentof Defense");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDCEC");
    const orgAddress= {
      streetAddress: orgAddressType.StreetAddress,
      unit : orgAddressType.Unit1,            
      city : orgAddressType.City,
      state:   orgAddressType.State,
      zipCode: orgAddressType.Zipcode,
            
    }

    cy.findElement(org.usaRadioBtn).click({ force: true });

    cy.enterOrganizationAddress(orgAddress);

    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.waitUntilElementIsGone(org.foreignradioBtn);

    //Navigates to Contact information    
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
    
    //list of contactrole
    cy.findElement(contact.contactRoleTxt).then(($contactrole) => {
      expect($contactrole).to.have.text(
        " What role best describes your affiliation with the DoD? "
      );
    });
        
    //Assert radio options
    cy.radioBtn(contact.militaryRadioBtn, "MILITARY").not("[disabled]");
    cy.radioBtn(contact.civilianRadioBtn,"CIVILIAN").not("[disabled]");
    //cy.radioBtn(contact.contractorRadioBtn,"CONTRACTOR").not("[disabled]");

    //select radio button
    cy.contactRoleRadioBtnOption(
      contact.civilianRadioBtn,      
      "CIVILIAN"
    );

    //Salutation dropdown
    cy.dropDownClick(contact.salutationDropDownIcon);
    
    const salutationDropdownList = [
      "Mr.",
      "Mrs.",
      "Miss",
      "Ms.",
      "Dr.",
    ];
    let foundDropdownList = 0
    //Verify the list in the dropdown
    cy.findElement(contact.salutationDropDownList)
      .children()
      .each(($el) => {
        const text = $el.text();
        if (salutationDropdownList.indexOf(text) > -1) {
          foundDropdownList++
        };
        return foundDropdownList === salutationDropdownList.length;
      })  
        
    //select the salutationfrom dropdown
    cy.textExists(contact.salutationDropdownListItemMr, "Mr.").click({ force: true });
        
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
    cy.enterTextInTextField(contact.titleTxtBox, "POC");    
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
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(contact.phoneNumberLabel);
    cy.verifyPageHeader("Let’s gather info about your Contracting Officer’s Representative (COR)");
  });

  it("TC2: Role is Military", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
        
    //select radio button
    cy.contactRoleRadioBtnOption(
      contact.militaryRadioBtn,
      "MILITARY",
      contact.serviceBranchAirForce
    );           

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
    cy.enterTextInTextField(contact.titleTxtBox, "PVT");
    cy.enterPhoneNumber(
      contact.phoneControlIcon,
      contact.phoneDropdown,
      "Defense",
      contact.countryListItems,
      contact.phoneInputBox,
      "312-560-1000"); 
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );  
    cy.btnExists(common.backBtn, "Back").click();    
    const contactHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "COR_");
    cy.waitUntilElementIsGone(contactHeaderTxtSelector);
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
    const selectedRadioOption ="radio_button_checkedMilitary"
    cy.verifySelectedRadioOption(contact.contactRadioBtnActive, selectedRadioOption );
  });

  it("TC3: Role is Civilian", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");
    cy.activeStep(common.subStepContactInformationTxt);

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    //select radio button
    cy.contactRoleRadioBtnOption(contact.civilianRadioBtn,"CIVILIAN");

    //select the value from salutationDropdownList
    cy.dropDownClick(contact.salutationDropDownIcon);
    cy.textExists(contact.salutationDropdownListItemMrs, "Mrs.").click({ force: true });  
        
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
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(contact.phoneInputBox);
    cy.verifyPageHeader(
      "Let’s gather info about your Contracting Officer’s Representative (COR)"
    );  
    cy.btnExists(common.backBtn, "Back").click();    
    const contactHeaderTxtSelector = prefixId(commonCorAcor.contactHeaderTxt, "COR_");
    cy.waitUntilElementIsGone(contactHeaderTxtSelector);
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
    const selectedRadioOption ="radio_button_checkedCivilian"
    cy.verifySelectedRadioOption(contact.contactRadioBtnActive, selectedRadioOption);
    
  });
    
  
  it("TC4: Contact Information: Field Validations", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information "); 
    
    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");

    // FirstName is blank
    cy.verifyRequiredInput(
      contact.fNameTxtBox,
      contact.fNameError,
      "Please enter your first name."
    );
    //LastName is blank
    cy.verifyRequiredInput(
      contact.lNameTxtBox,
      contact.lNameError,
      "Please enter your last name."
    );
    //Title is blank
    cy.verifyRequiredInput(
      contact.titleTxtBox,
      contact.titleError,
      "Please enter your title."
    );

    //Phone Number field is blank
    cy.verifyRequiredInput(
      contact.phoneTxtBox,
      contact.phoneError,
      "Please enter your phone number"
    );
    const pNo = randomNumber(10);
    cy.findElement(contact.phoneTxtBox).type(pNo);
    cy.clickSomethingElse(contact.emailTxtBox).then(() => {
      cy.findElement(contact.phoneTxtBox).scrollIntoView();
      cy.findElement(contact.phoneError).should("not.exist");      
    });   

    //US phone Number is not in standard format
    const phoneNumber = randomNumber(5);    
    cy.findElement(contact.phoneTxtBox).clear().type(phoneNumber);
    cy.clickSomethingElse(contact.emailTxtBox)
      .then(() => {
        cy.checkErrorMessage(
          contact.phoneError,
          "Please enter a number using the format for  United States (e.g., 999-999-9999)."
        );
      });
    
    //email address is blank
    cy.verifyRequiredInput(
      contact.emailTxtBox,
      contact.emailError,
      "Please enter your email address."
    ); 
    const validEmail = randomString(5)+"@test.mil"
    cy.findElement(contact.emailTxtBox).type(validEmail);
    cy.clickSomethingElse(contact.phoneTxtBox).then(() => {
      cy.findElement(contact.phoneTxtBox).scrollIntoView();
      cy.findElement(contact.emailError).should("not.exist");      
    });   
    //email isn't standard email format
    const email = randomString(5)+"@test.com"
    cy.findElement(contact.emailTxtBox).should("be.visible").clear()
      .type(email).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          contact.emailError,
          "Please use your .mil or .gov email address."
        );
      });
              
  });   
  
  it("TC5: Military: Field Validations", () => {
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.subStepContactInformationLink, " Contact Information ");

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s  find out about the primary point of contact for this requirement");

    cy.findElement(contact.civilianRadioBtn).focus();
    cy.clickSomethingElse(contact.roleError).then(() => {
      cy.checkErrorMessage(contact.roleError, "Please select your role.");
    })
    //Agency is blank
    cy.findElement(contact.militaryRadioBtn).click({ force: true });

    //Validation message for Service Agency
    cy.findElement(contact.serviceBranchDropDownIcon).click({force: true});
    cy.findElement(contact.militaryRadioBtn).click({ force: true })
      .then(() => {
        cy.checkErrorMessage(
          contact.serviceBranchError,
          "Please enter your Service Branch.");
        
      });
    
    cy.findElement(contact.serviceBranchDropdown).focus().then(()=>{
      cy.findElement(contact.serviceBranchDropDownIcon).click({ force: true });
      cy.findElement(contact.serviceBranchCoastGuard).click();
    });

    //Validation message for Rank
    cy.verifyRequiredDropdown(
      contact.rankInput,
      contact.rankError,
      "Please select your military rank."
    );
        
  });  
  
});    
  
