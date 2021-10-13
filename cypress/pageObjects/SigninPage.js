class SigninPage {
  navigate() {
    cy.visit(Cypress.env("baseURL"));
  }
  signInBtn() {
    return cy.get("#login_button").contains("Sign in");
  }
  classificationBanner() {
    return cy.contains(
      ".classification-banner",
      "Unclassified - Official Use Only"
    );
  }
  atatImage() {
    return cy.get("img.atat-nav-logo__icon");
  }
  classificationBannerText() {
    return cy
      .get("div.USWDC-official-banner__text.mr-3")
      .contains(" An official website of the United States government ");
  }
  howYouKnowText() {
    return cy.get("button").contains(" Here’s how you know ");
  }
  bannerOne() {
    return cy
      .get("div.USWDC-official-banner__col-01")
      .contains("Official websites use .mil");
  }
  bannerTwo() {
    return cy
      .get("div.USWDC-official-banner__col-02")
      .contains("Secure .mil websites use HTTPS");
  }
  ccpologo() {
    return cy.get("#atat-main-child-img");
  }
  certSelectionTex() {
    return cy.get("div.black--text.h3").contains("Certificate Selection");
  }
  lastLoginFooter() {
    return cy.get("footer.v-footer.atat-footer");
  }
}

export default SigninPage;
