import {
    colors, randomNumber,randomString,formatDateInMMDDYYYY
    } from "../../../helpers";    
    import background from "../../../selectors/background.sel";   
    import common from "../../../selectors/common.sel";    
    import "./02ExceptionToFairOpportunity.cy.js";
    
    
    describe("Test suite: E2E-Procurement History with J&A", () => {
    
        //Selection of Exception to Fair Opp,change this option in 02ExceptionToFairOpportunity file
        const fairOpp = "YES_FAR_16_505_B_2_I_C"; //YES_FAR_16_505_B_2_I_A//YES_FAR_16_505_B_2_I_B//YES_FAR_16_505_B_2_I_C;        
    
        //select Previous contract as Yes or No
        let previousContract = "Yes"; // Yes or No

        //Contract Overview
        const contractNo = randomNumber(13);
        const taskOrderNo = randomNumber(13);
        const competitiveStatusOptions ="otherThanFull";//fullOpen,sbSetAside,otherThanFull
        
        //Period of Performance(POP)
        const dayOfMonth = "11";
        

        //Contractor Details
        const cName = "testContractName-"+ randomString(3)
        const businessSizeOption = "large" //large,small,smallBA,hubZone,sdvosb,wosb;

        //procurement History Summary
        const date =new Date();
        const dayOfMonthFormatted = formatDateInMMDDYYYY(date,11,"previous");
        const expiredDateFormatted  = formatDateInMMDDYYYY(date,11,"next");
        const expectedPOP = dayOfMonthFormatted + " - " + expiredDateFormatted;
        const expectedProcurementHistoryData=[        
        [ cName, contractNo, taskOrderNo, expectedPOP]
        ]
        console.log('Expected Procurement History Data:', expectedProcurementHistoryData);
    before(() => {
            
        cy.findElement(common.stepBackgroundText)
            .should("be.visible")        
            .and("contain",  " Background ")
            .click().then(()=>{
                cy.waitUntil(function () {
                    return cy.findElement(common.stepBackgroundText).should("have.css", "color", colors.primary);
                });
        });        

        });
    function contractOverview(contractNo,taskOrderNo){
        cy.enterTextInTextField(background.contractNoTxtBox,contractNo);
        cy.enterTextInTextField(background.taskOrderNumberTxtBox,taskOrderNo);
        const competitiveStatusMap ={
            fullOpen:background.fullRadioOption,
            sbSetAside:background.sbSetAsideRadioOption,
            otherThanFull:background.otherThanRadioOption
        }
        cy.findElement(competitiveStatusMap[competitiveStatusOptions]).click({force:true});
    };

    function popStartEndDate(dayOfMonth){
        cy.selectDatefromDatePicker(
            background.startDatePickerBtnIcon,
            background.startDatePreviousMonth,
            background.selectDate,
            dayOfMonth,
            background.startDatepicker
        );       

        cy.selectDatefromDatePicker(
            background.expirationDatePickerIcon,
            background.navigateNextMonth,
            background.selectDate,
            dayOfMonth,
            background.expirationDatePicker
        );
        
        };

    function contractorDetails(cName){
        cy.enterTextInTextField(background.incumbentTxtBox,cName);
        const businessSizeOptionMap ={
            large:background.largeRadioOption,
            small:background.smallRadioOption,
            smallBA:background.smallBARadioOption,
            hubZone:background.hubRadioOption,
            sdvosb:background.sdvobRadioOption,
            wosb:background.wosbRadioOption
            
        }
        cy.findElement(businessSizeOptionMap[businessSizeOption]).click({force:true});
        };

    it("TC:1 Procurement History", () => {     
        
        if (fairOpp === "YES_FAR_16_505_B_2_I_C") {    
        
        cy.clickAndWaitForVisible(common.substepProcurementText, background.addInstanceNoDataBtn);        
        cy.verifyPageHeader("Your Procurement History");                    
        cy.clickAndWaitForVisible(background.addInstanceNoDataBtn,background.contractOverviewTitle ); 
        cy.verifyPageHeader(
            "Let’s gather some details about your previous or current contract"
        );
        contractOverview(contractNo,taskOrderNo);            
        popStartEndDate(dayOfMonth);
        contractorDetails(cName);
        cy.clickContinueButton(
            background.incumbentTxtBox,
            "Your Procurement History"
        );
        
        } else if (fairOpp === "YES_FAR_16_505_B_2_I_A" || fairOpp === "YES_FAR_16_505_B_2_I_B") {                
            
            cy.verifyPageHeader("Do you have a current or previous contract for this effort?");
            if (previousContract === "Yes") {
                cy.findElement(background.ccYesRadioOption).click({ force: true });
                cy.clickContinueButton(
                    background.ccYesRadioOption,
                    "Let’s gather some details about your previous or current contract"
                );
            contractOverview(contractNo,taskOrderNo);            
            popStartEndDate(dayOfMonth);
            contractorDetails(cName);
            cy.clickContinueButton(
                background.incumbentTxtBox,
                "Your Procurement History"
            ) ;
            cy.verifyTableValues(background.procurementHistoryTable,expectedProcurementHistoryData,4);          
            }else{
                cy.findElement(background. ccNoRadioOption).click({ force: true });
                cy.clickContinueButton(
                    background.ccYesRadioOption,
                    "Do you have a current environment to rehost?"
                );
            }
        }
        });    
        
    
    });
    
    
    
    