import { Amplify } from "aws-amplify";
import { ATATConfiguration } from "./atat-config-builder";

const REDIRECT_URL = `${window.location.origin}${process.env.BASE_URL}`;

export const buildConfig = (config: ATATConfiguration): unknown => {
  return Amplify.configure({
    Auth: {
      region: config.awsRegion,
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.userPoolClientId,
      oauth: {
        domain: config.cognitoDomain,
        scope: ["phone", "email", "openid", "profile"],
        redirectSignIn: REDIRECT_URL,
        redirectSignOut: REDIRECT_URL,
        responseType: "code",
        options: {
          AdvancedSecurityDataCollectionFlag: false,
        },
      },
    },
  });
};
