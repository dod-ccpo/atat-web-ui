import { isValid } from "date-fns";

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
    return !v || (v.length && v.length < 1) ? message : true;
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
    // console.log(v);
    // console.log(/^[0-9]*$/.test(v.replaceAll(/\//g, "")) )
    return v && /^[0-9]*$/.test(v.replaceAll(/\//g, "")) || message 
  };
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
      isDateValid
    };
  },
};