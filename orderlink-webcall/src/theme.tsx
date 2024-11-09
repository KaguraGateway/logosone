import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";

const config = defineConfig({
    globalCss: {
        body: {
            backgroundColor: "gray.100"
        }
    }
})

export default createSystem(defaultConfig, config);