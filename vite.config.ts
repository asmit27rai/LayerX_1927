// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      '@graphprotocol/hypergraph',
      '@graphprotocol/hypergraph-react',
      '@xstate/store',
      '@xstate/store/react'
    ]
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  ssr: {
    noExternal: [
      '@graphprotocol/hypergraph',
      '@graphprotocol/hypergraph-react',
      '@xstate/store'
    ]
  }
});
