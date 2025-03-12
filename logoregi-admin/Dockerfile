FROM oven/bun:latest AS builder

WORKDIR /usr/src/app/logos

COPY . ./

RUN bun install --production
ARG NEXT_PUBLIC_GRPC_HOST
ENV NEXT_PUBLIC_GRPC_HOST=${NEXT_PUBLIC_GRPC_HOST}
RUN bun run build

FROM oven/bun:latest

WORKDIR /usr/src/app/logos
COPY --from=builder /usr/src/app/logos ./

EXPOSE 3000
CMD ["bun", "start"]
