import {randomAlphaNumeric,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import sac from "../../../selectors/standComp.sel";

describe("Test suite:SAC Step: PII sub step ", () => {
  
  const pt = "TC-Step-6-SAC-PII-" + randomAlphaNumeric(5);
  const scope = "SAC-PII-" + randomString(5);
  const expectedPIIText = "What is PII? PII is information about an individual which identifies,"+
  " links, relates, or is unique to an individual. Examples include social security number,"+
  " age, military rank, civilian grade, etc. that can be used to distinguish or track an individual's identity.";   
  const systemName = randomAlphaNumeric(9);
  const operationPerformed = randomAlphaNumeric(15);
  beforeEach(() => {

    cy.goToSaCStep(
      pt,
      scope
    );
        
  });    
    
  it("TC1: Asserts: All texts on PII form", () => {
    cy.verifyTextMatches(sac.blueInfoMessageText,expectedPIIText);          
    //Asserts radio options
    cy.radioBtn(sac.yesPIIRadioOption, "YES").not("[disabled]");
    cy.radioBtn(sac.noPIIRadioOption, "NO").not("[disabled]");
    //Links Exists
    cy.textExists(sac.piiLink, " Why do we need to know about PII? ")
      .click({ force: true }).then(() => {            
          cy.textExists(sac.patLink, "FAR 52.224-1");
          cy.textExists(sac.paLink, "FAR 52.224-2");
          cy.textExists(sac.moreInfoLink, "FAR 24.1, Protection of Individual Privacy.");
        }); 
    
  });

  it("TC2: PII: Select radio option: Yes", () => {    
    //select radio option as yes
    cy.selectPiiOption(sac.yesPIIRadioOption, "YES");    
    //Assert textbox labels
    cy.textExists(sac.systemLabel, " System name ");
    cy.textExists(sac.operationPerformedLabel, "What is the operation of work to be performed?");
    //complete the System records form
    cy.completeSystemRecordsForm(systemName,operationPerformed);   
    cy.clickBackButton (
      sac.yesBAARadioOption,
      " Tell us more about your system of records "
      );       
    cy.verifyEnteredInputTxt(sac.systemNameTextBox, systemName);
    cy.verifyEnteredInputTxt(sac.operationPerformedTextBox, operationPerformed);
    cy.clickBackButton (
      sac.systemNameTextBox,      
      "Let’s find out if your project includes Personally Identifiable Information (PII)"
    );
    cy.verifySelectedRadioOption(
      sac.piiRadioOtionActive,
      "radio_button_checkedYes."+
      " This contract action will include a system of records with PII."
      );
  });

  it("TC4: PII: Select radio option: No", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ")
    //select radio option as No
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");
    cy.clickBackButton (
      sac.yesBAARadioOption,      
      "Let’s find out if your project includes Personally Identifiable Information (PII)"
    );
    cy.verifySelectedRadioOption(
      sac.piiRadioOtionActive,
      "radio_button_checkedNo.");

  }); 

  it("TC5: PII: Validations", () => { 
    // if radio option is not selected
    cy.radioBtn(sac.noPIIRadioOption,"NO").focus();
    cy.clickSomethingElse(sac.piiRadioError)      
      .then(() => {
        cy.checkErrorMessage(sac.piiRadioError, "Please select an option");
      })
    cy.selectPiiOption(sac.yesPIIRadioOption, "YES");
    cy.textExists(common.header, "Tell us more about your system of records");

    // system Name is blank
    cy.verifyRequiredInput(
      sac.systemNameTextBox,
      sac.systemNameError,
      "Please enter the name of your system of records.");

    //Operation of work perfomred is blank
    cy.verifyRequiredInput(
      sac.operationPerformedTextBox,
      sac.operationPerformedError,
      "Please enter a description for the operation of work to be performed.");   
    //Operation of work performed is more than 400
    const workDescriptionText = randomString(401);
    cy.findElement(sac.operationPerformedTextBox).should("be.visible").clear()
      .type(workDescriptionText).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          sac.operationPerformedError,
          "Please limit your description to 400 characters or less");
      });

  });
})