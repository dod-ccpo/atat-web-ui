import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambdaNodeJs from "@aws-cdk/aws-lambda-nodejs";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";

export interface ApiGatewayProxyProps {
  bucket: s3.IBucket;
  environmentId: string;
  ssmPrefix: string;
}

export class ApiGatewayProxy extends cdk.Construct {
  public readonly api: apigw.RestApi;
  public readonly proxyFunction: lambda.IFunction;
  constructor(scope: cdk.Construct, id: string, props: ApiGatewayProxyProps) {
    super(scope, id);

    const lambdaProxy = new lambdaNodeJs.NodejsFunction(this, "Proxy", {
      entry: "functions/proxy.ts",
      environment: {
        SPA_BUCKET_NAME: props.bucket.bucketName,
        ENVIRONMENT_ID: props.environmentId,
        SSM_PREFIX: props.ssmPrefix,
      },
    });
    props.bucket.grantRead(lambdaProxy);

    const proxyApi = new apigw.LambdaRestApi(this, "ApiGwProxy", {
      handler: lambdaProxy,
      restApiName: `Web App Proxy (${props.environmentId})`,
      description: "Proxies requests to the SPA in S3",
      deployOptions: {
        cachingEnabled: false,
        // These cannot be enabled until we can configure the
        // integrationOptions, as added in
        // https://github.com/aws/aws-cdk/pull/17065
        // This is expected in the near future.
        // cachingEnabled: true,
        // cacheDataEncrypted: true,
        // cacheTtl: cdk.Duration.hours(1),
        tracingEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
      },
      binaryMediaTypes: ["*/*"],
      endpointConfiguration: {
        types: [apigw.EndpointType.REGIONAL],
      },
    });

    this.api = proxyApi;
    this.proxyFunction = lambdaProxy;
  }
}
