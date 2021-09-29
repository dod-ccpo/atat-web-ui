import * as cognito from "@aws-cdk/aws-cognito";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
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
    const idpNames = ssm.StringListParameter.fromStringListParameterName(
      this,
      "CognitoIdPNames",
      `/atat/${props.environmentId}/cognito/idps`
    ).stringListValue;
    const userPool = cognito.UserPool.fromUserPoolId(this, "UserPool", poolId);
    // TODO: Only include localhost in pre-staging environments.
    const siteUrls = [
      site.websiteBucket.virtualHostedUrlForObject("index.html"),
    ];
    for (const port of ["8080", "8081"]) {
      for (const page of ["/", "/dashboard"]) {
        siteUrls.push(`https://localhost:${port}${page}`);
      }
    }
    userPool.addClient("ApplicationUserPoolClient", {
      supportedIdentityProviders: idpNames.map(
        cognito.UserPoolClientIdentityProvider.custom
      ),
      accessTokenValidity: cdk.Duration.minutes(60),
      refreshTokenValidity: cdk.Duration.days(1),
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        callbackUrls: siteUrls,
        logoutUrls: siteUrls,
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

new StaticSiteStack(app, environmentName + "StaticSpa", {
  environmentId,
});
app.synth();
