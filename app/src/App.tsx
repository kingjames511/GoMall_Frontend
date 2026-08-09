import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/query";
import { router } from "@/router";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppContextProvider } from "@/context/AppContext";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AppContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
