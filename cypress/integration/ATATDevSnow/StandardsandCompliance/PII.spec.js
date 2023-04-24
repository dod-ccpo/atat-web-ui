import {bootstrapMockApis,colors,cleanText,randomAlphaNumeric,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import sac from "../../../selectors/standComp.sel";

describe("Test suite:SAC Step: PII sub step ", () => {
  
  beforeEach(() => {

    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();    
  });    
    
  it("TC1: SAC: PII Substep is active", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepPIIText, " Personally Identifiable Information (PII) ");
    cy.textExists(common.subStepBAAText, " Business Associate Agreement (BAA) ");
    cy.textExists(common.substepPDOIText, " Public Disclosure of Information ");
    cy.textExists(common.substepSection508Text, " Section 508 Standards "); 
    cy.findElement(common.stepStandCompText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.subStepPIIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();     
      
  });

  it("TC2: Asserts: PII", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ")
    cy.textExists(common.header,
      " Let's find out if your effort provides for Personally Identifiable Information ");
    const expectedPIIText = "Personally Identifiable Information (PII)" +
      " PII is information about an individual which identifies, links," +
      " relates, or is unique to an individual. Examples include social" +
      " security number, age, military rank, civilian grade, etc. that" +
      " can be used to distinguish or track an individual's identity."
    cy.findElement(sac.blueInfoMessageText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(expectedPIIText);

    });
    //Assert Radio option label
    const piiOptionTextLabel = "Does this effort provide for the design," +
      " development, or operation of a system of records on individuals" +
      " by the contractor (in whole or in part)?"
    cy.findElement(sac.piiRadioOptionText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(piiOptionTextLabel);
    });
    //Asserts radio options
    cy.radioBtn(sac.yesPIIRadioOption, "YES").not("[disabled]");
    cy.radioBtn(sac.noPIIRadioOption, "NO").not("[disabled]");
    //Links Exists
    cy.textExists(sac.piiLink, " Why do we need to know about PII? ")
      .click({ force: true }).then(() => {
        const piiFAQTxt = "If this effort provides for the design," +
          " development, or operation of a system of records on" +
          " individuals (in whole or in part), then the contracting" +
          " officer must include the following clauses in the solicitation:"
        cy.findElement(sac.piiFAQText).then(($el) => {
          let actualTxt = $el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(piiFAQTxt);
          cy.textExists(sac.patLink, "FAR 52.224-1");
          cy.textExists(sac.paLink, "FAR 52.224-2");
          cy.textExists(sac.moreInfoLink, "FAR 24.1, Protection of Individual Privacy.");
        })
      
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

  it("TC3: PII: Select radio option: Yes", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as yes
    cy.selectPiiOption(sac.yesPIIRadioOption, "YES");
    cy.textExists(common.header, "Tell us more about your system of records");
    //Assert textbox labels
    cy.textExists(sac.systemLabel, " System name ");
    cy.textExists(sac.operationPerformedLabel, "What is the operation of work to be performed?");
    //enter the Values in the Textboxs
    const systemName = randomAlphaNumeric(9);
    cy.enterTextInTextField(sac.systemNameTextBox, systemName);
    const operationPerformed = randomAlphaNumeric(15);
    cy.enterTextInTextField(sac.operationPerformedTextBox, operationPerformed);
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    //navigates to BAA screen
    cy.textExists(sac.baaLabelText, "Business Associate Agreements (BAA)");
    cy.findElement(common.subStepBAAText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
  });

  it("TC4: PII: Select radio option: No", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ")
    //select radio option as No
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  }); 

  it("TC5: PII: Validations", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    // if radio option is not selected
    cy.findElement(sac.yesPIIRadioOption).focus();
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
    //Operation of work perfomred is more than 400
    const workDescriptionText = randomString(401);
    cy.findElement(sac.operationPerformedTextBox).should("be.visible").clear()
      .type(workDescriptionText).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          sac.operationPerformedError,
          "Please limit your description to 400 characters or less");
      });

  });
});
