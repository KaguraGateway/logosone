import { useTransport } from '@connectrpc/connect-query';
import { getUnpaidOrdersBySeatId } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@tanstack/react-query';

export function useUnpaidOrdersQuery(seatId: string) {
    const transport = useTransport();
    return useQuery(
        getUnpaidOrdersBySeatId.useQuery({ seatId }, { transport: transport })
    );
}