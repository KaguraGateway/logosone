FROM oven/bun:latest AS builder

WORKDIR /usr/src/app/logos

COPY . ./

RUN bun install --frozen-lockfile
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN bun run build

FROM oven/bun:latest

WORKDIR /usr/src/app/logos
COPY --from=builder /usr/src/app/logos ./

EXPOSE 3000
CMD ["bun", "start"]
