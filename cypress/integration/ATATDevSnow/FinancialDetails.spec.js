// it.skip("TC4: Surge Capabilities-Asserts and Validations Tell us more about the scope of your project", () => {

    //     cy.fillNewAcquisition(projectDetails.projectTitle + "001", projectDetails.scope)
    //     // Navigates to "Tell us more about the scope of your project"
    //     cy.textExists(common.header, "Tell us more about the scope of your project");
        
    //     //Label of the view
    //     cy.textExists(financialDetails.surgeCapabilitiesTxt, "Surge Capabilities");
        
    //     // ContractPricePercentage text
    //     cy.textExists(financialDetails.contractPriceTxt," If surge capabilities are required, what percentage of the contractor’s total proposed price will not be exceeded? ");
        
    //     //Enter the aplha numeric value to validate the error message 
    //     cy.fillSurgeCapabilities(projectDetails.invalidTextContractPercentage);   
        
    //     //Enter the value more than 50  to validate the error message
    //     cy.fillSurgeCapabilities(projectDetails.invalidTextContractPercentage);    
        
    //     //Enter the value more than 50  to validate the error message
    //     cy.fillSurgeCapabilities(projectDetails.invalidLessNumericContractPercentage);

    //     //buttons that exists on the view
    //     cy.btnExists(common.continueBtn, " Continue ");
    //     cy.btnExists(common.backBtn, "Back");
        
    //     //Enter the Valid Percentage
    //     cy.fillSurgeCapabilities(projectDetails.validContractPercentage,"continue");
    // });


// cy.fillSurgeCapabilities(projectDetails.validContractPercentage, "continue");
