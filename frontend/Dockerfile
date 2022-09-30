# Stage 1 build
FROM node:16.17.0 AS development

WORKDIR /dweb/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@14.2.3

COPY . .

RUN npm run build

EXPOSE 4200






