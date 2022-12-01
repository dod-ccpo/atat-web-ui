import { bootstrapMockApis,colors,cleanText}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";


describe.skip("Test suite: OCC: Training substep", () => {
  
  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
  });
    
  it("TC1: Training on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.findElement(common.stepOCCText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.subStepTrainingText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
      
  });

  it("TC2: Asserts: Training", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.verifyPageHeader(" Do you have a potential conflict of interest? ");
    cy.radioBtn(occ.coiNoRadioOption, "NO").not("[disabled]").click({ force: true })
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();    
    //navigates to packaging screen
    cy.verifyPageHeader("Do you need to include packaging, packing, or shipping instructions?");
    cy.checkBoxOption(occ.noneCheckBox, "NONE").check({ force: true })
      .should("be.checked");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(common.subStepTravelText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    const expectedBodyText = "Contractor employees may be required to take periodic" +
      " mandatory training courses provided through the agency, such as records" +
      " management training and other training required by statute, regulation," +
      " DoD, or local (e.g. DISA) policy. If your project requires specific training," +
      " we’ll gather details about these courses next."
    cy.findElement(occ.coiBodyCopyTxt).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedBodyText);
    });
    //assert the radio options
    cy.radioBtn(occ.trainingNoRadioBtn, "NO").not("[disabled]").and("not.be.checked");
    cy.radioBtn(occ.trainingYesRadioBtn, "YES").not("[disabled]")
      .and("not.be.checked")
    //select the radio option as Yes
    cy.selectTrainingOption(occ.trainingYesRadioBtn, "YES");

  });

  it("TC3: Option selected No", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    cy.selectTrainingOption(occ.coiNoRadioOption, "NO");   
  });

  it("TC4: Validation", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepTrainingText, " Training ").click({force: true});
    cy.verifyPageHeader("Do you require any specific training courses from your contractors?");
    cy.findElement(occ.trainingYesRadioBtn).focus().tab().tab().then(() => {
      cy.checkErrorMessage(
        occ.trainingRadioError,
        "Please select an option");    
    })
  
  });  

});
