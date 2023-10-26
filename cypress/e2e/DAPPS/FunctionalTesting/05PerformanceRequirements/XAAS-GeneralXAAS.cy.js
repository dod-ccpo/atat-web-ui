import { randomAlphaNumeric, randomString } from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import serviceOfferingGroups from "../../../../fixtures/serviceOfferingGroups.json";

describe("Test suite: General XAAS Requirement Categories with Instances", () => {
  const pt =
    "TC-Step-5-PR-General XAAS Requirement Categories-" + randomAlphaNumeric(5);
  const scope = "General XAAS Requirement Categories" + randomString(5);
  const selectedClassifications = [
    "level2",
    "level4",
    "level5",
    "level6",
    "tops",
  ];
  const classificationInstance = [
    //"impactLevel2",
    // "impactLevel4",
    "impactLevel5",
    // "impactLevel6",
    // "tops",
  ];

  before(() => {
    cy.requiredContractDetailsforPR(pt, scope);
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
  });

  it("TC1: Verify General IaaS, PaaS, and SaaS Offering", () => {
    cy.findElement(performanceReqs.startXaaSBtn).click();
    cy.findElement(performanceReqs.generalCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.anticipatedUsersPage();
    cy.clickContinueButton(
      performanceReqs.pageTextanticipatedUsers,
      serviceOfferingGroups.GeneralXaasPage.pageHeader1
    );
    cy.verifyTextMatches(
      performanceReqs.pageMainText,
      serviceOfferingGroups.GeneralXaasPage.sectionTitle
    );
    cy.log("What classification level is this instance deployed in? ");
    cy.selectDeployedClassificationLevel(classificationInstance);

    cy.log(" Statement of objectives for the anticipated need or usage");
    cy.anticipatedNeedAndDurationTitleandData(
      "GeneralXaas",
      "GeneralText",
      "requirement",
      "Yes"
    );
    cy.requirementsSummaryPage("General IaaS, PaaS, and SaaS", "requirements");

    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Statement of objectives",
      "GENERALTEXT"
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Duration",
      "ENTIRETASKORDER"
    );
  });

  it("TC2: Edit any General IaaS, PaaS, and SaaS to update", () => {
    cy.findElement(performanceReqs.instanceOneEditBtn).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.generalPageTitle,
      serviceOfferingGroups.GeneralXaasPage.pageTitle
    );
    cy.selectDeployedClassificationLevel(classificationInstance);
    cy.anticipatedNeedAndDurationTitleandData(
      "GeneralXaas",
      "UpdatedText",
      "requirement",
      "No"
    );

    cy.requirementsSummaryPage("General IaaS, PaaS, and SaaS", "requirements");

    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Statement of objectives",
      "GENERALTEXTUPDATEDTEXT"
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Duration",
      "BASEPERIOD"
    );
  });

  it("TC3: Delete any General IaaS, PaaS, and SaaS Instance", () => {
    cy.deleteInstanceOrRequirement(
      "Requirement",
      "General IaaS, PaaS, and SaaS"
    );
  });

  it("TC4: Add another General IaaS, PaaS, and SaaS Instance", () => {
    cy.findElement(performanceReqs.addAnotherInstance).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.pageMainText,
      serviceOfferingGroups.GeneralXaasPage.sectionTitle
    );
    cy.selectDeployedClassificationLevel(classificationInstance);
    cy.anticipatedNeedAndDurationTitleandData(
      "GeneralXaas",
      "NewGeneralText",
      "requirement",
      "Yes"
    );
    cy.requirementsSummaryPage("General IaaS, PaaS, and SaaS", "requirements");
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Statement of objectives",
      "NEWGENERALTEXT"
    );
    cy.verifyTableData(
      performanceReqs.summaryTableHeader,
      performanceReqs.summaryTableData,
      "Duration",
      "ENTIRETASKORDER"
    );
  });

  it("TC5: Verify Error Message Validations", () => {
    cy.errorMessageValidations("General IaaS, PaaS, and SaaS");

    cy.clickContinueButton(
      performanceReqs.classLevelQuestion,
      serviceOfferingGroups.GeneralXaasPage.generalSummaryPageTitle
    );
  });

  it("TC6: I dont need Compute/Delete all General IaaS, PaaS, and SaaS Instance", () => {
    cy.deleteALLInstanceOrRequirement(
      "General IaaS, PaaS, and SaaS",
      "requirements"
    );
  });
});
