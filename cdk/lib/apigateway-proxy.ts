import * as apigw from "@aws-cdk/aws-apigateway";
import * as lambdaNodeJs from "@aws-cdk/aws-lambda-nodejs";
import * as lambda from "@aws-cdk/aws-lambda";
import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as logs from "@aws-cdk/aws-logs";

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

    const proxyAccessLogs = new logs.LogGroup(this, "ProxyAccessLogs");

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
        accessLogDestination: new apigw.LogGroupLogDestination(proxyAccessLogs),
        accessLogFormat: apigw.AccessLogFormat.custom(
          JSON.stringify({
            requestId: apigw.AccessLogField.contextRequestId(),
            extendedRequestId: apigw.AccessLogField.contextExtendedRequestId(),
            xrayTraceId: apigw.AccessLogField.contextXrayTraceId(),
            // This field is in the Apache Common Log Format
            requestTime: apigw.AccessLogField.contextRequestTime(),
            httpMethod: apigw.AccessLogField.contextHttpMethod(),
            protocol: apigw.AccessLogField.contextProtocol(),
            responseLength: apigw.AccessLogField.contextResponseLength(),
            status: apigw.AccessLogField.contextStatus(),
            resourcePath: apigw.AccessLogField.contextResourcePath(),
            path: apigw.AccessLogField.contextPath(),
            ip: apigw.AccessLogField.contextIdentitySourceIp(),
            userAgent: apigw.AccessLogField.contextIdentityUserAgent(),
            // The Request ID for the integration (Lambda)
            integrationRequestId: "$context.integration.requestId",
            integrationLatency:
              apigw.AccessLogField.contextIntegrationLatency(),
          })
        ),
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
