# Specify Node Version and Image
# name Image development
FROM node:18.10.0 AS development

# Specify Working directory inside container
WORKDIR /dweb/src/app

# Copy package-lock.json and package.json from host to inside working directory
COPY package*.json ./

# Install deps inside container
RUN npm install

# Bundle App Sources
COPY . .
#
#RUN npm uninstall bcrypt
#RUN npm install bcrypt

RUN npm run build

EXPOSE 3000

################
## PRODUCTION ##
################

# Build another Image name production
FROM node:18.10.0 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir
WORKDIR /dweb/src/app

COPY --from=development /dweb/src/app/ .

EXPOSE 3000

# run app
CMD [ "node", "dist/main"]
