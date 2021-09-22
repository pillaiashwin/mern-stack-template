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

touch $OVERLAY_PATH/.tmp/mongo-secret.env
touch $OVERLAY_PATH/.tmp/gateway-service-secret.env
touch $OVERLAY_PATH/.tmp/user-service-secret.env
touch $OVERLAY_PATH/.tmp/survey-service-secret.env

echo "Applying changes using kustomize..."

kubectl delete -k $OVERLAY_PATH \
    && echo "Changes applied successfully." \
    || { echo "Error executing kustomize."; exit 1; }

rm -rf $OVERLAY_PATH/.tmp

exit 0