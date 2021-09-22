######################################### SETTINGS #########################################

OVERLAY=$1

if [ -z "$OVERLAY" ]; then
    echo "OVERLAY has no value."
    exit 1
fi

OVERLAY_PATH=./overlays/$OVERLAY

######################################### K8S RESOURCES #########################################

rm -rf $OVERLAY_PATH/.tmp
mkdir -p $OVERLAY_PATH/.tmp || { echo "Cannot create .tmp directory."; exit 1; }

envsubst <<EOF > $OVERLAY_PATH/.tmp/mongo-secret.env || { echo "Cannot create mongo-secret.env."; exit 1; }
admin-pass=$MONGO_ADMIN_PASS
appuser-pass=$MONGO_APPUSER_PASS
EOF

envsubst <<EOF > $OVERLAY_PATH/.tmp/gateway-service-secret.env || { echo "Cannot create gateway-service-secret.env."; exit 1; }
db-conn-str=$GATEWAY_SERVICE_DB_CONN_STR
EOF

envsubst <<EOF > $OVERLAY_PATH/.tmp/user-service-secret.env || { echo "Cannot create user-service-secret.env."; exit 1; }
db-conn-str=$USER_SERVICE_DB_CONN_STR
EOF

envsubst <<EOF > $OVERLAY_PATH/.tmp/survey-service-secret.env || { echo "Cannot create survey-service-secret.env."; exit 1; }
db-conn-str=$SURVEY_SERVICE_DB_CONN_STR
EOF

echo "Applying changes using kustomize..."

kubectl apply -k $OVERLAY_PATH \
    && echo "Changes applied successfully." \
    || { echo "Error executing kustomize."; exit 1; }

rm -rf $OVERLAY_PATH/.tmp

exit 0