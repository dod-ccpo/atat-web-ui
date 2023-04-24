/* eslint-disable cypress/no-unnecessary-waiting */
import { bootstrapMockApis,cleanText} from "../../../helpers";
import common from "../../../selectors/common.sel";
import ps from "../../../selectors/portfolioSummary.sel";
import al from "../../../selectors/acquisitionList.sel";


describe("Test suite: List of Acquisitions packages", () => {
  
  let menus;
  
  beforeEach(() => {
    bootstrapMockApis();
    cy.fixture("navigationBarMenu").then((data) => {
      menus = data;
    });    

    cy.launchATAT(false);

    cy.dropDownClick(common.acquisitionsTab);       
    cy.textExists(common.myPackage, "My Packages").click();
    cy.textExists(ps.summaryHeader, "Acquisitions"); 
    cy.tabStatus(al.openPackTab, "true");
    cy.wait(2000);
    
  });

  it("TC1: Open Packages tab", () => {

    cy.verifyStringArray(ps.portHeadersTab, menus.acquisitions.acquisitionsTabs);
    cy.findElement(ps.searchWrapper).should("exist");
    cy.verifyAcquisitionCardDetails();
    cy.findElement(al.acquisitionStatusChip).each((card) => {
      const cardText = Cypress.$(card).text();
      const actualCard = cleanText(cardText);
      cy.log(actualCard);
    })
      .should("not.contain", "ARCHIVED")
      .and("not.contain", "TASK ORDER AWARDED");    
    
    //search Waiting for TaskOrder
    const searchForTaskOrder = {
      searchSelector: al.searchPackageInput,
      searchItem: "iota",
      searchBtn: al.searchBtn,
      searchResultSelector: al.packagecardName,
      searchResultListName: "Iota"
    }
    cy.searchList(searchForTaskOrder);    
    cy.verifyAcquisitionCardDetails();
    cy.findElement(al.card0MenuBtn).scrollIntoView().click()
      .then(() => {
        cy.verifyStringArray(
          al.card0menuList,
          menus.acquisitions.waitingForTaskOrderSubmenu
        );
      })
    cy.findElement(al.searchPackageInput).clear();
    
    //Search Waiting for Signature
    const searchForSignature = {
      searchSelector: al.searchPackageInput,
      searchItem: "Epsilon",
      searchBtn: al.searchBtn,
      searchResultSelector: al.packagecardName,
      searchResultListName: "Epsilon"
    };
    cy.searchList(searchForSignature);  
    cy.verifyAcquisitionCardDetails();
    cy.findElement(al.card0MenuBtn).click().then(() => {
      cy.verifyStringArray(
        al.card0menuList,
        menus.acquisitions.waitingForSigSubmenu
      );
    });

  });

  it("TC2: Acquisitions Package list sorts", () => {

    cy.dropDownClick(al.packageSortDropdown).then(() => {
      cy.findElement(al.packageSortListItems).should("be.visible");
      const sortDropdownItems = [
        "Package name A-Z",
        "Recently modified"
      ]
      cy.verifyStringArray(
        al.packageSortListItems,
        sortDropdownItems
      );
    });
    
    let acquisitionLists = [];  
    let alphaSortedacquisitionLists = [];
    cy.findElement(al.packagecards).each(($el, index) => {
      acquisitionLists[index] = $el.text();
      cy.wrap(acquisitionLists);
    })
      .then(() => {
        alphaSortedacquisitionLists = acquisitionLists.sort();
        expect(acquisitionLists).to.deep.equal(alphaSortedacquisitionLists);
        
      });
    let lastModified=[]
    cy.dropDownClick(al.packageSortDropdown).then(() => {
      cy.findElement(al.recentlyModified).click();
      cy.wait(1000);
      cy.findElement(al.packagecards).each(($el, index) => {
        lastModified[index] = $el.text();
        cy.wrap(lastModified);          
      }).then(() => {       
        expect(lastModified).to.not.equal(acquisitionLists);
        
      })
    });
  }); 

  it("TC3: No Search results found", () => {

    const searchTextString = "“foo”";  
    const search = {
      searchInput: al.searchPackageInput,
      searchItem: "foo",
      searchBtn: al.searchBtn,
      noSearchResultHeader: ps.noSearchResultHeader,
      searchString: ps.searchString,
      searchText: searchTextString
    };    
    cy.noSearchResult(search);
    cy.textExists(ps.clearSearchBtn, "Clear search").click().then(() => {
      cy.findElement(ps.noSearchResultHeader).should("not.visible");
      cy.findElement(al.searchPackageInput).should('be.empty');
    });
    
  });  

  it("TC4:Archive Acquistion ", () => {    
    
    //search the Draft Menu 
    const search = {
      searchSelector: al.searchPackageInput,
      searchItem: "Alpha",
      searchBtn: al.searchBtn,
      searchResultSelector:al.packagecardName,
      searchResultListName: " Alpha Project "
    };
    cy.searchList(search);    
    cy.findElement(al.card0MenuBtn).click().then(() => {
      cy.verifyStringArray(al.card0menuList, menus.acquisitions.draftSubmenu);
      cy.findElement(al.archiveLink).click().then(() => {
        cy.dialogModalExist(
          al.archiveModal, al.archiveModaltitle,
          " Archive this acquisition package? "
        );
        cy.textExists(al.archiveBtn, " Archive ").click().then(() => {
          cy.dialogModalNotExist("Acquisition package archived");
          const searchTextString = "“Alpha”";               
          cy.textExists(ps.noSearchResultHeader, "No results");
          cy.textExists(ps.searchString, "for" + " " + searchTextString);
        });
        cy.tabStatus(al.archiveTab, "false").click();
        cy.verifyHasText("#StatusChip0").and("contain", "Archived");
        cy.findElement(al.card0MenuBtn).click().then(() => {
          cy.verifyStringArray(al.card0menuList, menus.acquisitions.archived);
          cy.findElement(al.restorePackage).click();
          cy.textExists(common.toastText, "Acquisition package restored to draft");
          cy.textExists(ps.noSearchResultHeader, "No results");
          cy.tabStatus(al.openPackTab, "false").click();
          cy.verifyHasText(al.statusChip0).and("contain", "Draft");
        });
      });
    });    

  });  

  it("TC5: Awarded task orders tab", () => {    
    
    cy.tabStatus(al.awardedTOTab, "false").click().then(() => {
      cy.tabStatus(al.awardedTOTab, "true");
    });
    cy.wait(1000);
    cy.verifyAcquisitionCardDetails();
    cy.findElement(al.acquisitionStatusChip).each((card) => {
      const cardText = Cypress.$(card).text();
      const actualCard = cleanText(cardText);
      cy.log(actualCard);
    })
      .should("contain","Task Order Awarded")
      .and("not.contain", "Archived")
      .and("not.contain", "Waiting for Task Order")
      .and("not.contain", "Waiting for Signatures")
      .and("not.contain", "Draft");
    cy.verifyAcquisitionCardDetails();
  });
  
  it("TC6: All packages tab", () => {

    cy.tabStatus(al.allPackageTab, "false").click().then(() => {
      cy.tabStatus(al.allPackageTab, "true");
    });
    cy.wait(1000);
    cy.findElement(al.searchPackageInput).should("exist").type("aa");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.findElement(al.searchBtn).should("exist").click().wait(1000).then(() => {
      cy.findElement(al.acquisitionStatusChip).each((card) => {
        const cardText = Cypress.$(card).text();
        const actualCard = cleanText(cardText);
        cy.log(actualCard);
      })
        .should("contain", "Archived")
        .and("contain", "Draft")
        .and("contain", "Task Order Awarded")
        .and("contain", "Waiting for Task Order")
        .and("contain", "Waiting for Signatures");
    });   
      
  });

  it("TC7: Archive tab", () => {

    cy.tabStatus(al.archiveTab, "false").click();
    cy.wait(1000);
    cy.findElement(al.acquisitionStatusChip).each((card) => {
      const cardText = Cypress.$(card).text();
      const actualCard = cleanText(cardText);
      cy.log(actualCard);
    })
      .should("contain", "Archived")
      .and("not.contain", "Draft")
      .and("not.contain", "Task Order Awarded")
      .and("not.contain", "Waiting for Task Order")
      .and("not.contain", "Waiting for Signatures");
      
  });

});