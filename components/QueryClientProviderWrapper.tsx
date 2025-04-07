"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Creamos la instancia del QueryClient en el lado del cliente
const queryClient = new QueryClient();

const QueryClientProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;