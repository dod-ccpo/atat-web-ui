
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/api/now/table/${tableName}`;
  //https://disastorefrontdev.servicenowservices.com/api/now/table/${tableName}
}

export function saveToSNOW(){
  
  const endPoints = [
    // {
    //   'fixture': 'acquistionPackage',
    //   'apiURL': 'x_g_dis_atat_acquisition_package'
    // },  
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
    },  
    {
      'fixture': 'fairOpportunity',
      'apiURL': 'x_g_dis_atat_fair_opportunity'
    },
    // {
    //   'fixture': 'period',
    //   'apiURL': 'x_g_dis_atat_period'
    // },
    // {
    //   'fixture': 'period_PATCH',
    //   'apiURL': 'x_g_dis_atat_period/**'
      
    // },   
    // {
    //   'fixture': 'periodOfPerformance',
    //   'apiURL': 'x_g_dis_atat_period_of_performance'
    // }, 
    // {
    //   'fixture': 'periodOfPerformance_GET',
    //   'apiURL': 'x_g_dis_atat_period_of_performance/**',
    //   'action': 'GET'
    // }, 
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

  endPoints.forEach((ep)=>{
    const action = ep.action || 'POST';
    cy.fixture("saveToSNOW/" + ep.fixture).then((data) => {
      cy.intercept(action, buildTableApiPath(ep.apiURL), {
        statusCode: 201,
        body: data,
      });
    }); 
  });

  
}