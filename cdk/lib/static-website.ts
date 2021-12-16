import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { Construct, Stack, StaticSiteProps } from "@aws-cdk/core";

interface StaticSiteProps extends cdk.StackProps {
  environmentId: string;
  applicationName: string;
}

export class StaticSite extends Construct {
  public readonly websiteBucket: s3.IBucket;
  public readonly deploymentRole: iam.IRole;
  public readonly deploymentPolicy: iam.IManagedPolicy;

  constructor(parent: Stack, name: string, props: StaticSiteProps) {
    super(parent, name);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });
    this.websiteBucket = siteBucket;

    this.deploymentPolicy = new iam.ManagedPolicy(this, "SpaDeploymentPolicy", {
      statements: [
        new iam.PolicyStatement({
          resources: [siteBucket.bucketArn],
          actions: ["s3:ListBucket"],
        }),
        new iam.PolicyStatement({
          resources: [siteBucket.arnForObjects("*")],
          actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
        }),
      ],
    });

    const githubProvider =
      iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
        this,
        "GitHubProvider",
        cdk.Fn.importValue("AtatGitHubOidcProvider")
      );
    this.deploymentRole = new iam.Role(this, "SpaDeploymentRole", {
      roleName: props.environmentId + "AtatSpaDeploymentRole",
      description: "Role to perform SPA deployments from a CI/CD pipeline",
      managedPolicies: [this.deploymentPolicy],
      assumedBy: new iam.OpenIdConnectPrincipal(githubProvider).withConditions({
        StringLike: {
          // Allow deployments only from the develop branch of the atat-web-ui repo
          "token.actions.githubusercontent.com:sub":
            "repo:dod-ccpo/atat-web-ui:ref:refs/heads/develop",
        },
      }),
    });
  }
}
