FROM oven/bun:latest

COPY . ./

RUN bun install
RUN bun add git+https://github.com/KaguraGateway/cafelogos-grpc.git
RUN pwd
RUN ls -la node_modules/@kaguragateway/cafelogos-grpc
RUN cat node_modules/@kaguragateway/cafelogos-grpc/package.json
RUN ls -la node_modules/@kaguragateway/cafelogos-grpc/scripts/pos/
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]