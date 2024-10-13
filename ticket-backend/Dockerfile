FROM rust:1.72.0

WORKDIR /app

COPY . .
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v25.3/protoc-25.3-linux-x86_64.zip"
RUN apt install unzip
RUN unzip -q protoc.zip bin/protoc 'include/*' -d /usr/local
RUN cargo build --release

ENV PORT 8080

CMD ["/app/target/release/cafelogos-ticket-backend"]
