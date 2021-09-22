// import awsconfig from './aws-exports';
import { Amplify } from 'aws-amplify';
import { SurveysBackendCdkStack } from './cdk-exports.json';

const apiEndpointWithoutSlash = () => {
    return SurveysBackendCdkStack.apiendpoint.slice(0, SurveysBackendCdkStack.apiendpoint.endsWith('/') ? -1 : SurveysBackendCdkStack.apiendpoint.length);
}

const CDKConfig = {
    aws_project_region: SurveysBackendCdkStack.awsprojectregion,
    aws_cognito_identity_pool_id: SurveysBackendCdkStack.awscognitoidentitypoolid,
    aws_cognito_region: SurveysBackendCdkStack.awscognitoregion,
    aws_user_pools_id: SurveysBackendCdkStack.awsuserpoolsid,
    aws_user_pools_web_client_id: SurveysBackendCdkStack.awsuserpoolswebclientid,
    oauth: {},
    aws_cloud_logic_custom: [{
      name: SurveysBackendCdkStack.apiname,
      endpoint: apiEndpointWithoutSlash(),
      region: SurveysBackendCdkStack.apiregion
  }]

}

// Amplify.configure({ ...awsconfig, ...CDKConfig });
Amplify.configure({...CDKConfig });