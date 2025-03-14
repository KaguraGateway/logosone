// @generated by protoc-gen-es v2.2.3 with parameter "target=ts+js+dts"
// @generated from file ticket/ticket_service.proto (package cafelogos.ticket, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file ticket/ticket_service.proto.
 */
export declare const file_ticket_ticket_service: GenFile;

/**
 * @generated from message cafelogos.ticket.RequestIssueTicket
 */
export declare type RequestIssueTicket = Message<"cafelogos.ticket.RequestIssueTicket"> & {
  /**
   * @generated from field: string prefix = 1;
   */
  prefix: string;
};

/**
 * Describes the message cafelogos.ticket.RequestIssueTicket.
 * Use `create(RequestIssueTicketSchema)` to create a new message.
 */
export declare const RequestIssueTicketSchema: GenMessage<RequestIssueTicket>;

/**
 * @generated from message cafelogos.ticket.ResponseIssueTicket
 */
export declare type ResponseIssueTicket = Message<"cafelogos.ticket.ResponseIssueTicket"> & {
  /**
   * @generated from field: cafelogos.ticket.Ticket ticket = 1;
   */
  ticket?: Ticket;
};

/**
 * Describes the message cafelogos.ticket.ResponseIssueTicket.
 * Use `create(ResponseIssueTicketSchema)` to create a new message.
 */
export declare const ResponseIssueTicketSchema: GenMessage<ResponseIssueTicket>;

/**
 * @generated from message cafelogos.ticket.RequestRevokeTicket
 */
export declare type RequestRevokeTicket = Message<"cafelogos.ticket.RequestRevokeTicket"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;
};

/**
 * Describes the message cafelogos.ticket.RequestRevokeTicket.
 * Use `create(RequestRevokeTicketSchema)` to create a new message.
 */
export declare const RequestRevokeTicketSchema: GenMessage<RequestRevokeTicket>;

/**
 * @generated from message cafelogos.ticket.ResponseRevokeTicket
 */
export declare type ResponseRevokeTicket = Message<"cafelogos.ticket.ResponseRevokeTicket"> & {
};

/**
 * Describes the message cafelogos.ticket.ResponseRevokeTicket.
 * Use `create(ResponseRevokeTicketSchema)` to create a new message.
 */
export declare const ResponseRevokeTicketSchema: GenMessage<ResponseRevokeTicket>;

/**
 * @generated from message cafelogos.ticket.Ticket
 */
export declare type Ticket = Message<"cafelogos.ticket.Ticket"> & {
  /**
   * @generated from field: string id = 1;
   */
  id: string;

  /**
   * PrefixとNumberを結合したもの
   *
   * @generated from field: string ticket_addr = 2;
   */
  ticketAddr: string;

  /**
   * @generated from field: string created_at = 3;
   */
  createdAt: string;
};

/**
 * Describes the message cafelogos.ticket.Ticket.
 * Use `create(TicketSchema)` to create a new message.
 */
export declare const TicketSchema: GenMessage<Ticket>;

/**
 * @generated from service cafelogos.ticket.TicketService
 */
export declare const TicketService: GenService<{
  /**
   * @generated from rpc cafelogos.ticket.TicketService.IssueTicket
   */
  issueTicket: {
    methodKind: "unary";
    input: typeof RequestIssueTicketSchema;
    output: typeof ResponseIssueTicketSchema;
  },
  /**
   * @generated from rpc cafelogos.ticket.TicketService.RevokeTicket
   */
  revokeTicket: {
    methodKind: "unary";
    input: typeof RequestRevokeTicketSchema;
    output: typeof ResponseRevokeTicketSchema;
  },
}>;

