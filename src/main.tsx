import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { MetaMaskProvider } from "./MetaMaskContext.tsx";
import { HypergraphAppProvider } from '@graphprotocol/hypergraph-react';
import { mapping } from './mapping.ts';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HypergraphAppProvider mapping={mapping} appId="93bb8907-085a-4a0e-83dd-62b0dc98e793">
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
    </HypergraphAppProvider>
  </StrictMode>
);
