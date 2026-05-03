import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/query-client';
import { Toaster } from 'sonner';

// Khởi chạy Service Worker
import { registerSW } from 'virtual:pwa-register';
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'brutalist-toast',
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0px',
            fontFamily: 'inherit',
            fontSize: '12px',
            textTransform: 'uppercase',
            fontWeight: '900',
            letterSpacing: '0.1em',
            boxShadow: '10px 10px 0px rgba(0,0,0,0.5)',
          },
        }}
      />
      <App />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
