import { bootstrapMockApis,randomNumber} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fd from "../../../selectors/financialDetails.sel";

describe("Test suite: Funding Plan substep: MIPR work flow",  () => {

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT(true);
    cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();;
    cy.verifyPageHeader("What type of funding request did you use for this acquisition?");    
    cy.selectFundingRequest(fd.miprRadioBtn, "MIPR");
    cy.textExists(fd.miprTextLabel, " MIPR number ");
        
  }); 
  
  it("TC1: Enter details on MIPR screen", () => {
    const miprNumberValue= randomNumber(6)
    cy.enterTextInTextField(fd.miprTextbox, miprNumberValue);
    const filepath = "files/dd1155.pdf"
    const filepath1 = "files/Requirements Checklist-DISA.pdf"
    cy.findElement('input[type="file"]').attachFile(filepath,filepath1);
    cy.findElement(fd.fundingfileupload).click({ force: true });
    // Only one file should be displayed.
    cy.findElement('#File00').contains("dd1155.pdf")
      .and("not.contain", "Requirements Checklist-DISA.pdf");
    cy.btnClick(common.continueBtn, " Continue ");
    cy.verifyPageHeader(" Are you requesting to incrementally fund this requirement? ");
    
  });
  
  it("TC2: Validations: MIPR screen", () => {
    cy.verifyRequiredInput(
      fd.miprTextbox,
      fd.miprTextboxError,
      "Please enter the MIPR number located on your authorized DD Form 448."); 
    
    //If there is no file 
    cy.findElement(fd.fundingfileupload).focus().tab();
    cy.clickSomethingElse(fd.fundingfileuploadError,)
      .then(() => {
        cy.checkErrorMessage(
          fd.fundingfileuploadError,
          "You must include an authorized MIPR for this acquisition." +
          " Please upload your missing document, or" +
          " select Back to choose another method for transferring funds.");
      });
    
    // upload file that is not pdf
    const filepath = "files/textfile.txt"
    cy.findElement('input[type="file"]').attachFile(filepath);
    cy.findElement(fd.fundingfileupload).click({ force: true }).then(() => {
      cy.checkErrorMessage(
        fd.fundingfileuploadError,
        "'textfile.txt' is not a valid format or has been corrupted." +
        " Please upload a valid .xlsx, .xls or .pdf file.")
    });    
    const file2 = "files/testforfileupload.docx"
    cy.findElement('input[type="file"]').attachFile(file2);
    cy.findElement(fd.fundingfileupload).click({ force: true }).then(() => {
      cy.checkErrorMessage(
        fd.fundingfileuploadError,
        "'testforfileu...oad.docx' is not a valid format or has been corrupted." +
        " Please upload a valid .xlsx, .xls or .pdf file.");
    });  
    
  });

  it("TC3: Upload file with drag and drop mode & Remove Uploaded file", () => {
    //cy.hopOutOfIframe(true, true);
    //cy.homePageClickAcquisitionPackBtn();
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();
    cy.verifyPageHeader("What type of funding request did you use for this acquisition?");    
    cy.selectFundingRequest(fd.miprRadioBtn, "MIPR");
    const filepath = "files/dd1155.pdf"
    cy.findElement('input[type="file"]').attachFile(filepath);
    cy.findElement(fd.fundingfileupload).click({ force: true });
    cy.findElement('#File00').contains("dd1155.pdf");    
    cy.findElement(fd.uploadedFile0RemoveBtn).should("exist")
      .and("contain.text", "Remove");
    //click on Remove button
    cy.textExists(fd.uploadedFile0RemoveBtn, "Remove").click().then(() => {
      cy.findElement(fd.uploadedFile0Link).should("not.exist");      
    });
  });    

});