# ---- Base Node ----
FROM node:11.12 AS base

# ---- Dependencies ----
FROM base AS dependencies
COPY ./src/ ./webapp/src
COPY ./public/ ./webapp/public
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
RUN npm run build
#RUN npm run test


# --- Release with Alpine ----
FROM nginx:1.15.9-alpine
WORKDIR /app
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
