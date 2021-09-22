# Working with local Docker

## Scope

The purpose is this section is to deploy components of current project using Docker.

This section considers that proper setup was done according to the [Environment section](../../.docs/environment.md).

## Deploying/Undeploying

The following actions can be done in relation to Docker:

| Action            | Command                  | Description                                   |
| ----------------- | ------------------------ | --------------------------------------------- |
| Deploy MongoDB    | `./mongo-deploy.sh`      | Creates the `/mern-stack-mongo` container.    |
| Undeploy MongoDB  | `./mongo-undeploy.sh`    | Removes the `/mern-stack-mongo` container.    |
| Deploy Services   | `./services-deploy.sh`   | Creates the `/mern-stack-services` container. |
| Undeploy Services | `./services-undeploy.sh` | Removes the `/mern-stack-services` container. |

Current approach is to expose all ports to the host network in order to be reachable for development purposes.

As a reminder use the following commands in order to inspect your Docker environment:

| Action                      | Command                                              |
| --------------------------- | ---------------------------------------------------- |
| List images                 | `docker images`                                      |
| Tag an image                | `docker image tag <name>:<tag> <new_name>:<new_tag>` |
| Remove an image             | `docker rmi <name>:<tag>`                            |
| List running containers     | `docker ps`                                          |
| List all containers         | `docker ps -a`                                       |
| Stop container by name      | `docker stop /<name>`                                |
| Stop container by ID        | `docker stop <id>`                                   |
| Remove container by name    | `docker rm /<name>`                                  |
| Remove container by ID      | `docker rm <id>`                                     |
| Show container logs by name | `docker logs /<name>`                                |
| Show container logs by ID   | `docker logs <id>`                                   |

## MongoDB

Current scripts deploys MongoDB using the [official MongoDB Docker image](https://hub.docker.com/_/mongo).

Initializing the DB on first usage can be done using shell and javascript scripts that can be placed inside `mongo-init` folder which is copied to the Docker container.

## Services

All services - `gateway-service`, `survey-service`, `user-service` - are started using a single Docker container.

This is not the best practice but instead is a workaround for temporarily decreasing the operational time needed to provision resources.

In a next iteration every service will have its own container.

The specification is available inside `mern-stack/Dockerfile` and `mern-stack/Dockerfile.mmcerts` (for fixing CA certificates validation when inside the VPN).

As these services are Node based services, these are started as daemons using a process manager called `PM2`.

After these are started `pm2 logs` is used in order to stream the logs from all services.

If this process is interrupted all services are being stopped using the `PM2` process manager.

One downside is that if all services die then `pm2 logs` will continue to run, but as already said, this is an intermediate solution and should not be used for production purposes.
