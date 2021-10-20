/// <reference types="cypress" />
import SignInpage from '../../pageObjects/SignInPage'
import DashBoardPage from "../../pageObjects/DashBoardPage";
import ProfilePage from "../../pageObjects/ProfilePage";
import StepOnePage from '../../pageObjects/StepOne';

    it('All the Assertions on StepOne:Create Portfolio view', () => {
        const signin = new SignInpage
        const dashboard = new DashBoardPage
        const profile = new ProfilePage
        const stepone = new StepOnePage
        

        signin.navigate()
        signin.signInBtn().should('be.visible')
        //signin.signInBtn().click()  
        const url = Cypress.env("localUrl")
        cy.visit(url + "dashboard")
        cy.wait(1000)
        cy.url().should('include', '/dashboard')
        dashboard. getStarted().click()
        cy.url().should('include', '/profile')
        profile.continueBtn().click()
        cy.url().should('include', '/createportfolio')
        cy.get('#btn-create-new-portfolio').contains(' Create a New Portfolio').click()
        cy.url().should('include', '/wizard/')
        stepone.stepperWizard()
        stepone.stepOneHeaderText().should('contain.text',"1  of 5 Create Portfolio")
        stepone.portfolioDetailsText().should('contain.text', "Portfolio Details")
        stepone.portfolioNameTextBox().should('be.empty')
        stepone.portfolioDescTextBox().should('be.empty')
        stepone.dodComponentHeaderText().should('contain.text','Select DoD component(s) funding your Portfolio')
        stepone.dodComponent().should('have.length', 11).should('not.be.checked')
        stepone.cspLabelText().should('contain.text', " Cloud Service Provider ")
        stepone.cspRadioOptions().should('have.length', 2)
        stepone.nextAddToBtn().should('contain.text','Next: Add Task Order ')
        stepone.saveAndCloseBtn().should('contain.text', 'Save and Close')




    })
