// swift-tools-version: 5.8
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "cafelogos-grpc",
    products: [
        // Products define the executables and libraries a package produces, making them visible to other packages.
        .library(
            name: "cafelogos-grpc",
            targets: ["cafelogos-grpc"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-protobuf.git", from: "1.6.0"),
        .package(url: "https://github.com/connectrpc/connect-swift.git", from: "0.8.0"),
    ],
    targets: [
        // Targets are the basic building blocks of a package, defining a module or a test suite.
        // Targets can depend on other targets in this package and products from dependencies.
        .target(
            name: "cafelogos-grpc",
            dependencies: [
                .product(name: "SwiftProtobuf", package: "swift-protobuf"),
                .product(name: "Connect", package: "connect-swift")
            ]
        ),
        .testTarget(
            name: "cafelogos-grpcTests",
            dependencies: ["cafelogos-grpc"]),
    ]
)
