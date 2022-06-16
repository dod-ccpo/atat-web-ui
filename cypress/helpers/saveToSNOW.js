
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/now/table/${tableName}`;
  //https://disastorefrontdev.servicenowservices.com/api/now/table/${tableName}
}

export function saveToSNOW(){
  
  const endPoints = [
    {
      'fixture': 'branches',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name' +
                '&name=x_g_dis_atat_military_rank&element=branch'
    },  
  ];

  endPoints.forEach((ep)=>{
    cy.fixture("initialData/" + ep.fixture).then((data) => {
      cy.intercept('GET', buildTableApiPath(ep.apiURL), {
        statusCode: 200,
        body: data,
      });
    }); 
  });

}