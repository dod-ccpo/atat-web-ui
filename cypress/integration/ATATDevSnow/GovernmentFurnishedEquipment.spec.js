import { colors,cleanText ,bootstrapMockApis} from "../../helpers";
import common from "../../selectors/common.sel"
import govFurEquip from "../../selectors/govFurEquip.sel";
import org from "../../selectors/org.sel";

describe("Test suite: Government Furnished Equipment", () => {

  beforeEach(() => {

    bootstrapMockApis();
    cy.launchATAT();
    
  });
    
  it("TC1: Government Furnished Equipment on the Vertical Stepper", () => {
    cy.clickSideStepper(common.stepGovFurEquipLink, " Government Furnished Equipment ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepPropDetailsText, " Property Details ");
    cy.textExists(common.substepJustificationText, " Justification ");
    cy.findElement(common.subStepPropDetailsText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary)
      .click();     
      
  });

  it("TC2: Asserts: Will this be a future recurring requirement?", () => {
    cy.clickSideStepper(common.stepGovFurEquipLink, " Government Furnished Equipment ");
    cy.textExists(
      common.header,
      " Will government equipment be furnished, provided or acquired under this acquisition? "
    );
    //assert radio button options
    cy.radioBtn(govFurEquip.yesRadioOption, "YES").not("[disabled]").click({ force: true });
    cy.findElement(govFurEquip.blueInfoMessageText).should("not.exist");
    cy.radioBtn(govFurEquip.noRadioOption, "NO").not("[disabled]").click({force: true});    
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(common.substepJustificationText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
      
  });

  it("TC3: Blue Info message displays only when user previously select DISA Agency", () => {
    cy.clickSideStepper(common.subStepOrganizationLink, " Organization ");
    // Navigates to "Organization"
    cy.textExists(common.header, " Next, we’ll gather information about your organization ");
    // Agency is DISA
    cy.agency("Defense Information Systems");
    cy.textExists(org.disaDropDownLabel," DISA Organization ");
    cy.autoCompleteSelection(org.disaOrgInput, "Assistan",org.disaAutoComplete);
    cy.textExists(org.activityAddressCodeLabel, " DoD Activity Address Code (DoDAAC) ");
    cy.enterTextInTextField(org.activityAddressCodeTxtBox, "DoDDD");
    cy.clickSideStepper(common.stepGovFurEquipLink, " Government Furnished Equipment ");
    cy.textExists(
      common.header,
      " Will government equipment be furnished, provided or acquired under this acquisition? ");
    //assert radio button options
    cy.radioBtn(govFurEquip.yesRadioOption, "YES").not("[disabled]")
    cy.findElement(govFurEquip.blueInfoMessageText).should("exist").and("be.visible");
    const alertText = "As a DISA mission owner, your GFP must be reviewed and approved by the" +
      " Workforce Services Directorate (WSD) Property Office. Once you are ready to submit" +
      " your acquisition package, we’ll take care of sending your GFP documents for review."
    cy.findElement(govFurEquip.blueInfoMessageText).then(($e) => {
      let actualTxt = $e.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(alertText);

    })
    cy.radioBtn(govFurEquip.noRadioOption, "NO").not("[disabled]");    
    cy.btnExists(common.backBtn, "Back").not("[disabled]");
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.findElement(common.substepJustificationText)
      .should("be.visible")
      .and('have.css', 'color', colors.primary);
      
  });

  it("TC4: Validations: Property Details", () => {
    cy.clickSideStepper(common.stepGovFurEquipLink, " Government Furnished Equipment ");
    cy.textExists(
      common.header,
      " Will government equipment be furnished, provided or acquired under this acquisition? ");
    //No radio button option is selected
    cy.radioBtn(govFurEquip.yesRadioOption, "YES").focus().tab().tab().then(() => {
      cy.checkErrorMessage(govFurEquip.govEquipRadioError, "Please select an option");
    });
      
  });
});
