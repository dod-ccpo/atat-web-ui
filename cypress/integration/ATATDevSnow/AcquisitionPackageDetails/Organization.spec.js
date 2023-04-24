import { bootstrapMockApis,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import org from "../../../selectors/org.sel";

describe("Test suite: Acquisition Package: Organization ", () => {
    
  let projectDetails;
  let orgAddressType;
      
  beforeEach(() => {
    bootstrapMockApis();

    cy.fixture("projectOverview").then((details) => {
      projectDetails = details;
    });
    cy.fixture("orgAddressType").then((types) => {
      orgAddressType = types;
    });
    
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
  });

  it("TC1: Organization substep is active", () => {
    cy.findElement(common.stepAcquisitionText)
      .should("be.visible")
      .and('have.css', 'color', 'rgb(84, 68, 150)')
    cy.findElement(common.subStepOrganizationLink).click();
    cy.findElement(common.subStepOrganizationTxt)
      .should("be.visible")
      .and('have.css', 'color', 'rgb(84, 68, 150)');
    
  });

  
  it("TC2: Next,we'll gather information about your org & Address Type is Foreign",
    () => {
    
      cy.fillNewAcquisition(projectDetails.projectTitle1, projectDetails.scope1);
        
      // Navigates to "Organization"
      cy.textExists(common.packageNameHeader, projectDetails.projectTitle1);

      //header 
      cy.findElement(common.wrap).scrollTo('top', { easing: 'linear' });
      cy.textExists(common.header, " Next, we’ll gather information about your organization ");

      //text Label
      cy.textExists(org.agencyLabel, " What agency do you work for? ");

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
      cy.btnExists(common.continueBtn, " Continue ");
      cy.btnExists(common.backBtn, "Back");

    });  

  it("TC3: Service Agency selected is DISA & Address Type is Military", () => {
        
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 

    // Navigates to "Organization"
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");

    // Serviceagency is DISA
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

    //Navigates to Contact information
    cy.verifyPageHeader("Let’s confirm your contact information");
    
  });

  it("TC4: Service Agency selected is not DISA & Address Type is US", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");

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
    cy.findElement(common.wrap).scrollTo('top', { easing: 'linear' });
    cy.textExists(common.header, "Let’s confirm your contact information");

  });

  it("TC5: Request to add your agency", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization ");
    // Navigates to "Organization"
    cy.textExists(org.requestAgencyLink,  " Request to have your agency added ").click();
    cy.textExists(org.requestModalTitle, " Request to add your agency ").should("exist");
    cy.textExists(org.agencyOrgNameTxtLabel, " Agency/Organization Name ");
        
  });    

  it("TC6: Validations: DISA & US address", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 
    cy.verifyPageHeader(" Next, we’ll gather information about your organization ");
    //Service Agency is DISA
    cy.verifyRequiredDropdown(
      org.agencyInput,
      org.agencyError,
      "Please select your agency."
    );    
    cy.agency("Defense Information Systems");
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

  it("TC7: Validations: Not DISA & Foreign address", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");
    cy.agency("Communications");
    // Organization Name  is blank
    cy.verifyRequiredInput(
      org.orgNameTxtBox,
      org.orgNameError,
      "Please enter your organization name."); 
    //Organization Name is more than 80 characters    
    const orgNameTxt=randomString(81)
    cy.findElement(org.orgNameTxtBox,).should("be.visible").clear()
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

  it("TC8: Validations: Military address", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");
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
