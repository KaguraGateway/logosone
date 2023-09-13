// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_ticket_service_pb = require('../proto/ticket_service_pb.js');

function serialize_cafelogos_RequestIssueTicket(arg) {
  if (!(arg instanceof proto_ticket_service_pb.RequestIssueTicket)) {
    throw new Error('Expected argument of type cafelogos.RequestIssueTicket');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_RequestIssueTicket(buffer_arg) {
  return proto_ticket_service_pb.RequestIssueTicket.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_RequestRevokeTicket(arg) {
  if (!(arg instanceof proto_ticket_service_pb.RequestRevokeTicket)) {
    throw new Error('Expected argument of type cafelogos.RequestRevokeTicket');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_RequestRevokeTicket(buffer_arg) {
  return proto_ticket_service_pb.RequestRevokeTicket.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_ResponseIssueTicket(arg) {
  if (!(arg instanceof proto_ticket_service_pb.ResponseIssueTicket)) {
    throw new Error('Expected argument of type cafelogos.ResponseIssueTicket');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_ResponseIssueTicket(buffer_arg) {
  return proto_ticket_service_pb.ResponseIssueTicket.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cafelogos_ResponseRevokeTicket(arg) {
  if (!(arg instanceof proto_ticket_service_pb.ResponseRevokeTicket)) {
    throw new Error('Expected argument of type cafelogos.ResponseRevokeTicket');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cafelogos_ResponseRevokeTicket(buffer_arg) {
  return proto_ticket_service_pb.ResponseRevokeTicket.deserializeBinary(new Uint8Array(buffer_arg));
}


var TicketServiceService = exports.TicketServiceService = {
  issueTicket: {
    path: '/cafelogos.TicketService/IssueTicket',
    requestStream: false,
    responseStream: false,
    requestType: proto_ticket_service_pb.RequestIssueTicket,
    responseType: proto_ticket_service_pb.ResponseIssueTicket,
    requestSerialize: serialize_cafelogos_RequestIssueTicket,
    requestDeserialize: deserialize_cafelogos_RequestIssueTicket,
    responseSerialize: serialize_cafelogos_ResponseIssueTicket,
    responseDeserialize: deserialize_cafelogos_ResponseIssueTicket,
  },
  revokeTicket: {
    path: '/cafelogos.TicketService/RevokeTicket',
    requestStream: false,
    responseStream: false,
    requestType: proto_ticket_service_pb.RequestRevokeTicket,
    responseType: proto_ticket_service_pb.ResponseRevokeTicket,
    requestSerialize: serialize_cafelogos_RequestRevokeTicket,
    requestDeserialize: deserialize_cafelogos_RequestRevokeTicket,
    responseSerialize: serialize_cafelogos_ResponseRevokeTicket,
    responseDeserialize: deserialize_cafelogos_ResponseRevokeTicket,
  },
};

exports.TicketServiceClient = grpc.makeGenericClientConstructor(TicketServiceService);
