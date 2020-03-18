# Creates the LCMS Connector Tool.
FROM node:12-slim AS builder
RUN mkdir -p /code
COPY package.json /code/package.json
WORKDIR /code
RUN yarn install
COPY . /code
WORKDIR /code
RUN yarn run build
RUN echo 'Built'

FROM node:12-alpine
RUN mkdir -p /app/node_modules
COPY --from=builder /code/node_modules /app/node_modules
COPY --from=builder /code/dist /app
COPY --from=builder /code/config.json /app/config.json
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3002
CMD ["node", "./run.js"]
