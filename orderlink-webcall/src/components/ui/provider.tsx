"use client"

import {ChakraProvider} from "@chakra-ui/react"
import theme from "@/theme.tsx";
import React from "react";

export function Provider(props: { children: React.ReactNode }) {
    return (
        <ChakraProvider value={theme}>
            {props.children}
        </ChakraProvider>
    )
}
