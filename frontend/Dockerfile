FROM node:18-alpine AS base

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY . /app/


FROM base AS dev

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]


FROM base AS prod

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "start"]