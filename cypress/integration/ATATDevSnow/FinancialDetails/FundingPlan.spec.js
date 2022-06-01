import { bootstrapMockApis,cleanText} from "../../../helpers";
import common from "../../../selectors/common.sel";
import fd from "../../../selectors/financialDetails.sel"

describe("Test suite: Financial Details Step: Funding Plan substep", () => {


  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
        
  });
    
  it("TC1: Funding Plan on the Vertical Stepper is active", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();
    cy.activeStep(common.stepFinancialDetailsText);
    cy.activeStep(common.subStepFundingPlanText);         
      
  });
  
  it("TC2: Upload a file", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();;
    cy.verifyPageHeader("Upload your MIPR");
    
    const expectedBody = "Drag and Drop" +
      " your file here or browse to upload" +
      " Use a PDF file with a max size of 1 GB."
    cy.findElement(fd.fileUploadSection).then(($el) => {
      let actualTxt = $el.text();
      cy.log(actualTxt);
      const formattedTxt = cleanText(actualTxt)
      expect(formattedTxt).equal(expectedBody);
    });
    cy.textExists(fd.uploadLink, " browse to upload ");
    const filepath = "files/dd1155.pdf"
    cy.findElement('input[type="file"]').attachFile(filepath);
    cy.findElement(fd.fundingfileupload).click({ force: true }).then(() => {
      cy.findElement(fd.uploadedFile0Link).should("exist")
        .and("contain.text", "dd1155.pdf");
      cy.findElement(fd.uploadedFile0RemoveBtn).should("exist")
        .and("contain.text", "Remove");
    });    
    const filetwo="files/Requirements Checklist-DISA.pdf"
    cy.findElement('input[type="file"]').attachFile(filetwo);
    cy.findElement(fd.fundingfileupload).click({ force: true });
  });
  
  it("TC3: Validations", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();;
    cy.verifyPageHeader("Upload your MIPR");
    // upload file that is not pdf or excel
    const filepath = "files/textfile.txt"
    cy.findElement('input[type="file"]').attachFile(filepath);
    cy.findElement(fd.fundingfileupload).click({ force: true }).then(() => {
      cy.checkErrorMessage(
        fd.fundingfileuploadError,
        "'textfile.txt' is not a valid format or has been corrupted." +
        " Please upload a valid .xlsx, .xls or .pdf file.");
    });
    //attach invalid files  at the same time
    const file2 = "files/testforfileupload.docx"
    cy.findElement('input[type="file"]').attachFile(file2, filepath);
    cy.findElement(fd.fundingfileupload).click({ force: true }).then(() => {
      cy.checkErrorMessage(
        fd.fundingfileuploadError,
        "'textfile.txt' is not a valid format or has been corrupted." +
        " Please upload a valid .xlsx, .xls or .pdf file.");
      cy.checkErrorMessage(
        fd.fundingfileuploadError,
        "'testforfileu...oad.docx' is not a valid format or has been corrupted." +
        " Please upload a valid .xlsx, .xls or .pdf file.");
      
    });
  });

  it("TC4: Remove: Uploaded file", () => {
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();;
    cy.verifyPageHeader("Upload your MIPR");    
    const filepath = "files/dd1155.pdf"
    cy.findElement('input[type="file"]').attachFile(filepath);
    cy.findElement(fd.fundingfileupload).click({ force: true })
    cy.findElement(fd.uploadedFile0RemoveBtn).should("exist")
      .and("contain.text", "Remove");
    //click on Remove button
    cy.textExists(fd.uploadedFile0RemoveBtn, "Remove").click().then(() => {
      cy.findElement(fd.uploadedFile0Link).should("not.exist");
      
    })
  });
  
  it("TC5: Upload file with drag and drop mode", () => {
    cy.hopOutOfIframe(true, true);
    cy.clickSideStepper(common.stepFinancialDetailsLink, " Financial Details ");
    //Verify the Substeps are  visible
    cy.textExists(common.subStepFundingPlanText, " Funding Plan ").click();;
    cy.verifyPageHeader("Upload your MIPR");
    const file = "files/Test.xlsx"
    cy.findElement('input[type="file"]').attachFile(file,{ action: 'drag-drop' });
    cy.findElement(fd.fundingfileupload).click({ force: true })
    cy.findElement(fd.uploadedFile0RemoveBtn).should("exist")
      .and("contain.text", "Remove");
    //click on Remove button
    cy.textExists(fd.uploadedFile0RemoveBtn, "Remove").click().then(() => {
      cy.findElement(fd.uploadedFile0Link).should("not.exist");
      
    })
  });

});