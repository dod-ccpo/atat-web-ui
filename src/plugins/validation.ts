import Vue from "vue"

import { compareAsc, compareDesc, isValid } from "date-fns"
import { CountryObj, SelectData } from "types/Global";

export class ValidationPlugin {

  /**
 * Validator that validates input meets a minimum length
 * Returns the error message otherwise.
 *
 * @param {number} length The minimum length allowed for the field's value
 * @param {string} message
 * @returns {() => string | true | undefined}
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
 * @returns {() => string | true | undefined}
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
 * @returns {() => string | true | undefined}
 */

  allowedLengths(
    lengths: number[], 
    message?: string
  ): ((v: string) => string | true | undefined) {

    let lengthsStr: string = lengths.length > 1 
      ? lengths.join(", ")
      : lengths[0].toString();
    lengthsStr = lengthsStr.replace(/,(?=[^,]+$)/, ' or');

    message = message || `Must be ${lengthsStr} characters.`;
    return (v: string) => {
      return v && !lengths.includes(v.length) ? message : true;
    };
  };

  required(
    message?: string, isCurrency?: string
  ): ((v: string) => string | true | undefined) {
    message = message || "This field is required.";
    return (v: string) => {
      if (typeof v === "object") { // if typeof 'selectData(dropdown)' or string[]
        if (v && Array.isArray(v) === false) {
          // array of objects
          return v && Object.values(v).every((val) => val !== "") || message;
        }
        // array of strings
        return v && Object.values(v).length > 0 || message;
      } else if (typeof (v) === "string") {
        return (v.trim() !== "") || message;
      } else if ( typeof (v) === "undefined"){ //validates file upload
        return message;
      } else if (isCurrency) {
        const amt = parseFloat(v);
        return (amt !== 0 && !isNaN(amt)) || message;
      } else {
        return (v !== "") || message;
      }
    };
  };

  notSameAsDefault(
    message?: string, defaultValue?: string
  ): ((v: string) => string | true | undefined) {
    message = message || "Text cannot be the same as the default text";
    return (v: string) => {
      return v && v.trim() !== defaultValue?.trim() || message;
    }
  }

  /**
 * Validator ensures that field only contains integers
 * Returns the error message otherwise.
 *
 * @param message
 * @returns {() => string | true | undefined}
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
 * @returns {() => string | true | undefined}
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
 * @returns {() => string | true | undefined}
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
 * @returns {() => string | true | undefined}
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
 * @returns {() => string | true | undefined}
 */
  isDateValid(
    message?: string
  ): ((v: string) => string | true | undefined) {
    message = message || `Invalid Date`;
    // validate date isn't something like 12/DD/YYYY
    return (v: string) => {
      if (v !== ""){
        const d = new Date(v);
        return (d instanceof Date && !isNaN(d.getMilliseconds())) || message;
      }
      return true;
    };
  };

  /**
 * Validator that validates inputted date after the dateToCompare
 *
 * @param {string} dateToCompare
 * @param {string} message
 * @param {boolean} canEqual can dates be equal
 *  @returns (v: string) => string | true | undefined)
 */
  compareDatesAsc(
    dateToCompare: string,
    message: string,
    canEqual: boolean,
  ): ((v: string) => string | true | undefined) {
    return (v: string) => {
      if (dateToCompare !=="" && v !=="" ){
        const condition = canEqual
          ? compareAsc(new Date(v),new Date(dateToCompare)) > -1
          : compareAsc(new Date(v),new Date(dateToCompare))=== 1
        return condition || message;
      };
      return true;
    } 
    
  };

  /**
 * Validator that validates inputted date is before the dateToCompare
 *
 * @param {string} dateToCompare
 * @param {string} message - error Message
 * @param {boolean} canEqual - can dates be equal
 * @returns (v: string) => string | true | undefined)
 */
  compareDatesDesc(
    dateToCompare: string,
    message: string,
    canEqual: boolean
  ): ((v: string) => string | true | undefined) {
    return (v: string) => {
      if (dateToCompare !=="" && v !=="" ){
        const condition = canEqual
          ? compareDesc(new Date(v),new Date(dateToCompare)) > 1
          : compareDesc(new Date(v),new Date(dateToCompare))=== 1
        return condition || message;
      };
      return true;
    } 
  };


  /**
 * Validator that validates if url is valid
 * Returns the error message otherwise.
 *
 * @param {string} message
 * @returns {() => string | true | undefined}
 */
  isURL(
    message?: string
  ):((v: string) => string | true | undefined){
    message = message || "Invalid URL";
    return (v: string) => {
      if (v !== "") {
        // eslint-disable-next-line max-len
        const httpRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm;
        return v.match(httpRegex) ? true : message;
      }
      return true;
    }
  };

  /**
  * @returns {() => string | true | undefined}
  */
  isEmail = (
    message?: string,
    isScrt?: boolean
  ): ((v: string) => string | true | undefined) => {
    isScrt = isScrt === undefined ? false : isScrt;
    return (v: string) => {
      if (v && v !== "") {
        if (/[a-z0-9]+@[a-z-_.0-9]+\.[a-z]{3}/i.test(v) === false) {
          return "Please use standard domain format, like ‘@mail.mil’"
        } else if (!isScrt && /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:gov|mil)$/i.test(v) === false) {
          return message || "Please use your .mil or .gov email address."
        } else if (isScrt && 
          /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:sgov|smil)+\.(?:gov|mil)$/i.test(v) === false
        ) {
          return message || "Please use your .smil or .sgov email address."
        }      
      }
      return true;
    };
  };

  /**
  * Returns the error message otherwise.
  *
  * @param {string} country country Abbreviation
  * @returns {() => string | true | undefined}
  */
  isPhoneNumberValid = (country: CountryObj): ((v: string) => string | true | undefined) => {
    return (v: string) => {
      if (v && v !== "") {
        const plainPN = v.replace(/[() -]/gi, '') || '';
        const isValid = country?.mask?.some((mask) => {
          return mask.replace(/[() -]/gi, '').length === plainPN.length;
        });
        return isValid ||
          `Please enter a number using the format ` +
          `for  ${country.name} (e.g., ${country.mask?.join(", ")}).`;
      }
      else {
        return "Please enter your phone number."
      }
    }
  };

  /**
   * Returns the error message otherwise.
   *
   * @param {string} mask an Array of input mask ['99999',99999-9999]
   * @param {string} message text to be shown if false
   * @param {boolean} isMaskRegex true or false
   * @returns {() => string | true | undefined}
   */
  isMaskValid = (mask: string[], message: string, isMaskRegex?: boolean):
    ((v: string) => string | true | undefined) => {
    return (v: string) => {
      if (v && v !== "") {
        const plainInput = v.replace(/[() -]/gi, '') || '';
        if (isMaskRegex && isMaskRegex === true) {
          const maskRegEx = new RegExp(mask[0])
          return maskRegEx.test(v) || message;
        } else {
          const isValid = mask?.some((mask) => {
            return mask.replace(/[() -]/gi, '').length === plainInput.length;
          });
          return isValid || message;
        }
      }
      return true;
    }
  };

  /**
   * Validator that ensures the file is valid.
   * Returns the error message otherwise.
   *
   * @returns {() => string | true | undefined}
   * @param file
   * @param validExtensions
   * @param maxFileSize
   * @param doesFileExist
   * @param SNOWError
   * @param statusCode
   * @param restrictedNames
   * @param maxFileNumber
   */

  isFileValid = (
    file: File, 
    validExtensions: string[], 
    maxFileSize: number, 
    doesFileExist: boolean,
    SNOWError?: string,
    statusCode?: number,
    restrictedNames?:string[],
  ):((v: string) => string | true | undefined) => {
    return () => {
      const fileName = file.name.length>20
        ? file.name.substring(0, 12) + '...'
            + file.name.substring(file.name.length-8, file.name.length)
        : file.name;
      const fileSize = file.size;
      const isValidExtension = validExtensions.some((ext)=>
        fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase() === ext
      )

      if (!isValidExtension){
        return `'${fileName}' is not a valid format or has been corrupted. ` +
                `Please upload a valid .${validExtensions.slice(0, -1).join(", .")} or ` +
                `.${validExtensions.slice(-1)} file.`
      }
      // list of names that a file can not have
      if(restrictedNames?.includes(file.name)){
        return "'" + file.name + "' already exists. Please rename the file<br />and upload again."
      }

      // does file aleady exist?
      if (doesFileExist){
        return `'${fileName}' was already uploaded.`
      }

      // is file too big?
      if (fileSize>maxFileSize){
        return `Your file '${fileName}' is too large. Please upload a file that is 1GB or less.`
      }

      if (SNOWError !== "" && SNOWError !== undefined){
        const error = SNOWError.toLowerCase();
        let invalidMessage = "";

        // during upload, did SNOW detect that the
        // file type was incorrect (eg, changing .txt to .pdf file)
        if (error.indexOf("invalid file type")>-1){
          invalidMessage = `'${fileName}' is not a valid format or has been corrupted. ` +
            `Please upload a valid .${validExtensions.slice(0, -1).join(", .")} or ` +
            `.${validExtensions.slice(-1)} file.`
        } else {
          // generic message to accommodate for all other errors
          //that are returned from SNOW
          invalidMessage = "We have encountered unexpected problems uploading your file '" +
            fileName +"'. Please try again later."
        }
        return invalidMessage;
      }
      return true
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
