'use client';
import { createPromiseClient } from '@connectrpc/connect';
import { PosService } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { atom, useAtom } from 'jotai';

import { createTransport } from '@/query/transport';

const clientIdAtom = atom(async () => {
  if (typeof window === 'undefined') {
    return '';
  }

  let clientId = window.localStorage.getItem('clientId');
  if (clientId == null) {
    const transport = createTransport();
    const client = createPromiseClient(PosService, transport);
    const res = await client.postNewClient({ name: 'Handy' });
    clientId = res.id;

    window.localStorage.setItem('clientId', clientId ?? '');
  }
  return clientId;
});

export function useClientId() {
  const [clientId] = useAtom(clientIdAtom);

  return clientId;
}
