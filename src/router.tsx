import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/components/ui/NotFound";

export const getRouter = () => {
  const router = createRouter({
    routeTree,

    context: {
      queryClient,
    },

    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};