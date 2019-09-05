# ---- Base Node ----
FROM node:10.15 AS base
# -- Install Node Explicitly
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y nodejs

# ---- Dependencies ----
FROM base AS dependencies
COPY ./src/ ./webapp/src
#COPY ./public/ ./webapp/public
# COPY ./test/ ./webapp/test
#COPY ./package*.json ./.babelrc ./webpack.config.js ./webapp/
COPY ./package*.json ./webpack.config.js ./webapp/


# ---- Build react/vue/angular bundle static files ----
FROM dependencies AS build
WORKDIR /app
COPY --from=dependencies ./webapp ./
RUN npm set strict-ssl false
RUN npm config set ca=""
#RUN npm config set registry http://registry.npmjs.org/
RUN npm install
RUN npm run build-dev
#RUN npm run test


# --- Release with Alpine ----
FROM nginx:1.15.9-alpine
WORKDIR /app
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
