import {randomString,randomAlphaNumeric}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";


describe("Test suite: OCC: PPS substep", () => {

  let pt = "TC-Step-6-OCC-PPS-" + randomAlphaNumeric(5);
  let scope = "OCC-PPS-" + randomString(5);
  const exText = randomString(10);
  const expectedBodyText = "This is not common for most cloud computing acquisitions."+
  " However, you may have a situation, like Tactical Edge device delivery,"+
  " instructional materials in support of training, or physical data transfer"+
  " services where you need to transfer data on hard drives to a CSP.";
  const checkBoxOneTxt = "When transferring physical media between locations,"+
  " the contractor shall provide a certified courier or other method of maintaining a"+
  " secure chain of custody over tapes and other media being moved to and from a defined,"+
  " secured off-site storage location."+
  " The contractor shall provide flexibility in courier pick-up and delivery time."

  beforeEach(() => {
    
    cy. goToOCCStep(
    pt, 
    scope,
    occ.coiYesRadioOption,
    "YES",
    exText
    );
  });
    
  it("TC1:Checkbox is None ", () => {  

    cy.verifyTextMatches(occ.introText,expectedBodyText); 
    cy.textExists(
      occ.selectMessageLabel,
      "Select all that apply to your contracting effort."
    );
    //assert checkboxes
    const expectedPPSCb=[
      checkBoxOneTxt,
      "Other - Write custom instructions",
      "None of these apply to my acquisition."
    ]
    cy.verifyCheckBoxLabels(occ.ppsCB,expectedPPSCb);
    cy.checkBoxOption(occ.contractorProviderCheckBox, "CONTRACTOR_PROVIDED");    
    //user can select checkbox one and two at the same time
    cy.checkBoxOption(occ.contractorProviderCheckBox, "CONTRACTOR_PROVIDED").check({ force: true })
      .should("be.checked");
    cy.checkBoxOption(occ.otherCheckBox, "OTHER").check({ force: true })
      .should("be.checked");    
    //if None is checked then Other checkboxes should be unchecked.
    cy.checkBoxOption(occ.noneCheckBox, "NONE").check({ force: true })
      .should("be.checked").then(() => {
        cy.findElement(occ.contractorProviderCheckBox).should("not.be.checked");
        cy.findElement(occ.otherCheckBox).should("not.be.checked")
      });    
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(occ.noneCheckBox);
    cy.verifyPageHeader(
          "Tell us about your travel requirements for contractor employees"
        );
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(occ.addTrip);
    const selectedPPSCb=["None of these apply to my acquisition."]
    cy.verifyCheckBoxLabels(occ.ppsCheckedCB,selectedPPSCb)

  });

  it("TC2: Checkbox option is Other", () => {
    
    const otherTxt = randomString(10)
    cy.ppsCheckBoxOptionSelected(
      occ.otherCheckBox,
      "OTHER",
      otherTxt
    );
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(occ.otherCheckBox);
    cy.verifyPageHeader(
          "Tell us about your travel requirements for contractor employees"
        );
    cy.btnClick(common.backBtn, "Back");
    cy.waitUntilElementIsGone(occ.addTrip);
    cy.verifyPageHeader(
      "Do you need to include packaging, packing, or shipping instructions?"
      );
    const selectedPPSCb=[      
      "Other - Write custom instructions"
    ]
    cy.verifyCheckBoxLabels(occ.ppsCheckedCB,selectedPPSCb);
    cy.verifyEnteredInputTxt(occ.otherTextBox, otherTxt);
  });
  
  it("TC3: Validations", () => { 
    
    //Validation if Check box is not selected
    cy.findElement(occ.noneCheckBox)
      .check({ force: true }).uncheck({ force: true })
      .then(() => {    
        cy.checkErrorMessage(
          occ.checkBoxError,
          "Please select an option.");
      });
      
    //validation if Other Input field is blank
    cy.findElement(occ.otherCheckBox).check({ force: true })
      .then(() => {
        cy.verifyRequiredInput(occ.otherTextBox,          
            occ.otherTxtError,
            "Please enter your packaging, packing and shipping instructions."
          );
        });
      
    
  });
});
