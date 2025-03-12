FROM oven/bun:latest

WORKDIR /usr/src/app/logos

COPY . ./

RUN bun install --production

ARG VITE_WEBSOCKET_API
ENV VITE_WEBSOCKET_API=${VITE_WEBSOCKET_API}
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "preview"]
