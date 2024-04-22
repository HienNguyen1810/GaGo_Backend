
############## prod ##################
FROM node:16-slim as STAGING_IMAGE

WORKDIR /strapi

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
ENV NODE_ENV=staging

COPY . .
RUN cp .env.staging .env;
RUN yarn run build --no-optimization
EXPOSE $PORT

CMD yarn run cs && yarn run start


############## dev ##################

FROM node:16-slim as DEV_IMAGE

WORKDIR /strapi

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
ENV NODE_ENV=development

# # Resolve node_modules for caching
COPY . .
RUN cp .env.development .env;
RUN yarn run build --no-optimization
EXPOSE $PORT

CMD yarn run cs && yarn run start