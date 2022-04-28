import { bootstrapMockApis} from "../../../helpers";
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

});      
