import * as iam from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import { Construct, Stack } from "@aws-cdk/core";

export class StaticSite extends Construct {
  public readonly websiteBucket: s3.IBucket;
  public readonly deploymentUser: iam.IUser;

  constructor(parent: Stack, name: string) {
    super(parent, name);

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });
    this.websiteBucket = siteBucket;
    new cdk.CfnOutput(this, "BucketName", { value: siteBucket.bucketName });
    new cdk.CfnOutput(this, "WebsiteUrl", {
      value: siteBucket.bucketWebsiteUrl,
    });
    new cdk.CfnOutput(this, "IndexHttpsUrl", {
      value: siteBucket.virtualHostedUrlForObject("index.html"),
    });

    const deploymentUser = new iam.User(this, "DeploymentUser");
    this.deploymentUser = deploymentUser;
    new cdk.CfnOutput(this, "DeploymentUserName", {
      value: deploymentUser.userName,
    });
    deploymentUser.addToPolicy(
      new iam.PolicyStatement({
        resources: [siteBucket.bucketArn],
        actions: ["s3:ListBucket"],
      })
    );
    deploymentUser.addToPolicy(
      new iam.PolicyStatement({
        resources: [siteBucket.arnForObjects("*")],
        actions: ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      })
    );

    // We cannot currently use the AWS CDK to create a Secret resource with a
    // specified value. At the moment, this is intentionally prohibited by the
    // CDK. As of
    // https://github.com/aws/aws-cdk/issues/5810
    // the CDK team intends to allow tokenized secrets, which will let us store
    // the value so long as we're referencing another resource's attributes
    // (in this case, the an AccessKey's attributes)
    // This code is commented below to allow us to us to use it as a starting
    // point later; though it may not work as-is if the final API is different.
    /*
    const userAccessKey = new iam.CfnAccessKey(this, "DeploymentAccessKey", {
      userName: deploymentUser.userName,
    });
    new cdk.CfnOutput(this, "DeploymentUserAccessKey", { value: userAccessKey.ref });
    const userAccessSecret = new secretsmanager.Secret(
      this,
      "DeploymentSecret",
      {
        description: "Access key used by GitHub Actions to deploy the SPA",
        secretString: userAccessKey.attrSecretAccessKey,
      },
    );
    */
  }
}
