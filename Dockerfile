FROM oven/bun:latest

COPY . ./

RUN bun install
RUN npm install git+https://github.com/KaguraGateway/cafelogos-grpc.git
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]