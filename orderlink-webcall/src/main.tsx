import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Provider} from "./components/ui/provider.tsx";
import {Home} from "@/pages/Home";
import {WebSocketProvider} from "@/jotai/websocket.tsx";

import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <WebSocketProvider>
                <Home/>
            </WebSocketProvider>
        </Provider>
    </StrictMode>,
)
