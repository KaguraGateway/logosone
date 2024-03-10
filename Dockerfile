FROM node:18

WORKDIR /usr/src/app/logos

COPY . ./

RUN npm install

ENV NEXT_PUBLIC_GRPC_HOST=https://cafelogos-pos-backend-z4ljh3ykiq-dt.a.run.app
ENV NEXT_PUBLIC_WEBSOCKET_API=wss://cafelogos-orderlink-backend-z4ljh3ykiq-dt.a.run.app

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]