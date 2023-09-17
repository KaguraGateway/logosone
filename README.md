# cafelogos-grpc
### Init
```
# git clone

# Brew
brew install protobuf
brew install bufbuild/buf/buf
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install connectrpc.com/connect/cmd/protoc-gen-connect-go@latest
# only Swift
brew install swift-protobuf grpc-swift
# only TypeScript
npm install

# Make
# Go & Swift & TypeScript
npx buf generate proto
# Rust
cargo build
```