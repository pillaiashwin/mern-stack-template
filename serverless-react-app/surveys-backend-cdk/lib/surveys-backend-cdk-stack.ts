import * as cdk from "@aws-cdk/core";
import * as cognito from "@aws-cdk/aws-cognito";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as apig from "@aws-cdk/aws-apigateway";

const LAMBDAS_OUTPUT_DIR = "./functions/build";
const TABLE_NAME = "surveys";
const PRIMARY_KEY = "userId";
const SORT_KEY = "createdAt";

const DEFAULT_CORS_PREFLIGHT_OPTIONS: apig.CorsOptions = {
  allowOrigins: apig.Cors.ALL_ORIGINS,
  allowMethods: apig.Cors.ALL_METHODS,
  allowHeaders: ["*"]
};

const DEFAULT_LAMBDA_FUNCTION_PROPS: Omit<lambda.FunctionProps, "handler"> = {
  runtime: lambda.Runtime.NODEJS_10_X,
  code: lambda.Code.fromAsset(LAMBDAS_OUTPUT_DIR),
  environment: {
    TABLE_NAME,
    PRIMARY_KEY
  },
};

export class SurveysBackendCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Auth
    const userPool = this.createUserPool();
    const userPoolClient = this.addClientToUserPool(userPool);

    const identityPool = this.createIdentityPool(userPoolClient, userPool);
    this.setupCognitoRoles(identityPool);

    // Database
    const dynamoTable = this.createDynamoTable();

    // Lambdas
    const createSurveyFunction = this.createCreateSurveyFunction(DEFAULT_LAMBDA_FUNCTION_PROPS);
    const listByUserIdFunction = this.createListByUserIdFunction(DEFAULT_LAMBDA_FUNCTION_PROPS);

    this.addGrantsToDynamoTable(dynamoTable, createSurveyFunction, listByUserIdFunction);

    // Rest API
    const restApi = this.createRestApi();
    const authorizer = this.createRestApiAuthorizer(restApi, userPool);
    const defaultMethodProps: apig.MethodOptions = this.defaultMethodProps(authorizer);
    this.addRestApiResources(restApi, defaultMethodProps, createSurveyFunction, listByUserIdFunction);

    this.outputs(identityPool, userPool, userPoolClient, restApi);
  }

  private createUserPool() {
    return new cognito.UserPool(this, "CdkAuthUserPool", {
      userPoolName: "surveys-user-pool",
      autoVerify: { email: true },
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 6,
        requireSymbols: false,
        requireLowercase: false,
        requireDigits: false,
        requireUppercase: false
      }
    });
  }

  private addClientToUserPool(userPool: cognito.UserPool) {
    return userPool.addClient("CdkAuthUserPoolClient", {
      userPoolClientName: "surveys-user-pool-client"
    });
  }

  private createIdentityPool(userPoolClient: cognito.UserPoolClient, userPool: cognito.UserPool) {
    return new cognito.CfnIdentityPool(this, "CdkAuthIdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });
  }

  private setupCognitoRoles(identityPool: cognito.CfnIdentityPool) {
    const authenticatedRole = new iam.Role(this, "CdkCognitoDefaultAuthenticatedRole", {
      assumedBy: new iam.FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: { "cognito-identity.amazonaws.com:aud": identityPool.ref },
          "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });

    authenticatedRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["mobileanalytics:PutEvents", "cognito-sync:*", "cognito-identity:*"],
        resources: ["*"],
      })
    );

    new cognito.CfnIdentityPoolRoleAttachment(this, "DefaultValid", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: authenticatedRole.roleArn,
      },
    });
  }

  private createDynamoTable() {
    return new dynamodb.Table(this, "surveys", {
      partitionKey: {
        name: PRIMARY_KEY,
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: SORT_KEY,
        type: dynamodb.AttributeType.STRING
      },
      tableName: TABLE_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }

  private createCreateSurveyFunction(defaultLambdaFunctionProps: Omit<lambda.FunctionProps, "handler">) {
    return new lambda.Function(this, "createSurveyFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.createSurvey"
    });
  }

  private createListByUserIdFunction(defaultLambdaFunctionProps: Omit<lambda.FunctionProps, "handler">) {
    return new lambda.Function(this, "listByUserIdFunction", {
      ...defaultLambdaFunctionProps,
      handler: "lambdas.listByUserId"
    });
  }

  private addGrantsToDynamoTable(dynamoTable: dynamodb.Table, createSurveyFunction: lambda.Function, 
    listByUserIdFunction: lambda.Function) {

    dynamoTable.grantWriteData(createSurveyFunction);
    dynamoTable.grantReadData(listByUserIdFunction);
  }

  private createRestApi() {
    return new apig.RestApi(this, "CdkSurveysApi", {
      restApiName: "surveysrestapi",
      defaultCorsPreflightOptions: DEFAULT_CORS_PREFLIGHT_OPTIONS
    });
  }

  private createRestApiAuthorizer(restApi: apig.RestApi, userPool: cognito.UserPool) {
    return new apig.CfnAuthorizer(this, "CdkSurveysApiAuthorizer", {
      restApiId: restApi.restApiId,
      name: "CdkSurveysAuthorizer",
      type: apig.AuthorizationType.COGNITO,
      identitySource: "method.request.header.Authorization",
      providerArns: [userPool.userPoolArn]
    });
  }

  private addRestApiResources(restApi: apig.RestApi, defaultMethodProps: apig.MethodOptions, 
    createSurveyFunction: lambda.Function, listByUserIdFunction: lambda.Function) {
    
      const surveys = restApi.root.addResource("surveys", {
      defaultCorsPreflightOptions: DEFAULT_CORS_PREFLIGHT_OPTIONS
    });

    const surveysByUserIdPath = surveys.addResource("{userId+}", {
      defaultCorsPreflightOptions: DEFAULT_CORS_PREFLIGHT_OPTIONS
    });

    surveys.addMethod("GET");

    const createSurveyIntegration = new apig.LambdaIntegration(createSurveyFunction);
    surveys.addMethod("POST", createSurveyIntegration, { ...defaultMethodProps });

    const listByUserIdIntegration = new apig.LambdaIntegration(listByUserIdFunction);
    surveysByUserIdPath.addMethod("GET", listByUserIdIntegration, { ...defaultMethodProps });
  }

  private defaultMethodProps(authorizer: apig.CfnAuthorizer): apig.MethodOptions {
    return {
      authorizer: {
        authorizerId: authorizer.ref,
        authorizationType: apig.AuthorizationType.COGNITO,
      },
    };
  }

  private outputs(identityPool: cognito.CfnIdentityPool, userPool: cognito.UserPool,
    userPoolClient: cognito.UserPoolClient, restApi: apig.RestApi) {

    new cdk.CfnOutput(this, "awsprojectregion", { value: cdk.Stack.of(this).region });
    new cdk.CfnOutput(this, "awscognitoidentitypoolid", { value: identityPool.ref });
    new cdk.CfnOutput(this, "awscognitoregion", { value: cdk.Stack.of(this).region });
    new cdk.CfnOutput(this, "awsuserpoolsid", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "awsuserpoolswebclientid", { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, "apiname", { value: restApi.restApiName });
    new cdk.CfnOutput(this, "apiendpoint", { value: restApi.urlForPath() });
    new cdk.CfnOutput(this, "apiregion", { value: restApi.env.region });
    new cdk.CfnOutput(this, "oauth", { value: "{}" });
  }
}