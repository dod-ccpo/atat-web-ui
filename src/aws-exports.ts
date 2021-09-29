import { Amplify } from "aws-amplify";

export default Amplify.configure({
  Auth: {
    region: "us-gov-west-1",
    userPoolId: "us-gov-west-1_0lfLVq0Kh",
    userPoolWebClientId: "7t6ecl3cmes30gj6nsjvce5rc1",
    oauth: {
      domain: "atat-api-at6532.auth-fips.us-gov-west-1.amazoncognito.com",
      scope: ["phone", "email", "openid", "profile"],
      redirectSignIn: window.location.href,
      redirectSignOut: window.location.href,
      responseType: "code",
      options: {
        AdvancedSecurityDataCollectionFlag: false,
      },
    },
  },
});
