/**
 * A response to an HTTP OPTIONS request.
 *
 * Note that CORs headers are explicitly not included.
 */
export const OPTIONS_RESPONSE = {
  body: "",
  statusCode: 200,
  headers: {
    Allow: "OPTIONS, GET",
  },
};

/**
 * An error response for all requests that are not a GET or OPTIONS.
 */
export const UNSUPPORTED_METHOD = {
  body: JSON.stringify({ message: "Unsupported request type" }),
  statusCode: 405,
};

/**
 * A generic HTTP Not Found error with an empty body.
 */
export const NOT_FOUND = {
  body: JSON.stringify({ message: "File not found" }),
  statusCode: 404,
};

/**
 * An error response for when an unknown error condition occurred.
 */
export const UNKNOWN_ERROR = {
  body: JSON.stringify({ message: "An unknown error occurred" }),
  statusCode: 500,
};
