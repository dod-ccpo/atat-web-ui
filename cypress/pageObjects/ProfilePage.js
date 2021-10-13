/// <reference types="cypress" />

class ProfilePage {
  profileInfoHeader() {
    return cy
      .get(".mt-7")
      .contains("First, let’s verify your profile information");
  }

  idCardLink() {
    return cy.get(".link-body-md");
  }
  basicInformationTitle() {
    return cy
      .get(":nth-child(4) > .v-card__title")
      .contains("Basic Information");
  }
  basicInformationCardText() {
    return cy.get(":nth-child(4) > .v-card__text");
  }
  contactinformationTitle() {
    return cy
      .get(":nth-child(5) > .v-card__title")
      .contains("Contact Information");
  }
  contactinformationCardText() {
    return cy.get(":nth-child(5) > .v-card__text");
  }
  continueBtn() {
    return cy.contains("button", "Continue");
  }
}
export default ProfilePage;
