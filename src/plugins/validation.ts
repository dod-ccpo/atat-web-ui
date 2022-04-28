import Vue from "vue"

import { isValid } from "date-fns";
import { CountryObj, SelectData } from "types/Global";

export class ValidationPlugin {

  /**
 * Validator that validates input meets a minimum length
 * Returns the error message otherwise.
 *
 * @param {number} length The minimum length allowed for the field's value
 * @param {string} message
 * @returns {function(*): (boolean|string)}
 */
  minLength(
    length: number,
    message?: string
  ): ((v: string) => string | true | undefined) {
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
  maxLength(
    length: number,
    message?: string
  ): ((v: string) => string | true | undefined) {
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

  // todo test this with required fields
  required (
    message?: string
  ): ((v: string) => string | true | undefined) {
    message = message || "This field is required.";
    return (v: string) => {
      if (typeof(v)==="object"){ // if typeof 'selectData(dropdown)' or string[]
        return Object.values(v).every((val)=> val !=="") || message;
      } else if (typeof(v) === "string"){ // else if typeof 'string'
        return (v!=="")|| message;
      }
    };
  };

  /**
 * Validator ensures that field only contains integers
 * Returns the error message otherwise.
 *
 * @param message
 * @returns {function(*=): boolean}
 */
  integer(message?: string): ((v: string) => string | true | undefined) {
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
  lessThan(
    max: number,
    message?: string
  ): ((v: number) => string | true | undefined) {
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
  greaterThan(
    min: number,
    message?: string
  ): ((v: number) => string | true | undefined) {
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
  isBetween(
    min: number,
    max: number,
    message?: string
  ): ((v: number) => string | true | undefined) {
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
  isDateValid(
    message?: string
  ): ((v: string) => string | true | undefined){
    message = message || `Invalid Date`;
    // validate date isn't something like 12/DD/YYYY
    return (v: string) => {
      return (/^[0-9]*$/.test(v.replaceAll(/\//g, ""))) || message 
    };
  };

  /**
 *
 * @returns {function(*): (boolean|string)}
 */
 isEmail = (): ((v: string) => string | true | undefined) => {
   return (v: string) => {
     if (v && v!==""){  
       if (/[a-z0-9]+@[a-z-]+\.[a-z]{3}/.test(v) === false) {
         return "Please use standard domain format, like ‘@mail.mil’"
       } else if (/^\S[a-z-_.0-9]+@[a-z-]+\.(?:gov|mil)$/.test(v) === false) {
         return "Please use your .mil or .gov email address."
       } 
     }
     return true;
   };
 };

 /**
 * Returns the error message otherwise.
 *
 * @param {string} country country Abbreviation 
 * @returns {function(*): (boolean|string)}
 */
 isPhoneNumberValid = ( country: CountryObj): ((v: string) => string | true | undefined) => {
   return (v: string) => {
     if (v && v!==""){ 
       const plainPN = v.replace(/[() -]/gi,'') || '';
       const isValid = country?.mask?.some((mask) =>{
         return mask.replace(/[() -]/gi,'').length === plainPN.length;
       });
       return isValid || 
        `Please enter a number using the format ` +
        `for  ${country.name} (e.g., ${country.mask?.join(", ")}).`;
     }
     else {
       return "Please enter your phone number."
     }
     return true;
   }
 };

}

declare module 'vue/types/vue' {
  interface Vue {
    $validators: ValidationPlugin
  }
}

export default {
  install(): void {
    const validation = new ValidationPlugin();
    Vue.prototype.$validators = validation;
  },
};