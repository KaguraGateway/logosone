package grpcserver

import "github.com/samber/do"

type GrpcServer struct {
	i *do.Injector
}

func NewGrpcServer(i *do.Injector) *GrpcServer {
	return &GrpcServer{i: i}
}
