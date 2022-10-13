
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/api/now/table/${tableName}`;
  //https://disastorefrontdev.servicenowservices.com/api/now/table/${tableName}
}

export function loadInitialData(){
  
  const endPoints = [
    {
      'fixture': 'branches',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name' +
                '&name=x_g_dis_atat_military_rank&element=branch'
    },
    {
      'fixture': 'classificationLevels',
      'apiURL': 'x_g_dis_atat_classification_level'
    },
    {
      'fixture': 'countries',
      'apiURL': 'core_country?sysparm_query=active%3Dtrue%5EORDERBYname'+
                '&sysparm_fields=name,iso3166_2'
    },
    {
      'fixture': 'disaOrganization',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_organization'+
                '&element=disa_organization'
    },
    {
      'fixture': 'gradeCiv',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name&'+
                'name=x_g_dis_atat_contacts&element=grade_civ'
    },
    {
      'fixture': 'ranks',
      'apiURL': 'x_g_dis_atat_military_rank'
    },
    {
      'fixture': 'roles',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_contacts&element=role'
    },
    {
      'fixture': 'salutations',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name&' +
                'name=x_g_dis_atat_contacts&element=salutation'
    },
    {
      'fixture': 'agency',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_organization' +
                '&element=agency'
    },
    {
      'fixture': 'serviceOffering',
      'apiURL': 'x_g_dis_atat_service_offering'
    },
    {
      'fixture': 'serviceOfferingGroup',
      'apiURL': 'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_service_offering' +
                '&element=service_offering_group'
    },
    {
      'fixture': 'states',
      'apiURL': 'sys_report_map?sysparm_query=active%3Dtrue%5EORDERBYname%5EkeySTARTSWITHus' +
                '&sysparm_fields=name,key'
    }
      
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
