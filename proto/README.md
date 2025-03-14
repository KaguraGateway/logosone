# cafelogos-grpc

## Init: 初回時のみ
```
brew install protobuf
brew install bufbuild/buf/buf
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
brew install swift-protobuf grpc-swift
bun install
```

## Generate: 生成
### Go & Swift & TypeScript
```
export PATH="$PATH:$(go env GOPATH)/bin"
bun run generate
```
### Rust
```
cargo build
```
