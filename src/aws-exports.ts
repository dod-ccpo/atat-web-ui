import { Amplify } from "aws-amplify";
import { ATATConfiguration } from "./atat-config-builder";

/**
 * NOTE TO DEVS: Modify these values to test in other environments.
 */

const ENVIRONMENT_ID = "dev";
/* END MODIFICATIONS */

const REDIRECT_URL = `${window.location.origin}${process.env.BASE_URL}`;

export const buildConfig = (config: ATATConfiguration): unknown => {
  return Amplify.configure({
    Auth: {
      region: config.awsRegion,
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.userPoolClientId,
      oauth: {
        domain: `atat-api-${ENVIRONMENT_ID}.auth-fips.${config.awsRegion}.amazoncognito.com`,
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
