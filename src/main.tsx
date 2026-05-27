import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getRouter } from "./router";
import "./styles.css";

// Official ECAN Typography
import '@fontsource/source-sans-3/300.css'
import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/700.css'
import '@fontsource/source-sans-3/900.css'

import '@fontsource/libre-baskerville/400.css'
import '@fontsource/libre-baskerville/700.css'

import '@fontsource/poppins/300.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/900.css'

const router = getRouter();
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
