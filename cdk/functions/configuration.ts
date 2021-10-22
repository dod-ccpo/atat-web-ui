import * as lambdaTypes from "aws-lambda";

export async function handleConfigurationRoute(): Promise<lambdaTypes.APIGatewayProxyResult> {
  // TODO(AT-6747): Implement retrieval of values
  const configuration = {
    applicationConfig: {
      userPoolId: "",
      userPoolClientId: "",
      awsRegion: "us-gov-west-1",
      apiUrl: "",
    },
  };
  return {
    statusCode: 200,
    body: JSON.stringify(configuration),
  };
}
