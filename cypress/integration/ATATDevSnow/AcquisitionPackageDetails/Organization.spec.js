import {
  bootstrapMockApis,
  randomString,
  randomAlphaNumeric,
  capitalizeFirstLetter
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import projectOverview from "../../../selectors/projectOverview.sel";
import org from "../../../selectors/org.sel";
import co from "../../../selectors/contractOffice.sel";
import contact from "../../../selectors/contact.sel";
import lp from "../../../selectors/landingPage.sel";

describe("Test suite: Acquisition Package Details: Organization ", () => {
  
  let orgAddressType;
  let pt = "Step-1-Organization-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);
  const expectedEmail = Cypress.env("snowUser");
  const expectedNames = expectedEmail.split('-ctr')[0].split('.');
  const expectedFirstName = expectedNames[0];
  const firstName = capitalizeFirstLetter(expectedFirstName);
      
  beforeEach(() => {
    bootstrapMockApis();
    
    cy.fixture("orgAddressType").then((types) => {
      orgAddressType = types;
    });
    
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");    
    cy.fillNewAcquisition(pt, scope);
  });

  it("TC1: Next,we'll gather information about your org & Address Type is Foreign",    () => {     
      
    // Navigates to "Organization"
    cy.textExists(common.packageNameHeader, pt);

    //text Label
    cy.textExists(org.agencyLabel, "What service or agency are you affiliated with?");

    //Select the Value from Service or agency dropdown
    cy.agency("Defense");

    //section One
    cy.textExists(org.sectionOneHeaderText, "1. Tell us more about your organization");
    cy.textExists(org.orgNameTxtLabel, " Organization name ");
    cy.enterTextInTextField(org.orgNameTxtBox, "TestDepartmentof Defense");
    cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDDE");

    //section Two
    cy.textExists(org.sectionTwoHeaderText, "2. What is your organization’s address?");

    //Assert radio group text      
    const addressType = ["U.S.address", "Military", "Foreign address"];      
    let foundRadioOptions = 0;
    cy.findElement(org.addressTypeRadioGroup)
      .children()
      .each(($addressTypetext) => {
        const text = $addressTypetext;
        if (addressType.indexOf(text) > -1) {
          foundRadioOptions++
        };
        return foundRadioOptions === addressType.length;
      });
        
    //radio buttons        
    cy.radioBtn(org.usaRadioBtn, "US").not("[disabled]");
    cy.radioBtn(org.militaryradioBtn, "MILITARY").not("[disabled]");
    cy.radioBtn(org.foreignradioBtn, "FOREIGN").not("[disabled]");

    //Select the radio button      
    cy.selectTypeOfMailingAddress(org.foreignradioBtn, "FOREIGN");
    const orgAddress = {
      streetAddress : orgAddressType.StreetAddress,
      unit : orgAddressType.Unit2,            
      city : orgAddressType.city2,
      state:   "",
      zipCode: orgAddressType.postalCode1,
      apoFPOSelector :    "",
      statecodeSelector :    "",
      stateProvince :    orgAddressType.stateProvince2,
      inputCountryName :    orgAddressType.country
        
    }
    //enter the text in the text fields
    cy.enterOrganizationAddress(orgAddress);
    //Assert buttons     
    cy.btnExists(common.backBtn, "Back");
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(org.foreignradioBtn);
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
    cy.btnExists(common.backBtn, "Back").click();
    cy.waitUntilElementIsGone(contact.militaryRadioBtn);
    cy.findElement(org.activityAddressCodeTxtBox).should("have.value", "DoDDDE");
    cy.verifySelectedRadioOption(org.addressTypeRadioActive, "radio_button_checkedForeign address");
  });  
    
  it("TC2: Service Agency selected is DISA & Address Type is Military", () => {       
    // Service agency is DISA
    cy.agency("Defense Information Systems");
    cy.textExists(org.disaDropDownLabel," DISA Organization ");
    cy.autoCompleteSelection(org.disaOrgInput, "Assistan",org.disaAutoComplete);
    cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDDA");

    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    const orgAddress = {
      streetAddress: orgAddressType.StreetAddress1,
      unit : orgAddressType.Unit,            
      city : "",
      state:   "",
      zipCode: orgAddressType.Zipcode,
      apoFPOSelector : org.apoFpoDropDownListItemsArmy,
      statecodeSelector : org.stateCodeAmerica,
      stateProvince :orgAddressType.stateProvince2,
      inputCountryName : orgAddressType.country
            
    }
    cy.enterOrganizationAddress(orgAddress);

    //Click on Continue button
    cy.btnClick(common.continueBtn, " Continue "); 
    cy.waitUntilElementIsGone(org.militaryradioBtn);
    //Navigates to Contact information
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
    cy.btnExists(common.backBtn, "Back").click();
    cy.waitUntilElementIsGone(contact.militaryRadioBtn);
    cy.findElement(org.activityAddressCodeTxtBox).should("have.value", "DoDDDA");
    const militaryOption = "radio_button_checkedMilitary/Diplomatic (APO, FPO, or DPO)";
    cy.verifySelectedRadioOption(org.addressTypeRadioActive, militaryOption );
    
  });

  it("TC3: Service Agency selected is not DISA & Address Type is US", () => {
    //Service Agency is not DISA
    cy.agency("Communications");
    cy.enterTextInTextField(org.orgNameTxtBox, "TestDepartmentof Defense");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDCEC");
    cy.selectTypeOfMailingAddress(org.usaRadioBtn, "US");

    //Enter the Orgranization address details
    const orgAddress = {
      streetAddress: orgAddressType.StreetAddress2,
      unit : orgAddressType.Unit,            
      city : orgAddressType.City,
      state:   orgAddressType.State,
      zipCode: orgAddressType.Zipcode,
            
    }
    cy.enterOrganizationAddress(orgAddress);
        
    //Click on Continue button
    cy.btnExists(common.continueBtn, " Continue ").click();
    //Navigates to Contact information
    cy.waitUntilElementIsGone(org.foreignradioBtn);
    cy.verifyPageHeader("Let’s find out about the primary point of contact for this requirement");
    cy.findElement(common.dashboardTab).click();
    cy.waitUntilElementIsGone(common.sideNavBar);
    cy.textExists(lp.welcomeBarText, "Hi " + firstName + "! How can we help you?");
    //navigate to Acquisition package to ensure the data is retreiving correctly on edit
    cy.findElement(lp.acqPackageaccordion).should("exist");
    cy.textExists(lp.acqCard0, pt).then(() => {
      cy.findElement("#Portfolio0").click();
    });
    cy.waitUntilElementIsGone(lp.acqCard0);
    cy.waitUntilModalNotVisible();
    cy.verifySelectedRadioOption(co.activeRadioOption, "Yes");
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(co.radioDITCO);
    cy.clickDevToggleBtn();
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(projectOverview.projDisChxkBox);
    cy.verifyPageHeader(" Next, we’ll gather information about your organization ");   
    cy.findElement(org.orgNameTxtBox).should("have.value", "TestDepartmentof Defense");
    cy.findElement(org.activityAddressCodeTxtBox).should("have.value", "DoDCEC");
    cy.verifySelectedRadioOption(org.addressTypeRadioActive, "radio_button_checkedU.S. address");
  });

  //this functionality is hidden on UI temproraily
  it.skip("TC4: Request to add your agency", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization ");
    // Navigates to "Organization"
    cy.textExists(org.requestAgencyLink,  " Request to have your agency added ").click();
    cy.textExists(org.requestModalTitle, " Request to add your agency ").should("exist");
    cy.textExists(org.agencyOrgNameTxtLabel, " Agency/Organization Name ");
        
  });    

  it("TC5: Validations: DISA & US address", () => {   
    //Service Agency is DISA
    cy.verifyRequiredDropdown(
      org.agencyInput,
      org.agencyError,
      "Please select your agency or service."
    ); 
    cy.agency("Defense Information Systems");
    cy.waitUntil(() => {
      return cy.findElement(org.disaOrgInput).should("be.visible");
    });
    
    // DISA dropdown is blank
    cy.verifyRequiredInput(
      org.disaOrgInput,
      org.disaDropdownError,
      "Please select your DISA Organization."); 
    cy.autoCompleteSelection(org.disaOrgInput, "Assistan", org.disaAutoComplete);
    //DoD Activity is blank
    cy.verifyRequiredInput(
      org.activityAddressCodeTxtBox,
      org.activityAddressCodeError,
      "Please enter your 6-character DoDAAC."
    );
    cy.findElement(org.activityAddressCodeTxtBox).scrollIntoView()
      .type("DODCCA")
    cy.clickSomethingElse(org.disaOrgInput).then(() => {
      cy.findElement(org.activityAddressCodeTxtBox).scrollIntoView();
      cy.findElement(org.activityAddressCodeError).should("not.exist");      
    });  
    //DoD Activity value more than 6 characters
    const dodTxt=randomString(7)
    cy.findElement(org.activityAddressCodeTxtBox).should("be.visible").clear()
      .type(dodTxt).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          org.activityAddressCodeError,
          "Your DoDAAC must be 6 characters."
        );
      });

    cy.findElement(org.usaRadioBtn).click({ force: true });

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

  it("TC6: Validations: Not DISA & Foreign address", () => {   
    
    cy.agency("Communications");
    // Organization Name  is blank
    cy.verifyRequiredInput(
      org.orgNameTxtBox,
      org.orgNameError,
      "Please enter your organization name."); 
    cy.findElement(org.orgNameTxtBox).type("org");
    cy.clickSomethingElse(org.activityAddressCodeTxtBox);
    //Organization Name is more than 80 characters    
    const orgNameTxt=randomString(81)
    cy.findElement(org.orgNameTxtBox).scrollIntoView().clear()
      .type(orgNameTxt).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          org.orgNameError,
          "Organization name cannot exceed 80 characters."
        );
      });
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
    cy.findElement(common.continueBtn).scrollIntoView().should("be.visible")
    //country dropdown is blank
    cy.verifyRequiredInput(
      org.countryInput,
      org.countryError,
      "Please select a country.");
    
  });

  it("TC7: Validations: Military address", () => {
    
    //select Address type as Military
    cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
    //APO/FPO/DPO dropdown is blank
    cy.findElement(org.apoFpoDropDown).scrollIntoView()
    cy.verifyRequiredDropdown(
      org.apoFpoDropDown,
      org.apoFpoDropDownError,
      "Please select a military post office (APO or FPO)."
    );
    //AA/AE/AP dropdown is blank   
    cy.verifyRequiredDropdown(
      org.stateCodeDropDown,
      org.aaAEError,
      "Please select a state code."); 
  });

});      
