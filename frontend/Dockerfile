# Stage 1 build
FROM node:20.11.1 AS build
 #development

WORKDIR /dweb/frontend
# WORKDIR /dweb/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@14.2.3

COPY . .

#RUN npm run build

#EXPOSE 4200

RUN npm run build --configuration production

# Stage 2: Serve
FROM node:20.11.1 AS production

WORKDIR /dweb/frontend
COPY --from=build /dweb/frontend/dist/frontend ./dist/frontend
RUN npm install -g http-server
EXPOSE 4200
CMD ["http-server", "dist/frontend", "-p", "4200"]



