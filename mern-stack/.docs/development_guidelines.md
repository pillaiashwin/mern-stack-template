# Development Guidelines

## Scope

This section is intended to serve as a guideline in order to help developers determine the best way to work with their code.

The following sections considers that the [correct environment](./environment.md) is already setup.

## Running all apps locally

There are cases when you want to start all apps locally in order to develop, debug and verify a feature.

This approach allows you for faster development as you can get a quick feedback on what you are doing.

You can achieve that by following the next steps:

1. update `/etc/hosts`
   - current project uses a fictive domain `local.mernstack.com` in order to simulate that the request comes from a specific domain
   - therefore this domain needs to point to `localhost` and thus it needs to be added to `/etc/hosts`
   - or simply use `echo "127.0.0.1 local.mernstack.com" >> /etc/hosts`

2. use a MongoDB instance
   - you can use an existing MongoDB instance or start a new one using Docker
     - if you are using your own instance, be sure to create the appropriate user with specific permissions
       - Docker version defines these using - `./mern-stack/.infra/docker/mongo-init/init.js`
     - each service defines its own database, therefore the user needs to have `readWrite` access on each of them
   - if you want to start one using Docker, there is a shell script that already configures one - `./mern-stack/.infra/docker/mongo-deploy.sh`
     - this will create also the appropriate user and permissions and the connection string is already defined in the rest of service, thus is the easiest way
     - also using Docker allows you to stop the container at any time, remove it and re-create it

3. start services & react-app
   - go to each app directory and run: `yarn && yarn dev`
   - note that if you are using your custom MongoDB installation you need configure the connection strings prior to starting these instances
     - you can set this statically in `./mern-stack/<service>/src/config.ts`
       - never push user specific configurations to the Git repository

4. add an app user
   - run `./mern-stack/.infra/docker/create-user.sh <user> <pass>` with your desired username and password

5. browse `local.mernstack.com:3000` and use the credentials that you used on the previous step

## Check your Dockerfiles

In the end, all apps will run as containers, which means that there needs to be a Dockerfile spec in order to specify how an image is built which can be instantiated into a container.

Even if you know that an app works fine by itself, you still have more layers to go on until the app is deployed.

The next step is to have a practice for writing Dockerfiles that will allow for fast development, debugging and testing.

The easiest way is to start containers locally.

You may start all or only a few containers, but you need to account for the configuration that needs to be done in order to connect various pieces.

The recipe to start all containers is:

1. start MongoDB container - `./mern-stack/.infra/docker/mongo-deploy.sh`
2. start apps container - `./mern-stack/.infra/docker/services-deploy.sh`
   - note that currently all apps are bundled into a single Dockerfile
     - this is documented in [Docker section](../.infra/docker/README.md)
3. add an app user - `./mern-stack/.infra/docker/create-user.sh <user> <pass>`
4. browse to - http://local.mernstack.com:3000

## Check your EKS Deployment

One way to develop and test the deployment to EKS is to run parts of your CD pipeline from your machine.

This can be done by replicating the steps that deploy to EKS or by creating a script or app that does the deployment and that is called also from the CD pipeline.

Currently there is a script that does the actual deployment and which can be used in order to deploy resources to EKS.

To find more about K8S specs build and deploy read the [K8S section](../.infra/k8s/README.md).

The recipe to deploy current specs to EKS is:
1. run kustomize overlay - `./mern-stack/.infra/k8s/deploy.sh dev-with-mongo`
2. wait for everything to deploy
3. add user - `./mern-stack/.infra/k8s/create-user.sh <user> <pass>`
4. browse - http://dev.mern.jumpstart.hackathon.nsawssnd.massmutual.com/

**WARNING:** deploying on EKS means that resources will be deployed on a given namespace which can re-configure existing resources.

Ensure that when running you are using a separate K8S namespace than that used for CD deployment.
