/// <reference types="cypress" />

class DashBoardPage {
  userNameTab(name) {
    return cy.get("#atat-header-nav__user-display-name").contains(name);
  }

  supportTab() {
    return cy.get("#atat-header-nav__support").contains("Support");
  }
  logout() {
    return cy.get("#atat-header-nav__logout").contains("Logout");
  }
  getStarted() {
    return cy.get(".ml-auto").contains("Get Started");
  }
  welcomeText() {
    return cy.get(".mb-5");
  }
  profileText() {
    return cy.get("div.font-weight-bold").contains("YOUR PROFILE");
  }
  profileName() {
    return cy.get("div.ml-4.pb-0");
  }
  linkOne() {
    return cy
      .get("div.row.ma-0 span.link-body-md")
      .contains("How will my contact information be used?");
  }
  textUnderLinkOne() {
    return cy.get("div.row.ma-0 div.v-card__text.h6.pb-0");
  }

  linkTwo() {
    return cy
      .get("div.row.ma-0.mb-3 span.link-body-md")
      .contains("Why can’t I update my profile in ATAT?");
  }

  textUnderLinkTwo() {
    return cy.get('.mb-3 > .ml-6 > [style=""] > .v-card__text > .row > .mt-3');
  }
  closeIcon() {
    return cy.get("#drawerCloser");
  }
}
export default DashBoardPage;
