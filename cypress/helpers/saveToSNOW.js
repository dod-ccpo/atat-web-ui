// import { classificationRequirements, contractType, workflow } from "../helpers/mockedAPICalls/contractDetails";
import { contractDetails } from  "../helpers/mockedAPICalls/contractDetails";
import { financialDetails } from "../helpers/mockedAPICalls/financialDetails";

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

const saveToSNOW = (testCase)=>{
  let currentTestEndPoints = [];
  let acquistionpackagedetails = [
    {
      'fixture': 'projectOverview',
      'apiURL': 'x_g_dis_atat_project_overview',
      'action': 'POST',
    },  
    {
      'fixture': 'organization',
      'apiURL': 'x_g_dis_atat_organization',
      'action': 'POST',
    },  
    {
      'fixture': 'contacts',
      'apiURL': 'x_g_dis_atat_contacts',
      'action': 'POST',
    }
  ];
  currentTestEndPoints =  currentTestEndPoints.concat(acquistionpackagedetails);
  
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
  if (spec === "conflictofinterest"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'action': 'POST',
        'times': 1,
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
    ]);
  }
  if (spec === "packagingpackingshipping"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1
      },
    ]);
  }
  if (spec === "training"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_PATCH_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_2',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_PATCH_2',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      },
    ]);
  }
  if (spec === "trainingcourse"){
    currentTestEndPoints =  currentTestEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/taskOrder_GET',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'GET',
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_GET_2',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'times': 1,
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_2',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'times': 1,
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_PATCH_1',
        'apiURL': 'x_g_dis_atat_contract_considerations/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1
      }
    ]);
  }
    
  /** standardsAndComplaince */
  if (spec === "baa"){
    const baa = [
      {
        'fixture': fixtureFolder + '/TC1_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 1
      },
      {
        'fixture': fixtureFolder + '/TC2_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 201,
        'times': 1,
        'testCase' : 3
      }, 
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'statusCode': 200,
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
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
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      }, 
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'statusCode': 200,
        'times': 1,
        'testCase' : 4
      },
     
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(baa);
  }
  if (spec === "foia"){
    const foia = [
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
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 2
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },  
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 4,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 6
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC6_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 6,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 7
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 7
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC7_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 7,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 8
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 8
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC8_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 8,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 9
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 9
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC9_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 9,
        'statusCode': 200,
      },

    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(foia);
  }
  if (spec === "pii"){
    const pii = [
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
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 4,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(pii);
  }
  if (spec === "section508standards"){
    const section508standards = [
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
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 2,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_GET_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC2_sensitiveInformation_PATCH_3',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 2,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 3
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 3,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC3_sensitiveInformation_PATCH_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'PATCH',
        'times': 1,
        'testCase' : 3,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC4_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 4
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 4,
      },
      {
        'fixture': fixtureFolder + '/TC4_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 4,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'times': 1,
        'testCase' : 5
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_POST_1',
        'apiURL': 'x_g_dis_atat_sensitive_information',
        'action': 'POST',
        'times': 1,
        'testCase' : 5,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_1',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
      {
        'fixture': fixtureFolder + '/TC5_sensitiveInformation_GET_2',
        'apiURL': 'x_g_dis_atat_sensitive_information/**',
        'action': 'GET',
        'times': 1,
        'testCase' : 5,
        'statusCode': 200,
      },
    ].filter((fixture)=>fixture.testCase === parseInt(testCase));
    currentTestEndPoints =  currentTestEndPoints.concat(section508standards);
  }

  
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