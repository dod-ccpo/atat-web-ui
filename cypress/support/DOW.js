import { getCheckboxId, getObjectFromArrayByKey } from "../helpers";
import common from "../selectors/common.sel";
import "cypress-iframe";
import performanceReq from "../selectors/performanceReqs.sel";
import performanceReqs from "../selectors/performanceReqs.sel";
import contractDetails from "../selectors/contractDetails.sel";
import serviceOfferingGroups from "../fixtures/serviceOfferingGroups.json";
Cypress.Commands.add(
  "verifyCategoryAndServiceOfferings",
  (categoryLabels, serviceOfferingGroups, categoryValue) => {
    cy.verifyCheckBoxLabels("input[type=checkbox]", categoryLabels);
    const categoryObj = getObjectFromArrayByKey(
      serviceOfferingGroups,
      "value",
      categoryValue
    );
    if (categoryObj) {
      cy.verifyServiceOfferingHeader(categoryObj);
      if (
        categoryObj.serviceOfferingCypressLabels &&
        categoryObj.serviceOfferingCypressLabels[0] !== "Other"
      ) {
        cy.verifyServiceOfferingsForCategory(categoryObj);
      }
    }
  }
);

Cypress.Commands.add("requiredContractDetailsforPR", (pt, scope) => {
  cy.goToAcqPackageStepOne(pt, scope);
  cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
  cy.verifyPageHeader(
    "Let’s gather details about the duration of your task order"
  );
  cy.findElement(contractDetails.addOptionLink).click();
  cy.findElement(contractDetails.optionalTextBox).should("have.value", "1");
  cy.clickContinueButton(
    contractDetails.addOptionLink,
    "Do you want to request a PoP start date?"
  );
});

//This command is to verify the checkbox label and header for the ServiceOffering Page
Cypress.Commands.add("verifyServiceOfferingHeader", (categoryObj) => {
  const categoryCheckBoxId = getCheckboxId(categoryObj.value);
  cy.selectServiceOfferingGroup([categoryCheckBoxId]);

  cy.verifyPageHeader("What type of " + categoryObj.label + " do you need?");
});

//This command is to verify the OtherCategories HeaderLabel on Summary Page
Cypress.Commands.add("verifyOtherServiceOfferings", (categories) => {
  categories.forEach((cat) => {
    cy.textExists(cat.headingSelector, cat.headingText);
    cy.hoverToolTip(
      cat.tooltipButtonSelector,
      cat.tooltipTextSelector,
      cat.tooltipText
    );
    cy.textExists(cat.linkSelector, " Add requirements ");
  });
});

//This command is to verify the checkbox label and header for the Compute Category
Cypress.Commands.add("verifyComputeHeader", (categoryObj) => {
  const categoryCheckBoxId = getCheckboxId(categoryObj.value);
  cy.selectServiceOfferingGroup([categoryCheckBoxId]);

  cy.verifyPageHeader(
    "Let’s start by gathering your " + categoryObj.label + " requirements"
  );
});

//This command is to verify the Region labels
Cypress.Commands.add("verifyRegionCheckBoxesLabels", (categoryObj) => {
  cy.textExists(
    performanceReq.regionCheckboxLabel,
    "What region(s) do you need this instance deployed in?"
  );
  const regionCheckBoxesLabels = [];
  categoryObj.regionCypressLabels.forEach((label) => {
    regionCheckBoxesLabels.push(label);
  });
  const region =
    "This is the geographic location where your public cloud resources are located," +
    " e.g., within the continental U.S. (CONUS) or outside of the continental U.S. (OCONUS)." +
    " If you need a certain location, select Other and enter your specifications.";
  cy.hoverToolTip(
    performanceReq.regionTooltipBtn,
    performanceReq.regionTooltipText,
    region
  );

  cy.verifyCheckBoxLabels(performanceReq.regionGroup, regionCheckBoxesLabels);
});

//This command is to verify the Performance tier radio group labels
Cypress.Commands.add("verifyPerformanceTierRadioLabels", (categoryObj) => {
  cy.findElement(performanceReq.performanceTierLabel).scrollIntoView();
  cy.textExists(performanceReq.performanceTierLabel, " Performance tier ");
  const tooltipText =
    "This refers to your network speed and service availability." +
    " If you have size and performance details, select Other and enter your specifications.";
  cy.hoverToolTip(
    performanceReq.performanceTierTooltipBtn,
    performanceReq.performanceTierTootipText,
    tooltipText
  );
  const performanceTierRadioLabels = [];
  categoryObj.performanceTierCypressLabels.forEach((label) => {
    performanceTierRadioLabels.push(label);
  });

  cy.verifyRadioGroupLabels(
    performanceReq.performanceRadioGroup,
    performanceTierRadioLabels
  );
});

//This command is to verify the list of storageType dropdown
Cypress.Commands.add("verifyStorageTypeListItems", (categoryObj) => {
  cy.findElement(performanceReq.storageTypeLabel).scrollIntoView();
  cy.textExists(performanceReq.storageTypeLabel, " Storage type ");
  cy.dropDownClick(performanceReq.storageTypeDropdown);
  const storageTypeListItems = [];
  categoryObj.storageTypeCypressLabels.forEach((list) => {
    storageTypeListItems.push(list);
  });
  cy.verifyStringArray(
    performanceReq.storageTypeDropdownList,
    storageTypeListItems
  );
});

//This command is to verify the checkbox label and header for the Compute Category
Cypress.Commands.add("verifyGeneralXaaSHeader", (categoryObj) => {
  const categoryCheckBoxId = getCheckboxId(categoryObj.value);
  cy.selectServiceOfferingGroup([categoryCheckBoxId]);

  cy.verifyPageHeader(
    "Let’s gather your requirements for general IaaS, PaaS and SaaS"
  );
});

//select generalXaaS option
Cypress.Commands.add(
  "selectGeneralXaaSOption",
  (categoryObj, serviceOfferingGroups) => {
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Let’s work on your performance requirements ");
    const categoryLabels = [];
    serviceOfferingGroups.forEach((obj) => {
      categoryLabels.push(obj.label);
    });
    cy.verifyCheckBoxLabels("input[type=checkbox]", categoryLabels);
    cy.verifyGeneralXaaSHeader(categoryObj);
  }
);

Cypress.Commands.add("anticipatedNeedUsage", (textSel, textVal, radioSel) => {
  cy.enterTextInTextField(textSel, textVal);
  cy.findElement(radioSel).click({
    force: true,
  });
});

Cypress.Commands.add(
  "verifyTableValues",
  (tableSel, expectedTableData, stopCellIndex) => {
    stopCellIndex = stopCellIndex ?? 1000;
    cy.findElement(tableSel).as("table");
    cy.findElement("@table")
      .find("tbody")
      .find("tr")
      .each(($row, rowIndex) => {
        cy.wrap($row)
          .find("td")
          .each(($cell, cellIndex) => {
            cy.wrap($cell)
              .invoke("text")
              .then((text) => {
                if (cellIndex < stopCellIndex) {
                  const expectedValue = expectedTableData[rowIndex][cellIndex];

                  const trimmedText = text.trim().replace(/\s+/g, " ");
                  cy.log("Expected Value:", expectedValue);
                  cy.log("Trimmed Text:", trimmedText);
                  cy.log("expected:", expectedValue);
                  expect(trimmedText).to.equal(expectedValue);
                }
              });
          });
      });
  }
);

Cypress.Commands.add(
  "clickAndWaitForVisible",
  (elementSelector, targetSelector) => {
    cy.get(elementSelector)
      .should("be.visible")
      .click()
      .then(() => {
        cy.waitUntil(() => cy.findElement(targetSelector).should("be.visible"));
      });
  }
);

Cypress.Commands.add(
  "clickAndWaitForElementExists",
  (elementSelector, targetSelector) => {
    cy.get(elementSelector)
      .should("be.visible")
      .click()
      .then(() => {
        cy.waitUntil(() => cy.findElement(targetSelector).should("exist"));
      });
  }
);

Cypress.Commands.add("otherAvailableCategory", (categoryText) => {
  cy.findElement("#OtherAvlGroups .h3")
    .each(($el) => {
      const text = $el.text();
      cy.log(text);
    })
    .should("contain", categoryText);
});

//Tell us about your anticipated users and data needs
Cypress.Commands.add(
  "anticipatedUserDataNeedAccordion",
  (selectedClassifications) => {
    let expectedAccordionCount = 0;

    cy.log("selectedClassifications:", selectedClassifications);

    if (selectedClassifications.includes("level2")) {
      expectedAccordionCount++;
    }
    if (selectedClassifications.includes("level4")) {
      expectedAccordionCount++;
    }
    if (selectedClassifications.includes("level5")) {
      expectedAccordionCount++;
    }
    if (selectedClassifications.includes("secret")) {
      expectedAccordionCount++;
    }
    if (selectedClassifications.includes("ts")) {
      expectedAccordionCount++;
    }

    cy.findElement(".mb-4.v-expansion-panels").then(($element) => {
      const actualAccordionCount = $element.length;
      cy.log("actualAccordionCount:", actualAccordionCount);
      expect(actualAccordionCount).equal(expectedAccordionCount);
    });
  }
);

Cypress.Commands.add(
  "setDurationUserData",
  (anticipatedDurationVal, accordionIndex, userData, estimateGrowth, val) => {
    if (anticipatedDurationVal === "Yes") {
      cy.findElement(
        `#Radio_Accordion${accordionIndex}Question${userData}YES`
      ).scrollIntoView();
      cy.findElement(
        `#Radio_Accordion${accordionIndex}Question${userData}YES`
      ).click({ force: true });
      if (estimateGrowth === "singleGrowth") {
        cy.findElement(
          `#Radio_Accordion${accordionIndex}Question${userData}Single`
        ).click({ force: true });
        cy.findElement(
          `#SingleAmount_${userData}_${accordionIndex}_text_field`
        ).should("exist");
        cy.findElement(
          `#SingleAmount_${userData}_${accordionIndex}_text_field`
        ).type(val);
      } else if (estimateGrowth === "customGrowth") {
        cy.findElement(
          `#Radio_Accordion${accordionIndex}Question${userData}Multiple`
        ).scrollIntoView();
        cy.findElement(
          `#Radio_Accordion${accordionIndex}Question${userData}Multiple`
        ).click({ force: true });
        cy.findElement(
          `#BASE_0_${userData}_${accordionIndex}_text_field`
        ).scrollIntoView();
        cy.findElement(
          `#BASE_0_${userData}_${accordionIndex}_text_field`
        ).should("exist");
        cy.findElement(`#BASE_0_${userData}_${accordionIndex}_text_field`).type(
          val
        );
      }
    } else {
      cy.findElement(
        `#Radio_Accordion${accordionIndex}Question${userData}NO`
      ).click({
        force: true,
      });
    }
  }
);

Cypress.Commands.add(
  "dataTransfer",
  (accordionIndex, dataTransferVal, selectedDropdownValue) => {
    const dropdownOptions = ["GB", "TB", "PB"];
    const dropdownSelector = `#DataTransfer_${accordionIndex}_dropdown`;

    cy.findElement(`#DataTransfer_${accordionIndex}_text_field`).type(
      dataTransferVal
    );
    cy.findElement(dropdownSelector).click();

    if (dropdownOptions.includes(selectedDropdownValue)) {
      const ddItemSel = `#DataTransfer_${accordionIndex}_DropdownListItem_${selectedDropdownValue}`;
      cy.findElement(ddItemSel).click();
    }
  }
);

//Current Functions
Cypress.Commands.add("selectCurrentFunction", (currentFunction) => {
  cy.log("Option selected:", currentFunction);
  let pageHeader = "";

  if (currentFunction === "Replicate") {
    cy.findElement(performanceReq.replicateRadioOption).click({ force: true });
    pageHeader =
      "Tell us more about your requirements to replicate your environment";
  } else if (currentFunction === "Optimize") {
    cy.findElement(performanceReq.optimiseRadioOption).click({ force: true });
    pageHeader =
      "Tell us more about your requirements to optimize your environment";
  } else {
    cy.findElement(performanceReq.replicateOptimiseNoOption).click({
      force: true,
    });
    pageHeader = "Your Performance Requirements Summary";
  }

  cy.clickContinueButton(performanceReq.replicateRadioOption, pageHeader);
});

Cypress.Commands.add(
  "selectAdditionalGrowth",
  (additionalGrowth, percentVal) => {
    if (additionalGrowth === "Yes") {
      cy.radioBtn(performanceReq.additionalGrowthYesOption, "YES").click({
        force: true,
      });
      cy.findElement(performanceReq.capacityPerTextField).type(percentVal);
    } else {
      cy.radioBtn(performanceReq.additionalGrowthNoOption, "NO").click({
        force: true,
      });
    }
  }
);

Cypress.Commands.add("selectPhasedOption", (phasedOption, scheduleVal) => {
  if (phasedOption === "Yes") {
    cy.radioBtn(performanceReq.phasedYesRadioOption, "YES").click({
      force: true,
    });
    cy.enterTextInTextField(performanceReq.phaseApproachTextfield, scheduleVal);
  } else {
    cy.radioBtn(performanceReq.phasedNoRadioOption, "NO").click({
      force: true,
    });
  }
});

Cypress.Commands.add("currentFunctionCardDesc", (currentFunction) => {
  let cfButton = "";
  let descriptionText = "";

  if (currentFunction=== "Replicate") {
    descriptionText = "Replicate (lift and shift) using JWCC offerings";
    cfButton = "View/Edit";
  } else if (currentFunction === "Optimize") {
    descriptionText = "Optimize (improve/modernize) using JWCC offerings";
    cfButton = "View/Edit";
  } else if (currentFunction === "No") {
    descriptionText = "No requirements";
    cfButton = "View/Edit";
  } else {
    cfButton = "Start";
  }
  const cfCardDetails = [
    `Your Current Functions ${descriptionText} ${cfButton}`,
  ];
  cy.verifyTextArray(performanceReq.currentFunctionCard, cfCardDetails);
});

Cypress.Commands.add(
  "completeCurrentFunctionForm",
  (
    currentFunction,
    statementVal,
    additionalGrowth,
    percentVal,
    phasedOption,
    scheduleVal
  ) => {
    cy.enterTextInTextField(performanceReq.objectiveTextfield, statementVal);
    cy.selectAdditionalGrowth(additionalGrowth, percentVal);
    cy.selectPhasedOption(phasedOption, scheduleVal);
    cy.clickContinueButton(
      performanceReq.phasedYesRadioOption,
      "Your Performance Requirements Summary"
    );
    cy.currentFunctionCardDesc(currentFunction);
  }
);


//Architectural Design solutions
Cypress.Commands.add("selectArchDesignOption", (archDesignOption) => {
  console.log("ArchDesignOption selected:", archDesignOption);

  let pageHeader = "";
  if (archDesignOption === "Yes") {
    cy.findElement(performanceReq.archYesRadioBtn).click({ force: true });
    pageHeader = "Tell us more about your architectural design requirements";
  } else {
    cy.findElement(performanceReq.archNoRadioBtn).click({ force: true });
    pageHeader = "Your Performance Requirements Summary";
  }
  cy.clickContinueButton(performanceReq.archYesRadioBtn, pageHeader);
});

Cypress.Commands.add(
  "fillInArchDesignSolForm",
  (objecText, externalFactor, archClassLevelDesc) => {
    cy.enterTextInTextField(performanceReq.objectiveTextfield, objecText);
    cy.findElement(performanceReq.archClassCheckboxes)
    cy.enterTextInTextField(
      performanceReq.externalFactorTextField,
      externalFactor
    );
    cy.clickContinueButton(
      performanceReq.externalFactorTextField,
      "Your Performance Requirements Summary"
    );
    cy.checkElementsTextAgainstArray(
      performanceReq.archDesignDesc,
      archClassLevelDesc
    );
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add("anticipatedUsersPage", () => {
  cy.log("First, tell us about your anticipated users and data needs");
  cy.clickContinueButton(
    performanceReqs.appCheckBox,
    serviceOfferingGroups.anticipatedUsersPage.pageHeader
  );
  cy.log("skipping anticipated page and moving to DeveloperTools and Services");
});

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "verifypageheaderwithClickContinue",
  (label, selector, text) => {
    let pageHeader = "";
    cy.getCheckBoxLabels(label).then((foundLabels) => {
      pageHeader = text + foundLabels;
    });
    cy.btnClick(common.continueBtn, " Continue ");
    cy.waitUntilElementIsGone(selector);
    cy.verifyPageHeader(pageHeader);
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "gatherRequirementsPage",
  (UnclassifiedOption, heading, anticipatedtext, radioOption) => {
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
      performanceReqs.contentAboutClass,
      serviceOfferingGroups.GatherRequirementsPage.pageText2
    );
    cy.verifyTextMatches(
      performanceReqs.requirementsHeading,
      "1. Tell us about the " + heading + " instance"
    );
    cy.verifyTextMatches(
      performanceReqs.anticipatedTextlabel1,
      serviceOfferingGroups.GatherRequirementsPage.sectionSubTitle
    );
    cy.verifyTextMatches(
      performanceReqs.functionalDescText,
      serviceOfferingGroups.GatherRequirementsPage.descriptionText
    );
    cy.findElement(performanceReqs.anticipatedTextBox1).type(anticipatedtext);
    cy.verifyTextMatches(
      performanceReqs.entireDurationRadioLabel1,
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
      cy.findElement(performanceReqs.baseCheckbox).should("be.checked");
      cy.findElement(performanceReqs.optionOneCheckbox).should(
        "not.be.checked"
      );
    }
    cy.clickContinueButton(
      performanceReqs.durationNoRadioBtn,
      serviceOfferingGroups.XaasRequirementsPage.XaasSummary
    );
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "instanceDatabaseConfigurationsScreenCheck",
  (configType) => {
    // VCPUs, ProcessorSpeed, OperatingSystem, Memory,
    //StorageType, StorageSize, noofInstances

    cy.verifyTextMatches(
      performanceReqs.instanceConfigTitle,
      "2. " + configType + " Configurations"
    );
    cy.log("numOfVCPUs Textbox:.............");
    cy.findElement(performanceReqs.operatingLicenseQuestion).scrollIntoView();
    cy.textExists(
      performanceReqs.noOfvCPULabel,
      serviceOfferingGroups.ComputePage.vCPsTextboxLable
    );
    cy.hoverToolTip(
      performanceReqs.noOfvCPUTooltipBtn,
      performanceReqs.noOfvCPUTooltipText,
      serviceOfferingGroups.ComputePage.vCPsToolTipText
    );
    cy.findElement(performanceReqs.operatingLicenseQuestion).scrollIntoView();

    cy.log("ProcessorSpeed Textbox:...........");
    cy.textExists(
      performanceReqs.procsrSpeedLabel,
      serviceOfferingGroups.ComputePage.processorTextboxLable
    );
    cy.hoverToolTip(
      performanceReqs.procsrSpeedTooltipBtn,
      performanceReqs.procsrSpeedTooltipText,
      serviceOfferingGroups.ComputePage.processerToolTipText
    );
    cy.findElement(performanceReqs.operatingLicenseQuestion).scrollIntoView();

    cy.log("Operating System Textbox:...........");
    cy.textExists(
      performanceReqs.operatingSysLabel,
      serviceOfferingGroups.ComputePage.operatingSysTextboxLable
    );
    cy.hoverToolTip(
      performanceReqs.operatingSysTooltipBtn,
      performanceReqs.operatingSysTooltipText,
      serviceOfferingGroups.ComputePage.operatingSysToolTipLabel
    );

    cy.log("Memory Textbox:................");
    cy.textExists(
      performanceReqs.memoryLabel,
      serviceOfferingGroups.ComputePage.memoryTextboxLable
    );
    cy.hoverToolTip(
      performanceReqs.memoryTooltipBtn,
      performanceReqs.memoryTooltipTxt,
      serviceOfferingGroups.ComputePage.memoryToolTipLabel
    );

    cy.log("storage type dropdown..............");
    cy.textExists(
      performanceReqs.storageTypeLabel,
      serviceOfferingGroups.ComputePage.storageTypeTextboxLable
    );
    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.waitUntil(function () {
      return cy.findElement(performanceReqs.optionBlockStorage).should("exist");
    });
    cy.findElement(performanceReqs.optionBlockStorage).should(
      "contain.text",
      " Block storage "
    );
    cy.findElement(
      performanceReqs.optionBlockStorage + performanceReqs.storageSubtitle
    ).should(
      "contain.text",
      serviceOfferingGroups.ComputePage.blockStorageText
    );

    cy.findElement(performanceReqs.optionObjectTypeStorage).should(
      "contain.text",
      " Object storage "
    );
    cy.findElement(
      performanceReqs.optionObjectTypeStorage + performanceReqs.storageSubtitle
    ).should(
      "contain.text",
      serviceOfferingGroups.ComputePage.objectStorageText
    );

    cy.findElement(performanceReqs.optionFileStorage).should(
      "contain.text",
      " File storage "
    );
    cy.findElement(
      performanceReqs.optionFileStorage + performanceReqs.storageSubtitle
    ).should("contain.text", serviceOfferingGroups.ComputePage.fileStorageText);

    cy.findElement(performanceReqs.optionArchiveStorage).should(
      "contain.text",
      " Archive storage "
    );
    cy.findElement(
      performanceReqs.optionArchiveStorage + performanceReqs.storageSubtitle
    ).should(
      "contain.text",
      serviceOfferingGroups.ComputePage.archiveStorageText
    );

    cy.log("Storage Size:................");
    cy.findElement(performanceReqs.storageAmountLabel).scrollIntoView();
    cy.textExists(
      performanceReqs.storageAmountLabel,
      serviceOfferingGroups.ComputePage.storageSizeTextLable
    );
    cy.findElement(
      performanceReqs.storageSizeField + performanceReqs.byteSizeDropdown
    ).click(); //dropdownGB
    cy.waitUntil(function () {
      return cy
        .findElement(
          performanceReqs.storageSizeField + performanceReqs.gigabyteOption
        )
        .should("exist");
    });
    cy.findElement(
      performanceReqs.storageSizeField + performanceReqs.gigabyteOption
    ).should("contain.text", " Gigabyte (GB) ");
    cy.findElement(
      performanceReqs.storageSizeField + performanceReqs.terabyteOption
    ).should("contain.text", " Terabyte (TB) ");
    cy.findElement(
      performanceReqs.storageSizeField + performanceReqs.petayteOption
    ).should("contain.text", " Petabyte (PB) ");
    cy.findElement(
      performanceReqs.storageSizeField + performanceReqs.gigabyteOption
    ).click({
      force: true,
    });

    cy.log("Number of Instances:................");
    cy.textExists(
      performanceReqs.noInstancesNeededLabel,
      serviceOfferingGroups.ComputePage.instancesTextboxLable
    );
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "instanceDatabaseConfigurationsFieldsData",
  (
    noOfVCPUs,
    processorSpeed,
    operatingSystem,
    memory,
    storage,
    storageSize,
    noOfInstances
  ) => {
    const storageTypeMap = {
      BlockStorage: performanceReqs.optionBlockStorage,
      ObjectStorage: performanceReqs.optionObjectTypeStorage,
      FileStorage: performanceReqs.optionFileStorage,
      ArchiveStorage: performanceReqs.optionArchiveStorage,
    };
    cy.findElement(performanceReqs.noOfvCPUTxtBox).type(noOfVCPUs);
    cy.findElement(performanceReqs.operatingLicenseQuestion).scrollIntoView();
    cy.findElement(performanceReqs.procsrSpeedTxtBox).type(processorSpeed);
    cy.findElement(performanceReqs.operatingSysTxtBox).type(operatingSystem);
    cy.findElement(performanceReqs.memoryTextBox).type(memory);
    cy.findElement(performanceReqs.storageTypeLabel).scrollIntoView();
    cy.findElement(performanceReqs.storageTypeDropdown).click();
    cy.findElement(storageTypeMap[storage]).click({
      force: true,
    });
    cy.findElement(performanceReqs.storageAmountTextBox).type(storageSize);
    cy.findElement(performanceReqs.noInstancesTextbox)
      .clear()
      .type(noOfInstances);
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "anticipatedNeedAndDurationTitleandData",
  (requirementName, anticipatedText, task, entireDuration) => {
    cy.verifyTextMatches(
      performanceReqs.anticipatedDurationLabel,
      serviceOfferingGroups.ComputePage.anticptdDurationLabel
    );
    if (requirementName == "Compute") {
      cy.verifyTextMatches(
        performanceReqs.anticipatedDurationText,
        serviceOfferingGroups.ComputePage.anticptdDurationText
      );
    } else {
      cy.verifyTextMatches(
        performanceReqs.anticipatedDurationText,
        serviceOfferingGroups.GatherRequirementsPage.descriptionText
      );
    }
    cy.findElement(performanceReqs.anticipatedTextBox2).type(anticipatedText);

    cy.verifyTextMatches(
      performanceReqs.entireDurationRadioLabel2,
      "Do you need this " +
        task +
        " for the entire duration of your task order?"
    );
    cy.hoverToolTip(
      performanceReqs.entireDurationToolTipBtn,
      performanceReqs.entireDurationToolTipText,
      "Performance period details will be used to generate a cost estimate for this " +
        task +
        " later."
    );
    cy.verifyRadioGroupLabels(
      performanceReqs.entireDurationRadioGroup,
      serviceOfferingGroups.ComputePage.entireDurationRadioboxes
    );

    if (entireDuration == "Yes") {
      cy.radioBtn(performanceReqs.durationYesRadioBtn, "YES")
        .not("[disabled]")
        .click({
          force: true,
        });
    } else if (entireDuration == "No") {
      cy.radioBtn(performanceReqs.durationNoRadioBtn, "NO")
        .not("[disabled]")
        .click({
          force: true,
        });
      cy.findElement(performanceReqs.baseCheckbox).should("be.checked");
      cy.findElement(performanceReqs.optionOneCheckbox).should(
        "not.be.checked"
      );
    }
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "selectDeployedClassificationLevel",
  (selectedClassification) => {
    const classLevelMap = {
      impactLevel2: performanceReqs.classIL2RadioBtn,
      impactLevel4: performanceReqs.classIL4RadioBtn,
      impactLevel5: performanceReqs.classIL5RadioBtn,
      impactLevel6: performanceReqs.classIL6RadioBtn,
      tops: performanceReqs.topsRadioBtn,
    };
    cy.verifyTextMatches(
      performanceReqs.classLevelQuestion,
      serviceOfferingGroups.ComputePage.classificationLevelQuestion
    );
    cy.hoverToolTip(
      performanceReqs.classLevelTooltipBtn,
      performanceReqs.classLevelTootipText,
      serviceOfferingGroups.ComputePage.classLevelToolTipText
    );
    cy.verifyRadioGroupLabels(
      performanceReqs.classLevelRadioGroup,
      serviceOfferingGroups.ComputePage.classLevelRadioGroup
    );
    cy.verifyTextMatches(
      performanceReqs.updateClassRequirements,
      serviceOfferingGroups.ComputePage.updateTitle
    );

    cy.findElement(classLevelMap[selectedClassification]).click({
      force: true,
    });
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add("OSandDBLicensing", (licenseName, licenseType) => {
  let category = "";

  if (licenseName == "operatingSystem") {
    category = performanceReqs.osLicensingRadio;
  } else if (licenseName == "database") {
    category = performanceReqs.dbLicensingRadio;
  }
  // cy.verifyRadioGroupLabels(
  //   performanceReqs.operatingLicenseRadioGroup,
  //   category + "input[type=radio]"
  // );

  if (licenseType == "transfer") {
    cy.findElement(category + performanceReqs.transferLicenseRadio).click({
      force: true,
    });
  } else if (licenseType == "newLicense") {
    cy.findElement(category + performanceReqs.newLicenseRadio).click({
      force: true,
    });
  }
});

// ST- new function created for Performance Requirements
Cypress.Commands.add("requirementsSummaryPage", (requirementName, task) => {
  cy.clickContinueButton(
    performanceReqs.classLevelQuestion,
    "Your " + requirementName + " Requirements"
  );
  cy.verifyTextMatches(
    performanceReqs.computeSummaryText,
    "If you need more " +
      task +
      ", add them below. You can also edit or delete any info from the " +
      task +
      " that you have already entered. When you’re done," +
      " click “Continue” and we will wrap up this category."
  );
});

// ST- new function created for Performance Requirements
Cypress.Commands.add("deleteInstanceOrRequirement", (type, requirementName) => {
  cy.findElement(performanceReqs.instanceOneDeleteBtn).click({
    force: true,
  });
  cy.verifyTextMatches(performanceReqs.dialogTitle, "Delete " + type + " #1?");
  cy.verifyTextMatches(
    performanceReqs.deleteMsg,
    "This " +
      type.toLowerCase() +
      " will be removed from your " +
      requirementName +
      " requirements. Any details about this " +
      type.toLowerCase() +
      " will not be saved."
  );
  cy.findElement(performanceReqs.deleteInstBtn).click({
    force: true,
  });
  cy.findElement(performanceReqs.instanceOneDeleteBtn).should("not.exist");
});

// ST- new function created for Performance Requirements
Cypress.Commands.add(
  "deleteALLInstanceOrRequirement",
  (requirementName, type) => {
    cy.findElement(performanceReqs.dontneedBtn).click({
      force: true,
    });
    cy.verifyTextMatches(
      performanceReqs.deleteAllInstTitle,
      "Delete all " + requirementName + " " + type + "?"
    );
    cy.verifyTextMatches(
      performanceReqs.deleteAllInstMsg,
      "This action will remove the “" +
        requirementName +
        "” category from your performance requirements. Any details about your " +
        type +
        " will not be saved."
    );
    cy.findElement(performanceReqs.deleteAllInstBtn).click({
      force: true,
    });
    cy.findElement(performanceReqs.computeRequirementsSummaryPageTitle).should(
      "not.exist"
    );
  }
);

// ST- new function created for Performance Requirements
Cypress.Commands.add("errorMessageValidations", (requirementName) => {
  cy.findElement(performanceReqs.addAnotherInstance).click({
    force: true,
  });
  cy.clickContinueButton(
    performanceReqs.classLevelQuestion,
    " Your " + requirementName + " Requirements "
  );
  cy.findElement(performanceReqs.instanceTwoEditBtn).click({
    force: true,
  });
  cy.verifyTextMatches(
    performanceReqs.classLevelQuestion,
    serviceOfferingGroups.PerformanceRequirementsPage
      .classificationLevelQuestion
  );
  cy.checkErrorMessage(
    performanceReqs.errorAlertMessage,
    serviceOfferingGroups.ComputePage.errorAlertMsg
  );
  cy.checkErrorMessage(
    performanceReqs.classLevelErrorMsg,
    serviceOfferingGroups.ComputePage.classLvlErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.anticipatedDurationError,
    serviceOfferingGroups.ComputePage.objStatementErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.entireDurationError,
    serviceOfferingGroups.ComputePage.selectOptionErrMsg
  );
});

// ST- new function created for Performance Requirements
Cypress.Commands.add("errorMessageValidationsCPDB", () => {
  cy.checkErrorMessage(
    performanceReqs.osLicensingTypeErrorMsg,
    serviceOfferingGroups.ComputePage.operSystemErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.noOfvCPUError,
    serviceOfferingGroups.ComputePage.greaterOneErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.procsrSpeedError,
    serviceOfferingGroups.ComputePage.greaterOneErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.operatingSysError,
    serviceOfferingGroups.ComputePage.operSysErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.memoryError,
    serviceOfferingGroups.ComputePage.greaterOneErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.storageTypeError,
    serviceOfferingGroups.ComputePage.storageTypeErrMsg
  );
  cy.checkErrorMessage(
    performanceReqs.storageAmountError,
    serviceOfferingGroups.ComputePage.greaterZeroErrMsg
  );
});

