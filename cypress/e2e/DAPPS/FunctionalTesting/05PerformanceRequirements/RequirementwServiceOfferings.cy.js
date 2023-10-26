import { randomAlphaNumeric, randomString } from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import performanceReqs from "../../../../selectors/performanceReqs.sel";
import serviceOfferingGroups from "../../../../fixtures/serviceOfferingGroups.json";

describe("Test suite: Requirement Categories with Serive Offering Groups", () => {
  const pt = "TC-Step-5-Anticipated User and Data-" + randomAlphaNumeric(5);
  const scope = "Anticipated User and Data" + randomString(5);
  const selectedClassifications = [
    "level2",
    "level4",
    "level5",
    "level6",
    "tops",
  ];

  before(() => {
    cy.requiredContractDetailsforPR(pt, scope);
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
  });

  it("TC1: Verify Performance Requirements - XaaS Requirements", () => {
    cy.verifyPageHeader(
      serviceOfferingGroups.XaasRequirementsPage.performancepageHeader
    );
    cy.findElement(performanceReqs.startXaaSBtn).contains("Start");
    cy.findElement(performanceReqs.startXaaSBtn).click();
    cy.verifyPageHeader(
      serviceOfferingGroups.XaasRequirementsPage.XaaspageHeader1
    );
    cy.verifyTextMatches(
      performanceReqs.introPText,
      serviceOfferingGroups.XaasRequirementsPage.XaaspageText2
    );
    cy.verifyTextMatches(
      performanceReqs.xaasLabelText,
      serviceOfferingGroups.XaasRequirementsPage.XaasPageQuestion
    );
    cy.verifyCheckBoxLabels(
      performanceReqs.xaasResources,
      serviceOfferingGroups.XaasRequirementsPage.XaasResources
    );
  });

  it("TC2: Verify Developer Tools", () => {
    cy.findElement(performanceReqs.devtoolsCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.anticipatedUsersPage();

    cy.log(" What type of Developer Tools and Services do you need? ")
    cy.clickContinueButton(
      performanceReqs.pageTextanticipatedUsers,
      serviceOfferingGroups.DeveloperToolsPage.pageHeader1
    );

    cy.verifyTextMatches(
      performanceReqs.pageTextApplication,
      serviceOfferingGroups.commonTextPage.selectAllText
    );
    cy.verifyCheckBoxLabels(
      performanceReqs.pagecheckboxes,
      serviceOfferingGroups.DeveloperToolsPage.developerToolTypes
    );
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    cy.findElement(performanceReqs.devToolDevSecOpsCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    cy.verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.devToolDevSecOpsCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    cy.gatherRequirementsPage(
      performanceReqs.checkBoxIL2,
      "Unclassified/IL2",
      "testDeveloperTools",
      "Yes"
    );
  });

  it("TC3: Verify Applications", () => {
    cy.findElement(performanceReqs.appLink).click({
      force: true,
    });
    cy.verifyPageHeader(serviceOfferingGroups.ApplicationsPage.pageHeader1);

    cy.verifyTextMatches(
      performanceReqs.pageTextApplication,
      serviceOfferingGroups.commonTextPage.selectAllText
    );
    cy.verifyCheckBoxLabels(
      performanceReqs.pagecheckboxes,
      serviceOfferingGroups.ApplicationsPage.applicationTypes
    );

    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    cy.findElement(performanceReqs.applicationCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    cy.verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.applicationCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );

    cy.gatherRequirementsPage(
      performanceReqs.checkBoxIL4,
      "Unclassified/IL4",
      "testApplications",
      "No"
    );
  });
  it.skip("TC4: Verify Error Message Validations", () => {
    cy.findElement(performanceReqs.netLink).click({
      force: true,
    });
    cy.radioBtn("#developerToggleButton", "").click({
      force: true,
    });
    cy.checkErrorMessage(
      performanceReqs.baseCheck1Error,
      serviceOfferingGroups.GatherRequirementsPage.errorMessage
    );
    cy.findElement(performanceReqs.networkHybridCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.clickContinueButton(
      performanceReqs.networkHybridCheckBox,
      serviceOfferingGroups.XaasRequirementsPage.XaasSummary
    );
    cy.findElement(performanceReqs.mlLink).click({
      force: true,
    });
    cy.checkErrorMessage(
      performanceReqs.baseCheck1Error,
      serviceOfferingGroups.GatherRequirementsPage.errorMessage
    );
    cy.findElement(performanceReqs.machineSpecializedCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.clickContinueButton(
      performanceReqs.machineSpecializedCheckBox,
      serviceOfferingGroups.XaasRequirementsPage.XaasSummary
    );
  });

  it("TC5: Verify Networking", () => {
    cy.findElement(performanceReqs.netLink).click({
      force: true,
    });
    cy.verifyPageHeader(serviceOfferingGroups.NetworkingPage.pageHeader1);

    cy.verifyTextMatches(
      performanceReqs.pageTextApplication,
      serviceOfferingGroups.commonTextPage.selectAllText
    );

    cy.verifyCheckBoxLabels(
      performanceReqs.pagecheckboxes,
      serviceOfferingGroups.NetworkingPage.networkTypes
    );
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    cy.findElement(performanceReqs.networkHybridCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    cy.verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.networkHybridCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    cy.gatherRequirementsPage(
      performanceReqs.checkBoxIL5,
      "Unclassified/IL5",
      "testNetworking",
      "Yes"
    );
  });
  it("TC6: Verify Machine Learning", () => {
    cy.findElement(performanceReqs.mlLink).click({
      force: true,
    });
    cy.verifyPageHeader(serviceOfferingGroups.MachineLearningPage.pageHeader1);

    cy.verifyTextMatches(
      performanceReqs.pageTextApplication,
      serviceOfferingGroups.commonTextPage.selectAllText
    );

    cy.verifyCheckBoxLabels(
      performanceReqs.pagecheckboxes,
      serviceOfferingGroups.MachineLearningPage.MachineLabels
    );

    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    cy.findElement(performanceReqs.machineSpecializedCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    cy.verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.machineSpecializedCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    cy.gatherRequirementsPage(
      performanceReqs.checkBoxIL5,
      "Unclassified/IL5",
      "testMachineLearning",
      "Yes"
    );
  });

  it("TC7: Verify Internet of Things (IOT)", () => {
    cy.findElement(performanceReqs.showMoreLink).click({
      force: true,
    });

    cy.findElement(performanceReqs.iotLink).click({
      force: true,
    });
    cy.verifyPageHeader(serviceOfferingGroups.internetThingsPage.pageHeader1);

    cy.verifyTextMatches(
      performanceReqs.pageTextApplication,
      serviceOfferingGroups.commonTextPage.selectAllText
    );

    cy.verifyCheckBoxLabels(
      performanceReqs.pagecheckboxes,
      serviceOfferingGroups.internetThingsPage.IOTLabels
    );
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    cy.findElement(performanceReqs.internetIOTEdgeCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    cy.verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.internetIOTEdgeCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    cy.gatherRequirementsPage(
      performanceReqs.checkBoxIL6,
      "Secret/IL6",
      "testIOT",
      "Yes"
    );
  });

  it("TC8: Verify Security", () => {
    cy.findElement(performanceReqs.secLink).click({
      force: true,
    });
    cy.verifyPageHeader(serviceOfferingGroups.securityPage.pageHeader1);

    cy.verifyTextMatches(
      performanceReqs.pageTextApplication,
      serviceOfferingGroups.commonTextPage.selectAllText
    );

    cy.verifyCheckBoxLabels(
      performanceReqs.pagecheckboxes,
      serviceOfferingGroups.securityPage.securityLabels
    );

    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    cy.findElement(performanceReqs.managedCSPSecurityCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    cy.verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.managedCSPSecurityCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    cy.gatherRequirementsPage(
      performanceReqs.checkBoxTS,
      "Top Secret",
      "testSecurity",
      "Yes"
    );
  });
});
