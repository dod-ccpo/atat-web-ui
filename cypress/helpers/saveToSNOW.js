// import { classificationRequirements, contractType, workflow } from "../helpers/mockedAPICalls/contractDetails";
import { acquisitionPackageDetails } from "../helpers/mockedAPICalls/acquisitionPackageDetails";
import { contractDetails } from  "../helpers/mockedAPICalls/contractDetails";
import { financialDetails } from "../helpers/mockedAPICalls/financialDetails";
import { otherContractConsiderations } from "../helpers/mockedAPICalls/otherContractConsiderations";
import { standardsAndCompliance } from "./mockedAPICalls/standardsAndCompliance";

const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/table/${tableName}`;
}

const buildAttachmentApiPath = (attachment)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}api/now/${attachment}`;
}

const filterTestCases = (testCases, testCase) => {
  return testCases.filter(
    (fixture)=>fixture.testCase === parseInt(testCase)
  );
}

const specPath = window.Cypress.spec.name.toLowerCase().split("/");

/**
 * 
 * accommodates for .spec.ts files that have predefined 
 * test suites (read: in folders), and those that don't
 * @returns string: testSuite
 */
let testSuite = ()=>{
  let _testSuite = specPath.length === 3 
    ? specPath[specPath.length-2]
    : "";
  return _testSuite.split(".")[0];
}
const spec = specPath[specPath.length-1].split(".")[0];
const fixtureFolder = testSuite() + "/" + spec;
debugger;
const saveToSNOW = (testCase)=>{
  let currentTestEndPoints = [];
  // let acquistionpackagedetails = [
  //   {
  //     'fixture': 'projectOverview',
  //     'apiURL': 'x_g_dis_atat_project_overview',
  //     'action': 'POST',
  //   },  
  //   {
  //     'fixture': 'organization',
  //     'apiURL': 'x_g_dis_atat_organization',
  //     'action': 'POST',
  //   },  
  //   // {
  //   //   'fixture': 'contacts',
  //   //   'apiURL': 'x_g_dis_atat_contacts',
  //   //   'action': 'POST',
  //   // }
  // ];

  /** contract details */
  if (testSuite() === "acquisitionpackagedetails"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(acquisitionPackageDetails(fixtureFolder)[spec], testCase)
    );
  }
  
  /** contract details */
  if (testSuite() === "contractdetails"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(contractDetails(fixtureFolder)[spec], testCase)
    );
  }
  
  /** financialDetails */
  if (testSuite() === "financialdetails"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(financialDetails(fixtureFolder)[spec], testCase)
    );
  }

  /** otherContractConsiderations */
  if (testSuite() === "othercontractconsiderations"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(otherContractConsiderations(fixtureFolder)[spec], testCase)
    );
  }

  /** standardsAndCompliance */
  if (testSuite() === "standardsandcompliance"){
    currentTestEndPoints = currentTestEndPoints.concat(
      filterTestCases(standardsAndCompliance(fixtureFolder)[spec], testCase)
    );
  }

  /** background */  

  
  if (spec === "background"){
    const background = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_currentContractAndRecurringInformation_GET_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'GET',
        'times': 1,
        'statusCode': 200,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_currentContractAndRecurringInformation_POST_1',
        'apiURL': 'x_g_dis_atat_current_contract_and_recurring_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(background);
  }

  if (spec === "common"){
    const common = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(common);
  }

  /** fairOpportunityProcess */
  if (spec === "fairopportunityprocess") {
    const fairOpportunityProcess = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 3
      },
      {
        'fixture': fixtureFolder + '/TC3_fairOpportunity_POST_1',
        'apiURL': 'x_g_dis_atat_fair_opportunity',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase': 3
      },
    ].filter((fixture) => fixture.testCase === parseInt(testCase));
    currentTestEndPoints = currentTestEndPoints.concat(fairOpportunityProcess);
  };


  
  currentTestEndPoints.forEach((ep)=>{
    /**
     * middleware needed for routes to executed in 
     * the order listed
     */
    const isAttachmentAPI = ep.apiURL.indexOf('attachment') > -1;
    const routeMatcher = {
      "method": ep.action,
      "url": isAttachmentAPI ? buildAttachmentApiPath(ep.apiURL): buildTableApiPath(ep.apiURL),
      "middleware": true
    }
    if (ep.times){
      routeMatcher.times = ep.times;
    }

    // craft static response
    let staticResponse = {
      "fixture": "saveToSNOW/" + ep.fixture,
      "statusCode":  ep.statusCode || 201,
    }

    cy.intercept(routeMatcher,(req)=>{
      req.reply(staticResponse)
    }).as(ep.fixture);

  });

}

export { saveToSNOW };