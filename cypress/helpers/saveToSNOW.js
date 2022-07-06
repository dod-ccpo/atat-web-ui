
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/api/now/table/${tableName}`;
  //https://disastorefrontdev.servicenowservices.com/api/now/table/${tableName}
}

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

  const otherContractConsiderations =[
    {
      'fixture': 'contractConsiderations',
      'apiURL': 'x_g_dis_atat_contract_considerations',
      'times': 1,
    },
    {
      'fixture': 'contractConsiderations_GET',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1,
    },
    {
      'fixture': 'contractConsiderations_GET_2',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1
    },
    {
      'fixture': 'contractConsiderations_PATCH',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'PATCH',
      'statusCode': 200,
      'times': 1
    },
    {
      'fixture': 'contractConsiderations_PATCH_2',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'PATCH',
      'statusCode': 200,
      'times': 1
    },
    {
      'fixture': 'taskOrder',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'POST',
      'statusCode': 200,
      'times': 1
    },
    {
      'fixture': 'taskOrder_GET',
      'apiURL': 'x_g_dis_atat_task_order',
      'action': 'GET',
      'times': 1
    },
    {
      'fixture': 'contractConsiderations_POST_2',
      'apiURL': 'x_g_dis_atat_contract_considerations',
      'times': 1,
    },
    {
      'fixture': 'contractConsiderations_GET_3',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1
    },
    {
      'fixture': 'contractConsiderations_PATCH_3',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'PATCH',
      'statusCode': 200,
      'times': 1
    },
    {
      'fixture': 'contractConsiderations_POST_3',
      'apiURL': 'x_g_dis_atat_contract_considerations',
      'times': 1,
    },
    {
      'fixture': 'contractConsiderations_GET_4',
      'apiURL': 'x_g_dis_atat_contract_considerations/**',
      'action': 'GET',
      'statusCode': 200,
      'times': 1
    },
  ]

  

  acqPackageEndPoints.concat(
    contractDetailsEndPoints,
    financialDetailsEndPoints,
    otherContractConsiderations
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