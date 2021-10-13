import { Amplify } from "aws-amplify";

/**
 * NOTE TO DEVS: Modify these values to test in other environments.
 */
const USER_POOL_ID = "us-gov-west-1_bmGhvyw5q";
const USER_POOL_CLIENT_ID = "7vuvs1b4mltqu09tfuu7hcbil1";
const ENVIRONMENT_ID = "dev";
/* END MODIFICATIONS */

const REGION = USER_POOL_ID.split("_")[0];
const REDIRECT_URL = `${window.location.origin}/index.html`;

export default Amplify.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: USER_POOL_CLIENT_ID,
    oauth: {
      domain: `atat-api-${ENVIRONMENT_ID}.auth-fips.${REGION}.amazoncognito.com`,
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
