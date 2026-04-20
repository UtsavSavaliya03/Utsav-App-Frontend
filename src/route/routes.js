import Login from "../pages/login/Login.jsx";
import Register from "../pages/register/Register.jsx";

export const initialRoutes = () => {
  const routes = [
    { path: "/login", component: Login },
    { path: "/register", component: Register },
  ];
  return routes;
};
