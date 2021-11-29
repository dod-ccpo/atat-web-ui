export interface ValidationError extends Error {
  /**
   * Maps form input IDs to validation error messages so that clients can display in-line errors
   * @type {any}
   * @memberof ValidationError
   */
  errorMap: any;
}
