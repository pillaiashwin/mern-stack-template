# Forking First Steps

After the repo is forked there are additional steps that needs to be followed in order to have a working CD pipeline and a working Landing Zone (EKS).

This happens because of the following factors:
- GitHub has secrets but these are not forked
- you will use a separate ECR repository to store your images
- you will opt to deploy to the same EKS cluster but a different namespace or to another EKS cluster

The following steps needs to be followed in order to fix various sections which have a hard reference on the above mentioned systems:

## Kustomize Overlays

K8S specs are built using `Kustomize` which has the concept of `overlay` that allows you to create a folder which will hold a particular customization.

Note that there are the following `Kustomize` overlays:
- `dev` - deploys all apps
- `dev-with-mongo` - like `dev` but deploys also a `MongoDB` instance

In the majority of cases you should be using `dev` because `Atlas` will be used in production which is a separate MongoDB SaaS solution.

Some of the next sections might reference these if there is the case.

## GitHub

### Define Secrets

Ask `Mr. J` (J. Kinsella) to add the following secrets in order to login to AWS from GitHub:

| Secret                  | Description           |
| ----------------------- | --------------------- |
| `AWS_ACCOUNT_ID`        | AWS account ID        |
| `AWS_ACCESS_KEY_ID`     | AWS access key ID     |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key |

Ask `Mr. Muthu` (Mutharasu Sivakumar) to add the following secrets in order for the services deployed on EKS to have access to MongoDB:

| Secret                        | Description                       |
| ----------------------------- | --------------------------------- |
| `GATEWAY_SERVICE_DB_CONN_STR` | gateway-service connection string |
| `USER_SERVICE_DB_CONN_STR`    | user-service connection string    |
| `SURVEY_SERVICE_DB_CONN_STR`  | survey-service connection string  |

If you opted for `dev-with-mongo` then you need to specify also credentials for `MongoDB` users:

| Secret               | Description                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `MONGO_ADMIN_PASS`   | Password used for the `admin` user, which is the admin of the cluster and databases.                             |
| `MONGO_APPUSER_PASS` | Password used for the `appuser` user, which is the application user used by services to connect to the database. |

Note that the names `admin` and `appuser` are fixed and used only for the overlay `dev-with-mongo`, for simplicity.

## Add ECR Repository

This is the place where images will be pushed, therefore you need to create a repository.

Follow the next link to ECR: https://console.aws.amazon.com/ecr/repositories?region=us-east-1

## Fix the CD Pipeline

Edit `.github/workflows/dev-cd.yml` and make the following changes:

| Section                           | Required | Change                                                                                                                   |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `KUSTOMIZE_OVERLAY: dev`          | no       | change it to your desired overlay `dev` or `dev-with-mongo`; usually you should use `dev` and connect to `Atlas MongoDB` |
| `ECR_REPOSITORY: jumpstart`       | yes      | change it to the newly created ECR rpository                                                                             |
| `IMAGE_NAME: novus`               | no       | your desired image name                                                                                                  |
| `AWS_REGION: us-east-1`           | no       | your AWS region                                                                                                          |
| `EKS_CLUSTER_NAME: ea-devops-eks` | no       | your EKS cluster                                                                                                         |

**Note:** most changes should be done to the environment variables defined at the top level.

## Fix K8S Specs

Kubernetes specs are built using Kustomize and some of them contain infrastructure related data (eg: subnets, domains).

Edit the following files and the corresponding sections which can be found under `mern-stack/.infra/k8s`:

| File                                              | Section                                     | Change                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `overlays/dev/kustomization.yml`                  | `namespace: mern-stack-dev`                 | change it to your desired namespace                                                                                                           |
|                                                   | `team: jumpstart`                           | change it to your desired team name                                                                                                           |
|                                                   | `images > mern-services-image > newName`    | replace with your `newName` which is the URL of the repo copied from ECR                                                                      |
| `overlays/dev/namespace.yml`                      | `name: mern-stack-dev`                      | change it to your desired namespace                                                                                                           |
| `overlays/dev-with-mongo/kustomization.yml`       | `namespace: mern-stack-dev`                 | change it to your desired namespace                                                                                                           |
|                                                   | `team: jumpstart`                           | change it to your desired team name                                                                                                           |
|                                                   | `images > mern-services-image > newName`    | replace with your `newName` which is the URL of the repo copied from ECR                                                                      |
| `overlays/dev-with-mongo/namespace.yml`           | `name: mern-stack-dev`                      | change it to your desired namespace                                                                                                           |
| `components/services/overlays/dev/ingress.yml`    | `alb.ingress.kubernetes.io/subnets`         | only if using a different EKS cluster - set the correct public subnets, for which a ALB (App Load Balancer) will be provisioned automatically |
|                                                   | `external-dns.alpha.kubernetes.io/hostname` | set the correct domain for react-app and gateway-service, for which Route53 routes will be registered automatically                           |
| `components/services/overlays/dev/deployment.yml` | `env > name: CORS_ORIGINS`                  | set the correct domains defined in Ingress file                                                                                               |
|                                                   | `env > name: REACT_APP_GATEWAY_SERVICE_URL` | set the correct gateway-service domain defined in Ingress file                                                                                |
