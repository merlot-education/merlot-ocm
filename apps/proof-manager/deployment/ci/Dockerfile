FROM node:16-alpine3.15 AS builder

WORKDIR /usr/src/app

RUN yarn global add @nestjs/cli

# wildcard for yarn.lock for not failing build if missing
COPY package.json yarn.lock* ./

# --prod works if @types/node is in deps (not devDeps)
RUN yarn
#--frozen-lockfile --prod

COPY . .

RUN yarn prisma:generate

RUN yarn build


FROM node:14-alpine3.15

ENV PATH /usr/src/app/node_modules/.bin:$PATH

WORKDIR /usr/src/app


COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/start.sh ./start.sh
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src/prisma prisma

EXPOSE 3007

RUN chmod +x ./start.sh

CMD ["./start.sh"]












