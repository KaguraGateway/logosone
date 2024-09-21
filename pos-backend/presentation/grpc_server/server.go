package grpc_server

import (
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type GrpcServer struct {
	db *bun.DB
	i  *do.Injector
}

func NewGrpcServer(db *bun.DB, i *do.Injector) *GrpcServer {
	return &GrpcServer{db: db, i: i}
}
