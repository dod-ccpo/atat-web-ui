import { S3 } from "@aws-sdk/client-s3";
import * as lambdaTypes from "aws-lambda";
import * as process from "process";
import * as configuration from "./configuration";
import * as s3Helper from "./s3-helper";
import * as responses from "./responses";

const s3Client = new S3({});
// We can be sure that this is available and it is a non-recoverable error
// if it is not anyway.
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SPA_BUCKET = process.env.SPA_BUCKET_NAME!;

const CONFIGURATION_ROUTE = /^\/configuration\/?$/;

export async function handleGetHead(
  path: string
): Promise<lambdaTypes.APIGatewayProxyResult> {
  if (CONFIGURATION_ROUTE.test(path)) {
    console.log("Configuration endpoint hit");
    return configuration.handleConfigurationRoute();
  }

  const s3path = s3Helper.mapToS3Path(path);
  try {
    const response = await s3Client.getObject({
      Bucket: SPA_BUCKET,
      Key: s3path,
    });
    return s3Helper.s3ToApiResponse(response);
  } catch (err: any) {
    if (err.name === "NoSuchKey") {
      return responses.NOT_FOUND;
    }
    console.log("An unknown error occurred", err);
    return responses.UNKNOWN_ERROR;
  }
}

export async function handler(
  event: lambdaTypes.APIGatewayProxyEvent
): Promise<lambdaTypes.APIGatewayProxyResult> {
  switch (event.httpMethod) {
    case "GET":
      return handleGetHead(event.path);
    case "OPTIONS":
      return responses.OPTIONS_RESPONSE;
    default:
      return responses.UNSUPPORTED_METHOD;
  }
}
