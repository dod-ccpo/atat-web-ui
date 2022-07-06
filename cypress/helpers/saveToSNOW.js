
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/api/now/table/${tableName}`;
  //https://disastorefrontdev.servicenowservices.com/api/now/table/${tableName}
}

const testNames = window.Cypress.spec.name.toLowerCase().split("/");
const testSuite = testNames[testNames.length-2];
const spec = testNames[testNames.length-1].split(".")[0];
const fixtureFolder = testSuite + "/" + spec;

export function saveToSNOW(){
  const acqPackageEndPoints = [
    {
      'fixture': 'projectOverview',
      'apiURL': 'x_g_dis_atat_project_overview'
    },  
    {
      'fixture': 'organization',
      'apiURL': 'x_g_dis_atat_organization'
    },  
    {
      'fixture': 'contacts',
      'apiURL': 'x_g_dis_atat_contacts'
    }
  ]
  const contractDetailsEndPoints = [
    {
      'fixture': 'fairOpportunity',
      'apiURL': 'x_g_dis_atat_fair_opportunity'
    },
    {
      'fixture': 'period',
      'apiURL': 'x_g_dis_atat_period'
    },
    {
      'fixture': 'periodOfPerformance',
      'apiURL': 'x_g_dis_atat_period_of_performance'
    },
  ]
  const financialDetailsEndPoints = [
    {
      'fixture': 'fairOpportunity',
      'apiURL': 'x_g_dis_atat_fair_opportunity'
    },
  ]
  
  if (spec === "conflictofinterest"){
    acqPackageEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
        'statusCode': 200,
        'times': 1
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_2',
        'apiURL': 'x_g_dis_atat_contract_considerations',
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
    acqPackageEndPoints.concat([
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
    acqPackageEndPoints.concat([
      {
        'fixture': fixtureFolder + '/taskOrder_POST_1',
        'apiURL': 'x_g_dis_atat_task_order',
        'action': 'POST',
      },
      {
        'fixture': fixtureFolder + '/contractConsiderations_POST_1',
        'apiURL': 'x_g_dis_atat_contract_considerations',
        'times': 1,
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
    ])
  }
  if (spec === "trainingcourse"){
    acqPackageEndPoints.concat([
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
    
  
  

  

  acqPackageEndPoints.concat(
    contractDetailsEndPoints,
    financialDetailsEndPoints,
    
  ).forEach((ep)=>{
    /**
     * middleware needed for routes to executed in 
     * the order listed
     */
    const routeMatcher = {
      "method": ep.action || 'POST',
      "url": buildTableApiPath(ep.apiURL),
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