package grpc_server

import (
	"github.com/KaguraGateway/logosone/proto/pkg/pos/posconnect"
	"github.com/samber/do"
	"github.com/uptrace/bun"
)

type GrpcServer struct {
	db *bun.DB
	i  *do.Injector
}

func NewGrpcServer(db *bun.DB, i *do.Injector) posconnect.PosServiceHandler {
	return &GrpcServer{db: db, i: i}
}
