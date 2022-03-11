export default new (class Validation {
  public install(Vue: any) {
    Vue.prototype.$validation = this;
  }

  /**
   * Validator that validates input should not exceed a given length
   * Returns the error message otherwise.
   *
   * @param {number} length The maximum length allowed for the field's value
   * @param {string} message
   * @returns {function(*): (boolean|string)}
   */
  public maxLength(
    length: number,
    message?: string
  ): (v: any) => string | true | undefined {
    message = message || `Max ${length} characters allowed.`;
    return (v: any) => {
      return v && v.length > length ? message : true;
    };
  }

  /**
   * Validator that validates input meets a minimum length
   * Returns the error message otherwise.
   *
   * @param {number} length The minimum length allowed for the field's value
   * @param {string} message
   * @returns {function(*): (boolean|string)}
   */
  public minLength(
    length: number,
    message?: string
  ): (v: any) => string | true | undefined {
    message = message || `Min ${length} characters allowed.`;

    return (v: any) => {
      return v && v.length < length ? message : true;
    };
  }

  /**
   * Validator that ensures the field value is not empty.
   * Returns the error message otherwise.
   *
   * @param message
   * @returns {function(*=): boolean}
   */
  public required(message?: string): (v: any) => string | true | undefined {
    message = message || "This field is required.";

    return (v: any) => {
      return !v || (v.length && v.length < 1) ? message : true;
    };
  }

  /**
   * Validator ensures that field only contains integers
   * Returns the error message otherwise.
   *
   * @param message
   * @returns {function(*=): boolean}
   */
  public integer(message?: string): (v: any) => string | true | undefined {
    message = message || "The value must be an integer number";

    return (v) => Number.isInteger(Number(v)) || message;
  }
})();
