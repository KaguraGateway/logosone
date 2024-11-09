import { getUnpaidOrdersBySeatId } from '@kaguragateway/cafelogos-grpc/scripts/pos/pos_service-PosService_connectquery';
import { useQuery } from '@connectrpc/connect-query';

export function useUnpaidOrdersQuery(seatId: string) {
    return useQuery(
        getUnpaidOrdersBySeatId,
        { seatId },
        { throwOnError: false }
    );
}
