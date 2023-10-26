import { randomAlphaNumeric, randomString } from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import contractDetails from "../../../../selectors/contractDetails.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import background from "../../../../selectors/background.sel";
import bgCEData from "../../../../fixtures/bgCEData.json";
import cf from "../../../../fixtures/currentFunction.json";
import archDesign from "../../../../fixtures/architecturalDesign.json";

describe("Test suite: Performance Requirement- Architecural design", () => {
  const pt =
    "TC-Step-05-Performance Requirement:Architecural design" +
    randomAlphaNumeric(5);
  const scope = "Project Scope-" + randomString(5);
  const input = randomString(4);
  const selectedClassifications = ["level4"];
  const objecText = "Arch design- " + randomAlphaNumeric(5);
  const appsNeedVal = "appsNeed- " + randomAlphaNumeric(5);
  const externalFactor = "externalfactor-" + randomAlphaNumeric(5);
  const archClassLevelDesc = [];
  const archDesignNoDesc = `No requirements`;

  before(() => {
    cy.goToContractDetailsStep(
      pt,
      scope,
      contractDetails.popStartDateNoRadioOption,
      "NO",
      input
    );
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
    cy.verifyPageHeader(" Let’s work on your performance requirements ");
    cy.findElement(performanceReqs.startArchDesignBtn).contains("Start");
    cy.findElement(performanceReqs.startArchDesignBtn).click();
  });

  it("TC1: Page1 & Page2: asserts & Validations", () => {
    cy.log("Page1:asserts");
    cy.verifyTextMatches(
      performanceReqs.descrIntroText,
      archDesign.page1DescText
    );

    cy.log("Validation Message:Arch Design Radio options");
    cy.verifyRequiredRadioBtn(
      performanceReqs.archNoRadioBtn,
      performanceReqs.archRadioGroupError,
      "Please select an option"
    );
    cy.verifyTextMatches(performanceReqs.jwtccAlertText, cf.jwtccInfoAlert);
    cy.selectArchDesignOption("Yes");

    cy.log("Page2:Asserts");
    cy.verifyTextMatches(
      performanceReqs.descrIntroText,
      archDesign.page2DescText
    );
    cy.verifyTextMatches(
      performanceReqs.statementLabel,
      archDesign.statementLabel
    );
    cy.verifyTextMatches(
      performanceReqs.archClassGroupLabel,
      archDesign.classGroupLabel
    );
    cy.verifyCheckBoxLabels(
      performanceReqs.archClassCheckboxes,
      archDesign.classificationLevels
    );
    cy.verifyTextMatches(
      performanceReqs.externalFactorLabel,
      archDesign.externalFactorLabel
    );
    cy.log("Validation Message:Statement Text field");
    cy.verifyRequiredInput(
      performanceReqs.objectiveTextfield,
      performanceReqs.objectiveError,
      "Enter a description for your requirement."
    );
  });

  it("TC2: Fill in the details in page2", () => {
    cy.log("Fill in the deatils in page2");
    cy.findElement(performanceReqs.objectiveTextfield).scrollIntoView();
    cy.enterTextInTextField(performanceReqs.objectiveTextfield, objecText);
    cy.enterTextInTextField(performanceReqs.appNeedsTextfield, appsNeedVal);
    cy.selectCheckBoxes([
      performanceReqs.archDesignClassCheckboxes +
        " " +
        performanceReqs.checkBoxIL2,
      performanceReqs.archDesignClassCheckboxes +
        " " +
        performanceReqs.checkBoxIL4,
    ]);
    cy.enterTextInTextField(
      performanceReqs.externalFactorTextField,
      externalFactor
    );
    cy.clickContinueButton(
      performanceReqs.externalFactorTextField,
      "Your Performance Requirements Summary"
    );
    cy.checkElementsTextAgainstArray(
      performanceReqs.archDesignDesc,
      archClassLevelDesc
    );
    cy.clickAndWaitForElementExists(
      performanceReqs.startArchDesignBtn,
      performanceReqs.archYesRadioBtn
    );
  });

  it("TC3: Navigation:View/Edit, Change Arch Option from Yes to No", () => {
    cy.log("Modify existing option from Yes to No in page1");
    cy.findElement(performanceReqs.archYesRadioBtn).should("be.checked");
    cy.selectArchDesignOption("No");
    cy.verifyTextMatches(performanceReqs.archDesignDesc, archDesignNoDesc);
  });

  it("TC4: When Arch design is No,warning message text in Xaas screen", () => {
    cy.log("Verify the warning message on XaaS page");
    cy.findElement(performanceReqs.startXaaSBtn).scrollIntoView();
    cy.clickAndWaitForElementExists(
      performanceReqs.startXaaSBtn,
      performanceReqs.computeCheckBox
    );
    cy.findElement(performanceReqs.archDesignAlert).should("exist");
    cy.verifyTextMatches(
      performanceReqs.archDesignAlert,
      archDesign.onlyArchAlertInXaaS
    );
    cy.findElement(performanceReqs.xaasNoneCheckBox).click({ force: true });
    cy.clickContinueButton(
      performanceReqs.xaasNoneCheckBox,
      "Your Performance Requirements Summary"
    );
    cy.clickAndWaitForElementExists(
      performanceReqs.startXaaSBtn,
      performanceReqs.computeCheckBox
    );
    cy.findElement(performanceReqs.completeArchDesignLink).should("exist");
    cy.clickAndWaitForElementExists(
      performanceReqs.completeArchDesignLink,
      performanceReqs.archYesRadioBtn
    );
    cy.findElement(performanceReqs.archNoRadioBtn).should("be.checked");
    cy.clickContinueButton(
      performanceReqs.archNoRadioBtn,
      "Your Performance Requirements Summary"
    );
  });

  it("TC5a: Add current environment to the package", () => {
    cy.clickSideStepper(common.stepBackgroundLink, " Background ");
    cy.findElement(common.substepCurrentEnvironmentLink).click();
    cy.radioBtn(background.existYesRadioOption, "YES").click({
      force: true,
    });
    cy.clickContinueButton(
      background.existYesRadioOption,
      bgCEData.CEPage2.pageHeader2
    );
    cy.findElement(common.stepPerformanceReqText).click();
    cy.verifyPageHeader(" Your Performance Requirements Summary ");
  });
  
  it("TC5b: When Arch design is No,warning message text on current function", () => {
    cy.log("Verify the warning message on current function page");
    cy.findElement(performanceReqs.startCurrentFunBtn).scrollIntoView();
    cy.clickAndWaitForElementExists(
      performanceReqs.startCurrentFunBtn,
      performanceReqs.replicateRadioOption
    );
    cy.verifyTextMatches(
      performanceReqs.replicateAlert,
      archDesign.archAlertInCF
    );
    cy.selectCurrentFunction("No");
    cy.clickAndWaitForElementExists(
      performanceReqs.startCurrentFunBtn,
      performanceReqs.replicateRadioOption
    );
    cy.findElement(performanceReqs.completeArchDesignLink).should("exist");
    cy.findElement(performanceReqs.completeXaaSLink).should("exist");
    cy.clickAndWaitForElementExists(
      performanceReqs.completeXaaSLink,
      performanceReqs.computeCheckBox
    );
    cy.log("Verify the warning message & current function link in XaaS page");
    cy.findElement(performanceReqs.completeCurrentEnvLink).should("exist");
    cy.verifyTextMatches(
      performanceReqs.archDesignAlert,
      archDesign.bothArchCFInXaas
    );
    cy.clickContinueButton(
      performanceReqs.xaasNoneCheckBox,
      "Your Performance Requirements Summary"
    );
        
  });

  it("TC6:'Red Alert' message display on Step 5 landing Page ", () => {
    cy.log("'Red Alert' exists -'No' for Arch design,Current function, & None for XaaS");
    cy.findElement(performanceReqs.dowlandingPageAlert).should("exist");
    cy.verifyTextMatches(
      performanceReqs.dowlandingPageAlert,
      archDesign.dowLandingPageAlert
    );
    cy.findElement(performanceReqs.startCurrentFunBtn).contains("Revisit");
    cy.findElement(performanceReqs.startArchDesignBtn).contains("Revisit");
    cy.findElement(performanceReqs.startXaaSBtn).contains("Revisit");
  });

  it("TC7: Revisit the ArchDesign & change the selection to Yes", () => {
    cy.log("verify warning message in the Arch design solution page");
    cy.findElement(performanceReqs.startArchDesignBtn).scrollIntoView();
    cy.clickAndWaitForElementExists(
      performanceReqs.startArchDesignBtn,
      performanceReqs.archYesRadioBtn
    );
    cy.verifyTextMatches(
      performanceReqs.archDesignAlert,
      archDesign.archAlertOnlyInArchDesignSol
    );
    cy.log("Modify Arch design from No to Yes and ensure no red alert text exists");
    cy.selectArchDesignOption("Yes");
    cy.enterTextInTextField(performanceReqs.objectiveTextfield, objecText);
    cy.selectCheckBoxes([performanceReqs.checkBoxIL2]);
    cy.clickContinueButton(
      performanceReqs.externalFactorTextField,
      "Your Performance Requirements Summary"
    );

    cy.log("Verify the No Alert text exists & Buttons change to View/Edit");
    cy.findElement(performanceReqs.dowlandingPageAlert).should("not.exist");
    cy.findElement(performanceReqs.startCurrentFunBtn).contains("View/Edit");
    cy.findElement(performanceReqs.startArchDesignBtn).contains("View/Edit");
    cy.findElement(performanceReqs.startXaaSBtn).contains("View/Edit");
  });

  it("TC8: No warning message exists in Current function & Xaas Pages", () => {
    cy.log(
      "No longer warning messages exists after changes the Arch Option to Yes in Xaas screen"
    );
    cy.findElement(performanceReqs.startXaaSBtn).scrollIntoView();
    cy.clickAndWaitForElementExists(
      performanceReqs.startXaaSBtn,
      performanceReqs.computeCheckBox
    );
    cy.findElement(performanceReqs.archDesignAlert).should("not.exist");
    cy.findElement(performanceReqs.completeArchDesignLink).should("not.exist");
    cy.clickContinueButton(
      performanceReqs.xaasNoneCheckBox,
      "Your Performance Requirements Summary"
    );
    cy.log(
      "No longer warning messages exists after changes the Arch Option to Yes in CF screen"
    );
    cy.findElement(performanceReqs.startCurrentFunBtn).scrollIntoView();
    cy.clickAndWaitForElementExists(
      performanceReqs.startCurrentFunBtn,
      performanceReqs.replicateRadioOption
    );
    cy.findElement(performanceReqs.replicateAlert).should("not.exist");
    cy.findElement(performanceReqs.completeArchDesignLink).should("not.exist");
    cy.clickContinueButton(
      performanceReqs.replicateRadioOption,
      "Your Performance Requirements Summary"
    );
  });
});