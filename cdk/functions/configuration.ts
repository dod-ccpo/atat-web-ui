import * as lambdaTypes from "aws-lambda";
import * as process from "process";
import * as ssm from "@aws-sdk/client-ssm";

const SSM_CLIENT = new ssm.SSM({});

interface ConfigurationData {
  applicationConfig: {
    apiUrl: string;
  };
  authenticationConfig: {
    userPoolId: string;
    userPoolClientId: string;
    awsRegion: string;
  };
}

async function getStringValue(name: string): Promise<string> {
  const parameter = await SSM_CLIENT.getParameter({ Name: name });
  if (!parameter?.Parameter?.Value) {
    throw new Error("No value for " + name);
  }
  return parameter.Parameter.Value;
}

export async function handleConfigurationRoute(): Promise<lambdaTypes.APIGatewayProxyResult> {
  const environmentId = process.env.ENVIRONMENT_ID;
  const ssmPrefix = process.env.SSM_PREFIX;
  // Using ! is safe because per the Lambda API, this must be defined
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const region = process.env.AWS_REGION!;
  const configuration: ConfigurationData = {
    applicationConfig: {
      apiUrl: await getStringValue(`/${ssmPrefix}/${environmentId}/api/url`),
    },
    authenticationConfig: {
      userPoolId: await getStringValue(
        `/${ssmPrefix}/${environmentId}/cognito/userpool/id`
      ),
      userPoolClientId: await getStringValue(
        `/${ssmPrefix}/${environmentId}/cognito/userpool/client/id`
      ),
      awsRegion: region,
    },
  };
  return {
    statusCode: 200,
    body: JSON.stringify(configuration),
  };
}
