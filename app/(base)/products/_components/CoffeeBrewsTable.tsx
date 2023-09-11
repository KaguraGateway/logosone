import { Table } from "@/ui/table/Table";
import { Tbody } from "@/ui/table/Tbody";

import { CoffeeBrew } from "../type";
import { CoffeeBrewItem } from "./CoffeeBrewItem";

export function CoffeeBrewsTable({ coffeeBrews }: { coffeeBrews: Array<CoffeeBrew> }) {
  return (
    <Table>
      <Tbody>
        {
          coffeeBrews.map((coffeeBrew) => <CoffeeBrewItem key={coffeeBrew.name} coffeeBrew={coffeeBrew} />)
        }
      </Tbody>
    </Table>
  )
}
