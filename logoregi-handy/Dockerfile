FROM oven/bun:latest

WORKDIR /usr/src/app/logos

COPY . ./

RUN bun install --frozen-lockfile
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]
