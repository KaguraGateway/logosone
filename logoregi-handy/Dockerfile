FROM oven/bun:latest

WORKDIR /usr/src/app/logos

COPY . ./

RUN bun install --frozen-lockfile
ARG NEXT_PUBLIC_POS_GRPC
ENV NEXT_PUBLIC_POS_GRPC=${NEXT_PUBLIC_POS_GRPC}
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
