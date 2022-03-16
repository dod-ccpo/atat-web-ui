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
): ((v: string ) => string | true | undefined) => {
  message = message || `Min ${length} characters allowed.`;

  return (v: string ) => {
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
 * Validator that validates input should not exceed a given length
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
    return v && v < max ? message : true;
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
      lessThan
    };
  },
};
