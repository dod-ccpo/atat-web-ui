import {
  GetObjectCommandOutput,
  HeadObjectCommandOutput,
} from "@aws-sdk/client-s3";
import * as stream from "stream";
import * as lambdaTypes from "aws-lambda";

// The names of our asset directories
const ASSET_DIR_REGEX = /^\/(?:css|fonts|img|js)\//i;
// All routes are words (and usually camelCase)
const LOOKS_LIKE_ROUTE = /^\/[a-z]*\/?/i;

/**
 * Map a URL path to an S3 path
 * @param urlPath The path from the API Gateway event
 * @returns the path to the correct file in S3
 */
export function mapToS3Path(urlPath: string): string {
  const stripLeadingSpace = (str: string): string =>
    str.startsWith("/") ? str.slice(1) : str;
  // Checks for paths that start with one of our asset directories,
  // followed by a `/` character.
  if (ASSET_DIR_REGEX.test(urlPath)) {
    return stripLeadingSpace(urlPath);
  }

  // Our routes are all word-like values, without numbers or symbols
  // so if it doesn't look like that, we should probably just assume
  // its supposed to go to a file
  if (!LOOKS_LIKE_ROUTE.test(urlPath)) {
    return stripLeadingSpace(urlPath);
  }

  // Default to returning index.html for everything
  return "index.html";
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

export async function s3ToApiResponse(
  response: GetObjectCommandOutput | HeadObjectCommandOutput
): Promise<lambdaTypes.APIGatewayProxyResult> {
  let body = "";
  if ("Body" in response) {
    body = await s3BodyToBase64String(response.Body);
  }

  const statusCode = 200;
  const isBase64Encoded = true;

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

  const eventResponse: lambdaTypes.APIGatewayProxyResult = {
    body,
    statusCode,
    isBase64Encoded,
    headers,
  };

  return eventResponse;
}
