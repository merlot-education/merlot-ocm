# Base 
FROM node:20 AS base

ARG APP_HOME=/home/node/app
ARG SERVICE

WORKDIR ${APP_HOME}

RUN corepack enable

# # libindy build
# FROM node:20-bullseye AS ssi-base

# RUN apt-get update \
#  && apt-get install -y --no-install-recommends libsodium-dev libzmq3-dev
# RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain '1.58.0'
# RUN git clone https://github.com/hyperledger/indy-sdk
# RUN cd indy-sdk/libindy && ~/.cargo/bin/cargo build --release
# RUN cd indy-sdk/libindy && mv target/release/libindy.so /usr/lib/libindy.so

# Build
FROM base AS build

ARG APP_HOME=/home/node/app
WORKDIR ${APP_HOME}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig*.json .swcrc ./
COPY apps/${SERVICE}/package.json ./apps/${SERVICE}/
COPY apps/shared/package.json ./apps/shared/

RUN pnpm install --frozen-lockfile

COPY apps/${SERVICE} ./apps/${SERVICE}
COPY apps/shared ./apps/shared
RUN pnpm --filter shared build
RUN pnpm --filter ${SERVICE} build:production
RUN pnpm --filter ${SERVICE} --prod deploy build
RUN pnpm --filter shared --prod deploy shared

# This is a way of keeping the generated prisma client in the build folder
RUN if [ -d ./apps/${SERVICE}/node_modules/\@prisma/client ]; then \
        GLOBAL_PRISMA_SETUP=`realpath ./apps/${SERVICE}/node_modules/\@prisma/client` \
        GLOBAL_PRISMA_CLIENT=`readlink -f ${GLOBAL_PRISMA_SETUP}/../../.prisma` \
        BUILD_PRISMA_SETUP=`realpath ./build/node_modules/\@prisma/client` \
        BUILD_PRISMA_CLIENT=`readlink -f ${BUILD_PRISMA_SETUP}/../..` \
        sh -c 'cp -r $GLOBAL_PRISMA_CLIENT $BUILD_PRISMA_CLIENT'; \
    fi

# Final
FROM node:20 AS final

ARG APP_HOME=/home/node/app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR ${APP_HOME}
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]

COPY --chown=node:node ./docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=build --chown=node:node ${APP_HOME}/build/dist ./dist
COPY --from=build --chown=node:node ${APP_HOME}/shared/dist ./shared
COPY --from=build --chown=node:node ${APP_HOME}/build/node_modules ./node_modules
COPY --from=build --chown=node:node ${APP_HOME}/build/package.json .

# Cut unnecessary stuff from package.json. Only leave name, version and module type
RUN node -e "\
    const { name, version, type } = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));\
    fs.writeFileSync('./package.json', JSON.stringify({ name, version, type }, null, 2));\
"

# USER node
