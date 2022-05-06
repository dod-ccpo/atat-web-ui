import {bootstrapMockApis,colors,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";
import org from "../../../selectors/org.sel";

describe("Test suite:SAC Step: FOIA sub step", () => {
  let orgAddressType;

  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("orgAddressType").then((types) => {
      orgAddressType = types;
    });
    cy.launchATAT();
        
  });    
    
  it("TC1: SAC: PDoI is active on Vertical stepper", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");  
    //Verify the Substep is active
    cy.textExists(common.substepPDOIText, " Public Disclosure of Information ").click();
    cy.findElement(common.stepStandCompText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.substepPDOIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();   
      
  });

  it("TC2: Asserts: FOIA", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");    
    //select radio option as yes
    cy.selectPiiOption(occ.noPIIRadioOption, "No");    
    //select radio options
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.textExists(occ.foiaLearnLink, " Learn more about FOIA. ").click()
      .then(() => {
        cy.findElement(occ.foiaLearnDrawer).should("exist");
        cy.textExists(occ.learnMoreDrawerLabel, " Learn More ");
        cy.textExists(occ.learnMoreHeaderTxt,
          "Understanding the Freedom of Information Act (FOIA)");
        cy.textExists(occ.learnMoreFOIAUrl, "https://www.foia.gov");
        //close the side panel
        cy.findElement(occ.learnMoreDrawerClose).should("be.visible").click();
        cy.findElement(occ.foiaLearnDrawer).not("be.visible");

      });
    cy.textExists(occ.foiaFAQLink, " How does FOIA impact my acquisition package? ").click()
      .then(() => {
        cy.findElement(occ.foiaFAQText).should("be.visible");
        cy.findElement(occ.foiaFAQLink).click()
      });
    cy.radioBtn(occ.foiaYesOption, "true").not("[disabled]");
    cy.radioBtn(occ.foiaNoOption, "false").not("[disabled]");    
    //select No option
    cy.selectFOIAOption(occ.foiaNoOption, "false")
    cy.textExists(occ.blueAlertLabel, " Section 508 Accessibility Standards for Cloud Computing ");
      
  });

  it("TC3: FOIA Coordinator: Foreign address", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");    
    //select radio option as yes
    cy.selectPiiOption(occ.noPIIRadioOption, "No");    
    //select radio options
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.selectFOIAOption(occ.foiaYesOption, "true");    
    //asserts the labels
    cy.textExists(occ.fullNameLabel, " Full name ");
    cy.textExists(occ.fullNameHelpTxt, " Include rank, if applicable ");
    cy.textExists(occ.emailLabel, " Email address ");
    cy.textExists(occ.emailHelpTxt, " Enter a .mil or .gov email address. ");    
    //enter the values in the text
    const fullName = randomString(5)
    cy.enterTextInTextField(occ.fullNameTxtBox, fullName);
    const email = randomString(5) + "@mail.mil"
    cy.enterTextInTextField(occ.emailTxtbox, email);    
    //radio buttons
    cy.radioBtn(org.usaRadioBtn, "US").not("[disabled]");
    cy.radioBtn(org.militaryradioBtn, "MILITARY").not("[disabled]");
    cy.radioBtn(org.foreignradioBtn, "FOREIGN").not("[disabled]");
    // radio butotn is selected
    cy.selectTypeOfMailingAddress(org.foreignradioBtn, "FOREIGN");
    const orgAddress = {
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
    //enter the text in the text fields
    cy.enterOrganizationAddress(orgAddress);

  });

  it("TC4: FOIA Coordinator: Military", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    cy.clickSideStepper(common.substepPDOIText, " Public Disclosure of Information ");    
    //select radio option as yes
    cy.selectFOIAOption(occ.foiaYesOption, "true");    
    //enter the values in the text
    const fullName = randomString(5);
    cy.enterTextInTextField(occ.fullNameTxtBox, fullName)
    const email = randomString(5) + "@test.mil"
    cy.enterTextInTextField(occ.emailTxtbox, email);    
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    const orgAddress = {
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
    cy.enterOrganizationAddress(orgAddress);
      
  });

  it("TC5: FOIA Coordinator: U.S Address", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    cy.clickSideStepper(common.substepPDOIText, " Public Disclosure of Information ");    
    //select radio option as yes
    cy.selectFOIAOption(occ.foiaYesOption, "true");    
    //enter the values in the text
    const fullName = randomString(5)
    cy.enterTextInTextField(occ.fullNameTxtBox, fullName);
    const email = randomString(5) + "@test.mil"
    cy.enterTextInTextField(occ.emailTxtbox, email);    
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.usaRadioBtn, "US");
    //Enter the Orgranization address details
    const orgAddress = {
      streetAddress: orgAddressType.StreetAddress2,
      unit: orgAddressType.Unit,
      city: orgAddressType.City,
      state: orgAddressType.State,
      zipCode: orgAddressType.Zipcode,
            
    };
    cy.enterOrganizationAddress(orgAddress);        
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();    
    //navigates to next substep
    cy.findElement(common.header).scrollIntoView();
    cy.textExists(common.header, "Let’s look into your Section 508 Accessibility requirements");
    
  });

  it("TC6: Validations: FOIA", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");    
    //select radio option as yes on PII screen
    cy.selectPiiOption(occ.noPIIRadioOption, "No");    
    //select radio options on BAA screen
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    // radio option  is not selected 
    cy.radioBtn(occ.foiaYesOption, "true").focus().tab()
      .then(() => {
        cy.radioBtn(occ.foiaNoOption, "false").focus().tab()
          .then(() => {
            cy.checkErrorMessage(occ.foiaRadioError, "Please select an option");
          })
      });
    cy.selectFOIAOption(occ.foiaYesOption, "true");
  });

  it("TC7: Military: Validations", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");    
    //select radio option as yes on PII
    cy.selectPiiOption(occ.noPIIRadioOption, "No");    
    //select radio option as no on BAA
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.selectFOIAOption(occ.foiaYesOption, "true");
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    //APO/FPO/DPO dropdown is blank
    cy.findElement(org.apoFpoDropDown).should("be.visible").clear({force: true})
      .focus().tab().then(() => {
        cy.checkErrorMessage(
          org.apoFpoDropDownError,
          "Please select a military post office (APO or FPO).");
      }); 
    //AA/AE/AP dropdown is blank   
    cy.findElement(org.stateCodeDropDown).should("be.visible").clear({force: true})
      .focus().tab().then(() => {
        cy.checkErrorMessage(
          org.aaAEError,
          "Please select a state code.");
      }); 
            
  });

  it("TC8: US: Validations", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");    
    //select radio option as yes on PII
    cy.selectPiiOption(occ.noPIIRadioOption, "No");    
    //select radio option as no on BAA 
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");    
    //select yes on FOIA
    cy.selectFOIAOption(occ.foiaYesOption, "true");
    //Full name is blank
    cy.verifyRequiredInput(
      occ.fullNameTxtBox,
      occ.fullNameError,
      "Please enter your FOIA coordinator’s full name."
    );    
    //Email address is blank
    cy.verifyRequiredInput(
      occ.emailTxtbox,
      occ.emailError,
      "Please enter your email address.");    
    //email isn't in sandard format
    const email = randomString(5)+"@test.com"
    cy.findElement(occ.emailTxtbox).should("be.visible").clear()
      .type(email).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          occ.emailError,
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

  it("TC9: Foreign address: Validations", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");    
    //select radio option as yes on PII
    cy.selectPiiOption(occ.noPIIRadioOption, "No");    
    //select radio option as no on BAA
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.selectFOIAOption(occ.foiaYesOption, "true");
    //select Address type as Foreign address
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
