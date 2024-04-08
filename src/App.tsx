import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import { Nav } from "./layout/nav";
import { MenuCard } from "./menu/menuCard";
import { Panel } from "./panel/panel";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./fetch/client.ts";
import { ReactQueryDevtools } from "react-query/devtools";
import { Demo } from "./layout/Demo.tsx";
import { nodeBuilder } from "./Logic/nodes";
import { templateMain } from "./node/index.ts";

interface MessagesData {
  messages: string[];
}

const Loading = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    messages: ["1", "2", "3"],
  } as MessagesData;
};

export function RootErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = "/")}>
        Click here to reload the app
      </button>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Nav />,
    errorElement: <RootErrorBoundary />,
    children: [
      {
        path: "/menu",
        element: <MenuCard />,
        errorElement: <RootErrorBoundary />,
        children: [
          {
            index: true,
            path: "/menu/proj",
            errorElement: <RootErrorBoundary />,
            async lazy() {
              const { Proj } = await import("./menu/proj");
              return {
                loader: Loading,
                Component: Proj,
              };
            },
          },
          {
            path: "/menu/temp",
            errorElement: <RootErrorBoundary />,
            async lazy() {
              const { TempA } = await import("./menu/temp");
              return {
                loader: Loading,
                Component: TempA,
              };
            },
          },
        ],
      },

      {
        //面板
        path: "/panel/*",
        loader: () => ({ message: "Hello Data Router1111!" }),
        element: <Panel></Panel>,
      },
    ],
  },
  {
    //面板
    path: "/demo/*",
    loader: () => ({ message: "Hello Data Router1111!" }),
    element: <Demo />,
  },
  {
    path: "/*",
    element: <>****</>,
  },
]);
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}

nodeBuilder();
templateMain();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
