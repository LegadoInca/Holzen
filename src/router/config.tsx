import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Productores from "../pages/productores/page";
import Empresas from "../pages/empresas/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/productores",
    element: <Productores />,
  },
  {
    path: "/empresas",
    element: <Empresas />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
