FROM node:18-alpine as base

WORKDIR /app

COPY ./package.json /app/

RUN npm install

COPY . /app/


FROM base as dev

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]


FROM base AS prod

ENV NODE_ENV=production

RUN npm run build

CMD ["npm", "start"]