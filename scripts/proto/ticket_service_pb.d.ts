// package: cafelogos
// file: proto/ticket_service.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class RequestIssueTicket extends jspb.Message { 
    getPrefix(): string;
    setPrefix(value: string): RequestIssueTicket;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestIssueTicket.AsObject;
    static toObject(includeInstance: boolean, msg: RequestIssueTicket): RequestIssueTicket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RequestIssueTicket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestIssueTicket;
    static deserializeBinaryFromReader(message: RequestIssueTicket, reader: jspb.BinaryReader): RequestIssueTicket;
}

export namespace RequestIssueTicket {
    export type AsObject = {
        prefix: string,
    }
}

export class ResponseIssueTicket extends jspb.Message { 

    hasTicket(): boolean;
    clearTicket(): void;
    getTicket(): Ticket | undefined;
    setTicket(value?: Ticket): ResponseIssueTicket;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResponseIssueTicket.AsObject;
    static toObject(includeInstance: boolean, msg: ResponseIssueTicket): ResponseIssueTicket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResponseIssueTicket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResponseIssueTicket;
    static deserializeBinaryFromReader(message: ResponseIssueTicket, reader: jspb.BinaryReader): ResponseIssueTicket;
}

export namespace ResponseIssueTicket {
    export type AsObject = {
        ticket?: Ticket.AsObject,
    }
}

export class RequestRevokeTicket extends jspb.Message { 
    getId(): string;
    setId(value: string): RequestRevokeTicket;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestRevokeTicket.AsObject;
    static toObject(includeInstance: boolean, msg: RequestRevokeTicket): RequestRevokeTicket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RequestRevokeTicket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestRevokeTicket;
    static deserializeBinaryFromReader(message: RequestRevokeTicket, reader: jspb.BinaryReader): RequestRevokeTicket;
}

export namespace RequestRevokeTicket {
    export type AsObject = {
        id: string,
    }
}

export class ResponseRevokeTicket extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ResponseRevokeTicket.AsObject;
    static toObject(includeInstance: boolean, msg: ResponseRevokeTicket): ResponseRevokeTicket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ResponseRevokeTicket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ResponseRevokeTicket;
    static deserializeBinaryFromReader(message: ResponseRevokeTicket, reader: jspb.BinaryReader): ResponseRevokeTicket;
}

export namespace ResponseRevokeTicket {
    export type AsObject = {
    }
}

export class Ticket extends jspb.Message { 
    getId(): string;
    setId(value: string): Ticket;
    getTicketAddr(): string;
    setTicketAddr(value: string): Ticket;
    getCreatedAt(): string;
    setCreatedAt(value: string): Ticket;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Ticket.AsObject;
    static toObject(includeInstance: boolean, msg: Ticket): Ticket.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Ticket, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Ticket;
    static deserializeBinaryFromReader(message: Ticket, reader: jspb.BinaryReader): Ticket;
}

export namespace Ticket {
    export type AsObject = {
        id: string,
        ticketAddr: string,
        createdAt: string,
    }
}
