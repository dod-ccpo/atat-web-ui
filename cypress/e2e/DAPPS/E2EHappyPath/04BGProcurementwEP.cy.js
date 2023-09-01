import {colors,randomString,randomNumber
} from "../../../helpers"
import background from "../../../selectors/background.sel";    
import common from "../../../selectors/common.sel";    
import "./02EvaluationPlan.cy.js";


describe("Test suite: E2E-Previous or Current Contract with EvaluationPlan", () => {    
    

    let currentContract = "Yes"; // Yes or No
    const incumbentCName = "IncumbentContractName- " + randomString(3);
    const contractNo = randomNumber(13);
    const taskOrderNo = randomNumber(13);
    const contractExpirationDate = 13

before(() => {           
        
        cy.findElement(common.stepBackgroundText)
        .should("be.visible")        
        .and("contain",  " Background ")
        .click().then(()=>{
            cy.waitUntil(function () {
                return cy.findElement(common.stepBackgroundText).should("have.css", "color", colors.primary);
            });
        });
    cy.waitUntil(() => cy.findElement(background.ccYesRadioOption).should("exist"));  
    
    })
it("TC:1 Current Contract", () => {       
        
    cy.verifyPageHeader("Do you have a current contract for this effort?");
    if (currentContract === "Yes") {
    cy.radioBtn(background.ccYesRadioOption, "YES").click({ force: true });
    cy.waitUntil(() => cy.findElement(background.ccYesRadioOption).should("be.checked"));
    cy.clickContinueButton(
    background.ccYesRadioOption,
    "Let’s gather some details about your previous or current contract"
    );
    cy.enterTextInTextField(background.incumbentTxtBox,incumbentCName);
    cy.enterTextInTextField(background.contractNoTxtBox,contractNo);
    cy.enterTextInTextField(background.taskDeliveryOrderNoTxtBox,taskOrderNo);
    cy.selectDatefromDatePicker(
        background.expirationDatePickerIcon, background.navigateNextMonth,
        background.selectDate, contractExpirationDate,background.expirationDatePicker
    );   
    cy.clickContinueButton(
        background.contractNoTxtBox,
        "Do you have a current environment to rehost?"
        );
    } else {
    cy.radioBtn(background.ccNoRadioOption, "NO").click({ force: true });
    cy.clickContinueButton(
    background.ccNoRadioOption,
    "Do you have a current environment to rehost?"
    );
    }
    
});     
    
})




