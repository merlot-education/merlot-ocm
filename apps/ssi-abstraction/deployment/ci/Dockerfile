FROM ubuntu:18.04 as base

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update -y && apt-get install -y \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    libsodium-dev \
    libzmq3-dev \
    git \
    openssl \
    libssl-dev \
    pkg-config \
    # Only needed to build indy-sdk
    build-essential

# libindy
#RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE7709D068DB5E88
#RUN echo "deb https://repo.sovrin.org/sdk/deb xenial stable" >> /etc/apt/sources.list
#
# nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash

# yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list


RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain '1.58.0'

RUN git clone https://github.com/hyperledger/indy-sdk

RUN cd indy-sdk/libindy && ~/.cargo/bin/cargo build --release

RUN cd indy-sdk/libindy && mv target/release/libindy.so /usr/lib/libindy.so

RUN apt-get update -y

## install depdencies
RUN apt-get install -y \
    nodejs

# Install yarn seperately due to `no-install-recommends` to skip nodejs install
RUN apt-get install -y --no-install-recommends yarn

WORKDIR /usr/src/app

RUN yarn global add @nestjs/cli@8.2.4

# wildcard for yarn.lock for not failing build if missing
COPY package.json yarn.lock* ./

# --prod works if @types/node is in deps (not devDeps)
RUN yarn --frozen-lockfile --prod

COPY . .

RUN yarn build



FROM base as final

# ENV RUN_MODE="docker"

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./

COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/start.sh ./start.sh
COPY --from=base /usr/src/app/node_modules ./node_modules

EXPOSE 3009
EXPOSE 3010
EXPOSE 4000

RUN chmod +x ./start.sh

CMD ["./start.sh"]

