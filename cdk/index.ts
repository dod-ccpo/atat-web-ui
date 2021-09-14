import * as cognito from "@aws-cdk/aws-cognito";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
import "source-map-support/register";
import { StaticSite } from "./static-website";
import * as util from "./util";

interface StaticSiteProps extends cdk.StackProps {
  environmentId: string;
}

class StaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: StaticSiteProps) {
    super(parent, name, props);

    const site = new StaticSite(this, "StaticSite");
    const poolId = ssm.StringParameter.fromStringParameterName(
      this,
      "UserPoolId",
      `/atat/${props.environmentId}/cognito/userpool/id`
    ).stringValue;
    const userPool = cognito.UserPool.fromUserPoolId(this, "UserPool", poolId);
    userPool.addClient("ApplicationUserPoolClient", {
      accessTokenValidity: cdk.Duration.minutes(60),
      refreshTokenValidity: cdk.Duration.days(1),
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: [
          site.websiteBucket.virtualHostedUrlForObject("index.html"),
        ],
        logoutUrls: [
          site.websiteBucket.virtualHostedUrlForObject("index.html"),
        ],
        scopes: [
          cognito.OAuthScope.PHONE,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.PROFILE,
        ],
      },
      preventUserExistenceErrors: true,
      generateSecret: false,
      userPoolClientName: "ATAT Web UI",
    });
  }
}

const app = new cdk.App();
const environmentParam = app.node.tryGetContext("EnvironmentId");
if (!util.isString(environmentParam)) {
  console.error("An EnvironmentId must be provided");
  process.exit(1);
}
const environmentName = util.normalizeEnvironmentName(environmentParam);
const environmentId = util.lowerCaseEnvironmentId(environmentParam);

const spaStack = new StaticSiteStack(app, environmentName + "StaticSpa", {
  environmentId,
});
app.synth();
