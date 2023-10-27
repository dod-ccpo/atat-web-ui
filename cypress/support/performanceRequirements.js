import common from "../selectors/common.sel";
import performanceReqs from "../selectors/performanceReqs.sel";

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

Cypress.Commands.add(
  "durationPeriodExists",
  (radioSelector, activeSelector, periodLabelSelector, value) => {
    cy.radioBtn(radioSelector, value).click({
      force: true,
    });
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

Cypress.Commands.add("selectServiceOfferingGroup", (checkboxes, selector) => {
  cy.selectCheckBoxes(checkboxes);
  cy.btnClick(common.continueBtn, " Continue ");
  cy.waitUntilElementIsGone(selector);
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