import { bootstrapMockApis,colors,cleanText } from "../../helpers";
import common from "../../selectors/common.sel"
import contractDetails from "../../selectors/contractDetails.sel";

describe("Test suite: Contract Details Step", () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
        
  });
    
  it("TC1: Contract Details on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepPopText, " Period of Performance ");
    cy.findElement(common.stepContractDetailsText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();     
      
  });

  it("TC2: Asserts: Do you want to request a PoP start date?", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.header,
      " Let’s gather some details about the duration of your task order ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Do you want to request a PoP start date?");
    const expectedstartText = "Due to project requirements and/or contractual obligations," +
      " your PoP may need to start on a specific date. If no date is specified," +
      " then your PoP will begin based upon the execution date of your task order."
    cy.findElement(contractDetails.popText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedstartText);

    });
    //assert radio button options
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "true").not("[disabled]")
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "false").not("[disabled]")
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });
  
  it("TC3: Do you want to request a PoP start date?: Select Radio Option", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.header,
      " Let’s gather some details about the duration of your task order ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Do you want to request a PoP start date?");
    //Select Yes radio option
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "false").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("not.exist")
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "true").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("exist"); 
    cy.findElement(contractDetails.requestedStartDropdownIcon).click();
    const listOptions = "No sooner thanNot later than"    
    cy.findElement(contractDetails.requestedStartDropdownList).each(($el) =>
      cy.wrap($el).should("contain.text", listOptions)
    );      
    cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
    cy.findElement(contractDetails.calendarIcon).click();
    cy.findElement(contractDetails.navigateNextMonth).click({force: true}).then(() => {
      cy.findElement(contractDetails.selectDate).first().click({ force: true });
      
    }); 
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
  });

  it("TC4: Do you want to request a PoP start date?: Requested Start date is Not later than",
    () => {
      cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
      cy.textExists(common.header,
        " Let’s gather some details about the duration of your task order ");
      cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
      cy.textExists(common.header, "Do you want to request a PoP start date?");
      //Select Yes radio option
      cy.radioBtn(contractDetails.popStartDateNoRadioOption, "false").click({ force: true });
      cy.radioBtn(contractDetails.popStartDateYesRadioOption, "true")
        .click({ force: true });
      cy.findElement(contractDetails.requestedStartDropdownIcon).click();      
      // If user select the Requested start date Not later than 
      cy.findElement(contractDetails.requestedStartDateNotlaterthan).click().then(() => {
        cy.findElement(contractDetails.warningTextMessage).should("exist");
      }); 
      const expectedWarningMessageText = "In the event that a JWCC contract option period is not" +
        " exercised or is terminated/canceled prior to the end of the last anticipated option" +
        " period in the JWCC contract schedule, any current task orders’ terms and conditions" +
        " will be unaffected. All efforts will be made to accommodate your requested period of" +
        " performance start date. However, there is no guarantee that the award will be made" +
        " by said date. Normal contracting lead times and/or complexity of requirements may" +
        " prevent meeting the requested date."
      cy.findElement(contractDetails.warningTextMessage).then(($e) => {
        let actualTxt = $e.text();
        cy.log(actualTxt);
        const formattedTxt = cleanText(actualTxt)
        expect(formattedTxt).equal(expectedWarningMessageText);

      });
      cy.findElement(contractDetails.calendarIcon).click();
      cy.findElement(contractDetails.navigateNextMonth).click({force: true}).then(() => {
        cy.findElement(contractDetails.selectDate).first().click({ force: true });
      
      });
      cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    });

  it("TC5: Asserts: Will this be a future recurring requirement?", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(contractDetails.popRadioGroup).should("exist");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, " Will this be a future recurring requirement? ");
    const expectedRecuringReqText = "DISA has developed a tracking system for expiring" +
      " contracts. Responding YES to this question will enable contract" +
      " specialists to populate the tracking system."
    cy.findElement(contractDetails.recurringReqText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedRecuringReqText);

    });
    //assert radio button options
    cy.radioBtn(contractDetails.yesRadioOption,  "true").not("[disabled]").click({force: true});
    cy.radioBtn(contractDetails.noRadioOption, "false").not("[disabled]").click({force: true});
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

});