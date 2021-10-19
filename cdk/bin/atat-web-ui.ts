import * as cdk from "@aws-cdk/core";
import { StaticSiteStack } from "../lib/atat-static-spa-stack";
import { getTags } from "../lib/load-tags";
import * as util from "../lib/util";

const APPLICATION_NAME = "ATAT";

const app = new cdk.App();
const environmentParam = app.node.tryGetContext("EnvironmentId");

if (!util.isString(environmentParam)) {
  console.error("An EnvironmentId must be provided");
  process.exit(1);
}
const environmentName = util.normalizeEnvironmentName(environmentParam);
const environmentId = util.lowerCaseEnvironmentId(environmentParam);
const stacks = [];
stacks.push(
  new StaticSiteStack(app, environmentName + "StaticSpa", {
    environmentId,
    applicationName: APPLICATION_NAME,
  })
);
for (const stack of stacks) {
  // Apply tags from both tag files; warn if unable to load tags from either
  const tagFiles = ["tags.json", "tags-private.json"];
  for (const tagFile of tagFiles) {
    try {
      getTags(tagFile).forEach((tag) =>
        cdk.Tags.of(stack).add(tag.key, tag.value)
      );
    } catch (err) {
      cdk.Annotations.of(stack).addInfo("Unable to load tags from " + tagFile);
    }
  }
}
app.synth();
