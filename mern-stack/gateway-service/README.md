# API Gateway Service

An microservice serves as the entry point to the microservice system.

## Requirements

* **Node**: v12.22.3+
* **NPM**: v6.14.13+
* **MongoDB**: v5.0
* **Yarn**: v1.22.10


### MongoDB Setup

1) Install [MongoDB v5.0 Community Edition](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#installing-mongodb-5.0-edition-edition)

2) Start mongo:

```
$ mongod
```

### Service Setup

1) Install dependencies using yarn:

```
$ yarn
```

2) Start your mongo service

```
$ brew services start mongodb-community@5.0
```

3) Run the service:

```
$ yarn dev
```

The following variables are configurable via environment variables:

| Name                       | Default                         |
|----------------------------|---------------------------------|
| CORS_ORIGINS               | http://local.mernstack.com:3000 |
| DB_HOST                    | localhost                       |
| DB_NAME                    | gateway-service                 |
| DB_PORT                    | 27017                           |
| PORT                       | 8080                            |
| USER\_SERVICE\_JWT\_SECRET | secret                          |
| USER\_SERVICE\_URL         | http://local.mernstack.com:8081 |
