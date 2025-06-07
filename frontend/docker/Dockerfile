FROM node:18-alpine AS base

WORKDIR /src

COPY ../package.json ../package-lock.json /src/

RUN npm ci

COPY ../ /src/


FROM base AS development

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]


FROM base AS production

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "start"]