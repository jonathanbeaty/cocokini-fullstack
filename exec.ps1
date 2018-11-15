docker build -t auth0-nodejs-webapp-01-login .
docker run --env-file .env -p 8080:8080 -it auth0-nodejs-webapp-01-login
