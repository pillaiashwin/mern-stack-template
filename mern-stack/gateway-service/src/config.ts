const config = {
  corsOrigins: process.env.CORS_ORIGINS || 'http://local.mernstack.com:3000',
  dbConnStr: process.env.GATEWAY_SERVICE_DB_CONN_STR || process.env.DB_CONN_STR || 'mongodb://appuser:appuserpass123@local.mernstack.com:27017/gateway-service?authSource=admin',
  port: process.env.PORT || 8080,
  userServiceJwtSecret: process.env.USER_SERVICE_JWT_SECRET || 'secret',
  userServiceUrl: process.env.USER_SERVICE_URL || 'http://local.mernstack.com:8081',
  serviceMap: [
    {
      url: '/v1/surveys',
      targetUrl: process.env.SURVEY_SERVICE_URL || 'http://local.mernstack.com:8082',
      jwtSecret: process.env.SURVEY_SERVICE_JWT_SECRET || 'secret',
    },
    {
      url: '/v1/users',
      targetUrl: process.env.USER_SERVICE_URL || 'http://local.mernstack.com:8081',
      jwtSecret: process.env.USER_SERVICE_JWT_SECRET || 'secret',
    },
    {
      url: '/v1/integration',
      targetUrl: process.env.INTEGRATION_SERVICE_URL || 'https://swapi.dev/api/people',
      jwtSecret: process.env.INTEGRATION_SERVICE_JWT_SECRET || 'secret',
    }
  ]
};

export default config;
