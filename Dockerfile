FROM node:18

WORKDIR /usr/src/app/logos

COPY . ./

RUN npm install

ENV NEXT_PUBLIC_GRPC_HOST=https://cafelogos-pos-backend-qlrb2to2zq-an.a.run.app

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]