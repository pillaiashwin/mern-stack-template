import * as cdk from "@aws-cdk/core";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as amplify from "@aws-cdk/aws-amplify";

const APP_NAME = "surveys";

// needed because we are in 'monorepo' mode
const APP_ROOT = 'serverless-react-app';
const AMPLIFY_MONOREPO_APP_ROOT = 'AMPLIFY_MONOREPO_APP_ROOT';

const OWNER_NAME = 'massmutual';
const REPO_NAME = 'ea-jumpstart-novus-enterprise';
const BRANCHES_NAMES_TO_TRACK = ["main", "dev", "serverless_react_app"];

// alternatively add an amplify.YAML to the root of the repo
const AMPLIFY_YAML = {
  version: '1.0',
  applications: [
    {
      appRoot: APP_ROOT,
      frontend: {
        phases: {
          preBuild: {
            commands: [
              'printenv',
              'yarn install'
            ]
          },
          build: {
            commands: [
              'yarn run build'
            ]
          }
        },
        artifacts: {
          baseDirectory: 'build',
          files: ['**/*']
        }
      }
    }
  ]
};

export class SurveysFrontendCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repoProps = buildRepoProps();

    const appProps = {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider(repoProps),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml(AMPLIFY_YAML)
    };

    const amplifyApp = new amplify.App(this, APP_NAME, appProps);

    trackBranches(amplifyApp);
  }
}

function buildRepoProps() {
  return {
    owner: OWNER_NAME,
    repository: REPO_NAME,
    // todo: use secrets manager here
    oauthToken: cdk.SecretValue.plainText('x')
  };
}

function trackBranches(amplifyApp: amplify.App) {
  BRANCHES_NAMES_TO_TRACK.forEach(function (branchName) {
    const branch = amplifyApp.addBranch(branchName);
    branch.addEnvironment(AMPLIFY_MONOREPO_APP_ROOT, APP_ROOT);
  });
}
