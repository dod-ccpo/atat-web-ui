import {
  randomAlphaNumeric, 
  randomNumberBetween,
  randomString,
} from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import contractDetails from "../../../../selectors/contractDetails.sel";
import background from "../../../../selectors/background.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";
import cf from "../../../../fixtures/currentFunction.json";

describe("Test suite: Performance Requirement- Current Function", () => {
  const pt =
    "TC-Step-05-Performance Requirement:Current function" +
    randomAlphaNumeric(5);
  const scope = "Project Scope-" + randomString(5);
  const selectedClassifications = ["level2"];
  const statementVal = randomString(5);

  //setOne data
  const additionalGrowth0 = "No";
  const phasedOption0 = "No";

  //setTwo data
  const additionalGrowth1 = "Yes";
  const percentVal = randomNumberBetween(1, 9);
  const phasedOption1 = "Yes";
  const scheduleVal = randomString(5);

  beforeEach(() => {
    cy.clickOnCurrentEnvironmentStep(pt, scope);
    cy.verifyPageHeader(bgCEData.CEPage1.pageHeader1);
    cy.verifyTextMatches(
      background.recurringPageText,
      bgCEData.CEPage1.pageText1
    );
    cy.verifyRadioGroupLabels(
      background.existingEnvNoRadioGroup,
      bgCEData.CEPage1.section1Radioboxes
    );
    cy.environmentsystemDiagramsMigrationOptions(
      "Yes",
      background.existYesRadioOption
    );
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.verifyPageHeader(
      "Let’s gather details about the duration of your task order"
    );
    cy.clickContinueButton(
      contractDetails.addOptionLink,
      "Do you want to request a PoP start date?"
    );
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
    cy.verifyPageHeader(" Let’s work on your performance requirements ");
    cy.findElement(performanceReqs.startCurrentFunBtn).click();
    cy.verifyPageHeader(
      "Do you want to replicate or optimize your current functions using JWCC offerings?"
    );
  });

  it("TC1: Page1 & Page2: Validations", () => {
    cy.log("Validation Message:ReplicateOptimise Radio options");
    cy.verifyRequiredRadioBtn(
      performanceReqs.replicateOptimiseNoOption,
      performanceReqs.replicateOptimiseRadioError,
      "Please select an option"
    );

    cy.selectCurrentFunction("Replicate");
    cy.log("Validation Message:Statement Text field");
    cy.verifyRequiredInput(
      performanceReqs.objectiveTextfield,
      performanceReqs.objectiveError,
      "Enter a description for your requirement."
    );
    cy.log("Validation Message:Additional growth Radio options");
    cy.verifyRequiredRadioBtn(
      performanceReqs.additionalGrowthNoOption,
      performanceReqs.additionalGrowthError,
      "Please select an option"
    );

    cy.radioBtn(performanceReqs.additionalGrowthYesOption, "YES").click({
      force: true,
    });
    cy.log("Validation Message:Capacity Percentage Text field");
    cy.verifyRequiredInput(
      performanceReqs.capacityPerTextField,
      performanceReqs.capacityTextFieldError,
      "Enter a percentage for your anticipated growth."
    );

    cy.log("Validation Message:Phased radio options");
    cy.verifyRequiredRadioBtn(
      performanceReqs.phasedNoRadioOption,
      performanceReqs.phasedRadioError,
      "Please select an option"
    );
    cy.radioBtn(performanceReqs.phasedYesRadioOption, "YES").click({
      force: true,
    });
    cy.log("Validation Message:Capacity Phased Approach Textfield");
    cy.verifyRequiredInput(
      performanceReqs.phaseApproachTextfield,
      performanceReqs.phasedApproachTextfieldError,
      "Enter details about your phased approach schedule."
    );
  });

  it("TC2: Current Function: Replicate: Anitcipate Growth and Phased Option as No", () => {
    cy.verifyTextMatches(performanceReqs.descrIntroText, cf.currentFunction);
    cy.verifyRadioGroupLabels(
      performanceReqs.radioCFLabels,
      cf.replicateOptimizeOptionsLabels
    );
    cy.verifyTextMatches(performanceReqs.jwtccAlertText, cf.jwtccInfoAlert);
    cy.selectCurrentFunction("Replicate");
    cy.enterTextInTextField(performanceReqs.objectiveTextfield, statementVal);
    cy.selectAdditionalGrowth(additionalGrowth0, "");
    cy.selectPhasedOption(phasedOption0, "");
    cy.clickContinueButton(
      performanceReqs.phasedYesRadioOption,
      "Your Performance Requirements Summary"
    );
    cy.currentFunctionCardDesc("Replicate");
  });

  it("TC3: Current Function: Optimise: Anitcipate Growth and Phased Option as Yes", () => {
    cy.selectCurrentFunction("Optimise");
    cy.enterTextInTextField(performanceReqs.objectiveTextfield, statementVal);
    cy.selectAdditionalGrowth(additionalGrowth1, percentVal);
    cy.selectPhasedOption(phasedOption1, scheduleVal);
    cy.clickContinueButton(
      performanceReqs.phasedYesRadioOption,
      "Your Performance Requirements Summary"
    );
    cy.currentFunctionCardDesc("Optimise");
  });

  it("TC4: Current Function: No", () => {
    cy.selectCurrentFunction("No");
    cy.currentFunctionCardDesc("No");
  });
  
});
