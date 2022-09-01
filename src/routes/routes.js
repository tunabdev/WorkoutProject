import PrivateRoute from "components/PrivateRoute";
import PublicRoute from "components/PublicRoute";
import WorkoutGrid from "components/WorkoutGrid";
import { AppLayout } from "layout";
import { Home, Login, Register } from "pages";
const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        auth: true,
        element: <Home />,
      },
      {
        public: true,
        path: "login",
        element: <Login />,
      },
      {
        public: true,
        path: "register",
        element: <Register />,
      },
    ],
  },
];

const authCheck = (routes) => {
  return routes.map((route) => {
    if (route?.auth) {
      route.element = <PrivateRoute>{route.element}</PrivateRoute>;
    }
    if (route?.public) {
      route.element = <PublicRoute>{route.element}</PublicRoute>;
    }
    if (route?.children) {
      route.children = authCheck(route.children);
    }

    return route;
  });
};

export default authCheck(routes);
