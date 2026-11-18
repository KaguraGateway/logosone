import { createConnectTransport } from '@connectrpc/connect-web';

export function createTransport() {
  return createConnectTransport({
    baseUrl: process.env.NEXT_PUBLIC_GRPC_HOST ?? 'http://localhost:8080',
  });
}

export function createOrderLinkTransport() {
  return createConnectTransport({
    baseUrl: process.env.NEXT_PUBLIC_GRPC_ORDERLINK_HOST ?? 'http://localhost:8080',
  });
}