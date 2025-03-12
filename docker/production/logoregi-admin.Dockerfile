FROM oven/bun:latest AS builder

WORKDIR /usr/src/app/logos

# 全部コピーしてこないとworkspaceの都合でbun installがコケる
# 本当はpackage.jsonのみだけでいけるはず
COPY .. ./

WORKDIR /usr/src/app/logos/logoregi-admin
ARG NEXT_PUBLIC_GRPC_HOST
ENV NEXT_PUBLIC_GRPC_HOST=${NEXT_PUBLIC_GRPC_HOST}
RUN bun install --production
RUN bun run build

FROM oven/bun:latest

WORKDIR /usr/src/app/logos/logoregi-admin
COPY --from=builder /usr/src/app/logos/logoregi-admin ./

EXPOSE 3000
CMD ["bun", "start"]
