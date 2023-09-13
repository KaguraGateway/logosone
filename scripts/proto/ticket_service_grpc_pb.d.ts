// package: cafelogos
// file: proto/ticket_service.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as proto_ticket_service_pb from "../proto/ticket_service_pb";

interface ITicketServiceService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    issueTicket: ITicketServiceService_IIssueTicket;
    revokeTicket: ITicketServiceService_IRevokeTicket;
}

interface ITicketServiceService_IIssueTicket extends grpc.MethodDefinition<proto_ticket_service_pb.RequestIssueTicket, proto_ticket_service_pb.ResponseIssueTicket> {
    path: "/cafelogos.TicketService/IssueTicket";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_ticket_service_pb.RequestIssueTicket>;
    requestDeserialize: grpc.deserialize<proto_ticket_service_pb.RequestIssueTicket>;
    responseSerialize: grpc.serialize<proto_ticket_service_pb.ResponseIssueTicket>;
    responseDeserialize: grpc.deserialize<proto_ticket_service_pb.ResponseIssueTicket>;
}
interface ITicketServiceService_IRevokeTicket extends grpc.MethodDefinition<proto_ticket_service_pb.RequestRevokeTicket, proto_ticket_service_pb.ResponseRevokeTicket> {
    path: "/cafelogos.TicketService/RevokeTicket";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<proto_ticket_service_pb.RequestRevokeTicket>;
    requestDeserialize: grpc.deserialize<proto_ticket_service_pb.RequestRevokeTicket>;
    responseSerialize: grpc.serialize<proto_ticket_service_pb.ResponseRevokeTicket>;
    responseDeserialize: grpc.deserialize<proto_ticket_service_pb.ResponseRevokeTicket>;
}

export const TicketServiceService: ITicketServiceService;

export interface ITicketServiceServer extends grpc.UntypedServiceImplementation {
    issueTicket: grpc.handleUnaryCall<proto_ticket_service_pb.RequestIssueTicket, proto_ticket_service_pb.ResponseIssueTicket>;
    revokeTicket: grpc.handleUnaryCall<proto_ticket_service_pb.RequestRevokeTicket, proto_ticket_service_pb.ResponseRevokeTicket>;
}

export interface ITicketServiceClient {
    issueTicket(request: proto_ticket_service_pb.RequestIssueTicket, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseIssueTicket) => void): grpc.ClientUnaryCall;
    issueTicket(request: proto_ticket_service_pb.RequestIssueTicket, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseIssueTicket) => void): grpc.ClientUnaryCall;
    issueTicket(request: proto_ticket_service_pb.RequestIssueTicket, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseIssueTicket) => void): grpc.ClientUnaryCall;
    revokeTicket(request: proto_ticket_service_pb.RequestRevokeTicket, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseRevokeTicket) => void): grpc.ClientUnaryCall;
    revokeTicket(request: proto_ticket_service_pb.RequestRevokeTicket, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseRevokeTicket) => void): grpc.ClientUnaryCall;
    revokeTicket(request: proto_ticket_service_pb.RequestRevokeTicket, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseRevokeTicket) => void): grpc.ClientUnaryCall;
}

export class TicketServiceClient extends grpc.Client implements ITicketServiceClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public issueTicket(request: proto_ticket_service_pb.RequestIssueTicket, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseIssueTicket) => void): grpc.ClientUnaryCall;
    public issueTicket(request: proto_ticket_service_pb.RequestIssueTicket, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseIssueTicket) => void): grpc.ClientUnaryCall;
    public issueTicket(request: proto_ticket_service_pb.RequestIssueTicket, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseIssueTicket) => void): grpc.ClientUnaryCall;
    public revokeTicket(request: proto_ticket_service_pb.RequestRevokeTicket, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseRevokeTicket) => void): grpc.ClientUnaryCall;
    public revokeTicket(request: proto_ticket_service_pb.RequestRevokeTicket, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseRevokeTicket) => void): grpc.ClientUnaryCall;
    public revokeTicket(request: proto_ticket_service_pb.RequestRevokeTicket, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: proto_ticket_service_pb.ResponseRevokeTicket) => void): grpc.ClientUnaryCall;
}
