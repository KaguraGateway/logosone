package grpc_server

import (
	"github.com/KaguraGateway/cafelogos-grpc/pkg/proto"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type GrpcServer struct {
	proto.UnimplementedPosServiceServer
	db *bun.DB
	i  *do.Injector
}

func NewGrpcServer(db *bun.DB, i *do.Injector) *GrpcServer {
	return &GrpcServer{db: db, i: i}
}
