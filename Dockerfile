FROM oven/bun:latest

COPY . ./

RUN bun install
RUN bun add git+https://github.com/KaguraGateway/cafelogos-grpc.git
RUN ls -la
RUN ls -la node_modules
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]