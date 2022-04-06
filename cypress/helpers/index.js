const buildTableApiPath = (tableName)=> {
    const baseAPIUrl = Cypress.env("BASE_API_URL");
     return `${baseAPIUrl}/now/table/${tableName}`;
}


const bootStrapAcquisitionPackageApi= ()=> {

    const acquisitionPackageApiEndpoint = buildTableApiPath('x_g_dis_atat_acquisition_package');
    cy.fixture("acquistionPackage").then((data) => {
        cy.intercept('POST', acquisitionPackageApiEndpoint, {
            statusCode: 201,
            body: data,
         });
    });
   
}

export function bootstrapMockApis(){
    
    bootStrapAcquisitionPackageApi();
    
}

export const cleanText = (text) => {
    return text.replace(/\n/g, '').replace(/\s\s+/g, ' ').trim();
}

export const colors = {
    primary:"rgb(84, 68, 150)"
}