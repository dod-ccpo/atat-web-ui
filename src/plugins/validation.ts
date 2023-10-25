import { compareAsc, compareDesc } from "date-fns"
import { CountryObj, ValidationResult } from "types/Global";
import { App } from "vue";

export class ValidationPlugin {

  /**
 * Validator that validates input meets a minimum length
 * Returns the error message otherwise.
 *
 * @param {number} length The minimum length allowed for the field's value
 * @param {string} message
 * @returns {() => ValidationResult}
 */
  minLength(
    length: number,
    message?: string
  ): ((v: string) => ValidationResult) {
    message = message || `Min ${length} characters allowed.`;

    return (v: string) => {
      return v && v.length < length ? message as string : true;
    };
  };

  /**
 * Validator that validates input should not exceed a given length
 * Returns the error message otherwise.
 *
 * @param {number} length The maximum length allowed for the field's value
 * @param {string} message
 * @returns {() => ValidationResult}
 */
  maxLength(
    length: number,
    message?: string
  ): ((v: string) => ValidationResult) {
    message = message || `Max ${length} characters allowed.`;
    return (v: string) => {
      return v && v.length > length ? message as string : true;
    };
  };

  /**
 * Validator that ensures the field value is not empty.
 * Returns the error message otherwise.
 *
 * @param message
 * @returns {() => ValidationResult}
 */

  allowedLengths(
    lengths: number[], 
    message?: string
  ): ((v: string) => ValidationResult) {

    let lengthsStr: string = lengths.length > 1 
      ? lengths.join(", ")
      : lengths[0].toString();
    lengthsStr = lengthsStr.replace(/,(?=[^,]+$)/, ' or');

    message = message || `Must be ${lengthsStr} characters.`;
    return (v: string) => {
      return v && !lengths.includes(v.length) ? message as string : true;
    };
  };

  required(
    message?: string, isCurrency?: string
  ): ((v: string) => ValidationResult) {
    message = message || "This field is required.";
    return (v: string) => {
      if (typeof v === "object") { // if typeof 'selectData(dropdown)' or string[]
        if (v && Array.isArray(v) === false) {
          // array of objects
          return v && Object.values(v).every((val) => val !== "") || message as string;
        }
        // array of strings
        return v && Object.values(v).length > 0 || message as string;
      } else if (typeof (v) === "string") {
        return (v.trim() !== "") || message as string;
      } else if (typeof (v) === "undefined"){ //validates file upload
        return message as string;
      } else if (isCurrency) {
        const amt = parseFloat(v);
        return (amt !== 0 && !isNaN(amt)) || message as string;
      } else {
        return (v !== "") || message as string;
      }
    };
  };

  notSameAsDefault(
    message?: string, defaultValue?: string
  ): ((v: string) => ValidationResult) {
    message = message || "Text cannot be the same as the default text";
    return (v: string) => {
      return v && v.trim() !== defaultValue?.trim() || message as string;
    }
  }

  /**
 * Validator ensures that field only contains integers
 * Returns the error message otherwise.
 *
 * @param message
 * @returns {() => ValidationResult}
 */
  integer(message?: string): ((v: string) => ValidationResult) {
    message = message || "The value must be an integer number";

    return (v) => Number.isInteger(Number(v)) || message as string;
  };

  /**
 * Validator that validates input should not exceed a given 'max' number
 * Returns the error message otherwise.
 *
 * @param {number} max Maximum number allowed
 * @param {string} message
 * @returns {() => ValidationResult}
 */
  lessThan(
    max: number,
    message?: string
  ): ((v: number) => ValidationResult) {
    message = message || `Value must be less than ${max}`;
    return (v: number) => {
      return v && v < max || message as string;
    };
  };

  /**
 * Validator that validates input should be greater than a given 'min' number
 * Returns the error message otherwise.
 *
 * @param {number} min Minimum number allowed
 * @param {string} message
 * @returns {() => ValidationResult}
 */
  greaterThan(
    min: number,
    message?: string
  ): ((v: number) => ValidationResult) {
    message = message || `Value must be greater than ${min}`;
    return (v: number) => {
      return v && v > min || message as string;
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
 * @returns {() => ValidationResult}
 */
  isBetween(
    min: number,
    max: number,
    message?: string
  ): ((v: number) => ValidationResult) {
    message = message || `Value must be between ${min} and ${max}`;
    return (v: number) => {
      return v && (v >= min && v <= max) || message as string;
    };
  };

  /**
 * Validator that validates if input is a valid Date
 * Returns the error message otherwise.
 *
 * @param (string) date as "MM/dd/yyyy"
 * @param {string} message
 * @returns {() => ValidationResult}
 */
  isDateValid(
    message?: string
  ): ((v: string) => ValidationResult) {
    message = message || `Invalid Date`;
    // validate date isn't something like 12/DD/YYYY
    return (v: string) => {
      if (v !== ""){
        const d = new Date(v);
        return (d instanceof Date && !isNaN(d.getMilliseconds())) || message as string;
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
 *  @returns (v: string) => ValidationResult)
 */
  compareDatesAsc(
    dateToCompare: string,
    message: string,
    canEqual: boolean,
  ): ((v: string) => ValidationResult) {
    return (v: string) => {
      if (dateToCompare !=="" && v !=="" ){
        const condition = canEqual
          ? compareAsc(new Date(v),new Date(dateToCompare)) > -1
          : compareAsc(new Date(v),new Date(dateToCompare))=== 1
        return condition || message;
      }
      return true;
    } 
    
  };

  /**
 * Validator that validates inputted date is before the dateToCompare
 *
 * @param {string} dateToCompare
 * @param {string} message - error Message
 * @param {boolean} canEqual - can dates be equal
 * @returns (v: string) => ValidationResult)
 */
  compareDatesDesc(
    dateToCompare: string,
    message: string,
    canEqual: boolean
  ): ((v: string) => ValidationResult) {
    return (v: string) => {
      if (dateToCompare !=="" && v !=="" ){
        const condition = canEqual
          ? compareDesc(new Date(v),new Date(dateToCompare)) > 1
          : compareDesc(new Date(v),new Date(dateToCompare))=== 1
        return condition || message;
      }
      return true;
    } 
  };


  /**
 * Validator that validates if url is valid
 * Returns the error message otherwise.
 *
 * @param {string} message
 * @returns {() => ValidationResult}
 */
  isURL(
    message?: string
  ):((v: string) => ValidationResult){
    message = message || "Invalid URL";
    return (v: string) => {
      if (v !== "") {
        // eslint-disable-next-line max-len
        const httpRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/gm;
        return v.match(httpRegex) ? true : message as string;
      }
      return true;
    }
  };

  /**
  * @returns {() => ValidationResult}
  */
  isEmail = (
    message?: string,
    highSide?: "S" | "TS"
  ): ((v: string) => ValidationResult) => {
    const isScrt = highSide === "S" ? true : false;
    const isTS = highSide === "TS" ? true : false;
    return (v: string) => {
      if (v && v !== "") {
        const validStructure = /[a-z0-9]+@[a-z-_.0-9]+\.[a-z]{3}/i.test(v);
        if (!validStructure) {
          return "Please use standard domain format, like ‘@mail.mil’";
        }
        const validScrt = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:sgov|smil)+\.(?:gov|mil)$/i.test(v);
        if (isScrt && !validScrt) {
          return message || "Please use your .smil or .sgov email address."
        } 
        const validGovOrMil = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:gov|mil)$/i.test(v);
        if (!validGovOrMil) {
          return message || "Please use your .mil or .gov email address."
        }
        // const validTS = /^\S[a-z-_.0-9]+@[a-z-_.0-9]+\.(?:ic)+\.(?:gov|mil)$/i.test(v)
        // if (isTS && !validTS) {
        //    TODO: determine if requiring only ".ic.gov" emails or if OK to show warning
        //    in UI if ends in ".gov" or ".mil" but does not contain ".ic"
        // }
      }
      return true;
    };
  };

  /**
  * Returns the error message otherwise.
  *
  * @param {string} country country Abbreviation
  * @returns {() => ValidationResult}
  */
  isPhoneNumberValid = (country: CountryObj): ((v: string) => ValidationResult) => {
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
   * @returns {() => ValidationResult}
   */
  isMaskValid = (mask: string[], message: string, isMaskRegex?: boolean):
    ((v: string) => ValidationResult) => {
    return (v: string) => {
      if (v && v !== "") {
        const plainInput = v.replace(/[() -]/gi, '') || '';
        if (isMaskRegex && isMaskRegex === true) {
          const maskRegEx = new RegExp(mask[0])
          return maskRegEx.test(v) || message as string;
        } else {
          const isValid = mask?.some((mask) => {
            return mask.replace(/[() -]/gi, '').length === plainInput.length;
          });
          return isValid || message as string;
        }
      }
      return true;
    }
  };

  /**
   * Validator that ensures the file is valid.
   * Returns the error message otherwise.
   *
   * @returns {() => ValidationResult}
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
  ):((v: string) => ValidationResult) => {
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
        return validExtensions.length > 1 ?
          `'${fileName}' is not a valid format or has been corrupted. <br />` +
                `Please upload a valid .${validExtensions.slice(0, -1).join(", .")} or ` +
                `.${validExtensions.slice(-1)} file.` 
          :
          `'${fileName}' is not a valid format or has been corrupted. <br />` +
                `Please upload a valid .${validExtensions[0]} file.`
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
          invalidMessage = validExtensions.length > 1 ?
            `'${fileName}' is not a valid format or has been corrupted. ` +
                `Please upload a valid .${validExtensions.slice(0, -1).join(", .")} or ` +
                `.${validExtensions.slice(-1)} file.` 
            :
            `'${fileName}' is not a valid format or has been corrupted. ` +
                `Please upload a valid .${validExtensions[0]} file.`
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


export default {
  install(app: App<any>): void {
    const validation = new ValidationPlugin();
    app.config.globalProperties.$validators = validation;
  },
};
