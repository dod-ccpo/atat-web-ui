import {randomString,randomAlphaNumeric} from "../../../helpers";
import orgAddressType from '../../../fixtures/orgAddressType.json';
import sac from "../../../selectors/standComp.sel";
import org from "../../../selectors/org.sel";

describe("Test suite:SAC Step: FOIA sub step", () => {

  const pt = "TC-Step-6-SAC-FOIA-" + randomAlphaNumeric(5);
  const scope = "SAC-FOIA-" + randomString(5);
  const systemName = randomAlphaNumeric(9);
  const operationPerformed = randomAlphaNumeric(15);  
  const fullName = randomString(5);
  const email = randomString(5) + "@mail.mil";
  const militaryOption = "radio_button_checkedMilitary/Diplomatic (APO, FPO, or DPO)";
  const milOrgAddress = {
    streetAddress: orgAddressType.StreetAddress1,
    unit: orgAddressType.Unit,
    city: "",
    state: "",
    zipCode: orgAddressType.Zipcode,
    apoFPOSelector: org.apoFpoDropDownListItemsArmy,
    statecodeSelector: org.stateCodeAmerica,
    stateProvince: orgAddressType.stateProvince2,
    inputCountryName: orgAddressType.country          
  };
  const foreignOrgAddress = {
    streetAddress: orgAddressType.StreetAddress,
    unit: orgAddressType.Unit2,
    city: orgAddressType.city2,
    state: "",
    zipCode: orgAddressType.postalCode1,
    apoFPOSelector: "",
    statecodeSelector: "",
    stateProvince: orgAddressType.stateProvince2,
    postalCode: orgAddressType.postalCode1,
    inputCountryName: orgAddressType.country
      
  }; 
  const usOrgAddress = {
    streetAddress: orgAddressType.StreetAddress2,
    unit: orgAddressType.Unit,
    city: orgAddressType.City,
    state: orgAddressType.State,
    zipCode: orgAddressType.Zipcode,
          
  };
  beforeEach(() => {
    
    cy.goToSaCStep(
      pt,
      scope
    );
    cy.selectPiiOption(sac.yesPIIRadioOption, "YES"); 
    cy.completeSystemRecordsForm(systemName,operationPerformed);
    cy.selectBAAOption(sac.yesBAARadioOption, "YES");    
    cy.selectFOIAOption(sac.foiaYesOption, "YES"); 
    cy.enterTextInTextField(sac.fullNameTxtBox, fullName);   
    cy.enterTextInTextField(sac.emailTxtbox, email); 
  });    
    
  it("TC1: Asserts: FOIA", () => {
    //asserts the labels
    cy.findElement(sac.fullNameLabel).scrollIntoView();
    cy.textExists(sac.fullNameLabel, " Full name ");
    cy.textExists(sac.fullNameHelpTxt, " Include rank, if applicable ");
    cy.textExists(sac.emailLabel, " Email address ");
    cy.textExists(sac.emailHelpTxt, " Enter a .mil or .gov email address. ");  
    cy.clickBackButton(
      sac.emailTxtbox,
      "Let’s look into the Freedom of Information Act (FOIA)"
      );
    cy.verifySelectedRadioOption(
        sac.foiaRadioOptionActive,
        "radio_button_checkedYes."
        );
    
    cy.textExists(sac.foiaLearnLink, " Learn more about FOIA. ").click()
      .then(() => {
        cy.findElement(sac.foiaLearnDrawer).should("exist");
        cy.textExists(sac.learnMoreDrawerLabel, " Learn More ");
        cy.textExists(sac.learnMoreHeaderTxt,
          "Understanding the Freedom of Information Act (FOIA)");
        cy.textExists(sac.learnMoreFOIAUrl, "FOIA.gov");
        //close the side panel
        cy.findElement(sac.learnMoreDrawerClose).should("be.visible").click();
        cy.findElement(sac.foiaLearnDrawer).not("be.visible");

      });
    cy.textExists(sac.foiaFAQLink, " How does FOIA impact my acquisition package? ").click()
      .then(() => {
        cy.findElement(sac.foiaFAQText).should("be.visible");
        cy.findElement(sac.foiaFAQLink).click();
      });         
      
  });

  it("TC2: FOIA Coordinator: Foreign address", () => {       
    // radio button is selected
    cy.selectTypeOfMailingAddress(org.foreignradioBtn, "FOREIGN");       
    //enter the text in the text fields
    cy.enterOrganizationAddress(foreignOrgAddress);
    cy.clickContinueButton(
      org.foreignradioBtn,
      "Let’s look into your Section 508 Accessibility requirements"
    );
    cy.clickBackButton(
      sac.sectionYesRadio,
      "Tell us about your FOIA Coordinator"
    );
    cy.verifyEnteredInputTxt(sac.fullNameTxtBox, fullName);
    cy.verifyEnteredInputTxt(sac.emailTxtbox, email);
    cy.verifySelectedRadioOption(org.addressTypeRadioActive, "radio_button_checkedForeign address");
    
  });

  it("TC3: FOIA Coordinator: Military", () => {        
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");   
    cy.enterOrganizationAddress(milOrgAddress);
    cy.clickContinueButton(
      org.foreignradioBtn,
      "Let’s look into your Section 508 Accessibility requirements"
    );
    cy.clickBackButton(
      sac.sectionYesRadio,
      "Tell us about your FOIA Coordinator"
    );   
    cy.verifySelectedRadioOption(org.addressTypeRadioActive, militaryOption );
  });

  it("TC4: FOIA Coordinator: U.S Address", () => {     
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.usaRadioBtn, "US");
    //Enter the Orgranization address details   
    cy.enterOrganizationAddress(usOrgAddress);     
    cy.clickContinueButton(
      org.foreignradioBtn,
      "Let’s look into your Section 508 Accessibility requirements"
    );
    cy.clickBackButton(
      sac.sectionYesRadio,
      "Tell us about your FOIA Coordinator"
    );
    cy.verifySelectedRadioOption(org.addressTypeRadioActive, "radio_button_checkedU.S. address");
  });

  it("TC5: Military: Validations", () => {    
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    //APO/FPO/DPO dropdown is blank
    cy.findElement(org.apoFpoDropDown).should("be.visible").clear({force: true})
      .focus();
    cy.clickSomethingElse(org.apoFpoDropDownError).then(() => {
      cy.checkErrorMessage(
        org.apoFpoDropDownError,
        "Please select a military post office (APO or FPO)."
      );
    }); 
    //AA/AE/AP dropdown is blank   
    cy.findElement(org.stateCodeDropDown).should("be.visible").clear({force: true})
      .focus();
    cy.clickSomethingElse(org.apoFpoDropDownError)
      .then(() => {
        cy.checkErrorMessage(
          org.aaAEError,
          "Please select a state code.");
      }); 
            
  });

  it("TC6: US: Validations", () => {    
    //Full name is blank
    cy.verifyRequiredInput(
      sac.fullNameTxtBox,
      sac.fullNameError,
      "Please enter your FOIA coordinator’s full name."
    );    
    //Email address is blank
    cy.verifyRequiredInput(
      sac.emailTxtbox,
      sac.emailError,
      "Please enter your email address.");      
    cy.findElement(sac.emailTxtbox).type(email);
      cy.clickSomethingElse(org.streetTxtBox).then(() => {
        cy.findElement(org.streetTxtBox).scrollIntoView();
        cy.findElement(sac.emailError).should("not.exist");      
      });    
    //email isn't in standard format
    const invalidEmail = randomString(5)+"@test.com"
    cy.findElement(sac.emailTxtbox).should("be.visible").clear()
      .type(invalidEmail).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          sac.emailError,
          "Please use your .mil or .gov email address.");
      });    
    //Street address is blank
    cy.verifyRequiredInput(
      org.streetTxtBox,
      org.streetError,
      "Please enter an address."
    );
    //City is blank
    cy.verifyRequiredInput(
      org.cityTxtBox,
      org.cityError,
      "Please enter a city."
    );
    //State is blank
    cy.verifyRequiredDropdown(
      org.stateTxtBox,
      org.stateError,
      "Please select a state."
    );
    
    //Zip code is blank
    cy.verifyRequiredInput(
      org.zipCodeTxtBox,
      org.zipError,
      "Please enter a ZIP code."
    );
  });

  it("TC7: Foreign address: Validations", () => {    
    cy.selectTypeOfMailingAddress(org.foreignradioBtn, "FOREIGN");
    //State or Province is blank
    cy.verifyRequiredInput(
      org.stateProvinceTxtBox,
      org.stateProvinceError,
      "Please enter a state/province."
    );    
    //Postal code is blank
    cy.verifyRequiredInput(
      org.postalCodeTxtBox,
      org.postalCodeError,
      "Please enter a postal code."
    );      
    //country dropdown is blank
    cy.verifyRequiredInput(
      org.countryInput,
      org.countryError,
      "Please select a country.");
        
  });

});
