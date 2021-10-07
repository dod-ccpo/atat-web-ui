import SigninPage from '../pageObjects/SigninPage'
import DashBoardPage from '../pageObjects/DashBoardPage'
import ProfilePage from '../pageObjects/ProfilePage'


describe('TestSuite to Verify the Assertions for all pages', function () {
    const signin = new SigninPage()
    const dashboard = new DashBoardPage()
    const profile = new ProfilePage()

    before(() => {
        cy.clearCookies()
    });
    beforeEach(() => {

        signin.navigate()
    })
    after(() => {

        dashboard.logout().click()
    })

    it('Testcase:1:Assertions on ATAT Homepage', function () {

        signin.classificationBanner().should('be.visible')
        signin.classificationBannerText()
        signin.howYouKnowText()
            .should('be.visible').click()
        signin.bannerOne()
        signin.bannerTwo()
        signin.howYouKnowText().should('be.visible').click()
        signin.atatImage()
            .should('be.visible')
            .should('have.attr', 'alt', 'ATAT logo')
        signin.ccpologo()
            .should('be.visible')
            .should('have.attr', 'alt', 'CCPO logo')
        signin.certSelectionTex().should('have.text', 'Certificate Selection')
        const options = { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
        const dateTimeStr = new Date().toLocaleDateString("en-US", options) + ' -04:00';
        signin.lastLoginFooter()
            .should('contain', 'Last login: ' + dateTimeStr)

        signin.signInBtn().click()
        cy.url().should('include', '/dashboard')
    });

    it('Testcase2:Assertions on DashBoardpage', () => {
        signin.signInBtn().click()
        cy.url().should('include', '/dashboard')
        dashboard.userNameTab('Maria Missionowner').should('exist')
        dashboard.supportTab().should('exist')
        dashboard.logout().should('exist')
        dashboard.welcomeText().should('contain.text', 'ATAT Cloud Services')
        cy.scrollTo('bottom')
        dashboard.getStarted().should('exist').click()
    })

    it('TestCase3:Assertions on Name Sidebar', () => {
        signin.signInBtn().click()
        dashboard.userNameTab('Maria Missionowner').click()
        dashboard.profileText().should('have.text', 'YOUR PROFILE')
        dashboard.profileName().should('contain.text', 'Maria Missionowner')
        dashboard.linkOne().click()
        dashboard.textUnderLinkOne().should('contain.text', 'We will send email notifications')
        dashboard.linkTwo().click()
        cy.scrollTo('bottom')
        dashboard.textUnderLinkTwo().should('contain.text', 'ATAT uses Global Directory for CAC authentication.')
        dashboard.closeIcon().click()
    })
    it('TestCase4:Assertions on Profile', () => {
        signin.signInBtn().click()
        dashboard.userNameTab('Maria Missionowner')
        dashboard.getStarted().should('exist').click()
        cy.url().should('include', '/profile')

        profile.profileInfoHeader()
        profile.idCardLink().should('exist')
        profile.basicInformationTitle()
        profile.basicInformationCardText().should('contain', 'Name')
            .and('contain', 'Title')
            .and('contain', 'DoD ID')
            .and('contain', 'Service Branch or Agency')
            .and('contain', 'Persona Type')
        profile.contactinformationTitle()
        profile.contactinformationCardText().should('contain', 'Email Address')
            .and('contain', 'Phone Numbers')
        profile.continueBtn().click()
    })
});
