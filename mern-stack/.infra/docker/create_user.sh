EMAIL=$1
PASSWORD=$2

curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d "{ \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\" }" \
  http://local.mernstack.com:8080/v1/users
