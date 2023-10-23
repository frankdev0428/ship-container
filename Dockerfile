# Step 1: build node modules
FROM node:17 as builder-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Step 2: build application
FROM node:17-alpine as builder

# Install deps
ENV JQ_VERSION=1.6
RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq

WORKDIR /app
ENV NODE_ENV production
COPY --from=builder-deps /app/node_modules ./node_modules/
COPY . /app/

# Inject env vars as config
RUN jq 'to_entries | map_values({ (.key) : ("$" + .key) }) | reduce .[] as $item ({}; . + $item)' ./src/config.json > ./src/config.tmp.json && mv ./src/config.tmp.json ./src/config.json

# had to disable the ESLINT
ENV DISABLE_ESLINT_PLUGIN true
ENV NODE_OPTIONS --openssl-legacy-provider
RUN npm run build

# Step 3: Serve it
FROM aeler/modsecurity-crs:3.3.2-nginx

# ToDo: figure out volumes and make sure to have the necessary ones
# Define mountable directories.
# VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", "/etc/nginx/conf.d", "/var/log/nginx", "/var/www/html"]

COPY --from=builder /app/dist /var/www/app
COPY ./config/nginx /etc/nginx/conf.d

# # Entrypoint
# ENTRYPOINT [ "start-nginx.sh" ]

# Define default command.
CMD ["nginx", "-g", "daemon off;"]

# Expose ports
EXPOSE 80

