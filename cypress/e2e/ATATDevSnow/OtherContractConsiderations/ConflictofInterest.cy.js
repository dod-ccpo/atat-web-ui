import {randomString,randomAlphaNumeric}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";


describe("Test suite: OCC:Conflict of Interest substep", () => {
  let pt = "TC-Step-6-OCC-COI-" + randomAlphaNumeric(5);
  let scope = "OCC-COI-" + randomString(5);
  const expectedBodyText = "An organizational COI is a situation where,"+
    " because of other relationships or activities, a person or company either"+
    " is unable or potentially unable to render impartial assistance or advice to the government,"+
    " cannot objectively perform contract work, or has an unfair competitive advantage. Learn more about COI.";
  const exText = randomString(10);

  beforeEach(() => {
    
    cy.goToAcqPackageStepOne(pt, scope)
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.activeStep(common.stepOCCText);
    cy.verifyPageHeader(
            "Do you have a potential Conflict of Interest (COI)?"
        );
  });     

  it("TC1: Asserts: COI", () => {    
    cy.verifyTextMatches(occ.coiBodyCopyTxt,expectedBodyText);
    cy.textExists(occ.coiLearnMoreLink, " Learn more about COI.");
    //Asserts radio buttons
    cy.radioBtn(occ.coiYesRadioOption, "YES").not("[disabled]");
    cy.selectCOIOption(occ.coiNoRadioOption, "NO");
    //Ensure data is retrieved correctly,when user revisits the page
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(occ.contractorProviderCheckBox);
    cy.verifyPageHeader(
    "Do you have a potential Conflict of Interest (COI)?"
    );
    cy.verifySelectedRadioOption(occ.coiActiveRadioOption, "No");
  });

  it("TC2:Learn more about COI", () => {    
    cy.textExists(occ.coiLearnMoreLink, " Learn more about COI.")
      .click().then(() => {
        cy.findElement(occ.coiLearnDrawer).should("exist");
        cy.textExists(occ.coiLMDTitleText, " Learn More ");
        cy.textExists(occ.coiLMDLabel,
          "Understanding Conflicts of Interest (COI)");
        cy.textExists(occ.coiFARUrl, "FAR 9.502");
        cy.findElement(occ.coiLMDBoldText).scrollIntoView()
          .should("have.text", " Who is responsible for identifying COI? ")
        //close the side panel
        cy.findElement(occ.coiLMDClose).should("be.visible").click();
        cy.findElement(occ.coiLearnDrawer).not("be.visible");
      });
    
  });

  it("TC3:Select Option Yes", () => {
    cy.selectCOIOption(occ.coiYesRadioOption, "YES",exText);
    //Ensure data is retrieved correctly,when user revisits the page
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(occ.noneCheckBox);
    cy.verifyPageHeader(
    "Do you have a potential Conflict of Interest (COI)?"
    );
    const selectedCOI ="radio_button_checkedYes."+
    " There is a potential COI that may influence which CSP should be awarded this task order."
    cy.verifySelectedRadioOption(occ.coiActiveRadioOption, selectedCOI);
    cy.verifyEnteredInputTxt(occ.explanationTextBox, exText);
  });
  
  it("TC4: Validations", () => {    
    cy.radioBtn(occ.coiYesRadioOption, "YES").click({ force: true })
      .should("be.checked")
    //Explanation text box is blank
    cy.verifyRequiredInput(
      occ.explanationTextBox,
      occ.explanationTextError,
      "Please provide an explanation of your COI."
    );
    //More than 1600 characters
    const explanationText = randomString(1601)
    cy.findElement(occ.explanationTextBox).should("be.visible").clear()
      .type(explanationText).blur({ force: true }).then(() => {
        cy.checkErrorMessage(
          occ.explanationTextError,
          "Please limit your description to 1600 characters or less");
      });    
    
  });

});     

