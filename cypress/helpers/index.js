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

function randomStringFromSet(characters, length) {
  return [...Array(length)].map(
    () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
}

export function randomAlphaNumeric(length) {
  // The string is not a secret as it is just a list of alphanumeric characters
  return randomStringFromSet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789", // pragma: allowlist secret
    length
  );
}

export function randomNumber(digits) {
  // The string is not a secret as it is just a list of numeric characters
  return randomStringFromSet(
    "0123456789", // pragma: allowlist secret
    digits
  );
}

export function randomString(length) {
  // The string is not a secret as it is just a list of alpha characters
  return randomStringFromSet(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz", // pragma: allowlist secret
    length
  );
}