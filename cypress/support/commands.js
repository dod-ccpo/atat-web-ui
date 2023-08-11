import "cypress-iframe";
import "@4tw/cypress-drag-drop";
import "cypress-file-upload";
import common from "../selectors/common.sel";
import lp from "../selectors/landingPage.sel";
import projectOverview from "../selectors/projectOverview.sel.js";
import contact from "../selectors/contact.sel";
import org from "../selectors/org.sel";
import commonCorAcor from "../selectors/commonCorAcor.sel";
import acor from "../selectors/acor.sel";
import background from "../selectors/background.sel";
import contractDetails from "../selectors/contractDetails.sel";
import { cleanText, colors, prefixId } from "../helpers";
import occ from "../selectors/occ.sel";
import fd from "../selectors/financialDetails.sel";
import performanceReqs from "../selectors/performanceReqs.sel";
import "cypress-wait-until";

const isTestingLocally = Cypress.env("isTestingLocally") === "true";
const runTestsInIframe = Cypress.env("isTestingInIframe") === "true";
const isTestingIsolated = Cypress.env("isTestingIsolated") === "true";
let hopOutOfIframe = false;

Cypress.Commands.add("visitURL", () => {
  if (isTestingIsolated) {
    cy.visit(Cypress.env("isolatedTestingURL"));
  } else if (isTestingLocally) {
    if (runTestsInIframe && !hopOutOfIframe) {
      cy.visit(Cypress.env("localTestURLInIframe"));
    } else {
      cy.visit(Cypress.env("localTestURL"));
    }
  } else {
    if (runTestsInIframe && !hopOutOfIframe) {
      cy.visit(Cypress.env("testURL"));
    } else {
      cy.visit(Cypress.env("disaNoIframeUrl"));
    }
  }
});

Cypress.Commands.add("hopOutOfIframe", (hopOut, navigate) => {
  hopOutOfIframe = hopOut || false;
  if (navigate) {
    cy.visitURL();
  }
});

Cypress.Commands.add("launchATAT", (bool) => {
  cy.hopOutOfIframe(false);
  if (isTestingLocally) {
    cy.clearSession();
    if (runTestsInIframe) {
      cy.visit(Cypress.env("localTestURLInIframe"));
      cy.frameLoaded(common.app);
    } else {
      if (bool) {
        cy.window()
          .its("sessionStorage")
          .invoke("setItem", "userId", Cypress.env("userId"));
      }
      cy.visit(Cypress.env("localTestURL"));
    }
  } else if (isTestingIsolated) {
    cy.clearSession();
    cy.visit(Cypress.env("isolatedTestingURL"));
  } else {
    cy.visit(Cypress.env("testURL"));
    cy.login(Cypress.env("snowUser"), Cypress.env("snowPass"));
    cy.clearSession();
    cy.get(common.title).should(
      "have.text",
      "DISA Sandbox home page - DISA Sandbox"
    );
    cy.frameLoaded(common.app);
  }
});

Cypress.Commands.add("clearSession", () => {
  if (isTestingLocally || isTestingIsolated) {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  } else {
    cy.window().then((win) => {
      win.sessionStorage.clear();
      const iframe = win.document.querySelector("iframe");
      iframe.contentWindow.sessionStorage.clear();
    });
  }
});

Cypress.Commands.add("login", (user, password) => {
  cy.get("#username").type(user);
  cy.get("#password").type(password);
  cy.contains("button", "Log in").click();
});

Cypress.Commands.add("findElement", (selector) => {
  if (runTestsInIframe && !hopOutOfIframe) {
    cy.iframe(common.app).find(selector);
  } else {
    cy.get(selector);
  }
});

Cypress.Commands.add("waitUntilModalNotVisible", () => {
  cy.waitUntil(() => {
    return Cypress.$("#LoadingModalTitle").is(":visible") === true;
  }).then(() => {
    cy.waitUntil(
      () => {
        return Cypress.$("#LoadingModalTitle").is(":hidden") === true;
      },
      { timeout: 30000 }
    ).then(() => {
      cy.verifyPageHeader(
        "Are you using the Defense Information Technology Contracting Organization (DITCO)" +
          " for processing your JWCC task order?"
      );
    });
  });
});

Cypress.Commands.add("homePageClickAcquisitionPackBtn", () => {
  cy.findElement(lp.welcomeBarText).should("exist");
  cy.textExists(lp.startAcqWelcome, "Start a new acquisition")
    .should("be.enabled")
    .click();
  cy.verifyPageHeader("Before you get started");

  cy.findElement("#stepperNavigation").scrollIntoView().should("be.visible");
  cy.findElement(common.continueBtn).click();
  cy.waitUntilModalNotVisible();
});

Cypress.Commands.add("selectDitcoOption", (selector, text) => {
  cy.radioBtn(selector, text).click({ force: true });
  cy.waitUntil(function () {
    return Cypress.$(selector).is(":checked") === true;
  });
  cy.btnExists(common.continueBtn, " Continue ").click();
  cy.waitUntil(
    function () {
      return Cypress.$(common.continueBtn).is(":hidden") === true;
    },
    { timeout: 30000 }
  ).then(() => {
    cy.verifyPageHeader(
      "Let’s start with basic info about your new acquisition"
    );
  });
});

Cypress.Commands.add("clickDevToggleBtn", () => {
  const toggleSel = "#developerToggleButton";
  cy.findElement(".atat-page-footer").scrollIntoView();
  cy.waitUntil(function () {
    return Cypress.$(toggleSel).attr("aria-checked") == "false";
  });
  cy.findElement(toggleSel)
    .click({ force: true })
    .then(() => {
      cy.waitUntil(function () {
        return Cypress.$(toggleSel).attr("aria-checked") == "true";
      });
      cy.waitUntil(function () {
        return cy
          .findElement(common.stepEvaluationCriteriaLink)
          .not("have.class", "step disabled");
      });
    });
});

Cypress.Commands.add("textExists", (selector, expectedText) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
  cy.findElement(selector)
    .should("be.visible")
    .then(($el) => {
      let actualTxt = $el.text();
      const formattedTxt = cleanText(actualTxt);
      cy.log(formattedTxt);
      const expectedTextCleaned = cleanText(expectedText);
      expect(formattedTxt).contains(expectedTextCleaned);
    });
});

Cypress.Commands.add("enterTextInTextField", (selector, text) => {
  cy.findElement(selector)
    .should("be.visible")
    .clear()
    .type(text)
    .then(() => cy.findElement(selector).should("have.value", text));
});

Cypress.Commands.add("btnExists", (selector, text) => {
  cy.findElement(selector).should("be.visible").and("have.text", text);
});

Cypress.Commands.add("btnClick", (selector, text) => {
  cy.findElement(selector).then((el) => {
    if (el.length > 1) {
      el = el[0];
    }
    cy.wrap(el)
      .scrollIntoView()
      .not("[disabled]")
      .and("have.text", text)
      .click();
  });
});

Cypress.Commands.add("clickBackButton", (selector,headerText) => {
  cy.btnClick(common.backBtn, "Back");
  cy.waitUntilElementIsGone(selector);
  cy.verifyPageHeader(headerText);
});

Cypress.Commands.add("clickContinueButton", (selector,headerText) => {
  cy.btnClick(common.continueBtn, " Continue ");
  cy.waitUntilElementIsGone(selector);
  cy.verifyPageHeader(headerText);
});

Cypress.Commands.add("clickLink", (selector) => {
  cy.findElement(selector).scrollIntoView().click();
});

Cypress.Commands.add("radioBtn", (selector, value) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findElement(selector).wait(1000).should("have.value", value);
});

Cypress.Commands.add("hoverToolTip", (selector, selector1, expectedText) => {
  cy.findElement(selector).should("be.visible").realHover();
  cy.findElement(selector1).then(($el) => {
    let actualTxt = $el.text();
    const formattedTxt = cleanText(actualTxt);
    cy.log(formattedTxt);
    expect(formattedTxt).equal(expectedText);
  });
});

Cypress.Commands.add("checkErrorMessage", (selector, errorMessage) => {
  cy.findElement(selector)
    .scrollIntoView()
    .then(($el) => {
      let actualTxt = $el.text();
      const actualErrorMessage = cleanText(actualTxt);
      cy.log(actualErrorMessage);
      const errorMessageCleaned = cleanText(errorMessage);
      expect(actualErrorMessage).contains(errorMessageCleaned);
    });
});

Cypress.Commands.add("verifyEnteredInputTxt", (selector, it) => {
  cy.findElement(selector).then(($inputText) => {
    const text = $inputText.val();
    cy.log(text);
    expect(text).contain(it);
  });
});

Cypress.Commands.add("verifySelectedRadioOption", (selector, radioOption) => {
  cy.findElement(selector).then(($radioOption) => {
    const text = cleanText($radioOption.text());
    cy.log(text);
    expect(text).contain(radioOption);
  });
});

Cypress.Commands.add("verifySelectedCheckBoxOption", (selector) => {
  cy.findElement(selector).should("be.checked");
});

Cypress.Commands.add(
  "verifyRequiredInput",
  (textboxSelector, errorSelector, errorMessage) => {
    cy.findElement(textboxSelector)
      .scrollIntoView()
      .should("be.visible")
      .clear()
      .click()
      .focus()
      .blur({ force: true })
      .then(() => {
        cy.checkErrorMessage(errorSelector, errorMessage);
      });
  }
);

Cypress.Commands.add(
  "verifyRequiredDropdown",
  (textboxSelector, errorSelector, errorMessage) => {
    cy.findElement(textboxSelector).click({ force: true });
    cy.clickSomethingElse(errorSelector).then(() => {
      cy.checkErrorMessage(errorSelector, errorMessage);
    });
  }
);

Cypress.Commands.add(
  "verifyRequiredCheckbox",
  (checkboxSelector, errorSelector, errorMessage) => {
    cy.findElement(checkboxSelector)
      .check({ force: true })
      .uncheck({ force: true })
      .then(() => {
        cy.checkErrorMessage(errorSelector, errorMessage);
      });
  }
);

Cypress.Commands.add(
  "verifyRequiredRadioBtn",
  (radioSelector, errorSelector, errorMessage) => {
    cy.findElement(radioSelector).focus();
    cy.clickSomethingElse(errorSelector).then(() => {
      cy.checkErrorMessage(errorSelector, errorMessage);
    });
  }
);

Cypress.Commands.add("verifyPageHeader", (headerText) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(100);
  cy.findElement(common.header)
    .scrollIntoView()
    .then(() => {
      cy.textExists(common.header, headerText);
    });
});

Cypress.Commands.add("verifyTextMatches", (selector, expectedText) => {
  cy.findElement(selector).then(($el) => {
    let actualTxt = $el.text();
    cy.log(actualTxt);
    const formattedTxt = cleanText(actualTxt);
    expect(formattedTxt).equal(expectedText);
  });
});

Cypress.Commands.add("reviewPageTxtMatches", (selector, it) => {
  cy.findElement(selector).then(($inputVal) => {
    const textReview =cleanText($inputVal.val());
    cy.log(textReview);
    expect(textReview).equal(it);
  });
});

Cypress.Commands.add("findCheckBox", (selector, value) => {
  cy.findElement(selector).should("have.value", value);
});

Cypress.Commands.add("checkBoxOption", (selector, value) => {
  cy.findElement(selector).should("have.value", value).and("not.checked");
});

Cypress.Commands.add("selectCheckBoxes", (checkBoxesSelectors) => {
  checkBoxesSelectors.forEach((selector) => {
    cy.findElement(selector)
      .click({ force: true })
      .then(() => {
        cy.waitUntil(
          () => {
            return Cypress.$(selector).is(":checked") === true;
          },
          { timeout: 30000 }
        );
      });
  });
});

Cypress.Commands.add("selectRadioBtn", (selector, value) => {
  cy.radioBtn(selector, value).click({ force: true });
});
Cypress.Commands.add("verifyCheckBoxLabels", (selector, expectedLabels) => {
  const foundLabels = [];
  const length = expectedLabels.length;
  cy.findElement(selector)
    .should("have.length", length)
    .each(($checkbox, index) => {
      cy.findElement(`label[for=${$checkbox.attr("id")}]`)
        .invoke("text")
        .then((text) => {
          foundLabels.push(cleanText(text));
          cy.log(text);
          if (index + 1 === length) {
            console.log("Actual:", foundLabels);
            console.log("Expected:", expectedLabels);
          }
        });
    })
    .then(() => {
      cy.log(foundLabels);
      expect(foundLabels).to.deep.equal(expectedLabels);
    });
});

Cypress.Commands.add("verifyRadioGroupLabels", (selector, expectedLabels) => {
  const foundLabels = [];
  const length = expectedLabels.length;
  cy.findElement(selector)
    .should("have.length", length)
    .each(($radio) => {
      cy.findElement(`label[for=${$radio.attr("id")}]`)
        .invoke("text")
        .then((text) => foundLabels.push(cleanText(text)));
    })
    .then(() => {
      expect(foundLabels).to.deep.equal(expectedLabels);
    });
});

Cypress.Commands.add("verifyElementTextArray", (selector, expectedText) => {
  cy.findElement(selector).each((card, index) => {
    const cardText = Cypress.$(card).text();
    const actualCard = cleanText(cardText);
    console.log(actualCard);
    expect(actualCard).equal(expectedText[index]);
  });
});

Cypress.Commands.add("verifyStringArray", (selector, expectedOptions) => {
  //Verify the list
  cy.findElement(selector)
    .then(($els) => {
      const foundText = Cypress.$.makeArray($els).map((el) => el.innerText);
      const foundTextArray = cleanText(foundText[0]).split(/\r?\n/);
      console.log("Actual:", foundTextArray);
      return foundTextArray;
    })
    .should("deep.equal", expectedOptions);
  console.log("expectedText:", expectedOptions);
});

Cypress.Commands.add(
  "verifyColumnHeaders",
  (columnIndex, headerText, expectedValue) => {
    cy.findElement(
      ".v-data-table-header  th:nth-child(" + columnIndex + ") span"
    )
      .invoke("text")
      .as("foundHeaderText");

    cy.get("@foundHeaderText").then((foundHeaderText) => {
      expect(headerText).equal(foundHeaderText);
    });
    cy.findElement("tbody td:nth-child(" + columnIndex + ")").then(($el) => {
      const value = $el.text();
      expect(value).equal(expectedValue);
    });
  }
);

//This command is to verify the selected Categories and Offerings in the summary page
Cypress.Commands.add("verifyTextArray", (selector, expectedValues) => {
  const foundItems = [];
  const length = expectedValues.length;

  cy.findElement(selector)
    .should("have.length", length)
    .each((el) => {
      foundItems.push(cleanText(el.text()));
    })
    .then(() => {
      expect(foundItems).deep.equal(expectedValues);
    });
});

Cypress.Commands.add("verifyListMatches", (selector, expectedText) => {
  //Verify the list
  cy.findElement(selector)
    .then(($els) => {
      const foundText = Cypress.$.makeArray($els).map((el) => el.innerText);
      const foundTextArray = foundText[0].split(", ");
      return foundTextArray;
    })
    .should("deep.equal", expectedText);
});

Cypress.Commands.add("clickSideStepper", (stepperSelector, stepperText) => {
  cy.findElement(stepperSelector)
    .should("be.visible")
    .and("have.length", 1)
    .and("contain", stepperText)
    .click().then(()=>{
      cy.waitUntil(function () {
        return cy.findElement(stepperSelector).should("have.class", "router-link-active");
      });
    });
});

Cypress.Commands.add("activeStep", (selector) => {
  cy.findElement(selector)
    .should("be.visible")
    .and("have.css", "color", colors.primary);
});

Cypress.Commands.add("dropDownClick", (selector) => {
  cy.findElement(selector).click();
});

Cypress.Commands.add(
  "autoCompleteSelection",
  (selector, inputText, selector1) => {
    cy.findElement(selector).type(inputText);
    cy.findElement(selector1).first().click({ force: true });
  }
);

Cypress.Commands.add(
  "autoCompletePhoneCountrySelection",
  (selector, inputText, selector1) => {
    cy.findElement(selector).type(inputText, { force: true });
    cy.findElement(selector1).first().click({ force: true });
  }
);

Cypress.Commands.add("messageDisplays", (selector, alertMessage) => {
  cy.findElement(selector)
    .should("exist")
    .then(($message) => {
      let actualTxt = $message.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt);
      expect(formattedTxt).equal(alertMessage);
    });
});

Cypress.Commands.add("completePercent", () => {
  let percentComplete = 0;
  cy.findElement(common.completePercentage)
    .each(($el) => {
      const text = $el[0].dataset.substepCompletePercentage;
      cy.wrap(text);
      percentComplete = percentComplete + parseFloat(text);
    })
    .then(() => {
      return percentComplete;
    });
});

Cypress.Commands.add("verifyAcqPackageName", (pt) => {
  cy.enterTextInTextField(projectOverview.projectTitleTxtBox, pt)
    .blur({ force: true })
    .then(($el) => {
      cy.log($el.val());
      const enteredText = $el.val();
      if (enteredText === "") {
        cy.textExists(common.packageNameHeader, "New Acquisition");
      } else {
        cy.textExists(common.packageNameHeader, pt);
      }
    });
});

Cypress.Commands.add("fillNewAcquisition", (projectTitle, scope) => {
  cy.enterTextInTextField(projectOverview.projectTitleTxtBox, projectTitle);
  cy.enterTextInTextField(projectOverview.scopeTxtBox, scope);
  cy.findElement(projectOverview.radioBtnYes)
    .should("have.value", "YES")
    .click({ force: true });
  cy.findElement(projectOverview.projDisChxkBox).scrollIntoView();
  cy.checkBoxOption(projectOverview.projDisChxkBox, "YES").click({
    force: true,
  });
  cy.findElement(projectOverview.cjadc2NoRadioOption)
  .should("have.value", "NO")
  .click({ force: true });
  cy.btnExists(common.continueBtn, " Continue ").click();
  cy.waitUntilElementIsGone(projectOverview.projDisChxkBox);
  cy.verifyPageHeader(
    " Next, we’ll gather information about your organization "
  );
});

Cypress.Commands.add("fillSurgeCapabilities", (percentage, clickContinue) => {
  cy.findElement(fd.contractPricePercentageTxtBox)
    .should("be.visible")
    .clear()
    .type(percentage)
    .blur({ force: true })
    .then(($el) => {
      cy.log($el.val());
      const enteredText = $el.val();
      const showError = () => {
        cy.findElement(fd.contractPriceError).should(
          "contain.text",
          "Please enter a number between 1-50"
        );
      };

      if (enteredText < 1 || enteredText > 50) {
        showError();
      } else if (isNaN(parseInt(enteredText))) {
        showError();
      } else {
        cy.findElement(fd.contractPriceControl).should(
          "not.contain",
          "Please enter a number between 1-50"
        );
      }
    });
  if (clickContinue) {
    cy.btnExists(common.continueBtn, " Continue ").click();
  }
});

Cypress.Commands.add("agency", (inputText) => {
  cy.dropDownClick(org.agencyDropDownIcon);
  cy.autoCompleteSelection(org.agencyInput, inputText, org.agencyAutoListItems);
  cy.findElement(org.agencyInput).then(($option) => {
    const selectedOption = $option.val();
    cy.log(selectedOption);
    if (selectedOption === "Defense Information Systems Agency (DISA)") {
      cy.findElement(org.disaOrgAutoComplete)
        .should("exist")
        .and("be.visible")
        .and("contain", "DISA Organization");
    } else {
      cy.textExists(org.orgNameControl, "Organization name").should("exist");
    }
  });
});

Cypress.Commands.add("selectTypeOfMailingAddress", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(org.addressTypeRadioActive).then(($radioBtn) => {
    const selectedOption = $radioBtn.text();
    cy.log(selectedOption);
    const commonFields = () => {
      cy.textExists(org.streetLabel, " Street address ");
      cy.textExists(org.unitLabel, " Unit, suite, etc.  Optional ");
    };
    commonFields();
    cy.findElement(common.continueBtn).scrollIntoView().should("be.visible");
    if (selectedOption === "radio_button_checkedU.S. address") {
      cy.textExists(org.cityLabel, " City ");
      cy.textExists(org.stateLabel, " State ");
      cy.textExists(org.zipCodeLabel, " ZIP code ");
    }
    if (selectedOption === "radio_button_checkedMilitary") {
      cy.textExists(org.zipCodeLabel, " ZIP code ");
      cy.textExists(org.stateCodeDropDownLabel, " State code ");
      cy.textExists(org.apoFpoDropDownLabel, " APO/FPO/DPO ");
    }
    if (selectedOption === "radio_button_checkedForeign address") {
      cy.textExists(org.cityLabel, " City ");
      cy.textExists(org.stateProvinceLabel, " State or Province ​");
      cy.textExists(org.postalCodeLabel, " Postal code ");
      cy.textExists(org.countryLabel, " Country ");
    }
  });
});

Cypress.Commands.add("enterOrganizationAddress", (orgAddress) => {
  cy.findElement(org.addressTypeRadioActive).then(($radioBtn) => {
    const selectedOption = $radioBtn.text();
    cy.log(selectedOption);
    const enterCommonFields = () => {
      cy.enterTextInTextField(org.streetTxtBox, orgAddress.streetAddress);
      cy.enterTextInTextField(org.unitTxtBox, orgAddress.unit);
    };
    enterCommonFields();
    if (selectedOption === "radio_button_checkedU.S. address") {
      //Assert Organization's address labels
      cy.enterTextInTextField(org.cityTxtBox, orgAddress.city);
      cy.autoCompleteSelection(
        org.stateTxtBox,
        orgAddress.state,
        org.stateAutoCompleteList
      );
      cy.enterTextInTextField(org.zipCodeTxtBox, orgAddress.zipCode);
    }
    if (
      selectedOption ===
      "radio_button_checkedMilitary/Diplomatic (APO, FPO, or DPO)"
    ) {
      //Assert Organization's address labels

      cy.findElement(org.apoFpoDropDown).click({ force: true });
      cy.findElement(orgAddress.apoFPOSelector).click({ force: true });
      cy.findElement(org.stateCodeDropDown).click({ force: true });
      cy.findElement(orgAddress.statecodeSelector).click();
      cy.enterTextInTextField(org.zipCodeTxtBox, orgAddress.zipCode);
    }
    if (selectedOption === "radio_button_checkedForeign address") {
      cy.enterTextInTextField(org.cityTxtBox, orgAddress.city);
      cy.enterTextInTextField(
        org.stateProvinceTxtBox,
        orgAddress.stateProvince
      );
      cy.enterTextInTextField(org.postalCodeTxtBox, orgAddress.zipCode);
      cy.autoCompleteSelection(
        org.countryInput,
        orgAddress.inputCountryName,
        org.countryListItems
      );
    }
  });
});

Cypress.Commands.add(
  "contactRoleRadioBtnOption",
  (selector, value, sbSelector) => {
    cy.radioBtn(selector, value)
      .click({ force: true }, { timeout: 1000 })
      .should("be.checked");
    cy.findElement(contact.contactRadioBtnActive).then(($radioBtn) => {
      cy.log($radioBtn.text());
      const selectedOption = $radioBtn.text();
      if (selectedOption === "radio_button_checkedMilitary") {
        cy.findElement(contact.serviceBranchControl)
          .should("exist")
          .and("be.visible")
          .and("contain", "Service branch");
        cy.findElement(contact.serviceBranchDropDownIcon).click({
          force: true,
        });
        cy.findElement(sbSelector)
          .click()
          .then(() => {
            cy.findElement(contact.rankAutoCompleteWrapper)
              .should("exist")
              .and("be.visible")
              .and("contain", "Rank");
            cy.findElement(contact.gradeAutoCompleteWrapper).should(
              "not.exist"
            );
          });
      }
      if (selectedOption === "radio_button_checkedCivilian") {
        cy.findElement(contact.gradeAutoCompleteWrapper)
          .should("exist")
          .and("be.visible")
          .and("contain", "Grade");
        cy.findElement(contact.salutationDropDownLabel)
          .should("exist")
          .and("be.visible")
          .and("contain", "Salutation");
        cy.findElement(contact.serviceBranchControl).should("not.exist");
      }
    });
  }
);

Cypress.Commands.add(
  "enterContactInformation",
  (contactInformation, prefix) => {
    let selector = prefixId(contactInformation.firstNameSelector, prefix);
    cy.enterTextInTextField(selector, contactInformation.firstName);
    selector = prefixId(contactInformation.mNameSelector, prefix);
    cy.enterTextInTextField(selector, contactInformation.mName);
    selector = prefixId(contactInformation.lastNameSelector, prefix);
    cy.enterTextInTextField(selector, contactInformation.lastName);
    selector = prefixId(contactInformation.emailSelector, prefix);
    cy.enterTextInTextField(selector, contactInformation.email);
    if (contactInformation.cor) {
      const expectedText =
        "A DoDAAC is a 6-character code that uniquely identifies a unit," +
        " activity, or organization that has the authority to request," +
        " contract for, or fund/pay bills for materials and services.";

      const tooltipButton =
        prefix === "COR_"
          ? commonCorAcor.toolTipBtnDodaacCOR
          : commonCorAcor.toolTipBtnDodaacACOR;
      const tooltipText =
        prefix === "COR_"
          ? commonCorAcor.toolTipTxtDodaacCOR
          : commonCorAcor.toolTipTxtDodaacACOR;

      cy.log("TOOLTIP SELECTOR", selector);
      cy.hoverToolTip(tooltipButton, tooltipText, expectedText);
      //enter DoDAAC
      selector = prefixId(commonCorAcor.dodaacTxtBox, prefix);
      cy.enterTextInTextField(selector, contactInformation.dodText);
    }
  }
);

Cypress.Commands.add(
  "enterPhoneNumber",
  (
    iconSelector,
    countrySelector,
    countryText,
    optionSelector,
    numberSelector,
    numberValue
  ) => {
    cy.dropDownClick(iconSelector);
    cy.autoCompletePhoneCountrySelection(
      countrySelector,
      countryText,
      optionSelector
    );
    cy.findElement(numberSelector).type(numberValue);
  }
);

Cypress.Commands.add(
  "checkIfCorOrAcor",
  (headerSelector, headerText, contactName) => {
    cy.textExists(headerSelector, headerText);
    cy.findElement(commonCorAcor.ditcoLink)
      .should("exist")
      .and("contain", " https://www.ditco.disa.mil/hq/cor/index.asp.");
    cy.findElement(commonCorAcor.searchContactWrapper).should("exist");
    cy.findElement(commonCorAcor.searchContactInput).type(contactName);
    cy.findElement(commonCorAcor.searchContactActive).then(($el) => {
      const result = $el.text();
      cy.log("ResultValue", result);
      if (result.indexOf("No results found") > -1) {
        cy.findElement(commonCorAcor.searchContactNoResult)
          .should("exist")
          .and("be.visible")
          .and("contain", " No results found. ");
        cy.findElement(commonCorAcor.searchContactNoResultLink).should(
          "be.visible"
        );
        cy.findElement(common.header).click();
      } else {
        cy.findElement(commonCorAcor.searchContactListItems)
          .first()
          .click({ force: true });
        cy.findElement(commonCorAcor.selectedContactCard)
          .should("exist")
          .and("be.visible");
        cy.findElement(commonCorAcor.contactFormToggle).should("not.exist");
      }
    });
  }
);

Cypress.Commands.add(
  "manuallyEnterContactInformation",
  (corOrAcor, nameText, contactAffiliationText, radioSelector, radioValue) => {
    let selector = prefixId(commonCorAcor.contactHeaderTxt, corOrAcor);
    cy.textExists(selector, nameText);
    cy.textExists(
      commonCorAcor.contactAffRadioGroupTxt,
      contactAffiliationText
    );
    cy.radioBtn(radioSelector, radioValue).click({ force: true });
    selector = prefixId(commonCorAcor.serviceBranchDropdown, corOrAcor);
    cy.findElement(selector).click({ force: true }).then(()=>{
      cy.waitUntil(() => {
      return Cypress.$(selector).is(":visible") === true;
    },{ timeout: 30000 })
  });
    selector = prefixId(commonCorAcor.serviceBranchDropdownList, corOrAcor);
    cy.findElement(selector).first().click().then(()=>{      
      cy.waitUntil(() => {
          return Cypress.$(selector).is(":hidden") === true;
        },{ timeout: 30000 })
    });
    cy.findElement(commonCorAcor.contactAffRadioActive).then(($radioBtn) => {
      cy.log($radioBtn.text());
      const selectedOption = $radioBtn.text();
      if (selectedOption === "radio_button_checkedMilitary") {
        selector = prefixId(commonCorAcor.rankAutoWrapper, corOrAcor);
        cy.findElement(selector)
          .should("exist")
          .and("be.visible")
          .and("contain", "Rank");
        selector = prefixId(commonCorAcor.salutationLabel, corOrAcor);
        cy.findElement(selector).should("exist").and("not.visible");
        //Click Rank dropdown
        selector = prefixId(commonCorAcor.rankInput, corOrAcor);
        cy.dropDownClick(selector);
        //select the value from Rank Dropdown
        selector = prefixId(commonCorAcor.rankAutoCompleteList, corOrAcor);
        cy.findElement(selector).first().click({ force: true });
      } else if (selectedOption === "radio_button_checkedCivilian") {
        selector = prefixId(commonCorAcor.salutationDropDownControl, corOrAcor);
        cy.findElement(selector)
          .should("exist")
          .and("be.visible")
          .and("contain", "Salutation");
        selector = prefixId(commonCorAcor.rankAutoWrapper, corOrAcor);
        cy.findElement(selector).should("exist").and("not.visible");
      }
    });
  }
);

Cypress.Commands.add(
  "selectedContactInformation",
  (nameText, email, phone, orgName, message, requestLink, removeLink) => {
    cy.textExists(commonCorAcor.selectedContactCardName, nameText);
    cy.textExists(commonCorAcor.selectedContactCardEmail, email);
    cy.textExists(commonCorAcor.selectedContactCardPhone, phone);
    cy.textExists(commonCorAcor.selectedContactCardOrgName, orgName);
    cy.textExists(commonCorAcor.selectedContactCardMessage, message);
    cy.btnExists(commonCorAcor.requestedContactChangeLink, requestLink);
    cy.btnExists(commonCorAcor.removeSelectedContactInfoLink, removeLink);
  }
);

Cypress.Commands.add(
  "requestChangeContactInformation",
  (requestLink, requestTitle, message, inputText) => {
    cy.btnExists(commonCorAcor.requestedContactChangeLink, requestLink).click();
    cy.textExists(commonCorAcor.requestModalTitle, requestTitle);
    cy.textExists(commonCorAcor.requestModalMessage, message);
    cy.enterTextInTextField(commonCorAcor.infoChangeTxtBox, inputText);
    cy.btnExists(commonCorAcor.sendRequestBtn, " Send Request ").and(
      "to.be.disabled"
    );
    cy.btnExists(commonCorAcor.cancelRequestBtn, "Cancel ").not(
      "to.be.disabled"
    );
  }
);

Cypress.Commands.add("acorOption", (radioSelector, value) => {
  cy.textExists(
    common.header,
    " Do you have an Alternate Contracting Officer’s Representative (ACOR)? "
  );
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(acor.activeRadioOption).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    cy.btnExists(common.continueBtn, " Continue ").click();
    cy.waitUntilElementIsGone(radioSelector);
    const yesOption = "radio_button_checkedYes";
    if (selectedOption === yesOption) {
      //naviagtes to ACOR
      cy.verifyPageHeader(" Let’s gather info about your ACOR ");
    } else {
      cy.verifyPageHeader(
        "Let’s see if you qualify for an exception to fair opportunity"
      );
    }
  });
});

Cypress.Commands.add("contractOption", (radioSelector, value) => {
  cy.textExists(
    common.header,
    " Do you have a current contract for this effort? "
  );
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(background.activeRadioOption).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    console.log("|" + selectedOption + "|");
    cy.btnExists(common.continueBtn, " Continue ").click();
    const expectedOption =
      "radio_button_checkedYes. There is a current contract for this effort.";
    console.log("|" + expectedOption + "|");
    if (selectedOption === expectedOption) {
      //navigates to current Contract details page
      cy.textExists(
        common.header,
        " Let’s gather some details about your current contract "
      );
    } else {
      cy.verifyPageHeader("Let’s work on your performance requirements");
    }
  });
});

Cypress.Commands.add("popLengthOptionYearExists", () => {
  cy.findElement(contractDetails.mainWrap).then((main) => {
    if (main.find(contractDetails.optionRow).length > 0) {
      cy.log("Option1Row FOUND!");
      cy.findElement(contractDetails.baseDeleteButton)
        .should("exist")
        .and("not.be.disabled");
      cy.findElement(contractDetails.optionDeleteButton)
        .should("exist")
        .and("not.be.disabled");
    } else {
      cy.log("Option1Row NOT FOUND!");
      cy.findElement(contractDetails.baseDeleteButton)
        .should("exist")
        .and("be.disabled");
    }
  });
});

Cypress.Commands.add(
  "defaultPoPLengthValue",
  (inputSelector, dropdownSelector) => {
    cy.findElement(inputSelector).invoke("val").should("be.equal", "1");
    cy.findElement(dropdownSelector)
      .then(($option) => {
        const defaultOption = $option.text();
        cy.log(defaultOption);
      })
      .should("have.text", "Year");
  }
);

Cypress.Commands.add(
  "selectDatefromDatePicker",
  (ciSel, nmSel, selDateSel, calDate, dpSel) => {
    cy.findElement(ciSel).click();
    cy.findElement(nmSel)
      .click({ force: true })
      .then(() => {
        cy.findElement(selDateSel).each(($el) => {
          const dateName = $el.text();
          if (dateName == calDate) {
            cy.wrap($el).click({ force: true });
          }
        });
        cy.findElement(dpSel).should("not.visible");
      });
  }
);

Cypress.Commands.add("selectPoPStartDate", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(contractDetails.activePoPStartDate).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    
    if (
      selectedOption ===
      "radio_button_checkedYes." 
        
    ) {
      cy.findElement(contractDetails.requestedStartDate).should("exist");
      cy.selectDatefromDatePicker(
          contractDetails.calendarIcon,
          contractDetails.navigateNextMonth,
          contractDetails.selectDate,
          13,
          contractDetails.datePicker
        );
    } else {
      cy.findElement(contractDetails.requestedStartDate).should("not.exist");
    }
    cy.btnExists(common.continueBtn, " Continue ").click();
  });
});

Cypress.Commands.add("selectTMCheckbox", (inputText) => {
  cy.findCheckBox(contractDetails.tmCheckBox, "T&M")
  .should("not.be.checked")
  .check({ force: true })
  .then(() => {
    cy.findElement(contractDetails.tmTextFieldLabel).should("exist");
    cy.textExists(
      contractDetails.tmTextFieldLabel,
      "Please provide justification for your T&M contract type."
    );
    cy.textExists(contractDetails.tmLearnMoreLink, "Learn more").should(
      "exist"
    );    
    cy.enterTextInTextField(contractDetails.tmTextFieldInputBox, inputText);
  });
});

Cypress.Commands.add("selectTrainingOption", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true }).should("be.checked");
  cy.findElement(occ.trainingRadioOptionActive).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    cy.btnExists(common.continueBtn, " Continue ").click();
    if (selectedOption === "radio_button_checkedYes.") {
      //naviagtes to "Tell us about your mandatory training screen"
      cy.textExists(common.header, " Tell us about your mandatory training ");
    } else {
      cy.verifyPageHeader(
        "Let's find out if your effort provides for Personally Identifiable Information"
      );
      cy.findElement(common.stepStandCompText)
        .should("be.visible")
        .and("have.css", "color", colors.primary);
    }
  });
});

Cypress.Commands.add("trainingCourseExists", () => {
  cy.findElement(occ.trainingCourse).then((trainingCourseRows) => {
    cy.log(trainingCourseRows.length);
    if (trainingCourseRows.length === 1) {
      cy.findElement(occ.trainCourseRemovebtn)
        .should("exist")
        .and("be.disabled");
    } else {
      cy.findElement(occ.trainCourseRemovebtn)
        .should("exist")
        .and("not.be.disabled");
    }
  });
});


Cypress.Commands.add("selectServiceOfferingGroup", (checkboxes) => {
  cy.selectCheckBoxes(checkboxes);
  cy.btnClick(common.continueBtn, " Continue ");
});

Cypress.Commands.add("deselectAllCheckboxes", () => {
  cy.findElement("[type='checkbox']").uncheck({ force: true });
});

Cypress.Commands.add(
  "durationPeriodExists",
  (radioSelector, activeSelector, periodLabelSelector, value) => {
    cy.radioBtn(radioSelector, value).click({ force: true });
    cy.findElement(activeSelector).then(($radioBtn) => {
      const selectedOption = $radioBtn.text();
      cy.log(selectedOption);
      if (selectedOption === "radio_button_checkedNo") {
        cy.findElement(periodLabelSelector).should("exist");
      } else {
        cy.findElement(periodLabelSelector).should("not.exist");
      }
    });
  }
);

Cypress.Commands.add("periodCount", (count, checkBoxRowSelector) => {
  cy.findElement(common.wrap).then((main) => {
    const periodCount = main.find(checkBoxRowSelector).length;
    expect(periodCount).equal(count);
  });
});

Cypress.Commands.add("selectFundingRequest", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(fd.fundingRadioActive).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    cy.btnClick(common.continueBtn, " Continue ");
    const fsfLabel =
      "radio_button_checkedFiscal" +
      " Service Forms (7600A and 7600B)" +
      "Import from G-Invoicing or manually upload your completed forms." +
      " Recommended";
    if (selectedOption === fsfLabel) {
      //naviagtes to "Did you use G-Invoicing for your funding request?"
      cy.verifyPageHeader("Did you use G-Invoicing for your funding request?");
    } else {
      //navigate to "Let’s gather info about your MIPR"
      cy.verifyPageHeader("Let’s gather info about your MIPR");
    }
  });
});
Cypress.Commands.add("clickSomethingElse", (selectorToScrollToAfter) => {
  cy.findElement(common.somethingElse)
    .scrollIntoView()
    .should("be.visible")
    .click({ force: true });
  if (selectorToScrollToAfter) {
    cy.findElement(selectorToScrollToAfter)
      .scrollIntoView()
      .should("be.visible");
  }
});

Cypress.Commands.add("notAvailableCategory", (categoryText) => {
  cy.textExists(performanceReqs.showMoreLink, " Show more ")
    .click()
    .then(() => {
      cy.findElement("#OtherAvlGroups .h3")
        .each(($el) => {
          const text = $el.text();
          cy.log(text);
        })
        .should("not.contain", categoryText);
    });
});

Cypress.Commands.add("otherAvailableCategory", (categoryText) => {
  cy.findElement("#OtherAvlGroups .h3")
    .each(($el) => {
      const text = $el.text();
      cy.log(text);
    })
    .should("contain", categoryText);
});

// This command is  used to select G-invoice for your funding request
Cypress.Commands.add("selectGInvoiceFRequest", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(fd.gInvoiceActiveRadioOption).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    const gInvoiceYesOption =
      "radio_button_checkedYes." +
      " My General Terms & Conditions (GT&C) and Order are in G-Invoicing.";
    if (selectedOption === gInvoiceYesOption) {
      const orderNo =
        "This is a 20-character value (including hyphens)" +
        " generated by G-Invoicing. You may also enter 22 characters" +
        " (including a period and digit at the end) to reference the version number.";
      //"Displays OrderNumber"
      cy.textExists(fd.gInvoiceOrderNo, " Order Number ");
      cy.findElement(fd.orderNoSearchInput).should("be.visible");
      cy.hoverToolTip(fd.orderNoTooltipBtn, fd.orderNoTooltipText, orderNo);
    } else {
      cy.findElement(fd.orderNoSearchInput).should("not.be.visible");
    }
  });
});

Cypress.Commands.add("incrementalFundingExists", () => {
  cy.findElement(common.wrap).then((main) => {
    if (main.find("#IncrementPeriod1_dropdown_field_control").length > 0) {
      cy.log("IncrementPeriod1 FOUND");
      cy.findElement(fd.deleteBtn0).should("exist").and("not.be.disabled");
      cy.findElement(fd.deleteBtn1).should("exist").and("not.be.disabled");
    } else {
      cy.log("IncrementPeriod1 NOT FOUND!");
      cy.findElement(fd.deleteBtn0).should("exist").and("be.disabled");
    }
  });
});

Cypress.Commands.add(
  "financialPOCAffiliation",
  (selector, value, sbSelector) => {
    cy.radioBtn(selector, value).click({ force: true });
    cy.findElement(fd.contactRadioBtnActive).then(($radioBtn) => {
      cy.log($radioBtn.text());
      const selectedOption = $radioBtn.text();
      if (selectedOption === "radio_button_checkedMilitary") {
        cy.findElement(contact.serviceBranchControl)
          .should("exist")
          .and("be.visible")
          .and("contain", " Service Branch ");
        cy.findElement(contact.serviceBranchDropDownIcon).click({
          force: true,
        });
        cy.findElement(sbSelector)
          .click()
          .then(() => {
            cy.findElement(contact.rankAutoCompleteWrapper)
              .should("exist")
              .and("be.visible")
              .and("contain", "Rank");
          });
      }
      if (selectedOption === "radio_button_checkedCivilian") {
        cy.findElement(contact.salutationDropDownLabel)
          .should("exist")
          .and("be.visible")
          .and("contain", "Salutation");
        cy.findElement(contact.serviceBranchControl)
          .should("exist")
          .and("not.visible");
      }
    });
  }
);

Cypress.Commands.add("selectIncrementalFundingPlan", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(fd.iFundActiveBtn).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    const ifpYesOption =
      "radio_button_checkedYes." +
      " I need to provide an incremental funding plan.";
    cy.btnClick(common.continueBtn, " Continue ");
    if (selectedOption === ifpYesOption) {
      cy.verifyPageHeader(
        "Let’s create an incremental funding plan for your base period"
      );
    } else {
      cy.textExists("div.mb-auto", "future summary page");
    }
  });
});

//This Command is used  to select the Exisitng Environment
Cypress.Commands.add("selectExistingEnv", (radioSelector, value) => {
  cy.radioBtn(radioSelector, value).click({ force: true });
  cy.findElement(background.ceActiveRadioOption).then(($radioBtn) => {
    const selectedOption = cleanText($radioBtn.text());
    cy.log(selectedOption);
    cy.btnClick(common.continueBtn, " Continue ");
    const yesLabel = "radio_button_checkedYes.";
    if (selectedOption === yesLabel) {
      //naviagtes to "where is your Current Environment located?"
      cy.verifyPageHeader(
        "Do you have system diagrams, data architecture diagrams, charts," +
          " or other relevant information for your current environment?"
      );
    } else {
      //navigate to "Future Summary Page"
      cy.textExists("div.mb-auto", "Future Summary page");
    }
  });
});

Cypress.Commands.add(
  "deleteRequirement",
  (deleteSelector, titleTxt, deleteBtnText) => {
    cy.findElement(deleteSelector)
      .click()
      .then(() => {
        cy.findElement(performanceReqs.dialogModal).should("be.visible");
        cy.textExists(performanceReqs.dialogTitle, titleTxt);
        cy.btnExists(performanceReqs.deleteInstBtn, deleteBtnText)
          .click()
          .then(() => {
            cy.findElement(performanceReqs.dialogModal).should("not.visible");
          });
      });
  }
);

Cypress.Commands.add("EditRequirement", (editSelector, text) => {
  cy.findElement(editSelector).click();

  cy.verifyPageHeader(" Let’s gather some details for " + text);
});

Cypress.Commands.add("addAnotherRequirement", (addSelector, text) => {
  cy.findElement(addSelector).click();
  cy.verifyPageHeader(" Let’s gather some details for " + text);
});

Cypress.Commands.add("waitUntilElementIsGone", (selector) => {
  cy.waitUntil(() => Cypress.$(selector).length === 0);  
},{timeout:2000});
