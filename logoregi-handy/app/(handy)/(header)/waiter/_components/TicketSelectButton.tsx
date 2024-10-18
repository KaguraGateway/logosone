import { Button } from "@chakra-ui/react";

type Props = {
    id: number;
    number: number;
    onClick?: () => void;

}

export default function TicketSelectButton(props: Props) {
  return (
  <>
    <Button size="lg" colorScheme="gray" h={16} bg="gray.50" color="gray.600" shadow="base" fontSize="xl" onClick={props.onClick}>
    {props.number}
    </Button>
  </>
  );
} 