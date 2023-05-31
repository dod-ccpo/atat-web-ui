import { bootstrapMockApis,colors,cleanText} from "../../../helpers";
import common from "../../../selectors/common.sel";
import sac from "../../../selectors/standComp.sel";

describe("Test suite: SAC step: BAA", () => {
  
  beforeEach(() => {

    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();    
  });
    
  it("TC1: SAC: BAA is active on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //Verify the Substep is active
    cy.textExists(common.subStepBAAText, " Business Associate Agreement (BAA) ").click();
    cy.findElement(common.stepStandCompText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.subStepBAAText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();
      
  }); 

  it("TC2: Asserts: BAA", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as No
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");
    cy.textExists(sac.baaLabelText, "Business Associate Agreements (BAA)");
    const expectedPHIText = "Protected Health Information (PHI) is information which relates" +
      " to the past, present, or future physical or mental health or condition of any" +
      " individual." +
        " Per the Health Insurance Portability and Accountability Act of 1996 (HIPAA), a BAA is" +
        " required between the mission owner and the business associate to provide assurance that" +
        " the business associate will appropriately safeguard PHI when it is transmitted or" +
        " maintained in electronic (e-PHI) or any other form. Learn more about business" +
        " associates and BAAs."
    cy.findElement(sac.phiTextMessage).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(expectedPHIText);
    });
    cy.textExists(sac.learnMoreBAALink, "Learn more about business associates and BAAs.");
    //Assert Radio option label
    const baaOptionTextLabel = "Does this effort provide for definition of a" +
        " Business Associate who may be involved in but not limited to design or development" +
        " (in whole or in part) of the system, and/or for creating, receiving, transmitting," +
        " managing, and disposing of PHI?"
    cy.findElement(sac.baaRadioOptionText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(baaOptionTextLabel);
    });
    //Asserts radio options
    cy.radioBtn(sac.yesBAARadioOption, "YES").not("[disabled]");
    cy.radioBtn(sac.noBAARadioOption, "NO").not("[disabled]");
    //About Business Associates info Link
    cy.textExists(sac.aboutBALink, " Why do we need to know about business associates? ").click()
      .then(() => {
        const BAAFAQTxt = "Per HIPAA, a BAA is required when PHI is transmitted" +
            " and maintained in electronic (e-PHI) or any other form or medium and" +
            " in combination with one or more of the 18 identifiers defined by HIPAA." +
            " DISA strives to protect the confidentiality, integrity, and availability" +
            " of e-PHI by permitting a business associate to create, receive, maintain," +
            " or transmit e-PHI on its behalf, only if there is written agreement" +
            " between DISA and the business associate that provides assurance that" +
            " the business associate will appropriately safeguard such e-PHI." +
            " Business associate must also obtain same business associate agreements from" +
            " its subcontractors. For more information, reference Business Associate and PHI," +
            " CFR title 45 part 160.103 and BAA, CFR title 45 part 164.308 (b)(4)."
        cy.findElement(sac.contentAboutBA).then(($el) => {
          let actualTxt = $el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(BAAFAQTxt);
          cy.textExists(sac.moreInfoBAALink,
            "Business Associate and PHI, CFR title 45 part 160.103");
        });
      
      });
    cy.findElement(common.continueBtn).scrollIntoView();
    //cy.findElement(common.wrap).scrollTo('bottom', { easing: 'linear' });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]");
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
  });
  
  it("TC3: BAA: Select the radio options", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as No
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");
    //Select radio options
    const infoAlert = "As a mission owner, it is your responsibility to obtain the appropriate" +
        " agreements with your business associate(s). Business associates must also obtain BAAs" +
        " from their subcontractors. You do not need to provide these agreements in your" +
        " acquisition package. For sample BAA provisions, visit" +
        " https://www.hhs.gov/hipaa/for-professionals/covered-entities/" +
        " sample-business-associate-agreement-provisions/index.html."
    cy.radioBtn(sac.yesBAARadioOption, "YES").click({ force: true })
      .then(() => {
        cy.findElement(sac.infoAlert).should("be.visible").then((el) => {
          let actualTxt = el.text();
          cy.log(actualTxt);
          const formattedTxt = cleanText(actualTxt);
          expect(formattedTxt).equal(infoAlert);
        });
      });
    
    cy.radioBtn(sac.noBAARadioOption, "NO").click({ force: true })
      .then(() => {
        cy.findElement(sac.infoAlert).should("not.be.visible")
      });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();

    //navigates to next substep
    cy.textExists(common.header, "Let’s look into the Freedom of Information Act (FOIA)");
    cy.findElement(common.substepPDOIText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
  });

  it("TC4: BAA: Validations", () => {
    cy.clickSideStepper(common.stepStandCompLink, " Standards and Compliance ");
    //select radio option as No
    cy.selectPiiOption(sac.noPIIRadioOption, "NO");
    // radio options error
    cy.radioBtn(sac.yesBAARadioOption, "YES").focus();
    cy.clickSomethingElse(sac.baaRadioError)
      .then(() => {
        cy.checkErrorMessage(sac.baaRadioError, "Please select an option");
      });
    
  });

});
