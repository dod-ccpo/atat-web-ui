import * as cdk from "@aws-cdk/core";
import "source-map-support/register";
import { StaticSite } from "./static-website";

class StaticSiteStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
    super(parent, name, props);

    new StaticSite(this, "StaticSite");
  }
}

const app = new cdk.App();
const accountId = app.node.tryGetContext("account");
const region = app.node.tryGetContext("region");
new StaticSiteStack(app, "StaticSpa", {
  env: { account: accountId, region },
});
app.synth();
