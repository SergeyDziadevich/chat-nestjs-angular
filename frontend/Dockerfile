# Stage 1 build
FROM node:20.19.2 AS build
 #development

WORKDIR /dweb/frontend


# Copy package files first for better layer caching
COPY package*.json ./

RUN npm install --force

# Copy the rest of the application
COPY . .

## Debug - check if app.module.ts exists
#RUN ls -la src/app/ || echo "app directory missing!"
#
## Create app directory if it doesn't exist
#RUN mkdir -p src/app

# Build with production configuration
RUN npm run build:prod

# Stage 2: Serve
FROM node:20.19.2 AS production

WORKDIR /dweb/frontend
COPY --from=build /dweb/frontend/dist/frontend ./dist/frontend
RUN npm install -g http-server
EXPOSE 4200
CMD ["http-server", "dist/frontend", "-p", "4200"]
