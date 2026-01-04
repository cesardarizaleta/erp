import type { Preview } from "@storybook/react-vite";
import React from "react";
import "../src/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { BrowserRouter } from "react-router-dom";
import { StoreInitializer } from "../src/components/StoreInitializer";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
  decorators: [
    Story => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <StoreInitializer />
          <TooltipProvider>
            <BrowserRouter>
              <Story />
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    ),
  ],
};

export default preview;
