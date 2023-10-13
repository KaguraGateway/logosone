FROM node:18

WORKDIR /usr/src/app/logos

COPY . ./

RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]