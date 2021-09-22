// Mongo Init DB Script

db.createUser({
    user: "appuser",
    pwd: "appuserpass123",
    roles: [
        { role: "readWrite", db: "gateway-service" },
        { role: "readWrite", db: "user-service" },
        { role: "readWrite", db: "survey-service" }
    ]
})