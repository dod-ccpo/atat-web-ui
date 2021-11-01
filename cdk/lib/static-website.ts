import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { Construct, Stack } from "@aws-cdk/core";

export class StaticSite extends Construct {
  public readonly websiteBucket: s3.IBucket;
  public readonly deploymentUser: iam.IUser;
  public readonly deploymentPolicy: iam.IManagedPolicy;

  constructor(parent: Stack, name: string) {
    super(parent, name);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });
    this.websiteBucket = siteBucket;

    const deploymentUser = new iam.User(this, "DeploymentUser");
    const deploymentPolicy = new iam.ManagedPolicy(this, "SpaDeploymentPolicy");
    deploymentUser.addManagedPolicy(deploymentPolicy);

    this.deploymentUser = deploymentUser;
    this.deploymentPolicy = deploymentPolicy;

    deploymentPolicy.addStatements(
      new iam.PolicyStatement({
        resources: [siteBucket.bucketArn],
        actions: ["s3:ListBucket"],
      }),
      new iam.PolicyStatement({
        resources: [siteBucket.arnForObjects("*")],
        actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      })
    );
  }
}
