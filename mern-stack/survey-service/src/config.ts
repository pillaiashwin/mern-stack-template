const config = {
  dbConnStr: process.env.SURVEY_SERVICE_DB_CONN_STR || process.env.DB_CONN_STR || 'mongodb://appuser:appuserpass123@local.mernstack.com:27017/survey-service?authSource=admin',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  port: process.env.PORT || 8082,
};

export default config;
