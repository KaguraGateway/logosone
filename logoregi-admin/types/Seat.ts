import { Seat as ProtoSeat } from 'proto/scripts/pos/pos_service_pb';

export type Seat = {
  id: string;
  name: string;
};

export type SeatBody = {
  name: string;
};

export function toSeatFromProto(seat: ProtoSeat): Seat {
  return {
    id: seat.id,
    name: seat.name,
  };
}
