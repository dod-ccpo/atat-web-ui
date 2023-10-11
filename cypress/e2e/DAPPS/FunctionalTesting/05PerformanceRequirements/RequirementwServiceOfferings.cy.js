import { randomAlphaNumeric, randomString } from "../../../../helpers";
import common from "../../../../selectors/common.sel";
import contractDetails from "../../../../selectors/contractDetails.sel";
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
    cy.clickContinueButton(
      contractDetails.addOptionLink,
      "Do you want to request a PoP start date?"
    );
    cy.selectClassificationLevel(selectedClassifications);
    cy.findElement(common.stepPerformanceReqText).click();
  });

  function verifypageheaderwithClickContinue(label, selector, text) {
    let pageHeader = "";
    cy.getCheckBoxLabels(label).then((foundLabels) => {
      pageHeader = text + foundLabels;
    });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(selector);
    cy.verifyPageHeader(pageHeader);
  }

  function gatherRequirementsPage(
    UnclassifiedOption,
    heading,
    anticipatedtext,
    radioOption
  ) {
    cy.verifyTextMatches(
      performanceReqs.pageTextClassification,
      serviceOfferingGroups.GatherRequirementsPage.pageText1
    );
    cy.findElement(UnclassifiedOption)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.verifyTextMatches(
      performanceReqs.aboutButton,
      serviceOfferingGroups.GatherRequirementsPage.pageText2
    );
    cy.verifyTextMatches(
      performanceReqs.requirementsHeading,
      "1. Tell us about the " + heading + " instance"
      // serviceOfferingGroups.GatherRequirementsPage.sectionTitle
    );
    cy.verifyTextMatches(
      performanceReqs.statement,
      serviceOfferingGroups.GatherRequirementsPage.sectionSubTitle
    );
    cy.verifyTextMatches(
      performanceReqs.functionalDescText,
      serviceOfferingGroups.GatherRequirementsPage.descriptionText
    );
    cy.findElement(performanceReqs.anticipatedTextArea).type(anticipatedtext);
    cy.verifyTextMatches(
      performanceReqs.durationQuestion,
      serviceOfferingGroups.GatherRequirementsPage.durationQuestion
    );
    if (radioOption == "Yes") {
      cy.radioBtn(performanceReqs.durationYesRadioBtn, "YES")
        .not("[disabled]")
        .click({
          force: true,
        });
    } else if (radioOption == "No") {
      cy.radioBtn(performanceReqs.durationNoRadioBtn, "NO")
        .not("[disabled]")
        .click({
          force: true,
        });
      cy.verifyTextMatches(
        performanceReqs.basePeriodCheckbox,
        serviceOfferingGroups.GatherRequirementsPage.basePeriodText
      );
    }
    //Page#3: Your Xaas Summary
    cy.clickContinueButton(
      performanceReqs.durationNoRadioBtn,
      serviceOfferingGroups.XaasRequirementsPage.XaasSummary
    );
  }

  // Test case: Functional test for Xaas Requirements
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

  // Test case: Functional test for Developer Tools
  it("TC2: Verify Developer Tools", () => {
    cy.findElement(performanceReqs.devtoolsCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");
    //Page#1: First, tell us about your anticipated users and data needs
    // this page will display for the first selection- call function need to be added
    cy.clickContinueButton(
      performanceReqs.appCheckBox,
      serviceOfferingGroups.anticipatedUsersPage.pageHeader
    );
    // skipping anticipated page and moving to DeveloperTools and Services
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
    //select and unselect all checkboxes
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    //check devSecOps checkbox
    cy.findElement(performanceReqs.devToolDevSecOpsCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    //Page#2: Now we’ll gather your requirements for DevSecOps
    verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.devToolDevSecOpsCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    gatherRequirementsPage(
      performanceReqs.checkBoxIL2,
      "Unclassified/IL2",
      "testDataIL2",
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

    //select and unselect all checkboxes
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    //check Application checkbox
    cy.findElement(performanceReqs.applicationCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.applicationCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );

    gatherRequirementsPage(
      performanceReqs.checkBoxIL4,
      "Unclassified/IL4",
      "testDataIL4",
      "No"
    );
  });
  it.skip("TC4: Verify Error Message Validations", () => {
    // verify Error messages for Networking
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
    // verify Error messages for MachineLearning
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

    //select and unselect all checkboxes
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    //check Hybrid checkbox
    cy.findElement(performanceReqs.networkHybridCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.networkHybridCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    gatherRequirementsPage(
      performanceReqs.checkBoxIL5,
      "Unclassified/IL5",
      "testDataIL5",
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

    //select and unselect all checkboxes
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    //select Machine Learning- Spacialized Application checkbox
    cy.findElement(performanceReqs.machineSpecializedCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.machineSpecializedCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    gatherRequirementsPage(
      performanceReqs.checkBoxIL5,
      "Unclassified/IL5",
      "testDataIL5",
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

    //select and unselect all checkboxes
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    //select IOT Edge check box
    cy.findElement(performanceReqs.internetIOTEdgeCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.internetIOTEdgeCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    gatherRequirementsPage(
      performanceReqs.checkBoxIL6,
      "Secret/IL6",
      "testDataIL5",
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

    //select and unselect all checkboxes
    cy.findElement(performanceReqs.pagecheckboxes)
      .check({
        force: true,
      })
      .should("be.checked");
    cy.deselectAllCheckboxes();

    //select Managed CSP Cloud Security Solutions
    cy.findElement(performanceReqs.managedCSPSecurityCheckBox)
      .check({
        force: true,
      })
      .should("be.checked");

    verifypageheaderwithClickContinue(
      performanceReqs.checkedCheckboxes,
      performanceReqs.managedCSPSecurityCheckBox,
      serviceOfferingGroups.commonTextPage.gatherRqmtsHeader
    );
    gatherRequirementsPage(
      performanceReqs.checkBoxTS,
      "Top Secret",
      "testDataIL5",
      "Yes"
    );
  });

});
