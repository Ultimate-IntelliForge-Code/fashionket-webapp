import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { queryClient } from './lib/queryClient.ts'
import NotFound from '@/components/ui/NotFound';

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      queryClient,
    },

    // Use a custom not-found component so the app renders a friendly page
    defaultNotFoundComponent: NotFound,

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
