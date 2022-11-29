import { bootstrapMockApis,colors,cleanText,randomString}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";

describe("Test suite: OCC: Conflict of Interest substep", () => {

  beforeEach(() => {

    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
  });
    
  it("TC1: COI on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepCoIText, " Conflict of Interest ");
    cy.textExists(common.subStepPPSText, " Packaging, Packing, and Shipping ");
    cy.textExists(common.subStepTrainingText, " Training ");
    cy.findElement(common.stepOCCText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.subStepCoIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
      
  });

  it("TC2: Asserts: COI", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.verifyPageHeader(" Do you have a potential conflict of interest? ");
    const expectedBodyText = "An organizational conflict of interest (COI)" +
      " is a situation where, because of other relationships or activities," +
      " a person or company (1) is unable or potentially unable to render" +
      " impartial assistance or advice to the government, (2) cannot" +
      " objectively perform contract work, or (3) has an unfair" +
      " competitive advantage. Learn more about COI."
    cy.findElement(occ.coiBodyCopyTxt).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedBodyText);

    });
    cy.textExists(occ.coiLearnMoreLink, " Learn more about COI.");
    //Asserts radio buttons
    cy.radioBtn(occ.coiYesRadioOption, "YES").not("[disabled]");
    cy.radioBtn(occ.coiNoRadioOption, "NO").not("[disabled]").click({ force: true })
      .then(() => {
        cy.findElement(occ.explanationLabelText).should("not.exist");
      });
    
  });

  it("TC3: Learn more about COI", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.verifyPageHeader(" Do you have a potential conflict of interest? ");
    cy.textExists(occ.coiLearnMoreLink, " Learn more about COI.")
      .click().then(() => {
        cy.findElement(occ.coiLearnDrawer).should("exist");
        cy.textExists(occ.coiLMDTitleText, " Learn More ");
        cy.textExists(occ.coiLMDLabel,
          "Understanding Conflicts of Interest (COI)");
        cy.textExists(occ.coiFARUrl, "FAR 9.502");
        cy.findElement(occ.coiLMDBoldText).scrollIntoView()
          .should("have.text", " Who is responsible for identifying COI? ");
        cy.findElement(occ.coiReferenceURL).scrollIntoView()
          .should("have.text", " FAR 9.5, Organizational and Consultant Conflicts of Interest");
        //close the side panel
        cy.findElement(occ.coiLMDClose).scrollIntoView().should("be.visible").click();
        cy.findElement(occ.coiLearnDrawer).not("be.visible");
      });
    
  });

  it("TC4: Select Option Yes", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.verifyPageHeader(" Do you have a potential conflict of interest? ");
    cy.radioBtn(occ.coiYesRadioOption, "YES").click({ force: true })
      .should("be.checked")
      .then(() => {
        cy.findElement(occ.explanationLabelText).should("exist");
        cy.textExists(
          occ.explanationLabelText,
          "Please provide an explanation of your conflict of interest."
        );
        const exText = randomString(10)
        cy.enterTextInTextField(occ.explanationTextBox, exText);
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    //navigates next substep  Packaging, Packing, and Shipping 
    cy.findElement(common.subStepPPSText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    
  });
  
  it("TC5: Validations", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.verifyPageHeader(" Do you have a potential conflict of interest? ");
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
