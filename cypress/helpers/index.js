import {loadInitialData} from "../helpers/initialDataLoad";
import {saveToSNOW} from "../helpers/saveToSNOW";
const isTestingIsolated = Cypress.env("isTestingIsolated")==="true";

const buildTableApiPath = (tableName)=> {
  const baseAPIUrl = Cypress.env("BASE_API_URL");
  return `${baseAPIUrl}/api/now/table/${tableName}`;
}


const bootStrapAcquisitionPackageApi= ()=> {
  const acquisitionPackageApiEndpoint = buildTableApiPath('x_g_dis_atat_acquisition_package');
  const testCase = window.Cypress.currentTest.title.split(":")[0].trim().replace("TC","");

  cy.fixture("acquistionPackage").then((data) => {
    cy.intercept('POST', acquisitionPackageApiEndpoint, {
      statusCode: 201,
      body: data,
    });
  }); 
  if (isTestingIsolated){
    loadInitialData();
    saveToSNOW(testCase);
  }

}

export function bootstrapMockApis(){
  bootStrapAcquisitionPackageApi();    
}

export const cleanText = (text) => {
  const encodedText = encodeURIComponent(text);
  const encodedTextNoZeroWidthWhiteSpace = encodedText.replace(/%E2%80%8B/g, '');
  let newStr = decodeURIComponent(encodedTextNoZeroWidthWhiteSpace);
  newStr = newStr.trim();
  newStr = newStr.replace(/\s\s+/g, ' ');
  return newStr;
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

export function randomNumberBetween(min, max) {
  // The string is not a secret as it is just a list of min and max included
  return Math.floor(Math.random() * (max - min + 1) + min) // pragma: allowlist secret
}

export function getObjectFromArrayByKey(data, key, value) {
  return data.find(e => e[key] === value);
}

export function getIdText(string) {
  return string.replace(/[^A-Z0-9]/ig, "");
}

export function getCheckboxId(string) {
  return "#Checkbox_" + string;
}

export function getServiceOfferingNames(obj) {
  return obj.serviceOfferingMainLabels 
    ? obj.serviceOfferingMainLabels 
    : obj.serviceOfferingCypressLabels;
}

export function getCheckboxIds(obj) {  
  const labels =  obj.serviceOfferingMainLabels 
    ? obj.serviceOfferingMainLabels 
    : obj.serviceOfferingCypressLabels;

  let checkboxIds=[]
  labels.forEach((label) => {
    const textForId = getIdText(label);
    const id = getCheckboxId(textForId);
    checkboxIds.push(id);    
  });
  return checkboxIds;
}

export function numberWithCommas(x) {
  if (!isNaN(x)) {
    return x.toLocaleString(
      undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    );
  }
  return "";
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function prefixId(id, prefix) {
  return [id.slice(0,1), prefix, id.slice(1)].join("");
}

export function currencyToNumber(str) {
  const stringNoDollar = str.replace(/\$/g, '');
  // eslint-disable-next-line no-useless-escape
  const stringNoComma = stringNoDollar.replace(/\,/g, '');      
  const toNumber = parseFloat(stringNoComma);
  return toNumber;
}

export function numberWithoutPercentSign(str) {
  const percentageString = str.replace(/[()]/g, '');         
  const withoutPercentage = percentageString.replace("%","");          
  const toNumber = parseFloat(withoutPercentage);
  return toNumber;
}