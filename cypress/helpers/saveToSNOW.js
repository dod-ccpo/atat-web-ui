
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

  const endPoints = [
     
  
    // {
    //   'fixture': 'period',
    //   'apiURL': 'x_g_dis_atat_period'
    // },
    // {
    //   'fixture': 'periodOfPerformance',
    //   'apiURL': 'x_g_dis_atat_period_of_performance'
    // }, 
    // {
    // {
    //   'fixture': 'contractType_PATCH',
    //   'apiURL': 'x_g_dis_atat_contract_type/**',
    //   'action': 'PATCH'
    // },
    // {
    //   'fixture': 'contractType_GET',
    //   'apiURL': 'x_g_dis_atat_contract_type/**',
    //   'action': 'GET'
    // }, 
  ];

  acqPackageEndPoints.concat(
    contractDetailsEndPoints,
    financialDetailsEndPoints
  ).forEach((ep)=>{
    const action = ep.action || 'POST';
    cy.fixture("saveToSNOW/" + ep.fixture).then((data) => {
      cy.intercept(action, buildTableApiPath(ep.apiURL), {
        statusCode: 201,
        body: data,
      });
    }); 
  });

}