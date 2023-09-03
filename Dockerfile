FROM rust:1.72.0

WORKDIR /app

COPY . .
RUN cargo build --release

ENV PORT 8080

ENTRYPOINT ["/app/target/release/cafelogos-ticket-backend"]