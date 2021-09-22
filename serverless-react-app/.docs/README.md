# Work in progress
# Interactions
- Amplify CLI (and headless support) https://docs.amplify.aws/cli/usage/headless/ https://github.com/aws-amplify/amplify-cli/tree/master/packages/amplify-cli/sample-headless-scripts
- Amplify Console
- Amplify UI Backend Console (Admin UI)
- Amplify CDK (no high level constructs for backends)

# Customizations
- https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html
- build image
- lambdas

# Project
- Init project / monorepo
- Add backend(s) (Auth, API + Storage) + cloning
- Add CI/CD (provided image, gitlab/github/manual/codecommit), webhook
- skipping CI/CD/ fullstack CI/CD toggle
- environments, backends pull/push, aws exports

# Monorepos
- https://docs.aws.amazon.com/amplify/latest/userguide/monorepo-configuration.html

# Team workflows / multi environments
- https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html

# Configuring build settings
- https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html

# Client configuration
- https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/

# Serverless Containers
- https://docs.amplify.aws/cli/usage/containers/#getting-started

# Storage
- dynamodb

# Cloud monitoring
- cloud watch

# Other 
- add analytics
- use other databases
- monitoring

# Team workflows

# Pros
- who is amplify for


# Disadvantages
- Consistent changes - not yet mature
- Traffic distribution - load balancing
- Cannot really test locally the backend part (if you have one)
- Auth just Cognito
- Storage is using dynamodb as standard
- No access to cloudfront distribution

# Use case - static website hosting

## Amplify vs S3 + Cloudfront

# Best practices
- keeping the names short, you may have very long resource names

# Resources
https://aws.amazon.com/amplify/faqs/
https://docs.aws.amazon.com/cdk/api/latest/docs/aws-amplify-readme.html
