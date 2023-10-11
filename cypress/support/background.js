import background from "../selectors/background.sel";
import common from "../selectors/common.sel";
import bgCEData from "../fixtures/bgCEData.json";

Cypress.Commands.add("clickOnCurrentEnvironmentStep", (pt, scope) => {
  cy.goToAcqPackageStepOne(pt, scope);
  cy.clickSideStepper(common.stepBackgroundLink, " Background ");
  cy.activeStep(common.stepBackgroundText);
  cy.clickSideStepper(
    common.substepCurrentEnvironmentLink,
    " Current Environment "
  );
  cy.activeStep(common.substepCurrentEnvironmentText);
});
Cypress.Commands.add(
  "environmentsystemDiagramsMigrationOptions",
  (option, selector) => {
    if (option === "Yes") {
      cy.radioBtn(selector, "YES").not("[disabled]").and("not.checked").click({
        force: true,
      });
    } else if (option === "No") {
      cy.radioBtn(selector, "NO").not("[disabled]").and("not.checked").click({
        force: true,
      });
    }
  }
);

Cypress.Commands.add("systemDiagramsUploadDoc", (uploadDoc) => {
  cy.findElement(background.uploadFileSysDiagram).selectFile(uploadDoc, {
    force: true,
  });
  cy.waitUntil(function () {
    return cy.findElement(background.removeFile1).should("exist");
  });
});

Cypress.Commands.add("environmentType", (environment) => {
  if (environment == "Cloud") {
    cy.radioBtn(background.cloudComputingRadio, "CLOUD").click({
      force: true,
    });
  } else if (environment == "onPremise") {
    cy.radioBtn(background.onPremiseRadio, "ON_PREM").click({
      force: true,
    });
  } else if (environment == "Hybrid") {
    cy.radioBtn(background.hybridRadio, "HYBRID").click({
      force: true,
    });
  }
});

Cypress.Commands.add("dataClassificationLevels", () => {
  cy.findElement(background.unClassCloudCheckboxes)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
});

Cypress.Commands.add("UnclassificationLevels", () => {
  cy.findElement(background.CloudClassificationCheckboxes)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
});

Cypress.Commands.add("cloudandOnpremiseInstances", () => {
  //Cloud Instances
  cy.findElement(background.unClassCloudCheckbox)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
  cy.findElement(background.scCloudCheckbox)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
  cy.findElement(background.tsCloudCheckbox)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
  cy.verifyCheckBoxLabels(
    background.CloudClassificationCheckboxes,
    bgCEData.CEPage5.expectedLabelsUnCL
  );
  cy.findElement(background.CloudClassificationCheckboxes)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");

  //Onpremise Instances
  cy.findElement(background.unClassPremCheckbox)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
  cy.findElement(background.scPremCheckbox)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
  cy.findElement(background.tsPremCheckbox)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
  cy.verifyCheckBoxLabels(
    background.onPremiseClassificationCheckboxes,
    bgCEData.CEPage5.expectedLabelsOnPrem
  );
  cy.findElement(background.onPremiseClassificationCheckboxes)
    .should("not.be.checked")
    .check({
      force: true,
    })
    .should("be.checked");
});

Cypress.Commands.add("section3InstanceConfigurations", (config) => {
  const {
    licensing,
    noOfVCPU,
    processorSpeed,
    operatingSystem,
    memoryByte,
    storageOptions,
    storage,
    performanceTierOption,
    instances,
    egressMonth,
  } = config;
  const storageTypeOptionsMap = {
    Block: background.blockStorageOption,
    Object: background.objectTypeStorageOption,
    File: background.fileStorageOption,
    Archive: background.archiveStorageOption,
  };

  const performanceTierOptionsMap = {
    generalPurpose: background.generalPurposeRadiobox,
    computeOptimized: background.computeOptimRadiobox,
    memoryOptimized: background.memoryOptimizedRadiobox,
    storageOptimized: background.storageOptimRadiobox,
  };
  cy.findElement(background.licenseTextbox).type(licensing);
  cy.findElement(background.numofVCPTextbox).type(noOfVCPU);
  cy.findElement(background.licenseTextboxLable).scrollIntoView();
  cy.findElement(background.processorSpeedTextbox).type(processorSpeed);
  cy.findElement(background.licenseTextboxLable).scrollIntoView();
  cy.findElement(background.operatingSysTextbox).type(operatingSystem);
  cy.findElement(background.memoryTextbox).type(memoryByte);
  cy.findElement(background.storageTypeDropdown).click();
  cy.waitUntil(function () {
    return cy.findElement(background.blockStorageOption).should("exist");
  });
  cy.findElement(storageTypeOptionsMap[storageOptions]).click({
    force: true,
  });
  cy.findElement(background.storageSizeLable).scrollIntoView();
  cy.textExists(
    background.storageSizeLable,
    bgCEData.CEPage6.storageSizeTextLable
  );
  cy.findElement(background.storageAmountTextbox).type(storage);
  cy.findElement(performanceTierOptionsMap[performanceTierOption]).click({
    force: true,
  });
  cy.findElement(background.instancesTextbox).clear().type(instances);
  cy.findElement(background.dataegressTextbox).type(egressMonth);
});

Cypress.Commands.add(
  "section2CurrentUsageandUsers",
  (eventCause, periodCause, users) => {
    cy.verifyRadioGroupLabels(
      background.currentUsageRadioGroup,
      bgCEData.CEPage6.section2Radioboxes
    );
    cy.radioBtn(background.regularUsageRadiobox, "EVEN_USAGE").click({
      force: true,
    });
    cy.radioBtn(background.irrregularUsageRadiobox, "IRREGULAR_USAGE").click({
      force: true,
    });
    cy.verifyCheckBoxLabels(
      background.spikesCheckboxes,
      bgCEData.CEPage6.spikesCheckboxes
    );
    cy.findElement(background.spikesCheckboxes)
      .should("not.be.checked")
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.highUsageEventTextbox).type(eventCause);
    cy.findElement(background.highUsagePeriodTextbox).type(periodCause);
    cy.findElement(
      background.regionUsersCheckboxes + background.conusWestCheckbox
    )
      .check({
        force: true,
      })
      .should("be.checked");
    cy.findElement(background.conusWestTextbox).type(users);
  }
);
Cypress.Commands.add("section7verifyTableData", (tableData) => {
  const {
    impactLevelCheckboxesList,
    instances,
    noOfVCPU,
    expctedMemory,
    storageExpected,
    performanceTierOptions,
  } = tableData;
  cy.verifyTableData(
    background.summaryCETableHeader,
    background.summaryCETableData,
    "Classification",
    impactLevelCheckboxesList
  );
  cy.verifyTableData(
    background.summaryCETableHeader,
    background.summaryCETableData,
    "Quantity",
    instances
  );
  cy.verifyTableData(
    background.summaryCETableHeader,
    background.summaryCETableData,
    "vCPU",
    noOfVCPU
  );
  cy.verifyTableData(
    background.summaryCETableHeader,
    background.summaryCETableData,
    "Memory",
    expctedMemory
  );
  cy.verifyTableData(
    background.summaryCETableHeader,
    background.summaryCETableData,
    "Storage",
    storageExpected
  );
  cy.verifyTableData(
    background.summaryCETableHeader,
    background.summaryCETableData,
    "Performance",
    performanceTierOptions
  );
});

Cypress.Commands.add(
  "verifyTableData",
  (tableHeader, tableData, columnHeader, expectedValue) => {
    cy.findElement(tableHeader).each(($el, index) => {
      const text = $el.text();
      if (text.includes(columnHeader)) {
        cy.findElement(tableData)
          .eq(index)
          .then(function (value) {
            const actualValue = value.text().trim();
            if (isNaN(actualValue)) {
              const trimmedActualValue = actualValue
                .toUpperCase()
                .replace(/\s/g, "")
                .replace(/[/()]/g, "");
              expect(trimmedActualValue).to.equal(expectedValue);
            } else {
              expect(Number(actualValue)).to.equal(Number(expectedValue));
            }
          });
      }
    });
  }
);
