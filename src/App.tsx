import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

import { Nav } from "./layout/nav";
import { MenuCard } from "./menu/menuCard";
import { Panel } from "./panel/panel";

interface MessagesData {
  messages: string[];
}

const Loading = async () => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    messages: [
      "Message 1 from Dashboard.tsx loader",
      "Message 2 from Dashboard.tsx loader",
      "Message 3 from Dashboard.tsx loader",
    ],
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
              const { Temp } = await import("./menu/temp");
              return {
                loader: Loading,
                Component: Temp,
              };
            },
          },
        ],
      },
      {
        //面板
        path: "/demo",
        loader: () => ({ message: "Hello Data Router1111!" }),
        element: <>2222</>,
      },
      {
        //面板
        path: "/panel",
        loader: () => ({ message: "Hello Data Router1111!" }),
        element: <Panel></Panel>,
      },
    ],
  },
  {
    path: "/*",
    element: <>****</>,
  },
]);
if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
function App() {
  return (
    <>
      <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
    </>
  );
}

export default App;
