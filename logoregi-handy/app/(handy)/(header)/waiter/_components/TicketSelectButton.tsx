import { Button } from "@chakra-ui/react";

type Props = {
    id: string;
    title: string;
    onClick?: () => void;
}

export default function TicketSelectButton(props: Props) {
  return (
    <Button 
      colorScheme="gray" 
      h={16} 
      bg="gray.50" 
      color="gray.600" 
      shadow="base" 
      fontSize="xl" 
      onClick={props.onClick} 
      width="100%"
      whiteSpace="nowrap" 
      overflow="hidden" 
      textOverflow="ellipsis"
    >
      {props.title}
    </Button>
  );
}
