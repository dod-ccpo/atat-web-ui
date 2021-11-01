import * as cognito from "@aws-cdk/aws-cognito";
import * as ssm from "@aws-cdk/aws-ssm";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as apigw from "@aws-cdk/aws-apigateway";
import * as iam from "@aws-cdk/aws-iam";
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
  public readonly ssmParameters: ssm.IParameter[] = [];

  constructor(parent: cdk.App, name: string, props: StaticSiteProps) {
    super(parent, name, props);
    const ssmPrefix = props.applicationName.toLowerCase();
    const site = new StaticSite(this, "StaticSite");
    this.bucket = site.websiteBucket;
    // TODO: Remove this
    this.workaroundToAllowDeveloperRoleToDeploy(site.deploymentPolicy);

    const proxy = new ApiGatewayProxy(this, "SiteProxy", {
      bucket: site.websiteBucket,
      environmentId: props.environmentId,
      ssmPrefix,
    });
    this.proxy = proxy.api;
    proxy.proxyFunction.addToRolePolicy(
      new iam.PolicyStatement({
        sid: "AllowSsmParameterRead",
        actions: ["ssm:GetParameter*"],
        resources: [
          cdk.Arn.format(
            {
              service: "ssm",
              resource: "parameter",
              resourceName: `${ssmPrefix}/${props.environmentId}/*`,
            },
            this
          ),
        ],
      })
    );

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
      siteUrls.push(
        `https://localhost:${port}/${proxy.api.deploymentStage.stageName}/`
      );
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
    this.ssmParameters.push(
      new ssm.StringParameter(this, "UserPoolClientId", {
        stringValue: this.userPoolClient.userPoolClientId,
        description: "Cognito User Pool Client ID",
        parameterName: `/${ssmPrefix}/${props.environmentId}/cognito/userpool/client/id`,
      })
    );
  }

  /**
   * This allows developers to deploy the SPA when using the developer role
   * instead of "being" the Deployment User.
   *
   * @param deploymentPolicy The policy that grants write the necessary deployment access
   */
  private workaroundToAllowDeveloperRoleToDeploy(
    deploymentPolicy: iam.IManagedPolicy
  ) {
    // Ideally this would only work for sandbox environments but we don't have
    // any way to identify those beyond a guess based on the name. When we add
    // the ability for a full (including CDK) deployment to be done via the CI
    // pipeline and potentially start deploying sandbox environments, we should
    // consider removing this.
    // TODO: This must not be kept in production-like environments.
    const developerRole = iam.Role.fromRoleArn(
      this,
      "DeveloperRole",
      cdk.Fn.importValue("AtatDeveloperRoleArn")
    );
    developerRole.addManagedPolicy(deploymentPolicy);
  }
}
