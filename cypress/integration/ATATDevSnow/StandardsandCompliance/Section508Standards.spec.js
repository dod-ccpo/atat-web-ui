import { bootstrapMockApis,colors,cleanText,} from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/standComp.sel";

describe("Test suite: SAC: Section 508 Standards", () => {
  
  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
        
  });    
    
  it("TC1: SAC: Section508 Standards is active on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //Verify the Substepis active
    cy.textExists(common.substepSection508Text, " Section 508 Standards ").click(); 
    cy.findElement(common.stepStandCompText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.substepSection508Text)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);     
      
  });

  it("TC2: Asserts: Section 508 standards", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as No on PII screen
    cy.selectPiiOption(occ.noPIIRadioOption, "No");

    //select radio options
    cy.radioBtn(occ.noBAARadioOption, "No").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.radioBtn(occ.foiaNoOption, "false").click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.textExists(common.header, "Let’s look into your Section 508 Accessibility requirements");
    cy.textExists(occ.blueAlertLabel, " Section 508 Accessibility Standards for Cloud Computing ");
    cy.findElement(occ.scrollBar).should("be.visible");
    const sectionText = "Are the above Section 508 requirements" +
      " sufficient for this acquisition?";
    cy.findElement(occ.secton508Text).should("be.visible").then((el) => {
      let actualTxt = el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(sectionText);      
    });
    //radio buttons
    cy.radioBtn(occ.sectionNoRadio, "false").not("[disabled]").click({ force: true });
    cy.radioBtn(occ.sectionYesRadio, "true").not("[disabled]").click({ force: true });

    //About 508 FAQ Link
    cy.textExists(occ.about508Link,
      " How do I determine which Section 508 accessibility requirements apply to my acquisition? "
    );  
    cy.findElement(common.continueBtn).scrollIntoView();
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(common.stepEvaluationCriteriaText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
  });

});
