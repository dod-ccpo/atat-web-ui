import background from "../../../selectors/background.sel";
import { descriptionDetails } from "../../../sharedData/sharedData";
import "./04BGProcurementwJA.cy.js";

describe("Test suite: Step04-Background-Current Environment JA",  { testIsolation: false },() => {
  const noCurrentEnvironmentDescriptionTxt = ["No existing environment"];

  before(() => {
    //Page#1: Do you have a current environment to rehost?  No
    cy.radioBtn(background.existNoRadioOption, "NO").click({
      force: true,
    });
  });

  it("TC1:CurrentEnvironment to rehost is No", () => {
    cy.clickContinueButton(
      background.existYesRadioOption,
      "Your Background Summary"
    );
    cy.log(" TestReport:Background Summary Details");
    cy.verifyTextMatches(
      background.procurementHistoryHeaderText,
      "Procurement History"
    );
    cy.verifyListMatches(
      background.procurementHistoryDescription,
      descriptionDetails
    );
    cy.findElement(background.procurementHistoryCompleteBtn).should(
      "contain",
      "View/Edit"
    );

    cy.verifyTextMatches(
      background.currentEnvironmentHeaderText,
      "Current Environment"
    );

    cy.verifyListMatches(
      background.currentEnvironmentDescription,
      noCurrentEnvironmentDescriptionTxt
    );
    cy.clickWrapUpThisSectionBtn(background.procurementHistoryHeaderText);
  });
});
