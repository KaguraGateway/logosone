import { dialogAnatomy } from "@ark-ui/react";
import { defineParts, defineRecipe } from "@pandacss/dev";

const parts = defineParts(dialogAnatomy.build())

export const dialog = defineRecipe({
  className: 'dialog',
  base: parts({
    backdrop: {
      background: 'gray.300',
      inset: 0,
      position: 'fixed',
      opacity: 0.7
    },
    container: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      background: 'white',
      borderRadius: 'md',
      boxShadow: 'lg',
      minW: "lg",
      position: 'relative',
    },
    title: {
      fontWeight: 'semibold',
      textStyle: "lg"
    },
  })
})