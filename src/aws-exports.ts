// import { Injectable } from "@angular/core";
// import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Amplify } from "aws-amplify";
// import { Observable } from "rxjs";
// import { BehaviorSubject } from "rxjs";
// import {
//   CognitoUserPool,
//   CognitoUserAttribute,
//   CognitoUser,
//   AuthenticationDetails,
//   CognitoUserSession,
// } from "amazon-cognito-identity-js";
import Auth, { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
// import { Hub, ICredentials } from "@aws-amplify/core";
// import { User } from "./user.model";
// import awsconfig from "../aws-exports";

export default Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: "XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab",

    // REQUIRED - Amazon Cognito Region
    region: "us-gov-west-1",

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "us-gov-west-1_aOkFERvad", //changed characters for paste, but this is at the top of general settings where it says Pool ID:

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "5fds5lg97ube8qf96l08ef583p", //couldn't find a web client ID, but I did find app client id, which has 26 characters

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    //mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // // // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // // cookieStorage: {
    // //   // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    // //   domain: '.yourdomain.com',
    // //   // OPTIONAL - Cookie path
    // //   path: '/',
    // //   // OPTIONAL - Cookie expiration in days
    // //   expires: 365,
    // //   // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    // //   sameSite: "strict" | "lax",
    // //   // OPTIONAL - Cookie secure flag
    // //   // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    // //   secure: true
    // // },

    // OPTIONAL - customized storage object

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },

    // OPTIONAL - Hosted UI configuration
    // oauth: {
    //   domain: 'ecommercetest.auth.us-east-1.amazoncognito.com',  //domain I added. reference: https://postimg.cc/TpMYrJWs
    //   scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    //   redirectSignIn: 'http://localhost:3000/',
    //   redirectSignOut: 'http://localhost:3000/',
    //   responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    // }
  },
});
// You can get the current config object
// const currentConfig = Auth.configure();

// const POOL_DATA = {
//   UserPoolId: "us-east-1_Jddp333m",
//   ClientId: "3533438444m9333on0sjkbn",
// };

// const userPool = new CognitoUserPool(POOL_DATA);

// @Injectable({ providedIn: "root" })
// export class AuthService {
//   authIsLoading = new BehaviorSubject<boolean>(false);
//   authDidFail = new BehaviorSubject<boolean>(false);
//   authStatusChanged = new Subject<boolean>();
//   public loggedIn: boolean;

//   private _authState: Subject<CognitoUser | any> = new Subject<
//     CognitoUser | any
//   >();
//   authState: Observable<CognitoUser | any> = this._authState.asObservable();

//   public static SIGN_IN = "signIn";
//   public static SIGN_OUT = "signOut";
//   public static GOOGLE = CognitoHostedUIIdentityProvider.Google;
//   registeredUser: CognitoUser;
//   constructor(private router: Router) {}

//   signUp(username: string, email: string, password: string): void {
//     this.authIsLoading.next(true);
//     const user: User = {
//       username: username,
//       email: email,
//       password: password,
//     };
//     const attrList: CognitoUserAttribute[] = [];
//     const emailAttribute = {
//       Name: "email",
//       Value: user.email,
//     };
//     attrList.push(new CognitoUserAttribute(emailAttribute));
//     userPool.signUp(
//       user.username,
//       user.password,
//       attrList,
//       null,
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           this.authDidFail.next(true);
//           this.authIsLoading.next(false);
//           return;
//         }
//         this.authDidFail.next(false);
//         this.authIsLoading.next(false);
//         this.registeredUser = result.user;
//       }
//     );
//     return;
//   }

//   confirmUser(username: string, code: string) {
//     this.authIsLoading.next(true);
//     const userData = {
//       Username: username,
//       Pool: userPool,
//     };
//     const cognitUser = new CognitoUser(userData);
//     cognitUser.confirmRegistration(code, true, (err, result) => {
//       if (err) {
//         this.authDidFail.next(true);
//         this.authIsLoading.next(false);
//         return;
//       }
//       this.authDidFail.next(false);
//       this.authIsLoading.next(false);
//       this.router.navigate(["/"]);
//     });
//   }
//   socialSignIn(
//     provider: CognitoHostedUIIdentityProvider
//   ): Promise<ICredentials> {
//     return Auth.federatedSignIn({ provider: provider });
//   }
//   signIn(username: string, password: string): void {
//     this.authIsLoading.next(true);
//     const authData = {
//       Username: username,
//       Password: password,
//     };
//     const authDetails = new AuthenticationDetails(authData);
//     const userData = {
//       Username: username,
//       Pool: userPool,
//     };
//     const cognitoUser = new CognitoUser(userData);
//     const that = this;
//     cognitoUser.authenticateUser(authDetails, {
//       onSuccess(result: CognitoUserSession): void {
//         that.authStatusChanged.next(true);
//         that.authDidFail.next(false);
//         that.authIsLoading.next(false);
//         console.log(result);
//       },
//       onFailure(err): void {
//         that.authDidFail.next(true);
//         that.authIsLoading.next(false);
//         console.log(err);
//       },
//     });
//     this.authStatusChanged.next(true); // create user with cognito data

//     return;
//   }

//   getAuthenticatedUser() {
//     return userPool.getCurrentUser();
//   }

//   logout() {
//     this.getAuthenticatedUser().signOut();
//     this.authStatusChanged.next(false);
//   }

//   isAuthenticated(): Observable<boolean> {
//     const user = this.getAuthenticatedUser();
//     const obs = Observable.create((observer) => {
//       if (!user) {
//         observer.next(false);
//       } else {
//         user.getSession((err, session) => {
//           if (err) {
//             observer.next(false);
//           } else {
//             if (session.isValid()) {
//               observer.next(true);
//             } else {
//               observer.next(false);
//             }
//           }
//         });
//       }
//       observer.complete();
//     });
//     return obs;
//   }

//   initAuth() {
//     this.isAuthenticated().subscribe((auth) =>
//       this.authStatusChanged.next(auth)
//     );
//   }
// }
