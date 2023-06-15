import "cypress-iframe";
import "@4tw/cypress-drag-drop";
import "cypress-real-events/support";
import co from "../selectors/contractOffice.sel";
import common from "../selectors/common.sel";
import contractDetails from "../selectors/contractDetails.sel";
import { cleanText } from "../helpers";
import occ from "../selectors/occ.sel";
import "cypress-wait-until";


Cypress.Commands.add("goToAcqPackageStepOne",(pt, scope)=>{
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.selectDitcoOption(co.radioDITCO, "DITCO");
    cy.textExists(common.stepAcquisitionText, " Acquisition Package Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepProjectOverviewTxt, " Project Overview ");
    cy.fillNewAcquisition(pt, scope);
    cy.clickDevToggleBtn();       
    })

Cypress.Commands.add("goToContractDetailsStep",(pt, scope,radioSelector, value,input)=>{
    cy.goToAcqPackageStepOne(pt, scope)
    cy.clickSideStepper(common.stepContractDetailsLink, " Contract Details ");
    cy.activeStep(common.stepContractDetailsText);
    cy.verifyPageHeader(
        "Let’s gather details about the duration of your task order"
    );
    cy.findElement(contractDetails.addOptionLink).click();
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.baseInputTxtBox);
    cy.verifyPageHeader(" Do you want to request a PoP start date? ");
    cy.selectPoPStartDate(radioSelector, value)
    cy.waitUntilElementIsGone(contractDetails.popStartDateYesRadioOption);
    cy.verifyPageHeader("Will this be a recurring requirement?");
    cy.radioBtn(contractDetails.yesRadioOption, "YES")
        .not("[disabled]")
        .click({ force: true });
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.yesRadioOption);
    cy.verifyPageHeader("Which contract type(s) apply to this acquisition?");
    cy.findCheckBox(contractDetails.ffpCheckBox, "FFP")
        .should("not.be.checked")
        .check({ force: true });
    cy.selectTMCheckbox(input)
    cy.btnExists(common.continueBtn, " Continue ").not("[disabled]").click();
    cy.waitUntilElementIsGone(contractDetails.ffpCheckBox);
    cy.verifyPageHeader(
    " What classification level(s) will be required for your cloud resources and/or services? "
    );
    });

Cypress.Commands.add("goToOCCStep",(pt, scope,radioSelector, value,input)=>{
    cy.goToAcqPackageStepOne(pt, scope)
    cy.clickSideStepper(common.stepOCCLink, " Other Contract Considerations ");
    cy.activeStep(common.stepOCCText);
    cy.verifyPageHeader(
        "Do you have a potential Conflict of Interest (COI)?"
    );
    cy.selectCOIOption(radioSelector,value,input)
    })

Cypress.Commands.add("selectCOIOption", (radioSelector, value,exText) => {
    cy.radioBtn(radioSelector, value).click({ force: true });
    cy.findElement(occ.coiActiveRadioOption).then(($radioBtn) => {
        const selectedOption = cleanText($radioBtn.text());
        cy.log(selectedOption);            
        const yesCOIOption = cleanText("radio_button_checkedYes."+" There is a potential COI that may influence which CSP should be awarded this task order.")
        if (selectedOption === yesCOIOption) 
        {
            cy.findElement(occ.explanationLabelText).should("exist");
            cy.textExists(occ.explanationLabelText, "Please provide an explanation of your conflict of interest.");
            cy.enterTextInTextField(occ.explanationTextBox, exText);
    
        } else {
            cy.findElement(occ.explanationTxtFieldControl).should("not.exist")
        }
        cy.btnExists(common.continueBtn, " Continue ").click();
        cy.waitUntilElementIsGone(occ.coiNoRadioOption);
        cy.verifyPageHeader(
            "Do you need to include packaging, packing, or shipping instructions?"
            );
    });
    }); 

    Cypress.Commands.add(
        "ppsCheckBoxOptionSelected",
        (selector, value, otherTxt) => {
            cy.checkBoxOption(selector, value).check({ force: true });
            cy.findElement(occ.checkBoxActive).then(($checkedOption) => {
            const selectedOption = cleanText($checkedOption.text());
            const customCB="check_box Other - Write custom instructions"
            cy.log(selectedOption);
            if (selectedOption === customCB) {
                cy.log("display Other is selected:", selectedOption);
                cy.findElement(occ.otherTextBox).should("exist").and("be.visible");
                cy.enterTextInTextField(occ.otherTextBox, otherTxt);
            } else {
                cy.findElement(occ.otherTextBox).should("not.exist");
            }
            });
        }
    );
    
    Cypress.Commands.add("clickAddTripBtn", () => {
    cy.findElement(occ.addTrip).click()
        .then(()=>{
            cy.dialogModalExist(
                occ.travelDialog,
                occ.travelDialogTitle,
                "Add Trip Details"
            );
        cy.findElement(occ.modalAddBtn).should("have.class", occ.btnClassDisabled);
        });
        
    });
    
    Cypress.Commands.add("enterTripDetails", (tripDetails) => {
        cy.enterTextInTextField(occ.tripLocTxtField,tripDetails.tripLocTxt);
        cy.enterTextInTextField(occ.durationTxtField,tripDetails.durationValue);
        cy.enterTextInTextField(occ.noOfTravlers,tripDetails.noOfTravelers);
        cy.enterTextInTextField(occ.noOfTrips,tripDetails.noOfTrips);
        cy.findElement(occ.cbBasePeriod).check({ force: true })
        .should("be.checked").then(()=>{
            cy.findElement(occ.modalAddBtn).should("have.class", occ.btnClassenabled)
            .click().then(()=>{
                cy.findElement(occ.travelDialog)
                    .should("not.visible");
            }
            )
        })
        
    });
    Cypress.Commands.add('getRowCount', (selector,expectedLength) => {
        cy.findElement(selector + ' table tbody tr' ).then(($el) => {
            const length = $el.length;
            cy.log("length:", length)
            console.log("length:", length)
            expect(length).deep.equal(expectedLength);    
        });          
    });