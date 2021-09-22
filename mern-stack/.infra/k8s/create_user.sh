EMAIL=$1
PASSWORD=$2

curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d "{ \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\" }" \
  http://dev.gateway.mern.jumpstart.hackathon.nsawssnd.massmutual.com/v1/users
