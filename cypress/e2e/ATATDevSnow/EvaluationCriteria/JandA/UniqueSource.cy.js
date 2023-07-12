import {
    randomString,
    randomNumber,
    randomAlphaNumeric,
    cleanText
} from "../../../../helpers";
import fo from "../../../../selectors/fairOpportunityProcess.sel";


describe("Test suite: Unique Source", () => {

    const pt = "TC-Step-2-EvalCriteria-FairOpp-" + randomAlphaNumeric(5);
    const scope = "EvaluationCriteria-FairOpp-" + randomString(5);
    let oneCSP = "YES_FAR_16_505_B_2_I_B";
    let allFair = "YES_FAR_16_505_B_2_I_C";
    let urgent ="YES_FAR_16_505_B_2_I_A";
    let fairopp = urgent
    const costEstimateInputTxt = randomNumber(4);
    const estDelayVal="12"
    const csp = "AWS";
    const descJustifictionInput = "Tesing Restorebtn-"+randomString(3);
    let gcp="Google";
    const conTxt_A_B="Your explanation should clearly show that "+
    csp+
    " is the ONLY source capable of performing the required work."+
    " Do not indicate that your source is the “only known source” "+
    "unless you fully describe the process undertaken to make that "+
    "determination (including items such as “sources sought” "+
    "synopsis posted on the Federal Business Opportunities website.)";
    const ConTxt_C="Your explanation should clearly show that "+
    gcp +
    " is the ONLY source capable of performing the required work. "+
    "Do not indicate that your source is the “only known source” "+
    "unless you fully describe the process undertaken to make that determination"+
    " (including items such as “sources sought” synopsis posted on the Federal"+
    " Business Opportunities website.) Because you cited “logical follow-on” as the exception,"+
    " your explanation should quantify substantial duplication of cost and unacceptable delay."+
    " Be sure to include the following: Provide an estimate of the cost to the Government"+
    " that would be duplicative and explain how the estimate was derived."+
    " Supply rationale for unacceptable delays. Discuss why the requirement continues"+
    " and why it would be of benefit to the Government for "+
    gcp+
    " to continue work."+
    " Specify how recent the previous competitive order was issued and the number of "+
    "times this exception has been used. Discuss why the other Indefininte Delivery,"+
    " Indefinite Quantity (IDIQ) holders could not meet the stated requirement."



    beforeEach(() => {

        cy.goToECStep(pt, scope);

    });

    it("TC1: FAR 16.505(b)(2)(i)(A) or FAR 16.505(b)(2)(i)(B) ", () => {  
        //select radio option as OnlyOneCSPCapable        
        cy.selectFairOppRadioOption(fo.radioUrgent, "YES_FAR_16_505_B_2_I_A");
        cy.selectCSPSelctionOption(fo.buttonAWS);
        //navigates to Tell us about your minimum government requirements
        cy.clickContinueButton(
            fo.descJustifictionInput,
            "Tell us about your minimum government requirements"
        );
        cy.clickContinueButton(
            fo.minGovInput,
            "Let’s find out more about the cause of the sole source situation"
        );
        cy.radioBtn(fo.addTimeCostYesOption, "YES").click({
            force: true});
        cy.findElement(fo.estCostMigrateInput).clear().type(costEstimateInputTxt);
        cy.findElement(fo.estDelayProjectInput).clear().type( estDelayVal);            
        cy.radioBtn(fo.govEngineersNoOption, "NO").click({
            force: true
        });
        cy.radioBtn(fo.govEngineersNoOption, "NO").click({
            force: true
        });
        cy.clickContinueButton(
            fo.addTimeCostYesOption,
            "Let’s review the cause of your sole source situation"
            )
        cy.clickContinueButton(
            fo.soleSourceSitInputBox,
            "Why is "+csp+" the only source capable of meeting your requirements?"
        ) ;
        cy.clickContentLink();
        if(fairopp==urgent || oneCSP){
            cy.contains(fo.instructionContentText,conTxt_A_B);
        }
        cy.findElement(fo.instructionLink).click();
        cy.findElement(fo.descJustifictionInput).type(descJustifictionInput).click();
        cy.findElement(fo.restoreBtn).should("be.enabled").click()
            .then(()=>{
                cy.findElement(fo.uniqueModal).should("exist");
                cy.findElement(fo.restoreModalBtn).click({force: true});
                cy.findElement(fo.uniqueModal)
                .should("not.be.visible")
            });
            cy.findElement(fo.restoreBtn).should("not.enabled")
        

        });


        
    it("TC2:  FAR 16.505(b)(2)(i)(C) ", () => {
        //select radio option as OnlyOneCSPCapable        
        cy.selectFairOppRadioOption(fo.radioAllFair, allFair);
        cy.selectCSPSelctionOption(fo.buttonGCP);
        //navigates to Tell us about your minimum government requirements
        cy.clickContinueButton(
            fo.descJustifictionInput,
            "Tell us about your minimum government requirements"
        );
        cy.clickContinueButton(
            fo.minGovInput,
            "Let’s find out more about the cause of the sole source situation"
        );
        cy.radioBtn(fo.addTimeCostNoOption, "NO").click({
            force: true});        
        cy.radioBtn(fo.govEngineersNoOption, "NO").click({
            force: true
        });
        cy.radioBtn(fo.govEngineersNoOption, "NO").click({
            force: true
        });
        cy.clickContinueButton(
            fo.featureYesOption,
            "Tell us about the cause of your sole source situation"
        );
        cy.clickContinueButton(
            fo.soleSourceSitInputBox,
            "Why is "+gcp+" the only source capable of meeting your requirements?"
        );       
        cy.clickContentLink();
        cy.verifyTextMatches(fo.instructionContentText,cleanText(ConTxt_C));        
            
        })

    });
