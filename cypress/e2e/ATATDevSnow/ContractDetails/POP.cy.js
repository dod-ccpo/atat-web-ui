import {
  bootstrapMockApis,
  randomNumberBetween,
  randomAlphaNumeric,
  randomString
} from "../../../helpers";
import common from "../../../selectors/common.sel";
import co from "../../../selectors/contractOffice.sel";
import contractDetails from "../../../selectors/contractDetails.sel";


describe("Test suite: Contract Details Step:Period of Performance substep", () => {
  let pt = "TC-Step-3-ContractDetails-PoP length-" + randomAlphaNumeric(5);
  let scope = "Project Scope-" + randomString(5);  


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");    
    cy.fillNewAcquisition(pt, scope);
    cy.clickDevToggleBtn();
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader("Let’s gather details about the duration of your task order");
  });
    
  
  it("TC1: Asserts:  Let’s gather details about the duration of your task order", () => {
    
    const expectedPOPText = "Your Period of Performance (PoP) will begin based" +
      " upon the execution date of your task order or on your requested start date," +
      " if applicable. It will extend through the length of the base period," +
      " plus any subsequent exercised option periods. In the fields below," +
      " specify the required length of time for each period." +
      " Add, duplicate or remove option periods as needed," +
      " not to exceed five calendar years total. Learn more about PoPs on the JWCC contract."
    cy.verifyTextMatches("p.mb-10", expectedPOPText);

    cy.findElement(contractDetails.popLearnMoreLink).should("exist");
    //assert the labels
    cy.textExists(contractDetails.popLengthLabelText, " Period of Performance length ");
    cy.textExists(contractDetails.baseLabelText, "Base");
    cy.findElement(contractDetails.baseInputTxtBox).should("exist");
    //default base period
    cy.defaultPoPLengthValue(
      contractDetails.baseInputTxtBox,
      contractDetails.baseDropdownDefault
    );         
    cy.findElement(contractDetails.baseDropdownIcon).click();
    const expectedOptions = [
      "Year",
      "Month(s)",
      "Week(s)",
      "Day(s)",      
    ];
    let foundDropdownItems = 0
    //Verifying the dropdown list
    cy.findElement(contractDetails.baseDropdownList)
      .children().each(($el) => {
        const text = $el.text();
        if (expectedOptions.indexOf(text) > -1) {
          foundDropdownItems++
        }
        return foundDropdownItems === expectedOptions.length;
      });
    
    cy.findElement(contractDetails.baseDuplicateButton).should("not.be.disabled");
    cy.findElement(contractDetails.baseDeleteButton).should("be.disabled");
    
    //Add an Option Link:
    cy.findElement(contractDetails.addOptionLink).should("exist").click();
    //default option period
    cy.defaultPoPLengthValue(
      contractDetails.optionalTextBox,
      contractDetails.optionOneDropdownDefault
    );
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader(
      " Do you want to request a PoP start date? "
    );    
  });

  it("TC2: Validations: Pop Length should not exceed one year", () => {
    let option;
    const showValidationMessage = (() => {
      cy.checkErrorMessage(contractDetails.errorMessageText,
        " The length of this period must be "+ option +" or less.");
    });
    //enter the Base value morethan 1 years 
    cy.findElement(contractDetails.baseInputTxtBox).clear().type("6").then(() => {
      option = " 1 year ";
      showValidationMessage()
    });
    //enter the base value 13 months
    cy.findElement(contractDetails.baseInputTxtBox).clear().type("13")
    cy.findElement(contractDetails.baseDropdownIcon).click();
    cy.findElement(contractDetails.baseDropdownMonth).click().then(() => {
      option = "12 months"
      showValidationMessage()
    });
    //enter the base value more than 365 days
    cy.findElement(contractDetails.baseInputTxtBox).clear().type("367")
    cy.findElement(contractDetails.baseDropdownIcon).click();
    cy.findElement(contractDetails.baseDropdownDays).click().then(() => {
      option = "365 days"
      showValidationMessage()
    });
    //enter the base value more than 52 weeks
    cy.findElement(contractDetails.baseInputTxtBox).clear().type("55")
    cy.findElement(contractDetails.baseDropdownIcon).click();
    cy.findElement(contractDetails.baseDropdownWeek).click().then(() => {
      option = "52 weeks"
      showValidationMessage()
    });
    
  });

  it("TC3: Delete:  Let’s gather details about the duration of your task order", () => {   
    cy.popLengthOptionYearExists();    
    cy.findElement(contractDetails.addOptionLink).click();
    cy.popLengthOptionYearExists();
    cy.findElement(contractDetails.baseDeleteButton).click();    
  });

  it("TC4: Duplicate: Drag and Drop", () => {       
    cy.findElement(contractDetails.baseDropdownIcon).click();
    cy.findElement(contractDetails.baseDropdownMonth).click();
    //Enter the Value for Base
    const base = randomNumberBetween(1,12);
    cy.findElement(contractDetails.baseInputTxtBox).clear().type(base);
    cy.findElement(contractDetails.baseDuplicateButton).click({force: true})
      .then(() => {
        cy.findElement(contractDetails.optionalTextBox).should("exist")
          .and  ("have.value", base)
        cy.findElement(contractDetails.optionOneDropdownSelected).should("exist")
          .and("have.text","Month(s)")
      });
    cy.findElement(contractDetails.addOptionLink).should("exist").click();
    const option2 =randomNumberBetween(1,4);
    cy.findElement(contractDetails.optionalTwoTextBox).clear().type(option2);
    cy.findElement(contractDetails.sourceItem)
      .drag(contractDetails.targetItem)
      .then((success) => {
        assert.isTrue(success)
        cy.findElement(contractDetails.sourceItem).trigger("dragend");
      });

    //After Drag and Drop,'Base' textbox has 'Option#2' value &'Option#2' textbox has 'Base' value
    cy.findElement(contractDetails.optionalTwoTextBox).should("have.value", base);
    cy.findElement(contractDetails.baseInputTxtBox).should("have.value", option2);
  });

  it("TC5: Asserts: Do you want to request a PoP start date?", () => {
    cy.findElement(contractDetails.addOptionLink).click();    
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader(
      " Do you want to request a PoP start date? "
    );
    
    const expectedstartText = "Due to project requirements and/or contractual obligations," +
      " your PoP may need to start on a specific date. If no date is specified," +
      " then your PoP will begin based upon the execution date of your task order."
    cy.verifyTextMatches(contractDetails.popText,expectedstartText);    
    //assert radio button options
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES")
      .not("[disabled]").and("not.checked");
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO")
      .not("[disabled]").and("not.checked")
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.popStartDateNoRadioOption);
    cy.verifyPageHeader(
      " Let’s gather details about the duration of your task order "
    );
    cy.defaultPoPLengthValue(
      contractDetails.baseInputTxtBox,
      contractDetails.baseDropdownDefault
    );
    cy.defaultPoPLengthValue(
      contractDetails.optionalTextBox,
      contractDetails.optionOneDropdownDefault
    );
  });
  
  it("TC6: POP Start Date: Select Radio Option", () => { 
    cy.findElement(contractDetails.addOptionLink).click();
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader(
      " Do you want to request a PoP start date? "
    );
    //Select Yes radio option
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("not.exist")
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").click({ force: true });
    cy.findElement(contractDetails.requestedStartDate).should("exist"); 
    cy.findElement(contractDetails.requestedStartDropdownIcon).click();
    const listOptions = [
      "No sooner than",
      "Not later than"
    ]    
    cy.verifyStringArray(contractDetails.requestedStartDropdownList, listOptions);
    cy.findElement(contractDetails.requestedStartDateNosoonerthan).click();
    cy.selectDatefromDatePicker(
      contractDetails.calendarIcon,
      contractDetails.navigateNextMonth,
      contractDetails.selectDate,
      "11",
      contractDetails.datePicker
    );
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
  });

  it("TC7: POP Start Date: Requested Start date is Not later than",
    () => {     
      cy.findElement(contractDetails.addOptionLink).click();
      cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
      cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
      cy.verifyPageHeader(
        " Do you want to request a PoP start date? "
      );
      
      //Select Yes radio option      
      cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES")
        .click({ force: true });
      cy.findElement(contractDetails.requestedStartDropdownIcon).click();      
      // If user select the Requested start date Not later than 
      cy.findElement(contractDetails.requestedStartDateNotlaterthan).click().then(() => {
        cy.findElement(contractDetails.warningTextMessage).should("exist");
      }); 
      const expectedWarningMessageText = "All efforts will be made to accommodate your requested" +
        " period of performance start date. However, there is no guarantee that the award will be" +
        " made by said date. Normal contracting lead times and/or complexity of requirements may" +
        " prevent meeting the requested date."
      cy.verifyTextMatches(contractDetails.warningTextMessage,expectedWarningMessageText);      
      cy.selectDatefromDatePicker(
        contractDetails.calendarIcon,
        contractDetails.navigateNextMonth,
        contractDetails.selectDate,
        "13",
        contractDetails.datePicker
      );
      cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
      cy.waitUntilElementIsGone(contractDetails.popStartDateYesRadioOption);
      cy.verifyPageHeader("Will this be a recurring requirement?")
    });
  
  it("TC8: Validations: POP Start Date", () => {
    cy.findElement(contractDetails.addOptionLink).click();
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader( "Do you want to request a PoP start date?");
    //radio button options not selected
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES").focus();
    cy.clickSomethingElse(contractDetails.popStartRadioError)
      .then(() => {
        cy.checkErrorMessage(
          contractDetails.popStartRadioError,
          "Please select an option"
        );
      });
    cy.radioBtn(contractDetails.popStartDateYesRadioOption, "YES")
      .click({ force: true }).then(() => {
        cy.findElement("#RequestDateOption_dropdown_field_control").should("exist");
        cy.findElement(contractDetails.requestDatePicker).focus().click();
        cy.clickSomethingElse()
          .then(() => {
            cy.checkErrorMessage(
              contractDetails.requestDatePickerError,
              "Please enter a valid date"
            );
          });
      });  
    
  });

  it("TC9: Asserts: Will this be a recurring requirement?", () => {
    cy.findElement(contractDetails.addOptionLink).click();
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader( "Do you want to request a PoP start date?");
    cy.radioBtn(contractDetails.popStartDateNoRadioOption, "NO").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.popStartDateNoRadioOption);
    cy.verifyPageHeader( "  Will this be a recurring requirement? ");    
    //assert radio button options
    cy.radioBtn(contractDetails.yesRadioOption,  "YES").not("[disabled]").click({force: true});
    cy.radioBtn(contractDetails.noRadioOption, "NO").not("[disabled]").click({force: true});
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.yesRadioOption);
    cy.verifyPageHeader("Which contract type(s) apply to this acquisition?");    
    cy.btnExists(common.backBtn, "Back").not("[disabled]").click();
    cy.verifyPageHeader("  Will this be a recurring requirement? ");
    cy.waitUntilElementIsGone(contractDetails.ffpCheckBox);
    cy.verifySelectedRadioOption(contractDetails.activeRadioOption, "No");
  });    

});
