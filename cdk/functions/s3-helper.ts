import { GetObjectCommandOutput } from "@aws-sdk/client-s3";
import * as stream from "stream";
import * as lambdaTypes from "aws-lambda";

// The names of our asset directories
const ASSET_DIR_REGEX = /^\/(?:css|fonts|img|js)\//i;

/**
 * Strips a single `/` from the start of the string, if one is present.
 * @param str The string to strip
 * @returns The string with up to one fewer `/` characters at the start
 */
function stripLeadingSlash(str: string): string {
  if (str.startsWith("/")) {
    return str.slice(1);
  }
  return str;
}

/**
 * Cleans up the request path from API Gateway.
 *
 * The specific definition of cleaning up is not part of this function's
 * contract; however, generally, it does things that more closely map the
 * event's path to object paths in S3.
 *
 * @param path The path from the API Gateway event
 * @returns A "cleaned up" path
 */
function cleanupRequestPath(urlPath: string): string {
  return stripLeadingSlash(decodeURIComponent(urlPath));
}

/**
 * Checks whether the path ends in an extension that looks like asset.
 *
 * The definition of what extensions look like an asset are not part of the
 * contract of this function; that list can be changed.
 *
 * @param urlPath The path to test
 * @returns true if the extension suggests this is an asset, false otherwise
 */
function hasAnAssetExtension(urlPath: string): boolean {
  const extension = urlPath.split(".").pop();
  if (!extension) {
    return false;
  }
  const assetExtensions = [
    "html",
    "js",
    "css",
    "json",
    "txt",
    "map",
    "png",
    "svg",
    "eot",
    "ttf",
    "woff",
    "woff2",
  ];
  return assetExtensions.includes(extension);
}

/**
 * Checks whether the given path "looks like" a route for the application.
 *
 * The specific definition of what "looks like" a route is not part of this
 * function's contract. The only guarantee is that it tries to return true
 * if the given path looks like something the application would use for a route
 * and false if it does not.
 *
 * @param urlPath The path to check
 * @returns true if the path looks a route and false otherwise
 */
function looksLikeRoute(urlPath: string): boolean {
  // If the file extension is something we know is likely to be an asset in
  if (ASSET_DIR_REGEX.test(urlPath) || hasAnAssetExtension(urlPath)) {
    return false;
  }

  // This implementation avoids creating especially messy regular expressions
  // that may have exponential run times, opening the possibility to a ReDoS
  // vulnerability. This may result in multiple passes over the URL but should
  // still be better than exponential.
  return (
    urlPath
      .split("/")
      // ignore empty segments (potentially caused by `//` in the path)
      .filter((segment) => !!segment)
      // each segment has alphanumeric characters and hyphens. this is the most
      // likely piece to need tweaking
      .every((segment) => /^[a-z0-9-]+$/.test(segment))
  );
}

/**
 * Map a URL path to an S3 path.
 *
 * @param urlPath The path from the API Gateway event
 * @returns the path to the correct file in S3
 */
export function mapToS3Path(urlPath: string): string {
  if (looksLikeRoute(urlPath)) {
    // index.html "handles" all the routes for the application
    return "index.html";
  }

  // Everything else should be looked up in S3 using the same path but
  // "cleaned up" to be more appropriate for a s3:GetOject request.
  return cleanupRequestPath(urlPath);
}

/**
 * Converts the Readable/Stream body of an S3 GetObjectCommandOutput object
 * to a base64-encoded string.
 *
 * Because data from S3 may be binary data, we cannot assume that it will be
 * correct or safe to pass it as a UTF-8 or ASCII string (because images don't
 * encode that way very well, especially though multiple web APIs designed for
 * JSON). This converts it to a base64 string.
 *
 * @param body The Body of the S3 GetObjectCommandOutput
 * @returns The base64-encoded body
 */
export async function s3BodyToBase64String(
  body: stream.Readable
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    body.on("data", (chunk) => chunks.push(chunk));
    body.on("error", reject);
    body.on("end", () => resolve(Buffer.concat(chunks).toString("base64")));
  });
}

/**
 * Converts an S3 GetObjectCommandOutput to an API Gateway response.
 *
 * The body of this response object will always be base64-encoded and the
 * flag to indicate that will be set to true. Additionally, the status code
 * will always be 200 in the returned object. When possible, headers that can
 * be derived from the API call response will be set in the `headers` field.
 * The headers field will always at least be present in the resulting object.
 *
 * @param response A {@link GetObjectCommandOutput} that should be converted to
 *   an API Gateway response
 * @returns An {@link APIGatewayProxyResult} with the body, status code, headers,
 *   and isBase64Encoded attributes set.
 */
export async function s3ToApiResponse(
  response: GetObjectCommandOutput
): Promise<lambdaTypes.APIGatewayProxyResult> {
  const headers: { [key: string]: string } = {};

  if (response.ContentType) {
    headers["Content-Type"] = response.ContentType;
    if (response.ContentType.startsWith("text/")) {
      headers["Content-Type"] += "; charset=utf-8";
    }
  }
  if (response.ETag) {
    headers["ETag"] = response.ETag;
  }
  if (response.LastModified) {
    headers["Last-Modified"] = response.LastModified.toUTCString();
  }

  return {
    // For data consistency purposes, we always base64-encode the object
    // that came from S3, in case it is binary data.
    body: await s3BodyToBase64String(response.Body),
    isBase64Encoded: true,
    // We always return a 200 response if an object was found
    statusCode: 200,
    headers,
  };
}
