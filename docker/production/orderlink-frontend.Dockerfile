FROM oven/bun:latest AS builder

WORKDIR /app

# 全部コピーしてこないとworkspaceの都合でbun installがコケる
# 本当はpackage.jsonのみだけでいけるはず
COPY . ./

WORKDIR /app/orderlink-frontend
ARG NEXT_PUBLIC_WEBSOCKET_API
ENV NEXT_PUBLIC_WEBSOCKET_API=${NEXT_PUBLIC_WEBSOCKET_API}
ARG NEXT_PUBLIC_GRPC_HOST
ENV NEXT_PUBLIC_GRPC_HOST=${NEXT_PUBLIC_GRPC_HOST}
RUN bun install --production
RUN bun run build

FROM oven/bun:latest

WORKDIR /app

ENV NODE_ENV=production

RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:bun /app/orderlink-frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /app/orderlink-frontend/.next/static ./orderlink-frontend/.next/static

COPY --from=builder /app/orderlink-frontend/public ./orderlink-frontend/public

USER nextjs
EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "./orderlink-frontend/server.js"]
