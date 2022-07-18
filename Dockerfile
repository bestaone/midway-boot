FROM node:16.14.2-alpine
WORKDIR /app
ENV TZ="Asia/Shanghai"

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build
RUN npm prune --production

EXPOSE 7001

ENTRYPOINT ["npm", "run", "start"]
