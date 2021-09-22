######################################### SETTINGS #########################################

MONGO_ADMIN_PASS=adminpass123
MONGO_APPUSER_PASS=appuserpass123

GATEWAY_SERVICE_DB_CONN_STR=mongodb://appuser:appuserpass123@mongodb-svc:27017/gateway-service?authSource=admin
USER_SERVICE_DB_CONN_STR=mongodb://appuser:appuserpass123@mongodb-svc:27017/user-service?authSource=admin
SURVEY_SERVICE_DB_CONN_STR=mongodb://appuser:appuserpass123@mongodb-svc:27017/survey-service?authSource=admin

######################################### K8S RESOURCES #########################################

./deploy.sh dev-with-mongo