/// <reference types="cypress" />

class StepOnePage {

    stepperWizard() {
        return cy.get('div.v-stepper.wizard-stepper')
            .contains('1 Create Portfolio 2 Add Funding 3 Add Application 4 Add Team Members 5 Review and Submit')
    }
    stepOneHeaderText() {
       return cy.get('div.step-of-pages-control.col.col-12')
    }

    portfolioDetailsText() {
        return cy.get('h2.h2')
    }
    portfolioNameTextBox() {
        return cy.get('#portfolio-name_text_field')
    }
    portfolioDescTextBox() {
        return cy.get('#portfolio-description_text_field')
    }
    dodComponentHeaderText() {
        return cy.get('div.h5.mt-6')
    }
    dodComponent() {
        return cy.get('.atat-checkbox-list')
            
    }
    cspLabelText() {
        return cy.get("h3.mb-2")
    }
        
    cspRadioOptions() {
        return cy.get('#atat-button-cards .radio-wrapper')
        
    }
    nextAddToBtn() {
        return cy.get('#step_1_navbtn_add_funding')
    }
    saveAndCloseBtn() {
        return cy.get('#step_1_navbtn_save_and_close')
    }
    //random generator for portfolioname
    randomportfolioname() {
        var text = "";
        var possible = "ABCDEFGHIJK0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}
 
export default StepOnePage