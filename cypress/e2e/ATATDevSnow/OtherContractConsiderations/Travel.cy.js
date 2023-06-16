import {randomString,randomAlphaNumeric}from "../../../helpers";
import common from "../../../selectors/common.sel";
import occ from "../../../selectors/occ.sel";
import sac from "../../../selectors/standComp.sel"


describe("Test suite: OCC: Travel substep", () => {

    let pt = "TC-Step-6-OCC-Travel-" + randomAlphaNumeric(5);
    let scope = "OCC-PPS-" + randomString(5);
    const exText = randomString(10);
    let addTripDetails={
        tripLocTxt:"VA",
        durationValue:1,
        noOfTravelers:1,
        noOfTrips:1
    };
    let editTripDetails={
        tripLocTxt:"MD",
        durationValue:2,
        noOfTravelers:2,
        noOfTrips:2
    };
    const introMessage = "CSP employees may be required to travel in order to fulfill performance requirements,"+
    " such as training or advisory support services. Add details for each anticipated trip below,"+
    " and we’ll include them within your Description of Work. If you have travel requirements,"+
    " we’ll also walk you through gathering price estimates for your Independent Government Cost Estimate (IGCE) later."

    beforeEach(() => {
    
    cy. goToOCCStep(
        pt, 
        scope,
        occ.coiYesRadioOption,
        "YES",
        exText
    );
    cy.checkBoxOption(occ.contractorProviderCheckBox, "CONTRACTOR_PROVIDED").check({ force: true })
        .should("be.checked");
    cy.btnClick(common.continueBtn, " Continue ");    
    cy.waitUntilElementIsGone(occ.noneCheckBox);
    cy.verifyPageHeader(
        "Tell us about your travel requirements for contractor employees"
    );
    cy.verifyTextMatches(common.introMessage,introMessage);
    cy.verifyTextMatches(occ.noTravelMessage,"You do not have any travel requirements yet.");
    // Add a Trip
    cy.clickAddTripBtn(); 
    cy.enterTripDetails(addTripDetails);
    const expectedValues = ["1", "VA", "1 day", "1 traveler", "1 total", "Base",""]
    cy.columnRowsExists(occ.firstRow, expectedValues);       
        
    });
    it("TC1: Edit a Trip ", () => {             
        //edit the existing trip details
        cy.findElement(occ.editOne).click().then(()=>{
            cy.dialogModalExist(
                occ.travelDialog,
                occ.travelDialogTitle,
                "Add Trip Details"
            );           
            cy.enterTripDetails(editTripDetails);
            const expectedValues = ["1", "MD", "2 days", "2 travelers", "2 total (2 per period)", "Base",""]
            cy.columnRowsExists(occ.firstRow, expectedValues);   
        });
        cy.textExists(occ.dontNeedTravel, " I don’t need CSP employees to travel ")
        .click().then(()=>{
            cy.dialogModalExist(
                occ.deleteModal,
                occ.deleteModalTitle,
                "Delete trips"
            );   
            cy.findElement(occ.modalDeleteBtn).click();
            cy.waitUntilElementIsGone(occ.deleteModal);
            cy.verifyPageHeader(
                "Let’s find out if your project includes Personally Identifiable Information (PII)"
            );            
            
        });
    });
    it("TC2: Copy & Delete a Trip ", () => { 
    
        //copy the existing trip details
        cy.findElement(occ.copyOne).click().then(()=>{
            cy.getRowCount(occ.tablewrapper,2);            
        });
        //delete the copied trip details       
        cy.findElement(occ.deleteTwo).click().then(()=>{
            cy.dialogModalExist(
                occ.deleteModal,
                occ.deleteModalTitle,
                "Delete trip to VA?"
            );
            cy.findElement(occ.modalDeleteBtn).click();
            cy.findElement(occ.deleteModal).should("not.be.visible");            
            cy.getRowCount(occ.tablewrapper,1);       
            });
        cy.btnClick(common.continueBtn, " Continue ");
        cy.waitUntilElementIsGone(occ.addTrip);
        cy.verifyPageHeader(
                "Let’s find out if your project includes Personally Identifiable Information (PII)"
            );
        cy.btnClick(common.backBtn, "Back");
        cy.waitUntilElementIsGone(sac.yesPIIRadioOption);
        const expectedValues = ["1", "VA", "1 day", "1 traveler", "1 total", "Base",""]
        cy.columnRowsExists(occ.firstRow, expectedValues); 

    });  

});

