import { isValid } from "date-fns";
import { CountryObj } from "types/Global";

/**
 * Validator that validates input meets a minimum length
 * Returns the error message otherwise.
 *
 * @param {number} length The minimum length allowed for the field's value
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
const minLength = (
  length: number,
  message?: string
): ((v: string) => string | true | undefined) => {
  message = message || `Min ${length} characters allowed.`;

  return (v: string) => {
    return v && v.length < length ? message : true;
  };
};

/**
 * Validator that validates input should not exceed a given length
 * Returns the error message otherwise.
 *
 * @param {number} length The maximum length allowed for the field's value
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
const maxLength = (
  length: number,
  message?: string
): ((v: string) => string | true | undefined) => {
  message = message || `Max ${length} characters allowed.`;
  return (v: string) => {
    return v && v.length > length ? message : true;
  };
};
/**
 * Validator that ensures the field value is not empty.
 * Returns the error message otherwise.
 *
 * @param message
 * @returns {function(*=): boolean}
 */
const required = (
  message?: string
): ((v: string) => string | true | undefined) => {
  message = message || "This field is required.";

  return (v: string) => {
    return (v && (v.length && v.length > 0)) || message;
  };
};

/**
 * Validator ensures that field only contains integers
 * Returns the error message otherwise.
 *
 * @param message
 * @returns {function(*=): boolean}
 */
const integer = (message?: string): ((v: string) => string | true | undefined) => {
  message = message || "The value must be an integer number";

  return (v) => Number.isInteger(Number(v)) || message;
};

/**
 * Validator that validates input should not exceed a given 'max' number
 * Returns the error message otherwise.
 *
 * @param {number} max Maximum number allowed
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
const lessThan = (
  max: number,
  message?: string
): ((v: number) => string | true | undefined) => {
  message = message || `Value must be less than ${max}`;
  return (v: number) => {
    return v && v < max || message;
  };
};

/**
 * Validator that validates input should be greater than a given 'min' number
 * Returns the error message otherwise.
 *
 * @param {number} min Minimum number allowed
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
const greaterThan = (
  min: number,
  message?: string
): ((v: number) => string | true | undefined) => {
  message = message || `Value must be greater than ${min}`;
  return (v: number) => {
    return v && v > min || message;
  };
};

/**
 * Validator that validates input should be between a given 'min' number
 * and a given 'max' number
 * Returns the error message otherwise.
 *
 * @param {number} min Minimum number allowed
 * @param {number} max Maximum number allowed
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
const isBetween = (
  min: number,
  max: number,
  message?: string
): ((v: number) => string | true | undefined) => {
  message = message || `Value must be between ${min} and ${max}`;
  return (v: number) => {
    return v && (v >= min && v <= max) || message;
  };
};

/**
 * Validator that validates if input is a valid Date
 * Returns the error message otherwise.
 *
 * @param (string) date as "MM/dd/yyyy"
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
const isDateValid = (
  message?: string
): ((v: string) => string | true | undefined) => {
  message = message || `Invalid Date`;
  // validate date isn't something like 12/DD/YYYY
  return (v: string) => {
    return (/^[0-9]*$/.test(v.replaceAll(/\//g, ""))) || message 
  };
};

/**
 * todo
 * Validator that validates if input is a valid Date
 * Returns the error message otherwise.
 *
 * @param (string) date as "MM/dd/yyyy"
 * @returns {function(*): (boolean|string)}
 */
 const isEmail = (
): ((v: string) => string | true | undefined) => {
  // validate date isn't something like 12/DD/YYYY
  return (v: string) => {
    if (v!==""){  
      if (/[a-z0-9]+@[a-z]+\.[a-z]{3}/.test(v)) {
          return "Please use standard domain format, like ‘@mail.mil’"
        } else if (v.indexOf("@") < 0){
          return "Please include an '@’ symbol in the email address."
        } else if (/[a-z0-9]+@[a-z]+\.[ gov,mil ]/.test(v)) {
          return "Please use your .mil or .gov email address."
        } 
    }
    return true;
  };
};

/**
 * todo
 * Validator that validates if input is a valid Date
 * Returns the error message otherwise.
 *
 * @param {string} country country Abbreviation 
 * @returns {function(*): (boolean|string)}
 */
 const isPhoneNumberValid = (
   country: CountryObj
  ): ((v: string) => string | true | undefined) => {
    // validate date isn't something like 12/DD/YYYY
    return (v: string) => {
      if (v!==""){ 
          const plainPN = v.split("-").join(""); 
          const plainPNLength = plainPN.length;
          if (country.abbreviation === "us"){
            return plainPNLength === 10 || "Phone number must be 10 digits including the area code.";
          } else if (country.abbreviation === "dsn"){
            return (
              (plainPNLength === 7 || plainPNLength === 10) || 
              "DSN number must be 7 digits for CONUS or 10 digits for OCONUS including the geographical code"
            );
          } else {
            const isLengthValid = (plainPNLength >=7 && plainPNLength <= 20);
            const isSpecialCharsValid = isNaN(parseInt(v)) ? /^[0-9\s+.()-]*$/.test(plainPN) : true;
            return (
              (isLengthValid && isSpecialCharsValid) || 
              "Phone number must be between 7 and 20 digits. It may contain left and right parentheses, hyphen, " + 
              "period, plus, and spaces."
            );
          }
        }
        return true;
      }
  };
  


export default {
  install(Vue: any, options: any): void {
    Vue.prototype.$validators = {
      // eslint-disable-next-line no-unused-labels
      minLength,
      maxLength,
      integer,
      required,
      lessThan,
      greaterThan,
      isBetween,
      isDateValid,
      isEmail,
      isPhoneNumberValid
    };
  },
};