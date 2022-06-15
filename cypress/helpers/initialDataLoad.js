
const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/now/table/${tableName}`;
  //https://disastorefrontdev.servicenowservices.com/api/now/table/${tableName}
}

export function loadInitialData(){
  
  const branchesApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_military_rank&element=branch');
  const countriesApiEndpoint = buildTableApiPath(
    'core_country?sysparm_query=active%3Dtrue%5EORDERBYname&sysparm_fields=name,iso3166_2')
  const disaOrganizationApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_organization&element=disa_organization');
  const gradeCivsApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_contacts&element=grade_civ');
  const ranksApiEndpoint = buildTableApiPath(
    'x_g_dis_atat_military_rank');
  const rolesApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_contacts&element=role');
  const salutationsApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_contacts&element=salutation');
  const serviceAgencyApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_organization&element=service_agency');
  const serviceOfferingApiEndpoint = buildTableApiPath(
    'x_g_dis_atat_service_offering');
  const serviceOfferingGroupApiEndpoint = buildTableApiPath(
    'sys_choice?sysparm_fields=label,value,name&name=x_g_dis_atat_service_offering&element=service_offering_group');
  const statesApiEndpoint = buildTableApiPath(
    'sys_report_map?sysparm_query=active%3Dtrue%5EORDERBYname%5EkeySTARTSWITHus&sysparm_fields=name,key');

  cy.fixture("initialData/branches").then((data) => {
    cy.intercept('GET', branchesApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  }); 
      
  cy.fixture("initialData/countries").then((data) => {
    cy.intercept('GET', countriesApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  }); 

  cy.fixture("initialData/disaOrganization").then((data) => {
    cy.intercept('GET', disaOrganizationApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  });

  cy.fixture("initialData/gradeCiv").then((data) => {
    cy.intercept('GET', gradeCivsApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  }); 

  cy.fixture("initialData/ranks").then((data) => {
    cy.intercept('GET', ranksApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  }); 

  cy.fixture("initialData/roles").then((data) => {
    cy.intercept('GET', rolesApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  }); 

  cy.fixture("initialData/salutations").then((data) => {
    cy.intercept('GET', salutationsApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  });

  cy.fixture("initialData/serviceAgency").then((data) => {
    console.log(data);
    cy.intercept('GET', serviceAgencyApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  });

  cy.fixture("initialData/serviceOffering").then((data) => {
    cy.intercept('GET', serviceOfferingApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  });

  cy.fixture("initialData/serviceOfferingGroup").then((data) => {
    cy.intercept('GET', serviceOfferingGroupApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  });

  cy.fixture("initialData/states").then((data) => {
    cy.intercept('GET', statesApiEndpoint, {
      statusCode: 200,
      body: data,
    });
  });
}