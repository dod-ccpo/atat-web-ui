import { bootstrapMockApis,colors,cleanText,randomString}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";


describe("Test suite: OCC: PPS substep", () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
  });
    
  it("TC1: PPS on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepPPSText, " Packaging, Packing, and Shipping ").click();
    cy.findElement(common.stepOCCText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    cy.findElement(common.subStepPPSText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
      
  });

  it("TC2: Asserts: PPS", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.verifyPageHeader(" Do you have a potential conflict of interest? ");
    cy.radioBtn(occ.coiNoRadioOption, "NO").not("[disabled]").click({ force: true })
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();    
    //navigates to packaging screen
    cy.verifyPageHeader("Do you need to include packaging, packing, or shipping instructions?");
    const expectedBodyText = "This is not common for most cloud computing acquisitions." +
      " However, you may have a situation, like Tactical Edge device delivery, instructional" +
      " materials in support of training, or physical data transfer services where you need" +
      " to transfer data on hard drives to a CSP."
    cy.findElement(occ.introText).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedBodyText);
    });
    cy.textExists(
      occ.selectMessageLabel,
      "Select all that apply to your contracting effort."
    );
    //assert checkboxes
    cy.checkBoxOption(occ.contractorProviderCheckBox, "CONTRACTOR_PROVIDED");
    const checkBoxOneTxt = "When transferring physical media between locations," +
      " the contractor shall provide a certified courier or other method of" +
      " maintaining a secure chain of custody over tapes and other media being" +
      " moved to and from a defined, secured off-site storage location. The" +
      " contractor shall provide flexibility in courier pick-up and delivery time." +
      " Other None of these apply to my acquisition."
    cy.findElement(occ.contractorProviderLabelTxt).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(checkBoxOneTxt);
    });
    //ensure user is able to check and uncheck checkboxes
    cy.checkBoxOption(occ.contractorProviderCheckBox, "CONTRACTOR_PROVIDED")
      .check({ force: true }).should("be.checked")
      .uncheck({ force: true }).should("not.be.checked");
    cy.checkBoxOption(occ.otherCheckBox, "OTHER")
      .check({ force: true }).should("be.checked")
      .uncheck({ force: true }).should("not.be.checked");
    cy.checkBoxOption(occ.noneCheckBox, "NONE").check({ force: true })
      .should("be.checked");
  });

  it("TC3: Checkbox option is Other", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepPPSText, " Packaging, Packing, and Shipping ").click();
    cy.verifyPageHeader("Do you need to include packaging, packing, or shipping instructions?");
    const othertxt = randomString(10)
    cy.ppsCheckBoxOptionSelected(
      occ.otherCheckBox,
      "OTHER",
      othertxt
    );
    
  });

  it("TC4: Checkbox is None", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepPPSText, " Packaging, Packing, and Shipping ").click();
    cy.verifyPageHeader("Do you need to include packaging, packing, or shipping instructions?");
    //user can select checkbox one and two at the same time
    cy.ppsCheckBoxOptionSelected(
      occ.contractorProviderCheckBox,
      "CONTRACTOR_PROVIDED"
    );
    cy.checkBoxOption(occ.otherCheckBox, "OTHER").check({ force: true })
      .should("be.checked");    
    //if None is checked then Other checkboxes should be unchecked.
    cy.checkBoxOption(occ.noneCheckBox, "NONE").check({ force: true })
      .should("be.checked").then(() => {
        cy.findElement(occ.contractorProviderCheckBox).should("not.be.checked");
        cy.findElement(occ.otherCheckBox).should("not.be.checked")
      });    
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();    
    //navigates next substep  Packaging, Packing, and Shipping 
    cy.findElement(common.subStepTravelText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
    
  });
  
  it("TC5: Validations", () => {
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.textExists(common.subStepPPSText, " Packaging, Packing, and Shipping ").click();
    cy.verifyPageHeader("Do you need to include packaging, packing, or shipping instructions?");    
    //validation if Check box is not selected
    cy.findElement(occ.contractorProviderCheckBox).check({force: true}).uncheck({force: true})
      .then(() => {
        cy.checkErrorMessage(
          occ.checkBoxError,
          "Please select an option.");
      });      
    //validation if Other Input field is blank
    cy.findElement(occ.otherCheckBox).check({ force: true })
      .then(() => {
        cy.findElement(occ.otherTextBox).click({force: true});
        cy.clickSomethingElse(occ.otherTextBox).then(() => {
          cy.checkErrorMessage(
            occ.otherTxtError,
            "Please enter your packaging, packing and shipping instructions."
          );
        });
      });
    
  });
});
