# Working with EKS Cluster

## Scope

The purpose is this section is to deploy components of current project to a Kubernetes cluster.

This section considers that proper setup was done according to the [Environment section](../../.docs/environment.md).

## General Structure

In order to specify what needs to be deployed on EKS, several K8S specs were created.

Because there might be several environments each with its own customization (eg: subnets, domains, claims, namespace, ...) `kustomize` is used in order to have `overlays` which are separate folders that keep the respective particularities.

All specs can be found under `./mern-stack/.infra/k8s` containing the following sections:

| Section      | Sub-Section | Sub-Section | Description                                                                                             |
| ------------ | ----------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `components` |             |             | specs for various components (eg: services, DB, ...)                                                    |
|              | `mongo`     |             | MongoDB specs for deploying instances on EKS                                                            |
|              |             | `base`      | base customization                                                                                      |
|              |             | `overlays`  | customizations per environment                                                                          |
|              | `services`  |             | specs for services                                                                                      |
|              |             | `base`      | base customization                                                                                      |
|              |             | `overlays`  | customizations per environment                                                                          |
| `overlays`   |             |             | main customizations per environment; you can define the main namespace, common annotations, images, ... |

The following scripts are also defined:

| Script              | Description                                    | Usage                              |
| ------------------- | ---------------------------------------------- | ---------------------------------- |
| `create_user.sh`    | creates an app user                            | `./create_user.sh user1 user1pass` |
| `deploy.sh`         | deploys K8S resources using a specific overlay | `./deploy.sh dev`                  |
| `default-deploy.sh` | deploys K8S resources using predefined configs | `./default-deploy.sh`              |
| `undeploy.sh`       | undeploys a specific overlay                   | `./undeploy.sh dev`                |

The deployment is done by simply using `kustomize`, on a location where `kustomization.yml` is located, to build the specs then the specs can be applied:

```bash
# cd to an overlay directory

# print the specs without applying
kustomize build

# build and apply the specs
kustomize build ./ | kubectl apply -

# build and apply at the same time
kubectl -k ./
```

## MongoDB

Current scripts deploys MongoDB using the [MongoDB Community Kubernetes Operator](https://github.com/mongodb/mongodb-kubernetes-operator/blob/master/README.md).

Note that this is a Community edition.

In production and in a real-case scenario, `Atlas` will be used instead.

This solution is only used in order to have a running MongoDB instance on EKS in the context where `Atlas` is not available for a given time, but is not intended for production.

The steps followed in order to create the specs of current deployment are present on K8S Operator documentation.

Following these steps several new K8S resources are being deployed to the cluster.

MongoDB pod is managed by another resource instance called MongoDB Community Kubernetes Operator.

In order to define how MongoDB should be created, there is another spec defined in `replica-set.yml` which defines:
- number of instances
- DB version
- users and roles
- volume claims

## Services

As stated in [Docker section README](../docker/README.md), all services - `gateway-service`, `survey-service`, `user-service` - together with `react-app`, are started using a single Docker container, which is not the best practice, but is used for the moment to decrease the operational overhead.

Please read also the [Docker section README](../docker/README.md) in order to familiarize to ho the Docker image is structured.

The following K8S specifications are defined:

| Spec         | Description                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `deployment` | one deployment is defined in order to define the image to be deployed and corresponding replicas, resources, ... |
| `service`    | a ClusterIP service is defined in order to point to all pod instances                                            |
| `ingress`    | defines an Ingress that defines a LoadBalancer routes                                                            |
|              | LoadBalancer provisions an ALB (Application Load Balancer) on AWS that has the specified public subnets          |
|              | Annotations specify domains that are used to create Route53 routes which point to the respective ALB.            |
|              | One domain is associated with the react-app (front-end) and one with the gateway-service (back-end).             |

`deployment` resource will point to the image that is found on `ECR` repository.

The image is pushed to `ECR` using the `CD` pipeline just before the app is being deployed to `EKS`.

When a user browses the specific Route53 DNS name, it gets pointed to a specific ALB that load-balances the traffic among the pods.
