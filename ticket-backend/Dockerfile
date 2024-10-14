FROM rust:1.81.0

WORKDIR /app

COPY . .
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v25.3/protoc-25.3-linux-x86_64.zip"
RUN apt install unzip
RUN unzip -q protoc.zip bin/protoc 'include/*' -d /usr/local
RUN cargo build --release --target-dir /app/target

RUN cargo install sea-orm-cli

COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

CMD ["/app/target/release/cafelogos-ticket-backend"]
