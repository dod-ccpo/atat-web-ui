import * as cognito from "@aws-cdk/aws-cognito";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as apigw from "@aws-cdk/aws-apigateway";
import { StaticSite } from "../lib/static-website";
import { ApiGatewayProxy } from "../lib/apigateway-proxy";

interface StaticSiteProps extends cdk.StackProps {
  environmentId: string;
  applicationName: string;
}

export class StaticSiteStack extends cdk.Stack {
  public readonly bucket: s3.IBucket;
  public readonly proxy: apigw.IRestApi;
  public readonly userPoolClient: cognito.IUserPoolClient;

  constructor(parent: cdk.App, name: string, props: StaticSiteProps) {
    super(parent, name, props);
    const ssmPrefix = props.applicationName.toLowerCase();
    const site = new StaticSite(this, "StaticSite");
    this.bucket = site.websiteBucket;

    const proxy = new ApiGatewayProxy(this, "SiteProxy", {
      bucket: site.websiteBucket,
      environmentId: props.environmentId,
    });
    this.proxy = proxy.api;

    const poolId = ssm.StringParameter.fromStringParameterName(
      this,
      "UserPoolId",
      `/${ssmPrefix}/${props.environmentId}/cognito/userpool/id`
    ).stringValue;
    const idpNames = ssm.StringListParameter.fromStringListParameterName(
      this,
      "CognitoIdPNames",
      `/${ssmPrefix}/${props.environmentId}/cognito/idps`
    ).stringListValue;
    const userPool = cognito.UserPool.fromUserPoolId(this, "UserPool", poolId);

    const siteUrls = [proxy.api.urlForPath()];
    // TODO: Only include localhost in pre-staging environments.
    for (const port of ["8080", "8081"]) {
      siteUrls.push(`https://localhost:${port}/index.html`);
    }
    this.userPoolClient = userPool.addClient("ApplicationUserPoolClient", {
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
      userPoolClientName: `${props.applicationName} Web UI`,
    });
  }
}
