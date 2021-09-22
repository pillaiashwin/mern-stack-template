# Quick Start

This project uses `MERN` stack which comes from `Mongo Express React Node`.

**Note:** if you run into certificate issues check the section [Environment - Certificate Issues](./environment.md#certificate-issues). For a quickfix try installing `MM Proxy Assist` from company app portal (`Self Service` Mac app).

## Step 1: Install NVM (Node Version Manager)

Install NVM by following the steps from https://github.com/nvm-sh/nvm#installing-and-updating.

## Step 2: Install Node

After NVM has been installed you should be able to install the latest version of node with the following command:

```bash
nvm install 16
```

Other versions can be installed by using the following command:

```bash
nvm install <NODE VERSION>
```

You can switch versions of node with the following command:

```bash
nvm use <NODE_VERSION>
```

## Step 3: Install Yarn with NPM

The microservices and react application both use yarn to run.  You can install yarn using NPM by running the following command:

```bash
npm install -g yarn
```

## Step 4: Update /etc/hosts

In order to simulate that we are making requests from a specific domain, thus testing also CORS, this project defines a fictive domain `local.mernstack.com`.

Therefore add the line `127.0.0.1 local.mernstack.com` to `/etc/hosts` in order to point at `localhost` or simply run:

```bash
echo "127.0.0.1 local.mernstack.com" >> /etc/hosts
```

## Step 5: Install Docker

Docker is required in order to start containers locally.

In order to install Docker on your desktop machine check the respective installation instructions, or use company `Self Service` application (recommended) in order to install `Docker Desktop`.

## Step 6: Start MongoDB

One easy way to have MongoDB locally is to start it as a Docker container.

For this purpose run the following:

```bash
# go to docker directory
cd ./mern-stack/.infra/docker

# give script execute permissions
chmod +x mongo-deploy.sh

# execute script
./mongo-deploy.sh
```

## Step 7: Build and start each app

In order to build and start each app, follow the steps for each app README.md, or simply run the following for each app directory:

```bash
# resolve dependencies
yarn

# start app
yarn dev
```

For reference, README.md for all applications are listed below:

| Application |
| --- |
| [gateway-service](../gateway-service/README.md) |
| [user-service](../user-service/README.md) |
| [survey-service](../survey-service/README.md) |
| [react-app](../react-app/README.md) |

## Step 8: Create app user

To create an application user run the following script with your username and password as parameters:

```bash
# go to docker directory
cd ./mern-stack/.infra/docker

# give script execute permissions
chmod + x create_user.sh

# execute script
./create_user.sh user1 user1pass
```

## Step 9: Browse the app

Go to http://local.mernstack.com:3000.