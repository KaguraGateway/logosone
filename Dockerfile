FROM oven/bun:latest

COPY . ./

RUN bun install
RUN bun run build

EXPOSE 3000
CMD ["bun", "start"]