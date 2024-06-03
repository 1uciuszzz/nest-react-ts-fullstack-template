FROM node:20

WORKDIR /app

COPY . .

RUN npm run install

RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/main"]