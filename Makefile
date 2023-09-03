grpc-go:
	protoc --go_out=. --go-grpc_out=require_unimplemented_servers=false:. ./proto/*.proto
grpc-swift:
	protoc --swift_out=./swift --grpc-swift_out=./swift --plugin=/opt/homebrew/bin/protoc-gen-swift --plugin=/opt/homebrew/bin/protoc-gen-grpc-swift ./proto/*.proto
grpc-rust:
	cargo build