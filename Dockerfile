FROM node:20.11.1 as builder

WORKDIR /usr/src/wallet-frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:soft

FROM nginx:latest

COPY --from=builder /usr/src/wallet-frontend/build /usr/share/nginx/html

COPY nginx/conf.d /etc/nginx/conf.d

RUN unlink /var/log/nginx/access.log && unlink /var/log/nginx/error.log
