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

  it("TC2: Asserts: Let’s gather some details about the duration of your task order", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.textExists(common.header,
      " Let’s gather some details about the duration of your task order ");
    const expectedPOPText = "Your Period of Performance (PoP) will begin based upon" +
      " the execution date of your task order or on your requested start date, if applicable." +
      " It will extend through the length of the base period, plus any subsequent option periods." +
      " In the fields below, specify the length of time that each period will remain in effect." +
      " Add, duplicate or remove option periods as needed, up to 5 years total." +
      " Learn more about PoPs on the JWCC contract."
    cy.findElement("p.mb-10").then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedPOPText);

    });

    cy.findElement(contractDetails.popLearnMoreLink).should("exist");
    //assert the labels
    cy.textExists(contractDetails.popLengthLabelText, " Period of Performance length ");
    cy.textExists(contractDetails.baseLabelText, " Base ");
    cy.findElement(contractDetails.baseInputTxtBox).should("exist");
    cy.findElement(contractDetails.baseDropdownIcon).click();
    cy.findElement(contractDetails.baseDropdownMonth).click();
    //Enter the Value for Base
    cy.findElement(contractDetails.baseInputTxtBox).type("12");
    cy.findElement(contractDetails.baseDuplicateButton).should("be.disabled");
    cy.findElement(contractDetails.baseDeleteButton).should("be.disabled");
    
    //Add an Option Link:
    cy.findElement(contractDetails.addOptionLink).should("exist").click();
    cy.findElement(contractDetails.optionalTextBox).type("4");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });

  it("TC3: Validations: Pop Length should not be able to exceed 5 years in total", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    const showValidationMessage = (() => {
      cy.checkErrorMessage(contractDetails.errorMessageText,
        " The total length of your base and option periods should be 5 years or less.");
    });
    //enter the Base value morethan 5 years 
    cy.findElement(contractDetails.baseInputTxtBox).type("6").then(() => {
      showValidationMessage()
    });
    //enter the base value and Option year more than 5 years
    cy.findElement(contractDetails.baseInputTxtBox).clear().type("3");
    cy.findElement(contractDetails.addOptionLink).should("exist").click();
    cy.findElement(contractDetails.optionalTextBox).type("4").then(() => {      
      showValidationMessage()
    });
    cy.findElement(contractDetails.baseDeleteButton).click();
    //enter the base valuemorethan 5 years in months
    cy.findElement(contractDetails.baseDropdownIcon).click();
    cy.findElement(contractDetails.baseDropdownMonth).click();
    cy.findElement(contractDetails.baseInputTxtBox).clear().type("66")
      .then(() => {
        showValidationMessage()
      });
  });

  it("TC4: Delete:Let’s gather some details about the duration of your task order", () => {
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.findElement(contractDetails.baseDeleteButton)
      .should("exist")
      .and("be.disabled");    
    cy.popLengthOptionYearExists();    
    cy.findElement(contractDetails.addOptionLink).click();
    cy.popLengthOptionYearExists();
    cy.findElement(contractDetails.baseDeleteButton).click();
    
  });

  it("TC5: Asserts: Do you want to request a PoP start date?", () => {
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
  
  it("TC6: Do you want to request a PoP start date?: Select Radio Option", () => {
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

  it("TC7: Do you want to request a PoP start date?: Requested Start date is Not later than",
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

  it("TC8: Asserts: Will this be a future recurring requirement?", () => {
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