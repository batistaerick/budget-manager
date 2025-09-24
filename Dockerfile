FROM node:22-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY prisma ./prisma
RUN yarn prisma generate

COPY . .
RUN yarn build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=base /app/package.json ./package.json
COPY --from=base /app/yarn.lock ./yarn.lock
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]
