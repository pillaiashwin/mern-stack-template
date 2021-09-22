# User Service

An microservice for managing user data.

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

2) Run the service:

```
$ yarn dev
```

The following variables are configurable via environment variables:

| Name                    | Default      |
|-------------------------|--------------|
| DB_HOST                 | localhost    |
| DB_NAME                 | user-service |
| DB_PORT                 | 27017        |
| JWT_SECRET              | secret       |
| PORT                    | 8081         |
