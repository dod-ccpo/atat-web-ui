import { bootstrapMockApis, randomString} from "../../../helpers";
import common from "../../../selectors/common.sel";
import ps from "../../../selectors/portfolioSummary.sel"

describe("Test suite: Portfolio info Drawer", () => {
  
  
  const title = "“Mock Title”";
  const fName = randomString(4);
  const lName = randomString(4);
  const email = (fName + "." + lName + "-ctr@mail.gov").toLowerCase();

  beforeEach(() => {
    bootstrapMockApis();
    cy.launchATAT();
    cy.textExists(common.portfolioBtn, "Portfolios").click();
    const portfolioName = "Mock Title"
    cy.findElement(ps.headerPortofilioTextfield).should("have.value", portfolioName);
    cy.findElement(ps.infoBtn).click().then(() => {
      cy.findElement(ps.slideoutPanel).should("be.visible");
      cy.textExists(ps.aboutPortHeader, "About Portfolio");
    });
  });
    
  it("TC1: Rename the portfolio description in info drawer", () => {
    const descValue = "Mock Description"
    const editdescText = "Edit Mock Description"
    cy.editInputField(
      ps.descriptionTextArea,
      descValue,
      editdescText,
      editdescText
    );
    cy.textExists(ps.statusLabel, "Status");
    cy.verifyHasText(ps.statusChip);
    cy.textExists(ps.cspLabel, "Cloud Service Provider");
    cy.verifyHasText(ps.cspName);
    cy.textExists(ps.serviceAgencyLabel, "Service/Agency");
    cy.verifyHasText(ps.serviceAgencyName);
    cy.textExists(ps.createdbyLabel, "Created by");
    cy.verifyHasText(ps.createdbyName);
    cy.textExists(ps.portMemTitle, "Portfolio members");
    cy.textExists(ps.portMemCount, 1);
    cy.findElement(ps.lastManager).should("exist");

  });

  it("TC2: Add portfolio member in info drawer", () => {
  
    cy.textExists(ps.portMemTitle, "Portfolio members");
    cy.textExists(ps.portMemCount, 1);
    //click on Add Member Icon
    cy.findElement(ps.addPortMemIcon).click().then(() => {
      cy.dialogModalExist(
        ps.addMemModal,
        ps.addMemTitle,
        " Invite people to" + " " + title);
      
      cy.findElement(ps.emailInputbox).type(email);
      cy.dropDownClick(ps.modalRoleDropdownIcon);
      cy.findElement(ps.roleDropdownManager).click();
      cy.clickBtnOnModal(common.commonOkBtn, "Invite", "1 member added");
      cy.textExists(ps.portMemCount, 2);
      cy.textExists(ps.memName1, email);
      cy.findElement(ps.lastManager).should("not.exist");
      
    });
  });

  it("TC3: Edit the portfolio member role in info drawer", () => {
  
    cy.textExists(ps.portMemTitle, "Portfolio members");
    cy.textExists(ps.portMemCount, 1);
    //click on Add Member Icon
    cy.findElement(ps.addPortMemIcon).click().then(() => {
      cy.dialogModalExist(
        ps.addMemModal,
        ps.addMemTitle,
        " Invite people to" + " " + title
      );      
      cy.findElement(ps.emailInputbox).type(email);
      cy.clickRoleDropdown(
        ps.modalRoleDropdownIcon,
        ps.roleDropdownManager
      );
      cy.clickBtnOnModal(common.commonOkBtn, "Invite", "1 member added");
      cy.textExists(ps.portMemCount, 2);
      cy.textExists(ps.memName1, email);
      //Change role for the existing member
      cy.clickRoleDropdown(ps.role0Dropdown, ps.role0Viewer).then(() => {
        cy.verifyTextMatches(ps.activeRole0, "Viewer");
      });
  
    });
  });

  it.only("TC4: Remove the portfolio member role in info drawer", () => {
  
    cy.textExists(ps.portMemTitle, "Portfolio members");
    cy.textExists(ps.portMemCount, 1);
    //click on Add Member Icon
    cy.findElement(ps.addPortMemIcon).click().then(() => {
      cy.dialogModalExist(
        ps.addMemModal,
        ps.addMemTitle,
        " Invite people to" + " " + title);        
      cy.findElement(ps.emailInputbox).type(email);
      cy.clickRoleDropdown(
        ps.modalRoleDropdownIcon,
        ps.roleDropdownViewer
      );
      cy.clickBtnOnModal(common.commonOkBtn, "Invite", "1 member added")
      cy.textExists(ps.portMemCount, 2);
      cy.textExists(ps.memName1, email);
      cy.verifyTextMatches(ps.activeRole1, "Viewer");
      cy.clickRoleDropdown(ps.role1Dropdown, ps.role1Remove);
      cy.dialogModalExist(
        ps.removememModal,
        ps.removeModalTitle,
        "Remove" + " " + email + " " + "from portfolio?");
      cy.clickBtnOnModal(
        ps.removememModal,
        " Remove member ",
        "Access removed"
      ); 
      //Member count goes down
      cy.textExists(ps.portMemCount, 1);
    
    });
  });  
  
  it("TC5: About roles in info drawer", () => {
  
    cy.textExists(ps.portMemTitle, "Portfolio members");
    cy.textExists(ps.portMemCount, 1);
    //click on Add Member Icon
    cy.findElement(ps.addPortMemIcon).click().then(() => {
      cy.dialogModalExist(
        ps.addMemModal,
        ps.addMemTitle,
        " Invite people to" + " " + title
      );        
      cy.findElement(ps.emailInputbox).type(email);
      cy.clickRoleDropdown(
        ps.modalRoleDropdownIcon,
        ps.roleDropdownViewer
      );
      cy.clickBtnOnModal(common.commonOkBtn, "Invite", "1 member added")
      cy.textExists(ps.portMemCount, 2);
      cy.textExists(ps.memName1, email);
      cy.verifyTextMatches(ps.activeRole1, "Viewer");
      cy.clickRoleDropdown(ps.role1Dropdown, ps.role1AboutRoles);
      cy.slideoutPanel(
        common.slidePanel,
        common.slidePanelHeader,
        "Learn More",
        common.panelTitle,         
        "Learn more about portfolio roles",          
      );                
    
    });
  });  
});
