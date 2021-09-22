# Kubernetes Community Operator

This directory contains `Kubernetes Community Operator` spec files copied from the main repository.

`kustomization.yml` was added in order to facilitate customization and deployment as a whole.

For example the following can be used to download the specific version of the operator which contains the respective spec files:

```bash
K8S_OPERATOR_VERSION=v0.6.2

mkdir .tmp
cd .tmp

rm -rf mongodb-kubernetes-operator

# get kubernetes operator community edition
git clone https://github.com/mongodb/mongodb-kubernetes-operator.git

cd mongodb-kubernetes-operator

git checkout tags/$K8S_OPERATOR_VERSION
```
