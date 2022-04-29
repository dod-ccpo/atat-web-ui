import { bootstrapMockApis} from "../../../helpers";
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
    
    cy.launchATAT();
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
      cy.textExists(org.serviceAgencyLabel, " What service or agency do you work for? ");

      //Select the Value from Service or agency dropdown
      cy.serviceOrAgency("Defense");

      //section One
      cy.textExists(org.sectionOneHeaderText, "1. Tell us more about your organization");
      cy.textExists(org.orgNameTxtLabel, " Organization name ");
      cy.enterTextInTextField(org.orgNameTxtBox, "TestDepartmentof Defense");
      cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
      cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDD");

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

      //verify the labels when the radio butotn is selected
      cy.selectTypeOfMailingAddress(org.usaRadioBtn, "US");
      cy.selectTypeOfMailingAddress(org.militaryradioBtn, "MILITARY");
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
    cy.serviceOrAgency("Defense Information Systems");
    cy.textExists(org.disaDropDownLabel," DISA Organization ");
    cy.autoCompleteSelection(org.disaOrgInput, "Assistan",org.disaAutoComplete);
    cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDD");

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
    cy.btnExists(common.continueBtn, " Continue ").click();

    //Navigates to Contact information
    cy.findElement(common.wrap).scrollTo('top', { easing: 'linear' });
    cy.textExists(common.header, "Let’s confirm your contact information");
    
  });

  it("TC4: Service Agency selected is  not DISA & Address Type is US", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization "); 
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");

    //Service Agency is not DISA
    cy.serviceOrAgency("Communications");
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

});      
