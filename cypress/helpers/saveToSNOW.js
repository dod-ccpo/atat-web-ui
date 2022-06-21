
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
    // {
    //   'fixture': 'acquistionPackage',
    //   'apiURL': 'x_g_dis_atat_acquisition_package'
    // },    
  ];

  endPoints.forEach((ep)=>{
    cy.fixture("saveToSNOW/" + ep.fixture).then((data) => {
      cy.intercept('POST', buildTableApiPath(ep.apiURL), {
        statusCode: 201,
        body: data,
      });
    }); 
  });

}