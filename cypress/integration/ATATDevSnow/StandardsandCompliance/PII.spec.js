import {bootstrapMockApis,colors,cleanText,randomAlphaNumeric,randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";

describe("Test suite:SAC Step: PII sub step ", () => {
  
  beforeEach(() => {

    bootstrapMockApis();
    cy.launchATAT();
        
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
    cy.findElement(occ.blueInfoMessageText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(expectedPIIText);

    });
    //Assert Radio option label
    const piiOptionTextLabel = "Does this effort provide for the design," +
      " development, or operation of a system of records on individuals" +
      " by the contractor (in whole or in part)?"
    cy.findElement(occ.piiRadioOptionText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(piiOptionTextLabel);
    });
    //Asserts radio options
    cy.radioBtn(occ.yesPIIRadioOption, "Yes").not("[disabled]");
    cy.radioBtn(occ.noPIIRadioOption, "No").not("[disabled]");
    //Links Exists
    cy.textExists(occ.piiLink, " Why do we need to know about PII? ")
      .click({ force: true }).then(() => {
        const piiFAQTxt = "If this effort provides for the design," +
          " development, or operation of a system of records on" +
          " individuals (in whole or in part), then the contracting" +
          " officer must include the following clauses in the solicitation:"
        cy.findElement(occ.piiFAQText).then(($el) => {
          let actualTxt = $el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(piiFAQTxt);
          cy.textExists(occ.patLink, "FAR 52.224-1");
          cy.textExists(occ.paLink, "FAR 52.224-2");
          cy.textExists(occ.moreInfoLink, "FAR 24.1, Protection of Individual Privacy.");
        })
      
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

  it("TC3: PII: Select radio option: Yes", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as yes
    cy.selectPiiOption(occ.yesPIIRadioOption, "Yes");
    cy.textExists(common.header, "Tell us more about your system of records");
    //Assert textbox labels
    cy.textExists(occ.systemLabel, " System name ");
    cy.textExists(occ.operationPerformedLabel, "What is the operation of work to be performed?");
    //enter the Values in the Textboxs
    const systemName = randomAlphaNumeric(9);
    cy.enterTextInTextField(occ.systemNameTextBox, systemName);
    const operationPerformed = randomAlphaNumeric(15);
    cy.enterTextInTextField(occ.operationPerformedTextBox, operationPerformed);
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    //navigates to BAA screen
    cy.textExists(occ.baaLabelText, "Business Associate Agreements (BAA)");
    cy.findElement(common.subStepBAAText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
  });

  it("TC4: PII: Select radio option: No", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ")
    //select radio option as No
    cy.selectPiiOption(occ.noPIIRadioOption, "No");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  }); 

  it("TC5: PII: Validations", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    // if radio option is not selected
    cy.findElement(occ.yesPIIRadioOption).focus().tab()
      .then(() => {
        cy.checkErrorMessage(occ.piiRadioError, "Please select an option");
      })
    cy.selectPiiOption(occ.yesPIIRadioOption, "Yes");
    cy.textExists(common.header, "Tell us more about your system of records");

    // system Name is blank
    cy.verifyRequiredInput(
      occ.systemNameTextBox,
      occ.systemNameError,
      "Please enter the name of your system of records.");

    //Operation of work perfomred is blank
    cy.verifyRequiredInput(
      occ.operationPerformedTextBox,
      occ.operationPerformedError,
      "Please enter a description for the operation of work to be performed.");   
    //Operation of work perfomred is more than 400
    const workDescriptionText = randomString(401);
    cy.findElement(occ.operationPerformedTextBox).should("be.visible").clear()
      .type(workDescriptionText).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          occ.operationPerformedError,
          "Please limit your description to 400 characters or less");
      });

  });
});
